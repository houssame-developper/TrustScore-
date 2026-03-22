from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status

from config.database import DbSession
from config.settings import RATING_SALT
from dependencies import get_rating_service, get_current_user, get_rating_statistics_service, get_voter_service, require_admin
from config.rate_limit import limiter
from models.voters import Role
from schemas.rating_schema import RatingCreate
from services.rating_service import RatingService
from services.rating_statistics_service import RatingStatisticsService
from services.voter_service import VoterService

rating_router = APIRouter(prefix="/profs", tags=["ratings"])


# ──────────────────────────────────────────────
# 1.  طلب إضافة تقييم (Rating) لدكتور معيّن
# ──────────────────────────────────────────────


@rating_router.post("/{prof_id}/ratings", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def add_rating(
    prof_id: UUID,
    
    request:Request,
    payload: RatingCreate,
    session:DbSession,
    rating_service: RatingService = Depends(get_rating_service),
    voters_service: VoterService = Depends(get_voter_service),
    current_user: dict = Depends(get_current_user), 
):
    """
    يضيف تقييم جديد لدكتور معيّن باستخدام منطق الـ blockchain الموجود في RatingService.
    """
    try:
        if current_user["role"] == Role.ADMIN.value:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Only authorized voters can submit a rating")

        voters = await voters_service.get_voter(current_user["user_id"],session)
        public_key_pem = voters["voter"].public_key.encode()
        new_rating = await rating_service.add_rating(
            session=session,
            prof_id=prof_id,
            rate=payload.rate,
            public_key_pem=public_key_pem,
            private_key_pem=payload.private_key.encode(),
            salt=RATING_SALT,
        )
        return {
            "id": str(new_rating.id),
            "prof_id": str(new_rating.prof_id),
            "rate": new_rating.rate,
            "timestamp": new_rating.timestamp,
            "previous_hash": new_rating.previous_hash,
            "block_hash": new_rating.block_hash,
            "nonce": new_rating.nonce,
        }
    except HTTPException as e:
        raise e
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error while adding rating: {str(e)}",
        )


# ──────────────────────────────────────────────
# 2.  التحقق من سلامة سلسلة التقييمات لدكتور معيّن
# ──────────────────────────────────────────────

@rating_router.get("/{prof_id}/ratings/verify")
@limiter.limit("5/minute")
async def verify_prof_ratings_chain(
    prof_id: UUID,
    request:Request,
    session:DbSession,
    rating_service: RatingService = Depends(get_rating_service),
    current_user: dict = Depends(require_admin),
):
    """
    يتحقق من سلامة سلسلة التقييمات (Blockchain) لدكتور معيّن.
    """
    try:
        is_valid, errors = await rating_service.verify_chain(session, prof_id)
        return {
            "prof_id": str(prof_id),
            "is_valid": is_valid,
            "errors": errors,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error verifying rating chain: {str(e)}",
        )


# ──────────────────────────────────────────────
# 3.  الحصول على آخر block_hash لدكتور معيّن
# ──────────────────────────────────────────────

@rating_router.get("/{prof_id}/ratings/last_block")
@limiter.limit("10/minute")
async def get_prof_last_block_hash(
    prof_id: UUID,
    request:Request,
    session:DbSession,
    rating_service: RatingService = Depends(get_rating_service),
    current_user: dict = Depends(require_admin),
):
    """
    يعيد آخر block_hash في سلسلة تقييمات الدكتور (أو GENESIS hash إذا لا يوجد تقييمات).
    """
    try:
        last_hash = await rating_service.get_last_block_hash(session, prof_id)
        return {
            "prof_id": str(prof_id),
            "last_block_hash": last_hash,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching last block hash: {str(e)}",
        )


@rating_router.get("/{prof_id}/ratings")
async def get_statis_ratings(prof_id:UUID,
    request:Request,
    session:DbSession,
    rating_statis_service: RatingStatisticsService = Depends(get_rating_statistics_service),
    current_user: dict = Depends(get_current_user)):
    return await rating_statis_service.rating_statis(prof_id,session)