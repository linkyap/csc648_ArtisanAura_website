FROM gcr.io/cloud-run/node:18

# Set the working directory in the container
WORKDIR /workspace/application/prototypes/verticalPrototype

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port on which the application listens (if needed)
EXPOSE 8080

# Set the command to run the Node.js application
CMD [ "npm", "start" ]
