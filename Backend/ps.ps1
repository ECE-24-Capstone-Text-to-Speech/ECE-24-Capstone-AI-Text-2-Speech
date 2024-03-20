echo "building image for fastapi backend"
docker build -t tts .

echo "starting fastapi backend service"

# nvidia user only
# docker run --gpus all -p 80:80 `
#     -e "TORTOISE_MODELS_DIR=/models" `
#     -v "$(pwd)/docker_data/models:/models" `
#     -v "$(pwd)/docker_data/results:/results" `
#     -v "$(pwd)/docker_data/.cache/huggingface:/root/.cache/huggingface" `
#     -v "$(pwd)/docker_data/work:/work" `
#     -v "$(pwd):/server" ` tts  # New volume mount

# non-nvidia user only
docker run -p 80:80 `
    -e "TORTOISE_MODELS_DIR=/models" `
    -v "$(pwd)/docker_data/models:/models" `
    -v "$(pwd)/docker_data/results:/results" `
    -v "$(pwd)/docker_data/.cache/huggingface:/root/.cache/huggingface" `
    -v "$(pwd)/docker_data/work:/work" `
    -v "$(pwd):/server" ` tts  # New volume mount

#docker run -v "$(pwd):/server" -p 80:80 tts

echo "shutting down fastapi server"
docker stop tts
docker rm tts


