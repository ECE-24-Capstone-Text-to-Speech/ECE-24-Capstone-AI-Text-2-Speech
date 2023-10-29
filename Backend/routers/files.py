from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import HTMLResponse
from internal.saveFile import save_audio_to_temp

# from models.AudioFile import AudioUploadFile

from dependencies import get_token_header

router = APIRouter(
    prefix="/files",  # all paths in this file assumes preceed by `/files`
    tags=["files"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


fake_files_db = {"plumbus": {"name": "Plumbus"}, "gun": {"name": "Portal Gun"}}


@router.get("/")
async def read_files():
    return fake_files_db


@router.post("/audioInput")
async def audio_input(audioFile: UploadFile | None = None):
    """
    Grabs FormData.audioFile.
    Requires frontend to send file in as FormData, input called "audioFile"
    """
    if not audioFile:
        raise HTTPException(
            status_code=400, detail="No input audio file given in the request."
        )
    fileName = audioFile.filename
    # fileSize = len(audioFile)

    allowed_formats = {"mp3", "wav"}
    file_extension = fileName[-3:]  # last three letters of file name
    if file_extension not in allowed_formats:
        raise HTTPException(
            status_code=400,
            detail="File format not supported. Supported formats are MP3 and WAV.",
        )

    # if fileSize > threshhold:
    saved: bool = await save_audio_to_temp(audioFile)
    if not saved:
        return {
            "filename": fileName,
            "format": file_extension,
            # "size": fileSize,
            "success": False,
        }

    return {
        "filename": fileName,
        "format": file_extension,
        # "size": fileSize,
        "success": True,
    }


@router.get("/upload")
async def upload_page():
    content = """
        <body>
            <form action="/files/audioInput" enctype="multipart/form-data" method="post">
                <input name="audioFile" type="file">
                <input type="submit">
            </form>
        </body>
    """
    return HTMLResponse(content=content)


@router.get("/{file_name}")
async def read_item(file_name: str):
    if file_name not in fake_files_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"name": fake_files_db[file_name]["name"], "file_name": file_name}
