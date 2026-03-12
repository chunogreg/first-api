# Use official Node image

FROM node:20

# Set working directory

WORKDIR /app

# Copy package files first

COPY package*.json ./

# Install dependencies

RUN npm install

# Copy the rest of the project

COPY . .

# Expose the part your app runs on

EXPOSE 3000

# Start the server

CMD ["npm", "run", "dev"]
