# Airline In-Flight Ordering System

A comprehensive airline in-flight meal ordering system with real-time capabilities, dietary management, and crew coordination features.

## 📚 Documentation

**📖 [Full Documentation](./docs/README.md)** - Complete documentation organized by topic

### Quick Navigation
- 🚀 **[Quick Start Guide](./docs/getting-started/quick-start.md)** - Get up and running in minutes
- 🏗️ **[System Overview](./docs/architecture/overview.md)** - High-level architecture
- 📋 **[API Reference](./docs/api/)** - Complete API documentation
- 🔧 **[Development Guides](./docs/development/)** - Frontend and backend development
- 🚨 **[Troubleshooting](./docs/maintenance/troubleshooting.md)** - Common issues and solutions

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0 (Recommended: Node.js 22.x)
- npm >= 8.0.0

### Installation & Setup

1. **Clone and navigate to the project:**
   ```bash
   cd airline-ordering-app
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies  
   cd ../frontend && npm install
   ```

3. **Start the servers:**
   ```bash
   # Start backend (Terminal 1)
   cd backend && npm run dev
   
   # Start frontend (Terminal 2)
   cd frontend && npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs

## ✅ Current Status

Both servers are now running successfully:
- ✅ **Backend**: Running on http://localhost:3001
- ✅ **Frontend**: Running on http://localhost:3000
- ✅ **API Proxy**: Frontend can access backend via /api routes
- ✅ **Health Check**: Backend health endpoint responding
- ✅ **Menu API**: Menu endpoint returning mock data

## 🛠️ Development

### Available Scripts

**Backend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run linting
```

**Frontend:**
```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
npm run type-check   # Run TypeScript type checking
```

### API Endpoints

**Health Check:**
- `GET /health` - Server health status

**Menu Management:**
- `GET /api/menu` - Get menu items for a flight
- `POST /api/order` - Create a new order
- `GET /api/order/:bookingRef` - Get orders by booking reference

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**User Management:**
- `GET /api/user/me` - Get current user profile

**Admin Functions:**
- `GET /api/admin/analytics` - Get system analytics

**Crew Operations:**
- `GET /api/crew/passengers/:flightNumber` - Get passenger meals for crew

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: Styled Components
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Yup validation
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Internationalization**: i18next

### Backend (Node.js + Express)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose (configured for production)
- **Authentication**: JWT tokens
- **Validation**: Joi schemas
- **Logging**: Winston structured logging
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate limiting

### Key Features Implemented
- ✅ Real-time menu browsing
- ✅ Dietary restrictions filtering
- ✅ Order management
- ✅ User authentication
- ✅ Crew coordination
- ✅ Health monitoring
- ✅ API documentation
- ✅ Error handling
- ✅ Logging system

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/airline_ordering
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📊 Testing

### API Testing
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test menu endpoint
curl "http://localhost:3001/api/menu?flightNumber=AA123&date=2024-01-15&cabinClass=economy"
```

### Frontend Testing
```bash
# Test frontend proxy
curl "http://localhost:3000/api/menu?flightNumber=AA123&date=2024-01-15&cabinClass=economy"
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill processes on ports 3000/3001
   lsof -ti:3000 | xargs kill -9
   lsof -ti:3001 | xargs kill -9
   ```

2. **Node.js version issues:**
   ```bash
   # Use nvm to switch to Node.js 22
   nvm use 22.17.0
   ```

3. **Dependency issues:**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

**📖 [Full Troubleshooting Guide](./docs/maintenance/troubleshooting.md)** - Detailed solutions for common issues

## 📝 Next Steps

1. **Database Integration**: Connect to MongoDB for persistent data
2. **Authentication**: Implement real user authentication
3. **Real-time Features**: Add WebSocket for live updates
4. **Payment Integration**: Add Stripe for payments
5. **Mobile App**: Create React Native mobile app
6. **Deployment**: Deploy to cloud platforms (AWS, Vercel, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

**📖 [Contributing Guide](./docs/contributing/guide.md)** - Detailed contribution guidelines

## 📄 License

MIT License - see LICENSE file for details
