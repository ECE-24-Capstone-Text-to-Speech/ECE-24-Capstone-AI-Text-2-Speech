import os


async def get_list_of_audio_in_temp(fullPath: bool = False) -> list[str]:
    out = []
    for filename in os.listdir("temp/"):
        basePath = "temp/" if fullPath else ""
        target = basePath + filename
        out.append(target)
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
