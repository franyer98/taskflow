from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------
class UserRegister(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=6, max_length=128)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str

    model_config = {"from_attributes": True}


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class RefreshIn(BaseModel):
    refresh_token: str


# ---------- Boards ----------
class BoardCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)


class BoardUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=120)


class BoardOut(BaseModel):
    id: int
    title: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------- Tasks ----------
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    priority: str = "media"
    due_date: Optional[str] = None
    column_id: int


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    column_id: Optional[int] = None
    position: Optional[float] = None


class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    priority: str
    due_date: Optional[str]
    position: float
    column_id: int

    model_config = {"from_attributes": True}


class ColumnOut(BaseModel):
    id: int
    title: str
    position: float
    tasks: list[TaskOut] = []

    model_config = {"from_attributes": True}


class BoardDetail(BoardOut):
    columns: list[ColumnOut] = []
