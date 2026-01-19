import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/axios';

export interface Task {
  _id: string;
  title: string;
  category: 'study' | 'life' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTasks = async () => {
    loading.value = true;
    try {
      const response = await api.get('/tasks');
      tasks.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取任务失败';
    } finally {
      loading.value = false;
    }
  };

  const addTask = async (taskData: Partial<Task>) => {
    try {
      const response = await api.post('/tasks', taskData);
      tasks.value.push(response.data);
    } catch (err: any) {
      error.value = err.response?.data?.message || '添加任务失败';
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await api.put(`/tasks/${id}`, updates);
      const index = tasks.value.findIndex(t => t._id === id);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '更新任务失败';
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      tasks.value = tasks.value.filter(t => t._id !== id);
    } catch (err: any) {
      error.value = err.response?.data?.message || '删除任务失败';
    }
  };

  return { tasks, loading, error, fetchTasks, addTask, updateTask, deleteTask };
});