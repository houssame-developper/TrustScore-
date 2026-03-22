from typing import Annotated
from fastapi import APIRouter,Depends,Cookie, HTTPException, Request, Response, status
from config.database import DbSession
from dependencies import get_current_user, get_rating_service,get_voter_service,get_auth_service
from schemas.login_schema import Login, Register
from services.auth_service import AuthService
from services.voter_service import VoterService
from services.rating_service import RatingService

from config.rate_limit import limiter

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/login")
@limiter.limit("5/minute")
async def login(login_schema:Login,request:Request,response:Response,
                     session:DbSession,
                     auth_service:AuthService=Depends(get_auth_service),
                     ):
                 

    return await auth_service.login(login_schema,session,response)           


@auth_router.post("/register")
@limiter.limit("5/minute")
async def register(register_schema:Register,request:Request,response:Response,
                                         session:DbSession,
                     rating_service:RatingService=Depends(get_rating_service),
                     voter_service:VoterService=Depends(get_voter_service),                                        
                     auth_service:AuthService=Depends(get_auth_service),
                     ):

    return await auth_service.register(register_schema,rating_service,
                                        voter_service,session,response)   


@auth_router.post("/logout")
async def logout(response:Response,
                    auth_service:AuthService=Depends(get_auth_service),
                     current_user:dict=Depends(get_current_user),

                     ):

    return await auth_service.logout(response)       

@auth_router.get("/me")
async def get_me(   
                    session:DbSession,
                    voter_service:VoterService=Depends(get_voter_service),
                    current_user:dict=Depends(get_current_user),

                     ):

    return await voter_service.get_voter(current_user["user_id"],session)       

@auth_router.get("/me/keypair")
async def get_keypair(
                    session:DbSession,
                    voter_service:VoterService=Depends(get_voter_service),
                    rating_service:RatingService=Depends(get_rating_service),
                    auth_service:AuthService=Depends(get_auth_service),
                    current_user:dict=Depends(get_current_user),

                     ):

    return await auth_service.get_keypair(current_user["user_id"],rating_service,session)       



@auth_router.post("/verify_token")  # Change to POST
@limiter.limit("10/minute")
async def refresh_token(  # Rename function
    response: Response,
    request:Request,
    auth_service: AuthService = Depends(get_auth_service),
    refresh_token: str = Cookie(None),
):
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is missing"
        )
    return await auth_service.regenerate_access_token(refresh_token, response)       