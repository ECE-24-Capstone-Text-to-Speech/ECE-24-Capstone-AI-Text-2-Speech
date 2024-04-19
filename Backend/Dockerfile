# Use an official CUDA devel image, FOR NVIDIA 
FROM nvidia/cuda:12.1.0-cudnn8-devel-ubuntu22.04

##FOR NON_NVIDIA comment out lines 2 and 28-29, then uncomment lines 8 and 32-33
##NVIDIA keep lines 2 and 27-28 uncommented, make sure lines 
##Use this for NON-NVIDIA PEEPS, comment out the above and uncoment the below line.
# FROM python:3.11-slim


# Set the working directory to /app
WORKDIR /server

# Update package lists and install necessary dependencies
# Set environment variable for noninteractive installation
# Update package lists and install necessary dependencies
RUN apt-get update && \
    apt-get install -y python3-pip && \
    apt-get install -y python3-dev && \
    apt-get autoremove -y && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*

# Install G++? for C++17 support
RUN apt-get install -y g++

# Install Python 3.11 from source
# Copy only the package.json and package-lock.json files first.

# Install Python packages -- NVIDIA BASED
RUN pip3 install --upgrade pip && \
   pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

##Install Python Packages -- NON-NVIDIA BASED 
# RUN pip3 install --upgrade pip && \
#     pip3 install torch torchvision torchaudio



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