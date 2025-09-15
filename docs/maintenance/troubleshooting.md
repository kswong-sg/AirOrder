# Troubleshooting Guide

This guide helps you resolve common issues encountered while developing and running the Airline In-Flight Ordering System.

## 🚨 Common Issues

### Node.js Version Issues

#### Problem: "Node.js version not supported"
```bash
Error: Node.js version 14.15.3 is not supported. Please use Node.js 18+.
```

#### Solution:
```bash
# Check current Node.js version
node --version

# Use nvm to switch to Node.js 22
nvm use 22.17.0

# Verify the change
node --version
```

#### Problem: Multiple Node.js installations
```bash
# Check which Node.js is being used
which node
which npm

# Use Homebrew Node.js
export PATH="/usr/local/opt/node@20/bin:$PATH"

# Or use nvm Node.js
nvm use 22.17.0
```

### Port Already in Use

#### Problem: "Port 3000/3001 already in use"
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

#### Solution:
```bash
# Find processes using the ports
lsof -i :3000
lsof -i :3001

# Kill the processes
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Or kill all Node.js processes
pkill -f node
```

### Dependency Installation Issues

#### Problem: "npm install fails with peer dependency conflicts"
```bash
npm ERR! ERESOLVE overriding peer dependency
```

#### Solution:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use npm with legacy peer deps
npm install --legacy-peer-deps
```

#### Problem: "Package not found"
```bash
npm ERR! 404 Not Found - GET https://registry.npmjs.org/non-existent-package
```

#### Solution:
```bash
# Check if the package exists
npm search package-name

# Update npm and clear cache
npm cache clean --force
npm install -g npm@latest
```

### Frontend Issues

#### Problem: "Next.js configuration errors"
```bash
Error: Invalid next.config.js options detected
```

#### Solution:
```bash
# Check Next.js version compatibility
npm list next

# Update Next.js configuration
# See: docs/development/frontend.md#configuration
```

#### Problem: "React Helmet Async errors"
```bash
TypeError: Cannot read properties of undefined (reading 'add')
```

#### Solution:
```bash
# Remove react-helmet-async
npm uninstall react-helmet-async

# Install react-helmet
npm install react-helmet @types/react-helmet

# Update imports in components
# Change: import { Helmet } from 'react-helmet-async';
# To: import { Helmet } from 'react-helmet';
```

#### Problem: "Styled Components not working"
```bash
Error: styled-components not found
```

#### Solution:
```bash
# Install styled-components
npm install styled-components @types/styled-components

# Update Next.js config
# Add: compiler: { styledComponents: true }
```

### Backend Issues

#### Problem: "Module not found errors"
```bash
Error: Cannot find module './routes/menu'
```

#### Solution:
```bash
# Check if route files exist
ls -la src/routes/

# Create missing route files
# See: docs/development/backend.md
```

#### Problem: "MongoDB connection failed"
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```

#### Solution:
```bash
# For development, the app uses mock data
# MongoDB is not required for basic functionality

# If you want to use MongoDB:
# 1. Install MongoDB
brew install mongodb-community

# 2. Start MongoDB
brew services start mongodb-community

# 3. Update environment variables
# MONGODB_URI=mongodb://localhost:27017/airline_ordering
```

#### Problem: "JWT token errors"
```bash
Error: jwt must be provided
```

#### Solution:
```bash
# Set JWT secret in environment
export JWT_SECRET=your-secret-key

# Or create .env file
echo "JWT_SECRET=your-secret-key" > .env
```

### API Issues

#### Problem: "API endpoints not responding"
```bash
curl: (7) Failed to connect to localhost port 3001
```

#### Solution:
```bash
# Check if backend is running
ps aux | grep "node.*server"

# Start backend if not running
cd backend && npm run dev

# Test health endpoint
curl http://localhost:3001/health
```

#### Problem: "CORS errors"
```bash
Access to fetch at 'http://localhost:3001/api/menu' from origin 'http://localhost:3000' has been blocked by CORS policy
```

#### Solution:
```bash
# Backend CORS is already configured
# Check if backend is running on correct port
curl http://localhost:3001/health

# Use frontend proxy instead of direct API calls
# Frontend: http://localhost:3000/api/menu
# Instead of: http://localhost:3001/api/menu
```

### Build Issues

#### Problem: "TypeScript compilation errors"
```bash
error TS2307: Cannot find module 'react-helmet-async' or its corresponding type declarations
```

#### Solution:
```bash
# Install missing types
npm install @types/react-helmet

# Check TypeScript configuration
npx tsc --noEmit
```

#### Problem: "ESLint errors"
```bash
error  'useState' is defined but never used  @typescript-eslint/no-unused-vars
```

#### Solution:
```bash
# Fix ESLint errors
npm run lint -- --fix

# Or disable specific rules in .eslintrc.js
```

## 🔧 Debugging Commands

### Check System Status
```bash
# Check Node.js version
node --version
npm --version

# Check running processes
ps aux | grep -E "(node|next)" | grep -v grep

# Check port usage
lsof -i :3000
lsof -i :3001

# Check disk space
df -h
```

### Check Application Status
```bash
# Test backend health
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000

# Test API endpoints
curl "http://localhost:3001/api/menu?flightNumber=AA123&date=2024-01-15&cabinClass=economy"
```

### Check Logs
```bash
# Backend logs (if running with nodemon)
# Check terminal output

# Frontend logs (if running with next dev)
# Check terminal output

# Check npm logs
npm logs
```

## 🛠️ Performance Issues

### Slow Development Server
```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Restart development servers
```

### Memory Issues
```bash
# Check memory usage
top -o mem

# Kill memory-intensive processes
pkill -f node

# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

## 🔄 Reset Everything

### Complete Reset
```bash
# Stop all processes
pkill -f node

# Clear all caches
rm -rf node_modules package-lock.json
rm -rf .next
npm cache clean --force

# Reinstall dependencies
npm install

# Start fresh
cd backend && npm run dev
cd ../frontend && npm run dev
```

### Database Reset (if using MongoDB)
```bash
# Connect to MongoDB
mongo

# Drop database
use airline_ordering
db.dropDatabase()

# Exit MongoDB
exit
```

## 📞 Getting Help

### Before Asking for Help
1. Check this troubleshooting guide
2. Check the [README.md](../../README.md)
3. Check the [Quick Start Guide](../getting-started/quick-start.md)
4. Search existing GitHub issues

### When Creating an Issue
Include the following information:
- Operating system and version
- Node.js version (`node --version`)
- npm version (`npm --version`)
- Error message (full text)
- Steps to reproduce
- What you've already tried

### Useful Commands for Debugging
```bash
# System information
uname -a
node --version
npm --version

# Process information
ps aux | grep node
lsof -i :3000
lsof -i :3001

# Network connectivity
ping localhost
curl -v http://localhost:3001/health

# File permissions
ls -la
ls -la node_modules/
```

---

*For more detailed information about specific components, see the [Development](../development/) section.* 