#!/usr/bin/env python3
"""
DataLab Georgia - Entry point for Railway deployment
"""
import subprocess
import sys
import os
from pathlib import Path

def build_frontend():
    """Build React frontend"""
    print("🔨 Building frontend...")
    
    # Change to frontend directory
    frontend_dir = Path(__file__).parent / "frontend"
    os.chdir(frontend_dir)
    
    # Install and build
    subprocess.run(["npm", "install", "--legacy-peer-deps"], check=True)
    subprocess.run(["npm", "run", "build"], check=True)
    
    # Copy build to backend static
    backend_static = Path(__file__).parent / "backend" / "static"
    backend_static.mkdir(exist_ok=True)
    
    subprocess.run([
        "cp", "-r", 
        str(frontend_dir / "build" / "*"),
        str(backend_static / ".")
    ], shell=True)
    
    print("✅ Frontend built!")

def start_backend():
    """Start FastAPI backend"""
    print("🚀 Starting backend...")
    
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    # Install Python deps
    subprocess.run(["pip", "install", "-r", "requirements.txt"], check=True)
    
    # Start server
    subprocess.run(["python", "server.py"], check=True)

if __name__ == "__main__":
    try:
        build_frontend()
        start_backend()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)