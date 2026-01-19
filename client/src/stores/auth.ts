import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';
import router from '../router/index';

interface User {
  _id: string;
  username: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const login = async (userData: any) => {
    try {
      error.value = null;
      const response = await api.post('/auth/login', userData);
      token.value = response.data.token;
      user.value = response.data;
      localStorage.setItem('token', token.value as string);
      router.push('/tasks');
    } catch (err: any) {
      error.value = err.response?.data?.message || '登录失败';
    }
  };

  const register = async (userData: any) => {
    try {
      error.value = null;
      const response = await api.post('/auth/register', userData);
      token.value = response.data.token;
      user.value = response.data;
      localStorage.setItem('token', token.value as string);
      router.push('/tasks');
    } catch (err: any) {
      error.value = err.response?.data?.message || '注册失败';
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    router.push('/login');
  };

  return { user, token, error, isAuthenticated, login, register, logout };
});