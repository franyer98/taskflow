from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.models import Board, BoardColumn, User
from app.schemas.schemas import BoardCreate, BoardDetail, BoardOut, BoardUpdate

router = APIRouter(prefix="/boards", tags=["boards"])

DEFAULT_COLUMNS = ["Por hacer", "En progreso", "Hecho"]


def _get_owned_board(board_id: int, user: User, db: Session) -> Board:
    board = db.get(Board, board_id)
    if not board or board.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tablero no encontrado")
    return board


@router.get("", response_model=list[BoardOut])
def list_boards(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Board).filter(Board.user_id == user.id).order_by(Board.created_at).all()


@router.post("", response_model=BoardDetail, status_code=201)
def create_board(
    data: BoardCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    board = Board(title=data.title, user_id=user.id)
    for i, title in enumerate(DEFAULT_COLUMNS):
        board.columns.append(BoardColumn(title=title, position=float(i)))
    db.add(board)
    db.commit()
    db.refresh(board)
    return board


@router.get("/{board_id}", response_model=BoardDetail)
def get_board(
    board_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    board = (
        db.query(Board)
        .options(joinedload(Board.columns).joinedload(BoardColumn.tasks))
        .filter(Board.id == board_id, Board.user_id == user.id)
        .first()
    )
    if not board:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tablero no encontrado")
    return board


@router.patch("/{board_id}", response_model=BoardOut)
def update_board(
    board_id: int,
    data: BoardUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    board = _get_owned_board(board_id, user, db)
    board.title = data.title
    db.commit()
    db.refresh(board)
    return board


@router.delete("/{board_id}", status_code=204)
def delete_board(
    board_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    board = _get_owned_board(board_id, user, db)
    db.delete(board)
    db.commit()
