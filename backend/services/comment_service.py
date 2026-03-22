from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException,status

from config.settings import RATING_SALT
from models.comments import Comment
from models.profs import Prof
from schemas.comment_schema import CommentCreate, CommentUpdate
from services.rating_service import RatingService
from uuid import UUID

class CommentService:

   async def get_comments(self,prof_id:UUID,session:AsyncSession):
        try:
            stmt = select(Comment).filter(Comment.prof_id == prof_id)
            result  = await session.execute(stmt)
            comments = result.scalars().all()
            return {"comments":comments}

        except Exception as e:
            if isinstance(e,HTTPException):
                raise e

            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}")    

   async def get_comment(self,prof_id:UUID,comment_id:UUID,session:AsyncSession):
        try:
            stmt = select(Comment).filter(Comment.prof_id == prof_id,Comment.id == comment_id)
            result  = await session.execute(stmt)
            comments = result.scalars().all()
            return {"comments":comments}

        except Exception as e:
            if isinstance(e,HTTPException):
                raise e

            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}")       

   async def create_comment(self,public_key:str,comment_schema:CommentCreate,prof_id:UUID,session:AsyncSession,rating_service:RatingService):
        try:
            vote_identity_hash = rating_service.build_vote_identity_hash(public_key,prof_id,salt=RATING_SALT)
            new_comment = {"content":comment_schema.content,
                           "prof_id":prof_id,
                           "vote_identity_hash":vote_identity_hash}

            comment = Comment(**new_comment)
            session.add(comment)
            await session.commit()
            await session.refresh(comment)
            
            return {"comment":comment}

        except Exception as e:
            await session.rollback()
            if isinstance(e,HTTPException):
                raise e

            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}")         

   async def update_comment(self,prof_id:UUID,comment_id:UUID,comment_schema:CommentUpdate,session:AsyncSession):
        try:
            
            stmt = select(Comment).filter(Comment.prof_id == prof_id,Comment.id == comment_id)
            result = await session.execute(stmt)
            comment = result.scalar_one_or_none()

            if comment is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="This comment not found")

            comment.content = comment_schema.content
            
            await session.commit()
            await session.refresh(comment)
            
            return {"comment":comment}

        except Exception as e:
            await session.rollback()
            if isinstance(e,HTTPException):
                raise e

            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}")         

   async def delete_comment(self,prof_id:UUID,comment_id:UUID,session:AsyncSession):
        try:
            
            stmt = select(Comment).filter(Comment.prof_id == prof_id,Comment.id == comment_id)
            result = await session.execute(stmt)
            comment = result.scalar_one_or_none
            if comment is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="This comment not found")


            await session.delete(comment)
            await session.commit()
            
            return {"comment":comment}

        except Exception as e:
            await session.rollback()
            if isinstance(e,HTTPException):
                raise e

            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}")              