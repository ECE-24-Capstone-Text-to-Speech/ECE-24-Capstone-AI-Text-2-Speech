# Use an official Python runtime as a parent image
FROM python:3.10-slim


#idk test: suha
RUN apt-get update && apt-get install -y libmagic1

# Set the working directory to /app
WORKDIR /server

VOLUME /server

# # Copy the current directory contents into the container at /app
# COPY . /server

# # Install any needed packages specified in requirements.txt
# RUN pip install -r requirements.txt


# Copy only the package.json and package-lock.json files first.
# This helps to cache the installation of your project's dependencies.
COPY requirements.txt ./

# Run npm install to install project dependencies.
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run main.py when the container launches
CMD ["uvicorn", "main:server", "--host", "0.0.0.0", "--port", "80"]
