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

# Run the application with Gunicorn, logging to stdout
# https://stackoverflow.com/a/25737799
CMD ["gunicorn", "--bind", "0.0.0.0:5919", "--access-logfile", "-", "--error-logfile", "-", "--access-logformat", '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" "%({X_Real_IP}i)s', "app:app"]