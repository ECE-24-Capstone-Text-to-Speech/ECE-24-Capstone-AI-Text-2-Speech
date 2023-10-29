import os
from fastapi import UploadFile

FILE_SIZE_LIMIT = 30_000_000  # 30 Megabytes


async def save_audio_to_temp(audioFile: UploadFile) -> tuple[bool, str]:
    print("Saving audio file")
    targetPath = os.path.join("temp/", audioFile.filename)
    try:
        with open(targetPath, "wb") as targetFile:
            content = await audioFile.read(FILE_SIZE_LIMIT)
            # print(str(content))
            targetFile.write(content)
            print("File saved")
            return True, "File saved"
    except Exception as e:
        print(e)
        return False, str(e)
