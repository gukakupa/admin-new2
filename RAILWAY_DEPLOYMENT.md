# DataLab Georgia - Railway Deployment Guide

## 🚀 Railway.com-ზე Deployment

Railway.com-ზე თქვენი DataLab Georgia full-stack აპლიკაციის deployment-ისთვის მიყევით ამ ნაბიჯებს:

### 1. კონფიგურაციის ფაილები

პროექტში უკვე შექმნილია Railway-სთვის საჭირო კონფიგურაციის ფაილები:

- `railway.json` - Railway service configuration
- `nixpacks.toml` - Build configuration for Nixpacks
- `Procfile` - Process configuration
- `.railwayignore` - Files to ignore during deployment
- `deploy.sh` - Deployment script

### 2. Environment Variables

Railway dashboard-ში დააყენეთ შემდეგი environment variables:

```
MONGO_URL=mongodb://your-mongodb-connection-string
DB_NAME=datalab_georgia
NODE_ENV=production
PYTHONPATH=/app/backend
```

### 3. MongoDB Database

Railway-ზე MongoDB service დაამატეთ:
1. Dashboard-ში "Add Service" → "Database" → "MongoDB"
2. Connection string მიიღეთ MONGO_URL environment variable-ისთვის

### 4. Deployment Process

1. **Repository Connection**:
   - Railway dashboard-ში "New Project" → "Deploy from GitHub repo"
   - აირჩიეთ თქვენი repository

2. **Build Process**:
   - Railway ავტომატურად იყენებს `nixpacks.toml` კონფიგურაციას
   - Frontend (React) იბილდება და გადაინაცვლებს backend static ფოლდერში
   - Backend (FastAPI) ელოდება და მოემსახურება როგორც API-ებს, ისე React app-ს

3. **Production URL**:
   - Railway მოგაწოდებთ production URL-ს (მაგ: `https://your-app.railway.app`)

### 5. Build Commands

Railway ავტომატურად შეასრულებს:

```bash
# Install Python dependencies
cd backend && pip install -r requirements.txt

# Install Node dependencies and build frontend
cd ../frontend && npm install && npm run build

# Move built frontend to backend static directory
mkdir -p ../backend/static
cp -r build/* ../backend/static/
```

### 6. Start Command

Railway შეასრულებს:
```bash
cd backend && python server.py
```

### 7. პრობლემების მოგვარება

**თუ build ვერ მუშაობს**:
1. შეამოწმეთ რომ ყველა dependency არის requirements.txt და package.json-ში
2. შეამოწმეთ environment variables Railway dashboard-ში
3. შეამოწმეთ MongoDB connection string

**თუ static files ვერ ტვირთავს**:
1. შეამოწმეთ რომ `backend/static/` directory არსებობს build-ის შემდეგ
2. შეამოწმეთ FastAPI static files routing

### 8. Health Check

Deployment-ის შემდეგ შეამოწმეთ:
- `https://your-app.railway.app/` - React frontend
- `https://your-app.railway.app/api/health` - Backend health check
- `https://your-app.railway.app/api/` - API status

### 9. Production Features

- ✅ React Single Page Application
- ✅ FastAPI Backend API
- ✅ MongoDB Database
- ✅ Static file serving
- ✅ Health check endpoints
- ✅ CORS configuration
- ✅ Environment-based configuration

### 10. Manual Deployment (Alternative)

თუ ავტომატური deployment არ მუშაობს, შეგიძლიათ ხელით deploy script-ის გაშვება:

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📞 Support

რაიმე პრობლემის შემთხვევაში, შეამოწმეთ Railway logs და შეატყობინეთ specific error messages.