from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from config.hashing import  verify_password
from models.voters import Role, Voter
from schemas.login_schema import Login
from schemas.voter_schema import VoterCreate
from services.rating_service import RatingService
from services.voter_service import VoterService
from fastapi import HTTPException, Response, status
import jwt 
import datetime as dt
from config.settings import SECRET_KEY
from fastapi import HTTPException,status
from uuid import UUID


class AuthService:

    def _token_encode(self,user_id:UUID,role:Role,minutes:int=0,hours:int=0):
        payload = {"user_id":str(user_id),
        "role":role.value,
        "exp": dt.datetime.now() + dt.timedelta(minutes=minutes, hours=hours)
        }

        return jwt.encode(payload=payload,key=SECRET_KEY,algorithm="HS256")
    
    

    def _token_decode(self,token:str):
        try:
            decode_data = jwt.decode(token,SECRET_KEY,algorithms=["HS256"])

            decode_data["user_id"] = UUID(decode_data["user_id"])
            if decode_data["user_id"] is None or decode_data["role"] is None:
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,detail="Token is corrupted")
            return  decode_data
            
        except jwt.ExpiredSignatureError as e:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,detail="Token is expire.")      

        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,detail="Token is invalid.")   

        except Exception as e:
            raise e   


            
    async def register(self,register_schema:VoterCreate,rating_service:RatingService,
                                        voter_service:VoterService,session:AsyncSession,response:Response):
        try:
            data = await voter_service.add_voter(register_schema,session)

            return {"message":"Register successful"}

        except Exception as e:
            raise e

    async def login(self,login_schema:Login,session:AsyncSession,response:Response):
        try:                                
            stmt = select(Voter).filter(Voter.email == login_schema.email)  
            result  = await session.execute(stmt)
            existing_voter = result.scalar_one_or_none() 

            if existing_voter is None or existing_voter.deleted_at:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"This email {login_schema.email} not found")  
        
            is_same,new_hash_password = verify_password(login_schema.password,existing_voter.password)

            if is_same:
                user_id = existing_voter.id
                role = existing_voter.role
                
                if new_hash_password:
                    existing_voter.password =  new_hash_password
                    await session.commit()
            else:
              raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect password")                         
                
            access_token = self._token_encode(user_id,role,minutes=3)
            refresh_token = self._token_encode(user_id,role,hours=30*24*3600)
            response.set_cookie("access_token",access_token,60*120,httponly=True)
            response.set_cookie("refresh_token",refresh_token,30*24*3600,httponly=True)
            return {"id":user_id,
                        "role":role.value,
                        "access_token":access_token
                        }  

        except HTTPException as e:
            raise e       
        except Exception as e:
            raise  HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}")   

    async def logout(self,response:Response):
        try:                                
                response.delete_cookie("access_token",httponly=True)
                response.delete_cookie("refresh_token",httponly=True)

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"error : {str(e)}")    

    async def get_keypair(self,voter_id:UUID,rating_service:RatingService,session:AsyncSession):
        try:                                
            existing_voter = await session.get(Voter,voter_id)

            if existing_voter is None or existing_voter.deleted_at:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"This account not found")  

            if existing_voter.public_key:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Your already has a key")          
               
            public_key, private_key = rating_service.generate_voter_keypair()
            public_key = public_key.decode("utf-8")
            private_key = private_key.decode("utf-8")
            existing_voter.public_key = public_key
            await session.commit()
            await session.refresh(existing_voter)

            return {"public_key":public_key,
                    "private_key":private_key}

        except HTTPException as e:
            raise e
        except Exception as e:
            raise  HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}")        


    async def regenerate_access_token(self,refresh_token:str,response:Response):
        try:

           data = self._token_decode(refresh_token)

           user_id = data["user_id"]
           role = data["role"]
           if user_id is None  or role is None:
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,detail="Token is corrupted") 

           access_token =  self._token_encode(user_id,role,minutes=3)     
           response.set_cookie("access_token",access_token,60*3,httponly=True)

           return {"id":user_id,
                   "role":role.value,
                   }

        except Exception as e:
            raise e     
               
