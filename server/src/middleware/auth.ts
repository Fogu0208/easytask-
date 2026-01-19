import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  id: string;
}

// 保护路由中间件
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // 检查请求头中的 Authorization 字段
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 获取 token (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // 验证 token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // 获取用户信息并附加到 request 对象，排除密码字段
      (req as any).user = await User.findById(decoded.id).select('-password') || undefined;

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: '未授权，token 验证失败' });
    }
  }

  if (!token) {
    res.status(401).json({ message: '未授权，没有 token' });
  }
};