# Use an official CUDA base image
FROM nvidia/cuda:12.1.0-base-ubuntu22.04

#idk test: suha
# Set the working directory to /app
WORKDIR /server

# Update package lists and install necessary dependencies
# Set environment variable for noninteractive installation
# Update package lists and install necessary dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3-pip \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

    # Install Python 3.11 from source
# Copy only the package.json and package-lock.json files first.

# Install Python packages
RUN pip3 install --upgrade pip && \
    pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121



# This helps to cache the installation of your project's dependencies.
COPY requirements.txt ./



# Install Python dependencies
RUN pip install -r requirements.txt fastapi uvicorn

# Copy application files
COPY . .

##VOLUME /server


# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run main.py when the container launches
CMD ["uvicorn", "main:server", "--host", "0.0.0.0", "--port", "80"]