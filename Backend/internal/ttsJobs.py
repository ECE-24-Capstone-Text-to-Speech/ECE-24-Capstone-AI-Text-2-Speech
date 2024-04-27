from collections import deque

from tortoise import start_tortoise


class ttsJobs:
    def __init__(self) -> None:
        self.tts_queue = deque()
        self.tts_jobs = dict()
        self.output_folder = "tortoise_generations"

    def add_job(self, user: str, text: str, setting: str = "ultra_fast"):
        """
        add job to queue and dict
        """
        target_folder = f"{self.output_folder}/{user}"
        new_job = __Job(user, text, target_folder, setting)
        self.tts_jobs[user] = new_job  # record this user's job in the dictionary
        self.tts_queue.append(new_job)  # add this job to queue

    def remove_job(self):
        """
        remove first in queue, start working on next.
        """
        pass

    def __work_job(self):
        """
        work on the first in queue, if empty then return none
        """
        self.tts_queue


class __Job:
    def __init__(
        self, user: str, text: str, target_folder: str, setting: str = "ultra_fast"
    ) -> None:
        self.user = user
        self.text = text
        self.target_folder = target_folder
        self.setting = setting
        self.is_working = False

    async def start(self):
        self.is_working = True
        try:
            file_response = await start_tortoise(
                self.text, self.user, self.target_folder, self.setting
            )
            self.is_working = False
            return file_response
        except:
            self.is_working = False
            print(f"Failed {self.user}'s job:\n\t`{self.text}`")
            return None
