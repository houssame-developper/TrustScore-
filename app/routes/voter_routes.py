from typing import Annotated
from uuid import UUID
from fastapi import APIRouter,Depends
from config.database import DbSession
from dependencies import get_rating_service, require_admin, get_voter_service
from schemas.voter_schema import VoterCreate, VoterUpdate
from services.rating_service import RatingService
from services.voter_service import VoterService

voter_router = APIRouter(prefix="/admin/voters", tags=["voters"])


@voter_router.get("/")
async def get_all_voters(session:DbSession,
                     voter_service:VoterService=Depends(get_voter_service),
                     current_user:dict=Depends(require_admin)):

    return await voter_service.get_all_voters(session)               

@voter_router.get("/{voter_id}")
async def get_voter(voter_id:UUID,session:DbSession,
                     voter_service:VoterService=Depends(get_voter_service),
                     current_user:dict=Depends(require_admin)):

    return await voter_service.get_voter(voter_id,session)  

@voter_router.post("/create")
async def create_voters(voter_schema:VoterCreate,session:DbSession,
                     voter_service:VoterService=Depends(get_voter_service),
                     current_user:dict=Depends(require_admin)):

    return await voter_service.add_voter(voter_schema,session)  


@voter_router.patch("/{voter_id}")
async def update_voter(voter_id:UUID,session:DbSession,
                     voter_schema:VoterUpdate,voter_service:VoterService=Depends(get_voter_service),
                     current_user:dict=Depends(require_admin)):

    return await voter_service.update_voter(voter_id,voter_schema,session)  

@voter_router.delete("/{voter_id}")
async def delete_voter(voter_id:UUID,session:DbSession,
                     voter_service:VoterService=Depends(get_voter_service),
                     current_user:dict=Depends(require_admin)):

    return await voter_service.delete_voter(voter_id,session)      