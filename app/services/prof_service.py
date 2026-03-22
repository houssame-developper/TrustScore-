from uuid import UUID, uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.profs import Prof
from fastapi import HTTPException,status,UploadFile
from schemas.prof_schema import ProfCreate,ProfUpdate
from typing import Optional
import aiofiles
import os

class ProfService:


    async def _upload_image(self, file: Optional[UploadFile]):
        allowed_extensions = {".png", ".jpg", ".jpeg"}
        default_path = "uploads/default.png"

        if not file:
            return {"filename": default_path}

        # 1. Vérification de l'extension du nom de fichier original
        _, ext = os.path.splitext(file.filename.lower())
        if ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Extension {ext} non supportée. PNG/JPG uniquement."
            )

        # 2. Nom unique
        file_name = f"{uuid4()}{ext}"
        file_path = os.path.join("uploads", file_name)

        # 3. Écriture asynchrone (ne bloque pas le serveur)
        async with aiofiles.open(file_path, "wb") as out_file:
            content = await file.read()  # Lit le contenu du fichier
            await out_file.write(content)

        return {"filename": file_path}



    async def get_all_profs(self,session:AsyncSession): 
        try:
            stmt = select(Prof)
            result = await session.execute(stmt)
            profs = result.scalars().all()

            return {"profs":profs}
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )

    async def get_prof(self,prof_id:UUID,session:AsyncSession):
        try:
            prof =  await session.get(Prof,prof_id)
            if prof is None:
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,detail=f"This Professor  not Found ")      

            return {"prof":prof}

        except Exception as e :
            if isinstance(e,HTTPException):
                raise e
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}")    


    async def add_prof(self, prof_schema: ProfCreate,session: AsyncSession): 
        try:
                # 1. Corrected filter syntax and result fetching
                stmt = select(Prof).filter(Prof.name == prof_schema.name)
                result = await session.execute(stmt)
                existing_prof = result.scalar_one_or_none()

                if existing_prof:
                    raise HTTPException(
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        detail=f"This Professor already exists: {existing_prof.name}"
                    ) 

                
                result = await self._upload_image(prof_schema.file)
                prof_schema.file = result["filename"]

                # 2. Prepare data
                prof_data = prof_schema.model_dump(exclude_unset=True)
                
                # 3. Create and save
                new_prof = Prof(**prof_data)
                
                session.add(new_prof)
                
                await session.commit()
                await session.refresh(new_prof) # This populates the ID from the DB

                # 4. Return combined data
                # We return a dict combining the DB object data and the sensitive private key
                return {
                    "prof": new_prof, 
                }

        except Exception as e:
            await session.rollback() # Must be awaited in async
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )


    async def update_prof(self,prof_id:UUID,prof_schema:ProfUpdate,session:AsyncSession): 
        try:

            prof = await session.get(Prof,prof_id)
            if prof is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"Professor  not Found") 


            prof_data =  prof_schema.model_dump(exclude_unset=True)  
            


            if "file" in prof_data and prof_data["file"] :
                result = await self._upload_image(prof_schema.file)
                prof_schema.file = result["filename"]      


            for k,v in prof_data.items():
                if hasattr(prof,k):
                    setattr(prof,k,v)

            await session.commit()
            await session.refresh(prof)
            return {"prof":prof}
        except Exception as e:
            await session.rollback() 
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )


    async def delete_prof(self,prof_id:UUID,session:AsyncSession): 
        try:
 
            prof = await session.get(Prof, prof_id)

            if prof is None:
                raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Professor not found"
            )
            await session.delete(prof)
            await session.commit()
            return {"message":"Professor has delete successful"}

        except Exception as e:
            await session.rollback() 
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
