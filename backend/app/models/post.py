from pydantic import BaseModel
from typing import List, Dict

class Post(BaseModel):
    imageUrl: str
    caption: str
    likes: List[str] = []
    comments: List[Dict] = []
