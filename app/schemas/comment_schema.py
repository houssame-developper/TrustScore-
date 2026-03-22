from uuid import UUID
from pydantic import BaseModel,ConfigDict, Field
from typing import Optional

class CommentCreate(BaseModel):
    content:str = Field(max_length=300)
    model_config = ConfigDict(extra="forbid")
 
class CommentUpdate(BaseModel):
    content:Optional[str] =  Field(max_length=300,default=None)
    model_config = ConfigDict(extra="forbid")

 