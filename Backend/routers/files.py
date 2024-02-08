import magic
from fastapi import APIRouter, Depends, HTTPException, Request, Response, UploadFile, status
from typing import Union
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from internal.cookies import getCurrUser
from internal.getFile import get_list_of_audio_in_temp
from internal.saveFile import save_audio_to_temp

# from models.AudioFile import AudioUploadFile

from dependencies import get_token_header
MAX_FILE_SIZE = 1_000_000  # 1 MB


router = APIRouter(
    prefix="/files",  # all paths in this file assumes preceed by `/files`
    tags=["files"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "files path needs functions name appended"}},
)

# router.mount("/files", StaticFiles(directory="temp"), name="audioFiles")

async def save_audio_file(user: str, audioFile: UploadFile):
    mime = magic.Magic()
    file_type = mime.from_buffer(audioFile.file.read(1024))
    # fileSize = len(audioFile)
    
    allowed_formats = {"MPEG ADTS", "RIFF"}
    if not any(x in file_type for x in allowed_formats):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="File format not supported. Supported formats are MP3 and WAV. File type provided is: "+file_type,
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
        print("file "+audioFile.filename+" not exists in "+str(allUserFiles)+", adding")
        saved, message = await save_audio_to_temp(audioFile, user=user)
    else:
        print("file "+audioFile.filename+" found aready")
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
async def audio_input(request: Request, audioFile: UploadFile | None = None):
    """
    Grabs FormData.audioFile.
    Requires frontend to send file in as FormData, input called "audioFile"
    """
    user = getCurrUser(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please log in in order to upload files!"
        )

    if not audioFile:
        raise HTTPException(
            status_code=404, detail="No input audio file given in the request."
        )

    mime = magic.Magic()
    file_type = mime.from_buffer(audioFile.file.read(1024))
    # fileSize = len(audioFile)
    
    allowed_formats = {"MPEG ADTS", "RIFF"}
    if not any(x in file_type for x in allowed_formats):
        raise HTTPException(
            status_code=415,
            detail="File format not supported. Supported formats are MP3 and WAV. File type provided is: "+file_type,
        )
    # audioFile.size    
    if audioFile.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File size = {audioFile.size:,} bytes, exceeds the limit of {MAX_FILE_SIZE:,} bytes by {(audioFile.size-MAX_FILE_SIZE):,} bytes.",
        )

    # Reset the file cursor to the beginning
    audioFile.file.seek(0)

    fileName = audioFile.filename
    file_extension = fileName.split(".")[-1]

    message: str = "Default message"
    saved: bool = False

    # if fileSize > threshhold:
    if fileName not in await get_list_of_audio_in_temp(user=user):
        saved, message = await save_audio_to_temp(audioFile, user=user)
    else:
        message = "File already exists"

    return {
        "filename": audioFile,
        "format": file_extension,
        # "size": fileSize,
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
            detail="Please log in in order to upload files!"
        )

    if not audioFiles:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No input audio file given in the request."
        )
    
    print(f"Received {len(audioFiles)} files")

    results = []

    for audioFile in audioFiles:
        result = await save_audio_file(user, audioFile)
        results.append(result)
    
    return results


@router.get("/audios")
async def get_audio_list():
    audioList = await get_list_of_audio_in_temp()
    print(audioList)
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
async def get_audio_file(request:Request, audio_name: str):
    # audio_bytes: str|None = await fetch_audio_from_temp(audio_name)
    user = getCurrUser(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please log in in order to upload files!"
        )
    files = await get_list_of_audio_in_temp(fullPath=True)
    for file in files:
        if audio_name == file.split("/")[-1]:
            return FileResponse(path=file)
    else:
        raise HTTPException(status_code=404, detail="File not found")

# from fastapi import FastAPI, APIRouter, Depends, HTTPException, Response, UploadFile
# from fastapi.responses import FileResponse, HTMLResponse
# from fastapi.staticfiles import StaticFiles
# from internal.getFile import get_list_of_audio_in_temp
# from internal.saveFile import save_audio_to_temp

# from fastapi.middleware.cors import CORSMiddleware


# # from models.AudioFile import AudioUploadFile

# from dependencies import get_token_header

# router = APIRouter(
#     prefix="/files",  # all paths in this file assumes preceed by `/files`
#     tags=["files"],
#     # dependencies=[Depends(get_token_header)],
#     responses={404: {"description": "files path needs functions name appended"}},
# )

# # router.mount("/files", StaticFiles(directory="temp"), name="audioFiles")


# @router.get("/")
# async def audio_page():
#     content = """
#         <body>
#             <form action="/files/audioInput" enctype="multipart/form-data" method="post">
#                 <input name="audioFile" type="file">
#                 <input type="submit">
#             </form>
#         </body>
#     """
#     return HTMLResponse(content=content)


# @router.post("/audioInput")
# async def audio_input(audioFile: UploadFile | None = None):
#     """
#     Grabs FormData.audioFile.
#     Requires frontend to send file in as FormData, input called "audioFile"
#     """
#     if not audioFile:
#         raise HTTPException(
#             status_code=400, detail="No input audio file given in the request."
#         )
#     fileName = audioFile.filename
#     # fileSize = len(audioFile)

#     allowed_formats = {"mp3", "wav"}
#     file_extension = fileName[-3:]  # last three letters of file name
#     if file_extension not in allowed_formats:
#         raise HTTPException(
#             status_code=400,
#             detail="File format not supported. Supported formats are MP3 and WAV.",
#         )

#     message: str = "Default message"
#     saved: bool = False
#     # if fileSize > threshhold:
#     if fileName not in await get_list_of_audio_in_temp():
#         saved, message = await save_audio_to_temp(audioFile)
#     else:
#         message = "File already exists"

#     return {
#         "filename": fileName,
#         "format": file_extension,
#         # "size": fileSize,
#         "success": saved,
#         "message": message,
#     }


# @router.get("/audios")
# async def get_audio_list():
#     audioList = await get_list_of_audio_in_temp()
#     print(audioList)
#     return audioList


# @router.get(
#     "/audios/{audio_name}",
#     # Set what the media type will be in the autogenerated OpenAPI specification.
#     # fastapi.tiangolo.com/advanced/additional-responses/#additional-media-types-for-the-main-response
#     responses={
#         200: {"content": {"multipart/form-data": {}}},
#         404: {"detail": "File not found"},
#     },
#     # Prevent FastAPI from adding "application/json" as an additional
#     # response media type in the autogenerated OpenAPI specification.
#     # https://github.com/tiangolo/fastapi/issues/3258
#     response_class=FileResponse,
# )
# async def get_audio_file(audio_name: str):
#     # audio_bytes: str|None = await fetch_audio_from_temp(audio_name)
#     files = await get_list_of_audio_in_temp(fullPath=True)
#     for file in files:
#         if audio_name == file.split("/")[-1]:
#             return FileResponse(path=file)
#     else:
#         raise HTTPException(status_code=404, detail="File not found")