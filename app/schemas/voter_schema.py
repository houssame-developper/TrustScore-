from pydantic import BaseModel,model_validator,Field,ConfigDict
from typing import Optional
from models.voters import Role
import re
class VoterCreate(BaseModel):
    name:str = Field(min_length=3, max_length=100) 
    email:str = Field(min_length=6, max_length=255)
    password:str = Field(min_length=6, max_length=255)
    role:Optional[Role] = Role.VOTER
    @model_validator(mode="after")
    def verify_email(self):
        # 1) block characters you don't want
        if re.search(r"[\/\s]", self.email):
            raise ValueError("Invalid email: cannot contain '/' or spaces")

        # 2) simple email pattern (not perfect RFC, but good practice)
        email_pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
        if not re.match(email_pattern, self.email):
            raise ValueError("Invalid email format")

        return self    
    model_config = ConfigDict(extra="forbid")
  


class VoterUpdate(BaseModel):
    # يجب وضع = None لكل الحقول ليعرف FastAPI أنها اختيارية
    name: Optional[str] = Field(None, min_length=3, max_length=255)
    
    # كلمة المرور: الافتراضي هو None لنتجنب تعارض الـ min_length
    password: Optional[str] = Field(None, min_length=6, max_length=255)
    
    role: Optional[Role] = None

    model_config = ConfigDict(extra="forbid")

 

