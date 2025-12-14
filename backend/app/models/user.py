from pydantic import BaseModel
from typing import List

class User(BaseModel):
    username: str
    email: str
    password: str
    followers: List[str] = []
    following: List[str] = []
