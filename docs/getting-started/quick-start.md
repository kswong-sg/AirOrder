# Quick Start Guide

Get the Airline In-Flight Ordering System up and running in under 10 minutes.

## 🚀 Prerequisites

- **Node.js**: Version 18+ (Recommended: Node.js 22.x)
- **npm**: Version 8+
- **Git**: For cloning the repository

## ⚡ Quick Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd airline-ordering-app
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Start the Servers
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm run dev
```

### 4. Verify Installation
```bash
# Test backend health
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000
```

## 🎯 What You Should See

### Backend (http://localhost:3001)
- Health endpoint responding with status
- API documentation available at `/api-docs`
- Mock data for testing

### Frontend (http://localhost:3000)
- Next.js application running
- Menu browsing interface
- Flight search functionality

## 🧪 Quick Tests

### Test Menu API
```bash
curl "http://localhost:3001/api/menu?flightNumber=AA123&date=2024-01-15&cabinClass=economy"
```

### Test Frontend Proxy
```bash
curl "http://localhost:3000/api/menu?flightNumber=AA123&date=2024-01-15&cabinClass=economy"
```

## 🔧 Common Issues

### Port Already in Use
```bash
# Kill processes on ports 3000/3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Node.js Version Issues
```bash
# Use nvm to switch to Node.js 22
nvm use 22.17.0
```

### Dependency Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. **Read the Architecture**: [System Overview](../architecture/overview.md)
2. **Explore the API**: [API Reference](../api/)
3. **Start Developing**: [Frontend Development](../development/frontend.md) or [Backend Development](../development/backend.md)
4. **Set Up Your Environment**: [Environment Setup](./environment.md)

## 🆘 Need Help?

- Check [Troubleshooting](../maintenance/troubleshooting.md)
- Review [Common Issues](../maintenance/troubleshooting.md#common-issues)
- Create an issue in the GitHub repository

---

*This guide gets you up and running quickly. For detailed setup instructions, see [Installation Guide](./installation.md).* 