from uuid import UUID
from pydantic import BaseModel,model_validator,ConfigDict,Field
from typing import Optional
import re
class Login(BaseModel):
    email:str 
    password:str

    @model_validator(mode="after")
    def verify_email(self):
        if self.email is None:
            self
        # 1) block characters you don't want
        if re.search(r"[\/\s]", self.email):
            raise ValueError("Invalid email: cannot contain '/' or spaces")

        # 2) simple email pattern (not perfect RFC, but good practice)
        email_pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
        if not re.match(email_pattern, self.email):
            raise ValueError("Invalid email format")

        return self    
    model_config = ConfigDict(extra="forbid")
        

class Register(BaseModel):
    name:str = Field(min_length=3, max_length=100) 
    email:str = Field(min_length=6, max_length=255)
    password:str = Field(min_length=6, max_length=255)

    @model_validator(mode="after")
    def verify_email(self):
        if self.email is None:
            self
        # 1) block characters you don't want
        if re.search(r"[\/\s]", self.email):
            raise ValueError("Invalid email: cannot contain '/' or spaces")

        # 2) simple email pattern (not perfect RFC, but good practice)
        email_pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
        if not re.match(email_pattern, self.email):
            raise ValueError("Invalid email format")

        return self    
    model_config = ConfigDict(extra="forbid")

     
# maybe other later comme new feature       
class EditAccount(BaseModel):
    name:Optional[str] = Field(None,min_length=3, max_length=100) 
    password:Optional[str] = Field(None,min_length=6, max_length=255)
    model_config = ConfigDict(extra="forbid")

      