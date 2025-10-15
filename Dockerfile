FROM node:18-alpine

# Install dependencies for cloudflared
RUN apk add --no-cache wget && \
    wget -O /usr/local/bin/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 && \
    chmod +x /usr/local/bin/cloudflared

# Set work directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Expose port
EXPOSE 8009

# Create a startup script
RUN echo '#!/bin/sh\nserve -s build -l 8009 &\nsleep 2\ncloudflared tunnel --no-autoupdate run --token eyJhIjoiOGJlNWJkYzMzYjZiNDQ0MTI3YjUwMzBlZjQyNTJlZTAiLCJ0IjoiOTI0YmJiOGMtMTE2ZC00ZjVjLWIyY2QtMmYyZTA2ZjU2NDhmIiwicyI6IllqWTJOV1ZpTlRNdE5qQTJZaTAwWTJNNUxUazBPVGd0TkRNME5UUTNPV1prWkdSaiJ9' > /app/start.sh && \
    chmod +x /app/start.sh

# Run the startup script
CMD ["/app/start.sh"]