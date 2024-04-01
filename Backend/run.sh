#!/bin/bash

dir=$(dirname "$0")
cd $dir
mkdir local

echo "building image for fastapi backend"
docker build . -t tts

echo "starting fastapi backend service"
#docker run -v "$(pwd):/server" -p 80:80 tts
#SACHIN ONLY

current_dir=$(pwd)

docker run -p 80:80 \
    -e "TORTOISE_MODELS_DIR=/models" \
    -v "$current_dir/docker_data/models:/models" \
    -v "$current_dir/docker_data/results:/results" \
    -v "$current_dir/docker_data/.cache/huggingface:/root/.cache/huggingface" \
    -v "$current_dir/docker_data/work:/work" \
    -it tts

echo "shutting down fastapi server"
docker stop tts
docker rm tts