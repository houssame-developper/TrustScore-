from fastapi import APIRouter
from uuid import UUID
from fastapi import APIRouter,Depends
from config.database import DbSession
from dependencies import get_comment_service, get_current_user, get_rating_service, get_voter_service
from schemas.comment_schema import CommentCreate, CommentUpdate
from services.comment_service import CommentService
from services.prof_service import ProfService
from services.rating_service import RatingService
from services.voter_service import VoterService

comment_router = APIRouter(tags=["comments"])


@comment_router.get("/{prof_id}/comments")
async def get_comments(prof_id:UUID,
                     session:DbSession,
                     comment_service:CommentService=Depends(get_comment_service),
                     current_user:dict=Depends(get_current_user)):

    return await comment_service.get_comments(prof_id,session)               

@comment_router.get("/{prof_id}/comments/{comment_id}")
async def get_comment(prof_id:UUID,
                     comment_id:UUID,
                     session:DbSession,
                     comment_service:CommentService=Depends(get_comment_service),
                     current_user:dict=Depends(get_current_user)):

    return await comment_service.get_comment(prof_id,comment_id,session)   

@comment_router.post("/{prof_id}/comments/create")
async def create_comment(prof_id:UUID,
                     comment_schema:CommentCreate,
                     session:DbSession,
                     comment_service:CommentService=Depends(get_comment_service),
                     voter_service:VoterService=Depends(get_voter_service),
                     rating_service:RatingService=Depends(get_rating_service),
                     current_user:dict=Depends(get_current_user)):

    voter = await voter_service.get_voter(current_user["user_id"],session)
    public_key = voter["voter"].public_key.encode()
    return await comment_service.create_comment(public_key,comment_schema,prof_id,session,rating_service)  


@comment_router.patch("/{prof_id}/comments/{comment_id}")
async def update_comment(prof_id:UUID,comment_id:UUID,
                     comment_schema:CommentUpdate,session:DbSession,
                     comment_service:CommentService=Depends(get_comment_service),
                     current_user:dict=Depends(get_current_user)):

    return await comment_service.update_comment(prof_id,comment_id,comment_schema,session)  

@comment_router.delete("/{prof_id}/comments/{comment_id}")
async def delete_comment(prof_id:UUID,comment_id:UUID,
                     session:DbSession,
                     comment_service:CommentService=Depends(get_comment_service),
                     current_user:dict=Depends(get_current_user)):
               
    return await comment_service.delete_comment(prof_id,comment_id,session)   