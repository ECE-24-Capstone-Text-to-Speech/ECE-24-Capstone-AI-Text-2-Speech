import os
from fastapi import UploadFile

FILE_SIZE_LIMIT = 30_000_000  # 30 Megabytes


async def save_audio_to_temp(audioFile: UploadFile, user: str = None) -> tuple[bool, str]:
    print("Saving audio file")
    targetFolder = "temp/"
    if user:
        targetFolder += user + "/"
    os.makedirs(name=targetFolder, exist_ok=True)
    targetPath = os.path.join(targetFolder, audioFile.filename)
    try:
        with open(targetPath, "wb") as targetFile:
            content = await audioFile.read(FILE_SIZE_LIMIT)
            targetFile.write(content)
            print("File saved")
            return True, "File saved"
    except Exception as e:
        print(e)
        return False, str(e)
