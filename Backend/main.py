from fastapi import Depends, FastAPI
from fastapi.responses import RedirectResponse
from internal import admin
from routers import items, files, users
from dependencies import get_query_token, get_token_header

server = FastAPI()
# server = FastAPI(dependencies=[Depends(get_query_token)])

server.include_router(items.router)
server.include_router(files.router)
server.include_router(users.router)
server.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_token_header)],
    responses={418: {"description": "I'm a teapot"}},
)


def redirect_external(target):
    response = RedirectResponse(url="https://" + target)
    return response


@server.get("/")
async def root_ping():
    return {"message": "Server active"}


@server.get("/{name}")
async def personal_website_redirect(name):
    urls = {
        "purva": "pkantawala0.github.io",
        "suha": "suha0825.github.io",
        "kevin": "xhc12345.github.io",
        "tristan": "tristanbecnel87.github.io",
        "lucy": "singrongchiu.github.io",
        "sachin": "sachinnairr.github.io",
    }
    target = urls.get(name, "google.com")
    return redirect_external(target)
