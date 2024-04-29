import asyncio
from collections import deque

# from internal.tortoise import start_tortoise


async def start_tortoise(text: str, user: str, path: str, setting: str):
    t = 1
    print(f"\t{user} starting a {t} seconds {setting} job to generate `{text}`...")
    await asyncio.sleep(t)
    print(f"\tDone, {user}'s generated file is at {path}.")
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
    def __init__(self, output_folder: str = "tortoise_generations") -> None:
        self.__queue: deque[cJob] = deque()
        self.__jobs: dict[str, cJob] = dict()
        self.output_folder = output_folder

    def queue_job(self, user: str, text: str, setting: str = "ultra_fast"):
        """
        add job to the queue.
        """
        print(f">>> Queueing {user}'s task: {text}")
        if user in self.__jobs:
            print(f"!!! ABORTED, USER {user} ALREADY IN QUEUE")
            return
        target_folder = f"{self.output_folder}/{user}"
        new_job = cJob(user, text, target_folder, setting)
        self.__jobs[user] = new_job  # record this user's job in the dictionary
        self.__queue.append(new_job)  # add this job to queue
        asyncio.create_task(self.__start())
        print("\tFinished queueing")

    def pop_job(self):
        """
        remove first job from queue, start working on next.
        """
        first_job = self.__remove_first()
        if not first_job:
            return
        print(f"<<< Popped {first_job.user}'s task: {first_job.text}")
        asyncio.create_task(self.__start())
        print("\tFinished popping")

    def get_queue_size(self, user: str | None = None):
        """
        get queue size
        """
        q_len = len(self.__queue)
        num_users = len(self.__jobs)
        user_job_index = -1
        if user:
            try:
                user_job = self.__jobs[user]
            except:
                return (q_len, num_users, user_job_index)
            user_job_index = self.__queue.index(user_job)
        return (q_len, num_users, user_job_index)

    def __remove_first(self) -> cJob | None:
        """
        pop and return first job in queue.
        also remove it from the dict.
        if queue is empty, return None.
        """
        try:
            first_job = self.__queue.popleft()
        except IndexError:
            return None

        try:
            del self.__jobs[first_job.user]
        except KeyError:
            print(f"User {first_job.user}'s job is not present in the dict")

        return first_job

    def __get_first(self) -> cJob | None:
        """
        return first job in queue without popping.
        if queuee is empty, return None.
        """
        try:
            return self.__queue[0]
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
        self.pop_job()


def tts_script():
    user_count = 5
    content = []
    for i in range(user_count):
        args = (f"user{i}", f"{i}:sentence to be generated:{i}")
        content.append(args)
    q_sys = ttsJobs()

    def print_size(q_sys: ttsJobs, user: str | None = None):
        q_size, user_count, user_index = q_sys.get_queue_size(user)
        print(
            f"--- Current queue length={q_size}, number of users in queue={user_count}"
            + (
                f", user {user} has {user_index} jobs infront on the queue"
                if user
                else ""
            )
        )

    async def __loop_script(args: tuple[str, str], q_sys: ttsJobs):
        print("-------------------------------------")
        for arg in args:
            (username, sentence) = arg
            q_sys.queue_job(username, sentence)
            print(f"### QUEUED JOB FOR {username} ###")
        q_sys.queue_job("user4", "REPEAT")
        print_size(q_sys, "user4")
        await asyncio.sleep(3.4)
        q_sys.queue_job("newUser666", "HAHAHA666")
        print(f"### QUEUED JOB FOR newUser666 ###")
        print_size(q_sys, "user4")
        await asyncio.sleep(7)
        print_size(q_sys, "newUser666")
        q_sys.queue_job("ElonMusk", "MAR2050")
        print(f"### QUEUED JOB FOR ElonMusk ###")
        await asyncio.sleep(3)
        print("Done")
        print("-------------------------------------")

    asyncio.run(__loop_script(content, q_sys))


if __name__ == "__main__":
    tts_script()
