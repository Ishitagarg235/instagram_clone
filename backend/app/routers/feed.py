from fastapi import APIRouter, Depends, HTTPException
from app.db.mongodb import db
from app.core.dependencies import get_current_user
from datetime import datetime

router = APIRouter(prefix="/feed", tags=["Feed"])


@router.get("/")
async def get_feed(current_user=Depends(get_current_user)):
    # Get current user
    user = await db.users.find_one({"_id": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get followed users' posts
    followed_posts = await db.posts.find(
        {"user_id": {"$in": user.get("following", [])}}
    ).sort("createdAt", -1).to_list(100)

    # Get own posts
    own_posts = await db.posts.find(
        {"user_id": current_user}
    ).sort("createdAt", -1).to_list(100)

    all_posts = followed_posts + own_posts

    # Cache users to avoid multiple DB calls (IMPORTANT)
    user_cache = {}

    formatted_posts = []

    for post in all_posts:
        # Fetch post owner (with cache)
        post_user_id = post["user_id"]
        if post_user_id not in user_cache:
            user_cache[post_user_id] = await db.users.find_one({"_id": post_user_id})

        post_user = user_cache[post_user_id]

        # Format comments (only first 2)
        formatted_comments = []
        for comment in post.get("comments", [])[:2]:
            comment_user_id = comment["user_id"]

            if comment_user_id not in user_cache:
                user_cache[comment_user_id] = await db.users.find_one(
                    {"_id": comment_user_id}
                )

            comment_user = user_cache[comment_user_id]

            formatted_comments.append({
                "user": {
                    "username": comment_user["username"],
                    "profilePicture": comment_user.get("profilePicture", "")
                },
                "text": comment["text"]
            })

        formatted_posts.append({
            "_id": str(post["_id"]),
            "imageUrl": post.get("imageUrl", ""),
            "caption": post.get("caption", ""),
            "user": {
                "username": post_user["username"],
                "profilePicture": post_user.get("profilePicture", "")
            },
            "likesCount": len(post.get("likes", [])),
            "isLiked": current_user in post.get("likes", []),
            "comments": formatted_comments,
            "createdAt": post.get("createdAt", datetime.utcnow())
        })

    # Sort posts by creation date
    formatted_posts.sort(key=lambda x: x["createdAt"], reverse=True)

    return {"posts": formatted_posts}
