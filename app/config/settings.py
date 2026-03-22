import os 

DATABASE_URL = os.getenv("DATABASE_URL") 

if not DATABASE_URL:
    raise RuntimeError(f"Missing env var: DATABASE_URL")


SECRET_KEY = os.getenv("SECRET_KEY") 
RATING_SALT = os.getenv("RATING_SALT","DEFAULT_CODE") 