from fastapi import Request


def getCurrUser(request: Request) -> str | None:
    currUser = request.cookies.get("loggedInSession", None)
    print("current user: " + str(currUser))
    return currUser