# Set error handling to stop on any errors
$ErrorActionPreference = 'Stop'

# Build the Docker image
docker build . -t tts

# Get the current working directory
$pwd = Get-Location

# Run the Docker container
docker run --gpus all `
    -e "TORTOISE_MODELS_DIR=/models" `
    -v "${pwd}\docker_data\models:/models" `
    -v "${pwd}\docker_data\results:/results" `
    -v "${pwd}\docker_data\.cache\huggingface:/root/.cache/huggingface" `
    -v "${pwd}\docker_data\work:/work" `
    tts
