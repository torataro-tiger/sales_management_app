from cruds import medium as medium_cruds
from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas import medium as medium_schema
from sqlalchemy.ext.asyncio import AsyncSession
from validates import validates

router = APIRouter()


@router.post(
    "/medium_registration",
    tags=["medium"],
    response_model=medium_schema.MediumRegisterResponse,
)
async def medium_registration(
    medium_body: medium_schema.MediumCreate,
    db: AsyncSession = Depends(get_db),
):
    return await medium_cruds.create_medium(
        db=db,
        medium_create=medium_body,
    )


@router.get(
    "/medium_search",
    tags=["medium"],
    response_model=list[medium_schema.MediumReadResponse],
)
async def medium_search(
    medium_name: str = "",
    db: AsyncSession = Depends(get_db),
):
    result = await medium_cruds.read_medium(
        db=db,
        medium_name=medium_name,
    )
    return result


@router.put(
    "/medium_update",
    tags=["medium"],
    response_model=medium_schema.MediumUpdateResponse,
)
async def medium_update(
    medium_body: medium_schema.MediumUpdate,
    db: AsyncSession = Depends(get_db),
):
    original = await validates.get_medium(
        db=db,
        medium_id=medium_body.id,
    )
    if original is None:
        raise HTTPException(404)
    result = await medium_cruds.update_medium(
        db=db,
        medium_update=medium_body,
        original=original,
    )
    return result
