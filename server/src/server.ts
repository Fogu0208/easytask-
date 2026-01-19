import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

// 连接数据库
const dbReady = connectDB();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (_req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (err) {
    res.status(500).json({ message: '数据库连接失败' });
  }
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 根路由
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 仅在非生产环境或非 Vercel 环境下启动监听
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
