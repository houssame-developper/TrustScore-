from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy import String, TIMESTAMP, Column,ForeignKey,func
from sqlalchemy.orm import relationship
from config.database import Base


class Comment(Base):
    __tablename__ = "comments"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True,default=uuid4)
    content = Column(String, nullable=False)
    prof_id = Column(UUID(as_uuid=True), ForeignKey("profs.id"))
    vote_identity_hash = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())
    prof  = relationship("Prof",back_populates="comments") 
