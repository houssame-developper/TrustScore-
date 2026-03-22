from sqlalchemy import Integer, String, TIMESTAMP, Column,ForeignKey,DECIMAL
from config.database import Base
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
class Rating(Base):
    __tablename__ = "ratings"
    id = Column(Integer,primary_key=True,index=True)
    vote_identity_hash = Column(String, nullable=False)
    prof_id = Column(UUID,ForeignKey("profs.id"))
    rate = Column(DECIMAL)
    timestamp = Column(TIMESTAMP(timezone=True), nullable=False)
    previous_hash = Column(String)
    block_hash = Column(String)
    nonce = Column(Integer)

