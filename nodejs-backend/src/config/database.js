const dns = require('dns');
const mongoose = require('mongoose');
const logger = require('../logger');

const connectDB = async () => {
  try {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1', '2001:4860:4860::8888']);
      logger.info('Configured Google/Cloudflare DNS servers for SRV resolution');
    } catch (dnsErr) {
      logger.warn('Could not set custom DNS servers, using default resolver:', dnsErr.message);
    }

    await mongoose.connect(process.env.MONGO_URL);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
