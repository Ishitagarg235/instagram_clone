from fastapi import APIRouter, Depends
from app.db.mongodb import db
from app.core.dependencies import get_current_user
from app.utils.objectid import to_object_id
from datetime import datetime

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.post("/")
async def create_post(post: dict, current_user=Depends(get_current_user)):
    post["user_id"] = current_user
    post["likes"] = []
    post["comments"] = []
    await db.posts.insert_one(post)
    return {"message": "Post created"}

@router.post("/{post_id}/like")
async def like_post(post_id: str, current_user=Depends(get_current_user)):
    post_oid = to_object_id(post_id)

    await db.posts.update_one(
        {"_id": post_oid},
        {"$addToSet": {"likes": current_user}}
    )
    return {"message": "Post liked"}


@router.post("/{post_id}/unlike")
async def unlike_post(post_id: str, current_user=Depends(get_current_user)):
    post_oid = to_object_id(post_id)

    await db.posts.update_one(
        {"_id": post_oid},
        {"$pull": {"likes": current_user}}
    )
    return {"message": "Post unliked"}


@router.post("/{post_id}/comment")
async def comment_post(post_id: str, data: dict, current_user=Depends(get_current_user)):
    post_oid = to_object_id(post_id)

    await db.posts.update_one(
        {"_id": post_oid},
        {"$push": {"comments": {
            "user_id": current_user,
            "text": data["text"]
        }}}
    )
    return {"message": "Comment added"}

@router.post("/")
async def create_post(post: dict, current_user=Depends(get_current_user)):
    post["user_id"] = current_user
    post["likes"] = []
    post["comments"] = []
    post["createdAt"] = datetime.utcnow()
    await db.posts.insert_one(post)
    return { "message": "Post created",
    "post_id": str(result.inserted_id)}
