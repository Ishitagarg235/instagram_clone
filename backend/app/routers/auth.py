from fastapi import APIRouter, HTTPException, Depends
from app.db.mongodb import db
from app.core.security import hash_password, verify_password, create_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
async def signup(user: dict):
    # Check if user exists
    existing = await db.users.find_one({"email": user["email"]})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    existing_username = await db.users.find_one({"username": user["username"]})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    user["password"] = hash_password(user["password"])
    user["followers"] = []
    user["following"] = []
    user["profilePicture"] = ""
    user["bio"] = ""
    
    result = await db.users.insert_one(user)
    token = create_token({"user_id": str(result.inserted_id)})
    
    user["_id"] = str(result.inserted_id)
    del user["password"]
    
    return {"token": token, "user": user}

@router.post("/login")
async def login(data: dict):
    user = await db.users.find_one({"email": data["email"]})

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(data["password"], user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_token({"user_id": str(user["_id"])})
    
    user["_id"] = str(user["_id"])
    del user["password"]
    
    return {"token": token, "user": user}

@router.get("/me")
async def get_current_user_info(current_user=Depends(get_current_user)):
    user = await db.users.find_one({"_id": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user["_id"] = str(user["_id"])
    del user["password"]
    
    return {"user": user}