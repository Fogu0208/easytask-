<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '../stores/task';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  (e: 'update-status', id: string, status: Task['status']): void;
  (e: 'delete', id: string): void;
}>();

const priorityMap: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低'
};

const categoryMap: Record<string, string> = {
  study: '学习',
  life: '生活',
  other: '其他'
};

const priorityColor = computed(() => {
  switch (props.task.priority) {
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
});

const handleStatusChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  emit('update-status', props.task._id, target.value as Task['status']);
};
</script>

<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
    <div class="px-4 py-4 sm:px-6 flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg leading-6 font-medium text-gray-900 truncate">
          {{ task.title }}
        </h3>
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <span
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2"
            :class="priorityColor"
          >
            {{ priorityMap[task.priority] || task.priority }}
          </span>
          <span class="mr-2">|</span>
          <span class="capitalize">{{ categoryMap[task.category] || task.category }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <select
          :value="task.status"
          @change="handleStatusChange"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="todo">待办</option>
          <option value="doing">进行中</option>
          <option value="done">已完成</option>
        </select>
        <button
          @click="emit('delete', task._id)"
          class="text-red-600 hover:text-red-900"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>