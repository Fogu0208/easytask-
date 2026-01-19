import mongoose, { Document, Schema } from 'mongoose';

// 定义用户接口
export interface IUser extends Document {
  username: string;
  password: string;
}

// 定义用户 Schema
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);