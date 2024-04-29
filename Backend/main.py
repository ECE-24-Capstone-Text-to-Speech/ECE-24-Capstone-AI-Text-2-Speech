from fastapi import Depends, FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from internal.ttsJobs import ttsJobs, tts_script

# tts_script()

queue_system = ttsJobs()

from internal import admin
from routers import files, users
from dependencies import get_query_token, get_token_header


server = FastAPI()
# server = FastAPI(dependencies=[Depends(get_query_token)])

# allow direct access to files in temp folder (e.g. localhost/files/audio/Record1.mp3)
# server.mount("/files/audio", StaticFiles(directory="temp"), name="audioFiles")


origins = [
    "http://localhost:3000",
    "https://www.klpsst.com",
    "https://amplify.d2sckcya9qtany.amplifyapp.com",
]

methods = ["PUT", "POST", "GET", "OPTIONS", "DELETE"]

headers = ["Content-Disposition"]

server.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],  # Add your frontend URL here
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=methods,
    allow_headers=["*"],
    expose_headers=headers,
)

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
