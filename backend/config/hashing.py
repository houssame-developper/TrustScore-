from passlib.context import CryptContext

ctx  = CryptContext(schemes=["bcrypt"],deprecated="auto")

def hashing_password(password:str):
    return ctx.hash(password)


def verify_password(password:str,hash_password:str):
   return ctx.verify_and_update(secret=password,hash=hash_password)


