import asyncio
from collections import deque

from tortoise import start_tortoise


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


class ttsJobs:
    def __init__(self) -> None:
        self.queue: deque[__Job] = deque()
        self.jobs: dict[str, __Job] = dict()
        self.output_folder = "tortoise_generations"

    async def queue_job(self, user: str, text: str, setting: str = "ultra_fast"):
        """
        add job to the queue.
        """
        target_folder = f"{self.output_folder}/{user}"
        new_job = __Job(user, text, target_folder, setting)
        self.jobs[user] = new_job  # record this user's job in the dictionary
        await self.queue.append(new_job)  # add this job to queue
        self.__start()

    async def pop_job(self):
        """
        remove first job from queue, start working on next.
        """
        first_job = await self.__remove_first()
        if not first_job:
            return None
        self.__start()

    def __remove_first(self) -> __Job | None:
        """
        pop and return first job in queue.
        also remove it from the dict.
        if queue is empty, return None.
        """
        try:
            first_job = self.queue.popleft()
        except IndexError:
            return None

        try:
            del self.jobs[first_job.user]
        except KeyError:
            print(f"User {first_job.user}'s job is not present in the dict")

        return first_job

    def __get_first(self) -> __Job | None:
        """
        return first job in queue without popping.
        if queuee is empty, return None.
        """
        try:
            return self.queue[0]
        except IndexError:
            return None

    async def __start(self):
        """
        work on the first in queue.
        if already working on first job return false.
        if empty then return false.
        """
        first_job = self.__get_first()
        if not first_job or first_job.is_working:
            return  # False

        print("Starting first in queue")
        job_response = await first_job.start()
        print("Finished first in queue")


if __name__ == "__main__":
    user_count = 0
    asyncio.run()
