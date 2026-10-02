// Updated environment variables configuration
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const socketService = require('./services/socketService');
const startAuctionScheduler = require('./utils/auctionScheduler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Connect to MongoDB database and seed
connectDB().then((conn) => {
  if (conn) {
    try {
      const seedAuctions = require('./utils/seeder');
      seedAuctions();
    } catch (err) {
      console.error('Seeding error:', err.message);
    }
  }
}).catch((err) => {
  console.error('Database connection error:', err.message);
});

const app = express();

// Standard middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://bidzy-frontend.onrender.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed origins, localhost, or any onrender.com domain
    if (
      allowedOrigins.includes(origin) ||
      allowedOrigins.some(o => origin.startsWith(o)) ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }
    return callback(null, origin);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Handle OPTIONS preflight requests explicitly across all routes
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Bidzy - Student Auction Marketplace API is running...' });
});

// Database connection readiness check middleware
app.use('/api', (req, res, next) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database connection unavailable. Please check your backend MONGO_URI environment variable.'
    });
  }
  next();
});

// Mount routing layers
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Fallback error middlewares
app.use(notFound);
app.use(errorHandler);

// Instantiate HTTP server
const server = http.createServer(app);

// Initialize Socket.io server
socketService.init(server);

// Start the background auction expiry scheduler
startAuctionScheduler();

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
