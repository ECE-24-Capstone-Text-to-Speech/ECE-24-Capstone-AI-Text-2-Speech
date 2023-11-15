from fastapi import Depends, FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from internal import admin
from routers import items, files, users
from dependencies import get_query_token, get_token_header
from fastapi.middleware.cors import CORSMiddleware

server = FastAPI()
# server = FastAPI(dependencies=[Depends(get_query_token)])

# allow direct access to files in temp folder (e.g. localhost/files/audio/Record1.mp3)
# server.mount("/files/audio", StaticFiles(directory="temp"), name="audioFiles")

server.add_middleware(
    CORSMiddleware,
<<<<<<< HEAD
    allow_origins=["*"],  # You may want to restrict this to specific origins in production
=======
    allow_origins=["*"],  # Add your frontend URL here
>>>>>>> b4fada54461d2232c8fc0dc2c790a7fad5748ad5
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
=======

>>>>>>> b4fada54461d2232c8fc0dc2c790a7fad5748ad5
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
