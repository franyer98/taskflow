from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.database import get_db
from app.models.models import User
from app.schemas.schemas import RefreshIn, TokenPair, UserRegister

router = APIRouter(prefix="/auth", tags=["auth"])


def _token_pair(user: User) -> TokenPair:
    return TokenPair(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=user,
    )


@router.post("/register", response_model=TokenPair, status_code=201)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status.HTTP_409_CONFLICT, "Ese email ya está registrado")
    user = User(email=data.email, name=data.name, password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return _token_pair(user)


@router.post("/login", response_model=TokenPair)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Email o contraseña incorrectos")
    return _token_pair(user)


@router.post("/refresh", response_model=TokenPair)
def refresh(data: RefreshIn, db: Session = Depends(get_db)):
    user_id = decode_token(data.refresh_token, "refresh")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Usuario no encontrado")
    return _token_pair(user)
