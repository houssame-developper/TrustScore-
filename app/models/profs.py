from datetime import datetime


from sqlalchemy import String, TIMESTAMP, Column,Text,func
from sqlalchemy.orm import relationship
from config.database import Base
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID

class Prof(Base):
    __tablename__ = "profs"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True,default=uuid4)
    name = Column(String(100), nullable=False)
    department = Column(String(200), nullable=False)  
    subject = Column(String(200), nullable=False)
    file = Column(Text, nullable=True)    
    created_at = Column[datetime](TIMESTAMP(timezone=True), nullable=False, server_default=func.now())
    comments  = relationship("Comment",back_populates="prof") 
