from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import create_async_engine,AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.settings import DATABASE_URL

engine = create_async_engine(DATABASE_URL,future=True,echo=True,
                                         pool_size=15,max_overflow=0)

AsyncSessionLocal = sessionmaker(bind=engine,class_=AsyncSession,
autocommit=False,autoflush=False)

Base = declarative_base()

async def get_db():
  async with AsyncSessionLocal() as session:
    yield session

DbSession = Annotated[AsyncSession, Depends(get_db)]
