from bson import ObjectId
from fastapi import HTTPException

def to_object_id(id: str):
    try:
        return ObjectId(id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")
