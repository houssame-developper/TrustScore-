from sqlalchemy import String,Text ,TIMESTAMP, Column,func ,Enum as SQLEnum # Renommé pour éviter le conflit
import enum
from config.database import Base

from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID

# 1. Utiliser enum.Enum de Python
class Role(enum.Enum):
    VOTER = "voter"
    ADMIN = "admin"

class Voter(Base):
    __tablename__ = "voters"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True,default=uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)    
    password = Column(Text, nullable=False)  
    public_key = Column(String(2050), nullable=False)   
    # 2. On passe la classe Role au type SQLEnum de SQLAlchemy
    role = Column(SQLEnum(Role),nullable=False,default=Role.VOTER)
    
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)
