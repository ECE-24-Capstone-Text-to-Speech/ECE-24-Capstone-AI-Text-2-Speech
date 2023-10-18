#!/bin/bash

echo "building image for fastapi backend"
docker build -t my-fastapi-app .

echo "starting fastapi backend service"
docker run -p 80:80 my-fastapi-app

echo "shutting down fastapi server"
docker stop my-fastapi-app