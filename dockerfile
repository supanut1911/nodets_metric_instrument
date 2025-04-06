# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all files first (including src)
COPY . .

# Install dependencies
RUN npm install

RUN npm run build

# Expose port
EXPOSE 8899


# Start the application
CMD ["npm", "run", "dev"]
