# Base Bun image
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
# Copy package.json (and lock files)
COPY package.json ./
COPY bun.lock* ./
# Install dependencies
RUN bun install

# Builder stage
FROM base AS builder
# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
# Copy all other files
COPY . .
# Set production environment for build
ENV NODE_ENV=production
# Build the application
RUN bun run build

# Production stage
FROM base AS production
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy built files from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Expose port
EXPOSE ${PORT}

# Run the app with the Cloudflare adapter
CMD ["bun", "run", "start"]
