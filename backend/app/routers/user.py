from fastapi import APIRouter, Depends, HTTPException
from app.db.mongodb import db
from app.core.dependencies import get_current_user
from app.utils.objectid import to_object_id
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{username}")
async def get_user_profile(username: str, current_user=Depends(get_current_user)):
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's posts
    posts = await db.posts.find({"user_id": user["_id"]}).to_list(100)
    
    # Format posts
    formatted_posts = []
    for post in posts:
        formatted_posts.append({
            "_id": str(post["_id"]),
            "imageUrl": post.get("imageUrl", ""),
            "caption": post.get("caption", ""),
            "likesCount": len(post.get("likes", [])),
            "commentsCount": len(post.get("comments", []))
        })
    
    # Check if current user follows this user
    current = await db.users.find_one({"_id": current_user})
    is_following = user["_id"] in current.get("following", [])
    
    user_data = {
        "_id": str(user["_id"]),
        "username": user["username"],
        "fullName": user.get("fullName", ""),
        "profilePicture": user.get("profilePicture", ""),
        "bio": user.get("bio", ""),
        "followersCount": len(user.get("followers", [])),
        "followingCount": len(user.get("following", [])),
        "isFollowing": is_following
    }
    
    return {"user": user_data, "posts": formatted_posts}

@router.post("/{user_id}/follow")
async def follow_user(user_id: str, current_user=Depends(get_current_user)):
    target_id = to_object_id(user_id)

    await db.users.update_one(
        {"_id": current_user},
        {"$addToSet": {"following": target_id}}
    )
    await db.users.update_one(
        {"_id": target_id},
        {"$addToSet": {"followers": current_user}}
    )
    return {"message": "User followed"}

@router.delete("/{user_id}/follow")
async def unfollow_user(user_id: str, current_user=Depends(get_current_user)):
    target_id = to_object_id(user_id)

    await db.users.update_one(
        {"_id": current_user},
        {"$pull": {"following": target_id}}
    )
    await db.users.update_one(
        {"_id": target_id},
        {"$pull": {"followers": current_user}}
    )
    return {"message": "User unfollowed"}