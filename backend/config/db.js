import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stock_trading_platform';
  
  try {
    console.log(`Attempting connection to MongoDB at: ${mongoUri}...`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Could not connect to external MongoDB: ${error.message}`);
    console.log('Starting In-Memory MongoDB Server fallback...');
    
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      console.log(`In-Memory MongoDB Server started at: ${uri}`);
      
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
    } catch (memError) {
      console.error(`Error starting In-Memory MongoDB: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
