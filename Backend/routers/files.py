from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    UploadFile,
    status,
)
from typing import Union
import os
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from internal.tortoise import start_tortoise
from internal.tortoise import start_tortoise_example
from internal.cookies import getCurrUser
from internal.getFile import (
    get_list_of_audio_in_temp,
    get_list_of_audio_in_tortoise_out,
)
from internal.saveFile import save_audio_to_temp
from typing import List

# from models.AudioFile import AudioUploadFile

from dependencies import get_token_header

MAX_FILE_SIZE = 3_000_000  # 3 MB


router = APIRouter(
    prefix="/files",  # all paths in this file assumes preceed by `/files`
    tags=["files"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "files path needs functions name appended"}},
)

# router.mount("/files", StaticFiles(directory="temp"), name="audioFiles")


async def save_audio_file(user: str, audioFile: UploadFile):
    # mime = magic.Magic()
    # file_type = mime.from_buffer(audioFile.file.read(1024))
    # # fileSize = len(audioFile)

    # allowed_formats = {"MPEG ADTS", "RIFF"}
    # if not any(x in file_type for x in allowed_formats):
    #     raise HTTPException(
    #         status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
    #         detail="File format not supported. Supported formats are MP3 and WAV. File type provided is: "+file_type,
    #     )
    file_extension = audioFile.filename.split(".")[-1].lower()
    allowed_formats = {"mp3", "wav"}
    if file_extension not in allowed_formats:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"File format not supported. Supported formats are MP3 and WAV. File extension provided is: {file_extension}",
        )

    # audioFile.size
    if audioFile.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size = {audioFile.size:,} bytes, exceeds the limit of {MAX_FILE_SIZE:,} bytes by {(audioFile.size-MAX_FILE_SIZE):,} bytes.",
        )

    # Reset the file cursor to the beginning
    audioFile.file.seek(0)

    fileName = audioFile.filename
    file_extension = fileName.split(".")[-1]

    message: str = "Default message"
    saved: bool = False

    # if fileSize > threshhold:
    allUserFiles = await get_list_of_audio_in_temp(user=user)
    if fileName not in allUserFiles:
        print(
            "file "
            + audioFile.filename
            + " not exists in "
            + str(allUserFiles)
            + ", adding"
        )
        saved, message = await save_audio_to_temp(audioFile, user=user)
    else:
        print("file " + audioFile.filename + " found aready")
        message = "File already exists"

    return {
        "filename": audioFile.filename,
        "format": file_extension,
        "size": audioFile.size,
        "success": saved,
        "message": message,
    }


@router.get("/")
async def audio_page():
    content = """
        <body>
            <header>
                <h1>Test file upload page</h1>
                <p>This runs on the backend only</p>
                <p>Check "Network" tab in F12 menu to see how this API is used</p>
            </header>
            <p>The top upload option is for single file....</p>
            <form action="/files/audioInput" enctype="multipart/form-data" method="post">
                <input name="audioFile" type="file">
                <input type="submit">
            </form>
            <p>The bottom upload option is for multiple files....</p>
            <form action="/files/multiAudioInputs" enctype="multipart/form-data" method="post">
                <input name="audioFiles" type="file" multiple>
                <input type="submit">
            </form>
        </body>
    """
    return HTMLResponse(content=content)


@router.post("/audioInput")
async def audio_input(
    request: Request, audioFiles: List[UploadFile], strValue: str | None = None
):
    """
    Grabs FormData.audioFile.
    Requires frontend to send file in as FormData, input called "audioFile"
    """
    user = getCurrUser(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please log in order to upload or download files!",
        )

    if audioFiles is None or len(audioFiles) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No input audio file given in the request.",
        )

    # Extract file extension from the filename

    for audioFile in audioFiles:
        file_extension = audioFile.filename.split(".")[-1].lower()

        # Check if the file extension is one of the allowed formats
        allowed_formats = {"mp3", "wav"}
        if file_extension not in allowed_formats:
            raise HTTPException(
                status_code=415,
                detail=f"File format not supported. Supported formats are MP3 and WAV. File extension provided is: {file_extension}",
            )

        # Check file size
        if audioFile.size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File size = {audioFile.size:,} bytes, exceeds the limit of {MAX_FILE_SIZE:,} bytes by {(audioFile.size-MAX_FILE_SIZE):,} bytes.",
            )

        # Reset the file cursor to the beginning
        audioFile.file.seek(0)

        fileName = audioFile.filename

        message: str = "Default message"
        saved: bool = False

        # Check if the file already exists in the temporary directory
        if fileName not in await get_list_of_audio_in_temp(user=user):
            saved, message = await save_audio_to_temp(audioFile, user=user)
        else:
            message = "File already exists"
    # print("awooga")
    # await start_tortoise_example() ##how do i pass in input to start_tortoise? is this fine for now, work on optimize in future
    # print("joemamatoes")

    return {
        "filename": fileName,
        "format": file_extension,
        "success": saved,
        "message": message,
    }


@router.post("/multiAudioInputs")
async def audio_input(request: Request, audioFiles: list[UploadFile]):
    """
    Grabs FormData.audioFile.
    Requires frontend to send file in as FormData, input called "audioFile"
    """
    print("Multi file upload function")
    user = getCurrUser(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please log in in order to upload files!",
        )

    if not audioFiles:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No input audio file given in the request.",
        )

    print(f"Received {len(audioFiles)} files")

    results = []

    for audioFile in audioFiles:
        result = await save_audio_file(user, audioFile)
        results.append(result)

    return results


@router.get("/download")
async def download_file(request: Request):
    user = getCurrUser(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please log in order to upload or download files!",
        )
    files = await get_list_of_audio_in_tortoise_out()
    ##print("awooga")
    ##wait start_tortoise()
    ##print("done")
    for file in files:
        return FileResponse(path=file)
    else:
        raise HTTPException(status_code=404, detail="File not found")


@router.get("/audios")
async def get_audio_list():
    audioList = await get_list_of_audio_in_temp()
    print(audioList)
    ##print("awooga")
    ##await start_tortoise()
    ##print("done")
    return audioList


@router.get(
    "/audios/{audio_name}",
    # Set what the media type will be in the autogenerated OpenAPI specification.
    # fastapi.tiangolo.com/advanced/additional-responses/#additional-media-types-for-the-main-response
    responses={
        200: {"content": {"multipart/form-data": {}}},
        404: {"detail": "File not found"},
    },
    # Prevent FastAPI from adding "application/json" as an additional
    # response media type in the autogenerated OpenAPI specification.
    # https://github.com/tiangolo/fastapi/issues/3258
    response_class=FileResponse,
)
async def get_audio_file(request: Request, audio_name: str):
    # audio_bytes: str|None = await fetch_audio_from_temp(audio_name)
    # user = getCurrUser(request)
    # if not user:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Please log in order to upload or download files!",
    #     )
    files = await get_list_of_audio_in_temp(fullPath=True)
    for file in files:
        if audio_name == file.split("/")[-1]:
            return FileResponse(path=file)
    else:
        raise HTTPException(status_code=404, detail="File not found")


@router.post("/toTortoise")
async def sendToTortoise(request: Request):

    user = request.cookies.get("loggedInSession", None)
    message = "not logged in"
    if user:
        try:
            body_str = await request.body()  # Get the request body as bytes
            inputStr = body_str.decode()
            
            path = f"tortoise_generations/{user}"
            await start_tortoise(inputStr, user, path, "ultra_fast")
            message = "start_tortoise called"
        except FileNotFoundError as e:
            message = "directory not found"
    return message
