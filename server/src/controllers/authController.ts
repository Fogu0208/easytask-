import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// 生成 JWT Token
const generateToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 未配置');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    注册用户
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: '请填写用户名和密码' });
    }

    // 检查用户是否已存在
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建用户
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: '无效的用户数据' });
    }
  } catch (error) {
    const err = error as any;
    if (err?.code === 11000) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    console.error('registerUser error:', error);
    res.status(500).json({ message: err?.message || '服务器错误' });
  }
};

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: '请填写用户名和密码' });
    }

    // 查找用户 (只支持用户名登录)
    const user = await User.findOne({ username });

    // 验证密码
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: '用户名或密码错误' });
    }
  } catch (error) {
    console.error('loginUser error:', error);
    const err = error as any;
    res.status(500).json({ message: err?.message || '服务器错误' });
  }
};
