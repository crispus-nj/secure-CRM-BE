# FROM node:18

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD npm start


# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json, then install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files and build
COPY . .
RUN npm run build

# Stage 2: Create a clean production environment
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production dependencies in the runner stage
COPY package*.json ./
RUN npm install --omit=dev

# Copy the build output and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
