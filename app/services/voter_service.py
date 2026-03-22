from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func,select
from config.hashing import hashing_password
from models.voters import Voter
from fastapi import HTTPException,status
from schemas.login_schema import Register
from schemas.voter_schema import VoterCreate,VoterUpdate

class VoterService:

    async def get_all_voters(self,session:AsyncSession): 
        try:
            stmt = select(Voter)
            result = await session.execute(stmt)
            voters = result.scalars().all()

            return {"voters":voters}
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )

    async def get_voter(self,voter_id:UUID,session:AsyncSession):
        try:
            voter =  await session.get(Voter,voter_id)
            if voter is None:
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,detail=f"This user not Found ")      

            return {"voter":voter}

        except Exception as e :
            if isinstance(e,HTTPException):
                raise e
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}")    


    async def add_voter(self, voter_schema: VoterCreate|Register,session: AsyncSession): 
        try:
                # 1. Corrected filter syntax and result fetching
                stmt = select(Voter).filter(Voter.email == voter_schema.email)
                result = await session.execute(stmt)
                existing_voter = result.scalar_one_or_none()

                if existing_voter:
                    raise HTTPException(
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        detail=f"This email already exists: {existing_voter.email}"
                    ) 

                # 2. Prepare data
                voter_data = voter_schema.model_dump()
                print(f"before: {voter_data["password"]}")
                voter_data["password"] = hashing_password(voter_data["password"])            
                print(f"after: {voter_data["password"]}")          
                # 3. Create and save
                new_voter = Voter(**voter_data)
 
                session.add(new_voter)
                
                await session.commit()
                await session.refresh(new_voter) # This populates the ID from the DB

                # 4. Return combined data
                # We return a dict combining the DB object data and the sensitive private key
                return {
                    "id": new_voter.id,
                    "role":new_voter.role, 
                }

        except Exception as e:
            await session.rollback() # Must be awaited in async
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )


    async def update_voter(self,voter_id:UUID,voter_schema:VoterUpdate,session:AsyncSession): 
        try:
            voter = await session.get(Voter,voter_id)
            if voter is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"User not Found") 


            new_data = voter_schema.model_dump(exclude_unset=True)
            if "password" in new_data and new_data["password"]:
                new_data["password"] = hashing_password(new_data["password"])


            for k,v in new_data.items():
                if hasattr(voter,k) and v:
                    setattr(voter,k,v)

            await session.commit()
            await session.refresh(voter)
            return {
                    "id": voter_id,
                    "role":voter.role, 
                }
        except Exception as e:
            await session.rollback() 
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )


    async def delete_voter(self,voter_id:UUID,session:AsyncSession): 
        try:
            voter = await session.get(Voter,voter_id)
            if voter is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"User not Found") 
      
            voter.deleted_at = func.now()
            await session.commit()
            return {"message":"voter has delete successful"}

        except Exception as e:
            await session.rollback() 
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
