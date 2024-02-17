from fastapi import Request


def getCurrUser(request: Request) -> str | None:
    currUser = request.cookies.get("loggedInSession", None)
    return currUser