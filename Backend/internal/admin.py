from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def admin_pin():
    return {"message": "Welcome, admin"}


@router.post("/")
async def update_admin():
    return {"message": "Admin getting ready to work it woohoo!"}
