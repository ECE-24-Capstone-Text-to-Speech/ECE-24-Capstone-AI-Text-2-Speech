import asyncio
from collections import deque
from tortoise import start_tortoise


async def start_tortoise(text: str, user: str, path: str, setting: str):
    t = 1
    print(f"\t\t{user} starting a {t} seconds {setting} job to generate `{text}`...")
    await asyncio.sleep(t)
    print(f"\t\tDone, {user}'s generated file is at {path}.")
    return {"filePath": path}


class cJob:
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
        except Exception as e:
            self.is_working = False
            print(f"!!! Failed {self.user}'s job: `{self.text}`")
            return None


class ttsJobs:
    def __init__(self) -> None:
        self.queue: deque[cJob] = deque()
        self.jobs: dict[str, cJob] = dict()
        self.output_folder = "tortoise_generations"

    async def queue_job(self, user: str, text: str, setting: str = "ultra_fast"):
        """
        add job to the queue.
        """
        print(f">>> Queueing {user}'s task: {text}")
        target_folder = f"{self.output_folder}/{user}"
        new_job = cJob(user, text, target_folder, setting)
        self.jobs[user] = new_job  # record this user's job in the dictionary
        self.queue.append(new_job)  # add this job to queue
        asyncio.create_task(self.__start())

    async def pop_job(self):
        """
        remove first job from queue, start working on next.
        """
        first_job = self.__remove_first()
        if not first_job:
            return None
        print(f"\tPopped {first_job.user}'s task: {first_job.text}")
        asyncio.create_task(self.__start())

    def get_queue_size(self):
        """
        get queue size
        """
        q_len = len(self.queue)
        num_users = len(self.jobs)
        return (q_len, num_users)

    def __remove_first(self) -> cJob | None:
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

    def __get_first(self) -> cJob | None:
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
        if not first_job:
            print("===============================================================")
            print("END OF QUEUE")
            return  # False
        if first_job.is_working:
            print("===============================================================")
            print("AWAITING CURRENT TASK TO COMPLETE")
            return  # False

        print("===============================================================")
        job_response = await first_job.start()
        await self.pop_job()


if __name__ == "__main__":
    user_count = 5
    content = []
    for i in range(user_count):
        args = (f"user{i}", f"{i}:sentence to be generated:{i}")
        content.append(args)
    q_sys = ttsJobs()

    async def __loop_script(args, q_sys):
        for arg in args:
            (username, sentence) = arg
            await q_sys.queue_job(username, sentence)
            print(f"### QUEUED JOB FOR {username} ###")
        await asyncio.sleep(3.4)
        await q_sys.queue_job("newUser666", "HAHAHA666")
        print(f"### QUEUED JOB FOR newUser666 ###")
        await asyncio.sleep(7)
        await q_sys.queue_job("ElonMusk", "MAR2050")
        print(f"### QUEUED JOB FOR ElonMusk ###")
        await asyncio.sleep(3)
        print("Done")

    asyncio.run(__loop_script(content, q_sys))
