import asyncio
import os

async def get_list_of_audio_in_temp(fullPath: bool = False, user: str=None) -> list[str]:
    '''
    Get all audio files in temp folder.
    If fullPath is true, print full paths
    If given user, then only get files under that user's folder
    '''
    baseFolder = "temp"
    targetFolder = ""
    if user:
        if user not in os.listdir(baseFolder):
            print(user + " doesn't exists")
            return []
        targetFolder += "/" + user

    def getFilesInFolder(folderName):
        # print("Exploring: "+baseFolder+folderName)
        files = []
        for filename in os.listdir(baseFolder + folderName):
            currPath = folderName + "/" + filename
            # print("\tChecking: "+currPath)
            if os.path.isdir(baseFolder + currPath):
                # print("\t\tIs folder, recurrsing...")
                subFiles = getFilesInFolder(currPath)
                files.extend(subFiles)
            else:
                # print("\t\tIs file, adding to list")
                finalPath = (baseFolder + currPath) if fullPath else currPath
                files.append(finalPath)
        return files
    
    out = getFilesInFolder(targetFolder)
    
    return out


# async def fetch_audio_from_temp(fileName: str) -> str | None:
#     print("Fetching audio file")
#     targetPath = os.path.join("temp/", fileName)
#     try:
#         with open(targetPath, "r") as targetFile:
#             # content = await targetFile.read()
#             # # print(str(content))
#             # targetFile.write(content)
#             # print("File saved")
#             # return True
#             return targetPath
#     except Exception as e:
#         print(e)
#         return None


async def __printAllFilesInTemp():
    user = "folder3"
    print(await get_list_of_audio_in_temp(fullPath=False, user=user))


if __name__ == "__main__":
    asyncio.run(__printAllFilesInTemp())
