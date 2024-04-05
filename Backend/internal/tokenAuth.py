from fastapi import Request
import jwt


def getCurrUser(request: Request):
    # Extract the token from the Authorization header
    auth_header = request.headers.get("Authorization", None)
    username = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            # Decode the token
            payload = jwt.decode(token, options={"verify_signature": False})
            username = payload.get("sub")  # Assuming 'sub' contains the username
            print("current user: " + str(username))
        except (jwt.DecodeError, jwt.ExpiredSignatureError):
            # Token is invalid or expired
            print("Error while decoding JWt token to username")
    else:
        print("No Authorization header found")
    return username
