from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config.database import Base,engine
from slowapi import Limiter,_rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware

from config.rate_limit import limiter
from routes.auth_routes import auth_router
from routes.comment_routes import comment_router
from routes.prof_routes import prof_router
from routes.rating_routes import rating_router
from routes.voter_routes import voter_router

origins = [
    "http://localhost:8000",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    
app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(status.HTTP_429_TOO_MANY_REQUESTS,_rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


    
@app.get("/")
def root():  
  return {"fg":"fgfg"}

app.include_router(voter_router,prefix="/api/v1")
app.include_router(prof_router,prefix="/api/v1")
app.include_router(rating_router,prefix="/api/v1")
app.include_router(comment_router,prefix="/api/v1")
app.include_router(auth_router,prefix="/api/v1")
