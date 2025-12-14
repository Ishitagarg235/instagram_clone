from fastapi import Header, HTTPException
from jose import jwt
from app.core.config import JWT_SECRET
from app.utils.objectid import to_object_id

async def get_current_user(token: str = Header(...)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return to_object_id(payload["user_id"])
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
