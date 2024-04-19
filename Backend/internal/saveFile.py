import os
from fastapi import UploadFile

FILE_SIZE_LIMIT = 30_000_000  # 30 Megabytes


async def create_folders(*folderPathes: str):
    for folderPath in folderPathes:
        os.makedirs(name=folderPath, exist_ok=True)


async def create_user_folders(user: str) -> tuple[str, str]:
    targetFolder = f"temp/{user}/"
    outputFolder = (
        f"tortoise_generations/{user}/"  # creates output folder too for later use
    )
    await create_folders(targetFolder, outputFolder)
    return targetFolder, outputFolder


async def save_audio_to_temp(audioFile: UploadFile, user: str) -> tuple[bool, str]:
    print("Saving audio file")
    targetFolder, outputFolder = await create_user_folders(user)
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
