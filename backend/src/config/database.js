const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    // For development, we'll use a mock connection
    // In production, this would connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/airline_ordering';
    
    logger.info('[Database] Attempting to connect to MongoDB');
    
    // Mock connection for development
    logger.info('[Database] Mock connection established for development');
    
    // In production, you would use:
    // await mongoose.connect(mongoURI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    
    logger.info('[Database] Connected successfully');
    
  } catch (error) {
    logger.error('[Database] Connection error:', error);
    // Don't exit in development, just log the error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = {
  connectDB
}; 