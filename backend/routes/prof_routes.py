from fastapi import APIRouter, Request
from typing import Annotated
from uuid import UUID
from fastapi import APIRouter,Depends
from config.database import DbSession
from dependencies import require_admin, get_prof_service
from schemas.prof_schema import ProfCreate, ProfUpdate
from services.prof_service import ProfService

prof_router = APIRouter(prefix="/admin/profs",tags=["profs"])


@prof_router.get("/")
async def get_all_profs(session:DbSession,
                     prof_service:ProfService=Depends(get_prof_service),
                     current_user:dict=Depends(require_admin)):

    return await prof_service.get_all_profs(session)               

@prof_router.get("/{prof_id}")
async def get_prof(prof_id:UUID,session:DbSession,
                     prof_service:ProfService=Depends(get_prof_service),
                     current_user:dict=Depends(require_admin)):

    return await prof_service.get_prof(prof_id,session)  

@prof_router.post("/create")
async def create_prof(prof_schema:ProfCreate,session:DbSession,
                     prof_service:ProfService=Depends(get_prof_service),
                     current_user:dict=Depends(require_admin)):

    return await prof_service.add_prof(prof_schema,session)  


@prof_router.patch("/{prof_id}")
async def update_profs(prof_id:UUID,prof_schema:ProfUpdate,session:DbSession,
                     prof_service:ProfService=Depends(get_prof_service),
                     current_user:dict=Depends(require_admin)):

    return await prof_service.update_prof(prof_id,prof_schema,session)  

@prof_router.delete("/{prof_id}")
async def delete_profs(prof_id:UUID,session:DbSession,
                      prof_service:ProfService=Depends(get_prof_service),
                      current_user:dict=Depends(require_admin)):

    return await prof_service.delete_prof(prof_id,session)      