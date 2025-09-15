# Airline In-Flight Ordering System - Setup Guide

## ✅ Installation Complete!

Both frontend and backend dependencies have been successfully installed with no vulnerabilities.

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:3001`

### 2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:3000`

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## 📁 Project Structure

```
airline-ordering-app/
├── frontend/                 # React + Next.js frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Next.js pages
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Utility functions
│   ├── package.json         # Frontend dependencies
│   └── next.config.js       # Next.js configuration
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Main server file
│   ├── package.json         # Backend dependencies
│   └── logs/                # Application logs
├── requirements/             # Functional requirements
├── docs/                    # Documentation
└── README.md               # Main documentation
```

## 🔧 Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Backend Scripts
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
npm run deploy       # Deploy to AWS
```

## 🌟 Key Features Implemented

### Frontend Features
- ✅ **Modern React 18** with TypeScript
- ✅ **Next.js 14** with SSR and optimized routing
- ✅ **Styled Components** for modern styling
- ✅ **Framer Motion** for smooth animations
- ✅ **React Query** for efficient state management
- ✅ **Error Boundaries** for robust error handling
- ✅ **Responsive Design** for mobile and desktop
- ✅ **Internationalization** ready with i18next

### Backend Features
- ✅ **Express.js** with TypeScript
- ✅ **Comprehensive Error Handling** with custom error classes
- ✅ **Structured Logging** with Winston
- ✅ **Security Middleware** (CORS, Helmet, Rate Limiting)
- ✅ **API Documentation** with Swagger
- ✅ **Health Monitoring** and performance tracking
- ✅ **Database Integration** ready (MongoDB, Redis)

### Core Functionality
- ✅ **Menu Browsing** with dietary filters
- ✅ **Order Management** with real-time updates
- ✅ **Dietary Restrictions** (vegetarian, vegan, gluten-free, halal, kosher)
- ✅ **Allergy Management** with automatic warnings
- ✅ **Meal Slot Management** with time-based ordering
- ✅ **Crew Coordination** features
- ✅ **Food Safety Monitoring** ready
- ✅ **Emergency Protocols** ready

## 🔒 Security Features

- **JWT Authentication** with role-based access control
- **Rate Limiting** to prevent abuse
- **Input Validation** with Joi schemas
- **CORS Protection** for cross-origin requests
- **Helmet.js** for security headers
- **Error Handling** with proper logging

## 📊 Monitoring & Logging

- **Structured Logging** with Winston
- **Request/Response Logging** with Morgan
- **Health Checks** at `/health` endpoint
- **Performance Monitoring** with response time tracking
- **Memory Usage Monitoring** with automatic alerts

## 🧪 Testing

### Frontend Testing
```bash
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
```

### Backend Testing
```bash
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
```

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to AWS S3 + CloudFront
npm run deploy
```

### Backend Deployment
```bash
# Deploy to AWS Lambda
npm run deploy

# Or deploy to traditional server
npm run build
npm run start
```

## 🔧 Environment Configuration

### Frontend Environment (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Airline In-Flight Ordering
NEXT_PUBLIC_ENVIRONMENT=development
```

### Backend Environment (.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/airline_ordering
JWT_SECRET=your-super-secret-jwt-key
```

## 📚 API Endpoints

### Core Endpoints
- `GET /api/menu` - Get menu items for a flight
- `POST /api/order` - Create a new order
- `GET /api/order/:id` - Get order details
- `POST /api/auth/login` - User authentication

### Admin Endpoints
- `GET /api/admin/analytics` - Admin analytics
- `POST /api/admin/slots/:id/lock` - Lock meal slot
- `POST /api/admin/export` - Export to catering

### Crew Endpoints
- `GET /api/crew/passengers/:flight` - Get passenger meals
- `POST /api/crew/service-complete` - Report service completion

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   ```

2. **Database Connection Issues**
   ```bash
   # Start MongoDB
   mongod
   
   # Start Redis
   redis-server
   ```

3. **Node Modules Issues**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **TypeScript Errors**
   ```bash
   # Run type check
   npm run type-check
   ```

## 📞 Support

For issues and questions:
- Check the logs in `backend/logs/`
- Review the API documentation at `/api-docs`
- Check the browser console for frontend errors
- Review the terminal output for backend errors

## 🎉 Success!

Your airline in-flight ordering system is now ready for development! The application includes:

- ✅ **Modern Tech Stack** with latest dependencies
- ✅ **Comprehensive Error Handling** with proper logging
- ✅ **Security Features** with authentication and validation
- ✅ **Scalable Architecture** ready for production
- ✅ **Advanced Features** for dietary restrictions and crew coordination
- ✅ **Monitoring & Logging** for production readiness

Start developing by running both servers and accessing the application at http://localhost:3000! 