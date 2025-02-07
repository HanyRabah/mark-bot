# Use the official Rasa image from DockerHub
FROM rasa/rasa:2.8.0-full

# Set the working directory
WORKDIR /app

# Copy the Rasa project files into the container
COPY . /app

# Expose port 5005 for the Rasa server
EXPOSE 5005

# Run the Rasa server
CMD ["run", "--enable-api", "--cors", "*"]