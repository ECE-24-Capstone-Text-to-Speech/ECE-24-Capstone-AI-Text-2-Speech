from fastapi import FastAPI
from fastapi.responses import RedirectResponse

server = FastAPI()

def redirect_external(target):
    response = RedirectResponse(url='https://'+target)
    return response

@server.get("/")
async def root():
    return {"message": "Hello World"}

@server.get("/{name}")
async def personal_website_redirect(name):
    urls= {"purva":'pkantawala0.github.io', "suha":'suha0825.github.io', "kevin":'xhc12345.github.io', "tristan":'tristanbecnel87.github.io', "lucy":'singrongchiu.github.io', "sachin":'sachinnairr.github.io'}
    target = urls.get(name, 'google.com')
    return redirect_external(target)
