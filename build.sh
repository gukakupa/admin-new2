#!/bin/bash
echo "Building DataLab Georgia..."

# Build frontend
cd frontend
npm install --legacy-peer-deps
npm run build

# Copy to backend
cd ..
mkdir -p backend/static
cp -r frontend/build/* backend/static/

# Install backend deps
cd backend
pip install -r requirements.txt

echo "Build complete!"