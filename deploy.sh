#!/bin/bash

# Exit on any error
set -e

echo "Starting deployment..."

# Install dependencies
echo "Installing dependencies with pnpm..."
pnpm install

# Build the application
echo "Building Next.js application..."
pnpm run build

echo "Deployment completed successfully!"
