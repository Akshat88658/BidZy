const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('WARNING: MONGO_URI environment variable is not set in environment.');
    }
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (e) {
      // fallback ignore
    }
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bidzy');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;


