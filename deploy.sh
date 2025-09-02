#!/bin/bash

# DataLab Georgia Deployment Script for Railway
echo "🚀 Starting DataLab Georgia deployment..."

# Set environment variables
export NODE_ENV=production
export PYTHONPATH="/app/backend"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd backend
pip install -r requirements.txt

# Install Node dependencies and build frontend
echo "📦 Installing Node dependencies and building frontend..."
cd ../frontend
npm install
npm run build

# Move built frontend to backend static directory
echo "📁 Moving built frontend to backend static directory..."
mkdir -p ../backend/static
cp -r build/* ../backend/static/

# Return to root directory
cd ..

echo "✅ Deployment preparation complete!"
echo "🎯 Ready to start with: cd backend && python server.py"