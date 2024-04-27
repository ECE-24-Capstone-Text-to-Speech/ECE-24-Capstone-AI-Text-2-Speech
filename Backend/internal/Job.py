class Job:
    def __init__(self, user: str, text: str, setting: str = "ultra_fast") -> None:
        self.user = user
        self.text = text
        self.setting = setting
