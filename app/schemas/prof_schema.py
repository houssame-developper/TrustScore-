from uuid import UUID
from pydantic import BaseModel,ConfigDict,Field
from typing import Optional
from fastapi import UploadFile,File
class ProfCreate(BaseModel):
    name:str = Field(min_length=3, max_length=100)
    department:str = Field(min_length=3, max_length=200)
    subject:str = Field(min_length=3, max_length=200)
    file: Optional[UploadFile] = File(None)
    model_config = ConfigDict(extra="forbid")

 
class ProfUpdate(BaseModel):
    name:Optional[str] = Field(None, min_length=3, max_length=100)
    department:Optional[str] = Field(None, min_length=3, max_length=200)
    subject:Optional[str] = Field(None, min_length=3, max_length=200)  
    file: Optional[UploadFile] = File(None)
    model_config = ConfigDict(extra="forbid")
