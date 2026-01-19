import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// 使用全局变量缓存连接，防止 Serverless 环境下重复连接
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI as string, opts).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`Error: ${(e as Error).message}`);
    throw e;
  }

  return cached.conn;
};

export default connectDB;
