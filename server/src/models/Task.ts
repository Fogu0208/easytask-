import mongoose, { Document, Schema } from 'mongoose';

// 任务分类类型
export type TaskCategory = 'study' | 'life' | 'other';
// 任务优先级类型
export type TaskPriority = 'low' | 'medium' | 'high';
// 任务状态类型
export type TaskStatus = 'todo' | 'doing' | 'done';

// 定义任务接口
export interface ITask extends Document {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  user: mongoose.Schema.Types.ObjectId;
}

// 定义任务 Schema
const TaskSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['study', 'life', 'other'],
    default: 'other',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo',
  },
}, {
  timestamps: true,
});

export default mongoose.model<ITask>('Task', TaskSchema);