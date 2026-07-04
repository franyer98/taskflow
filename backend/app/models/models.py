from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    boards: Mapped[list["Board"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )


class Board(Base):
    __tablename__ = "boards"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    owner: Mapped["User"] = relationship(back_populates="boards")
    columns: Mapped[list["BoardColumn"]] = relationship(
        back_populates="board", cascade="all, delete-orphan", order_by="BoardColumn.position"
    )


class BoardColumn(Base):
    __tablename__ = "columns"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120))
    position: Mapped[float] = mapped_column(default=0)
    board_id: Mapped[int] = mapped_column(ForeignKey("boards.id", ondelete="CASCADE"), index=True)

    board: Mapped["Board"] = relationship(back_populates="columns")
    tasks: Mapped[list["Task"]] = relationship(
        back_populates="column", cascade="all, delete-orphan", order_by="Task.position"
    )


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")
    priority: Mapped[str] = mapped_column(String(10), default="media")  # baja | media | alta
    due_date: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)  # YYYY-MM-DD
    position: Mapped[float] = mapped_column(default=0)
    column_id: Mapped[int] = mapped_column(ForeignKey("columns.id", ondelete="CASCADE"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    column: Mapped["BoardColumn"] = relationship(back_populates="tasks")
