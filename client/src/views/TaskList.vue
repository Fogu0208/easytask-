<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTaskStore, type Task } from '../stores/task';
import TaskItem from '../components/TaskItem.vue';

const taskStore = useTaskStore();

const newTask = ref({
  title: '',
  category: 'other' as Task['category'],
  priority: 'medium' as Task['priority'],
});

onMounted(() => {
  taskStore.fetchTasks();
});

const handleAddTask = async () => {
  if (!newTask.value.title) return;
  await taskStore.addTask(newTask.value);
  newTask.value.title = '';
  newTask.value.category = 'other';
  newTask.value.priority = 'medium';
};

const handleUpdateStatus = (id: string, status: Task['status']) => {
  taskStore.updateTask(id, { status });
};

const handleDeleteTask = (id: string) => {
  if (confirm('确定要删除这个任务吗？')) {
    taskStore.deleteTask(id);
  }
};
</script>

<template>
  <div>
    <div class="mb-8 bg-white shadow sm:rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">添加新任务</h2>
      <form @submit.prevent="handleAddTask" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">标题</label>
          <input
            type="text"
            id="title"
            v-model="newTask.title"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
          />
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">分类</label>
            <select
              id="category"
              v-model="newTask.category"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
            >
              <option value="study">学习</option>
              <option value="life">生活</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700">优先级</label>
            <select
              id="priority"
              v-model="newTask.priority"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          添加任务
        </button>
      </form>
    </div>

    <div v-if="taskStore.loading" class="text-center py-4">加载中...</div>
    <div v-else-if="taskStore.error" class="text-red-600 text-center py-4">{{ taskStore.error }}</div>
    <div v-else class="space-y-4">
      <TaskItem
        v-for="task in taskStore.tasks"
        :key="task._id"
        :task="task"
        @update-status="handleUpdateStatus"
        @delete="handleDeleteTask"
      />
      <div v-if="taskStore.tasks.length === 0" class="text-center text-gray-500 py-8">
        还没有任务，快去添加一个吧！
      </div>
    </div>
  </div>
</template>