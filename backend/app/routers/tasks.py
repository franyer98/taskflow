from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.models import BoardColumn, Task, User
from app.schemas.schemas import TaskCreate, TaskOut, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])

PRIORITIES = {"baja", "media", "alta"}


def _get_owned_column(column_id: int, user: User, db: Session) -> BoardColumn:
    column = db.get(BoardColumn, column_id)
    if not column or column.board.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Columna no encontrada")
    return column


def _get_owned_task(task_id: int, user: User, db: Session) -> Task:
    task = db.get(Task, task_id)
    if not task or task.column.board.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tarea no encontrada")
    return task


@router.post("", response_model=TaskOut, status_code=201)
def create_task(
    data: TaskCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    if data.priority not in PRIORITIES:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Prioridad inválida")
    column = _get_owned_column(data.column_id, user, db)
    last = max((t.position for t in column.tasks), default=0.0)
    task = Task(
        title=data.title,
        description=data.description,
        priority=data.priority,
        due_date=data.due_date,
        column_id=column.id,
        position=last + 1.0,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    data: TaskUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = _get_owned_task(task_id, user, db)
    if data.column_id is not None:
        _get_owned_column(data.column_id, user, db)
        task.column_id = data.column_id
    if data.priority is not None:
        if data.priority not in PRIORITIES:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Prioridad inválida")
        task.priority = data.priority
    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description
    if data.due_date is not None:
        task.due_date = data.due_date or None
    if data.position is not None:
        task.position = data.position
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    task = _get_owned_task(task_id, user, db)
    db.delete(task)
    db.commit()
