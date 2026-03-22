from models.voters import Role
from services.auth_service import AuthService
from services.comment_service import CommentService
from services.voter_service import VoterService
from services.prof_service import ProfService
from services.rating_service import RatingService
from services.rating_statistics_service import RatingStatisticsService
from fastapi import Cookie,Depends, HTTPException, status

def get_auth_service():
    return AuthService()

def get_voter_service():
    return VoterService()

def get_prof_service():
    return ProfService()    

def get_rating_service():
    return RatingService()    

def get_rating_statistics_service():
    return RatingStatisticsService()  

def get_comment_service():
    return CommentService()  

def get_current_user(access_token:str=Cookie(),auth_service:AuthService=Depends(get_auth_service)):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token is missing"
        )

    data =  auth_service._token_decode(access_token)
    return data

def require_admin(current_user:dict=Depends(get_current_user)):
    if current_user["role"] != Role.ADMIN.value:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"This page not found")

    return current_user    




    
