#!/bin/bash

set -e

echo "building image for fastapi backend"
docker build . -t tts
echo "starting fastapi backend service"

pwd=$(pwd)

docker run --gpus all -p 80:80 \
    -e TORTOISE_MODELS_DIR=/models \
    -v $pwd/docker_data/models:/models \
    -v $pwd/docker_data/results:/results \
    -v $pwd/docker_data/.cache/huggingface:/root/.cache/huggingface \
    -v $pwd/docker_data/work:/work \
    -v "$(pwd):/server" \
    -it tts


echo "shutting down fastapi server"
docker stop tts
docker rm tts