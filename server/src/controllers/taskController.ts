import { Request, Response } from 'express';
import Task from '../models/Task';

// @desc    获取所有任务
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: Request, res: Response) => {
  try {
    // 获取当前登录用户的任务
    const tasks = await Task.find({ user: (req.user as any)?._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    创建新任务
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: Request, res: Response) => {
  const { title, category, priority } = req.body;

  if (!title) {
    return res.status(400).json({ message: '请添加任务标题' });
  }

  try {
    const task = await Task.create({
      user: (req.user as any)?._id,
      title,
      category,
      priority,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新任务
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: '任务未找到' });
    }

    // 确保只能更新自己的任务
    if (task.user.toString() !== (req.user as any)._id.toString()) {
      return res.status(401).json({ message: '未授权' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // 返回更新后的文档
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    删除任务
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: '任务未找到' });
    }

    // 确保只能删除自己的任务
    if (task.user.toString() !== (req.user as any)?.id) {
      return res.status(401).json({ message: '未授权' });
    }

    await task.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};