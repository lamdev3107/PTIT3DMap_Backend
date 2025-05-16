# Create Dockerfile in PITT3DMap_Backend directory
 # Use Node.js 20.10.0 Alpine Linux base image for a lightweight container
FROM node:20.10.0-alpine   

# Set the working directory inside container to /app
WORKDIR /app              

# Copy package.json and package-lock.json to working directory
COPY package*.json ./      

# Install all dependencies defined in package.json
RUN npm install           

# Copy all remaining source code files to working directory
COPY . .                  

#Docker container will listen on port 8000
EXPOSE 8000      
       
# Define the command to start the Node.js application
CMD ["npm", "start"]
