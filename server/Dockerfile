# Use the official Python image from the Docker Hub
FROM python:3.12-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install the package dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/

# Don't buffer log output to stdout
ENV PYTHONUNBUFFERED 1

# Expose the application port
EXPOSE 5919

# Run the application
CMD ["python", "app.py"]