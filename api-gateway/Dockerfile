FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
# Use npm ci for clean install = ci == CLEAN INSTALL
RUN npm ci  

# Copy application source (not needed for dev as we'll mount the code)
# COPY . .

# Expose API port
EXPOSE 8080

# Command is now specified in docker-compose.yml
# This allows us to easily switch between development and production modes
CMD ["npm", "run", "start:dev"]