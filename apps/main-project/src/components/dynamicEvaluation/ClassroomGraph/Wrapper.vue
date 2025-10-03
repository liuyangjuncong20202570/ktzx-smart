<template>
  <component :is="currentComponent"></component>
</template>

<script setup>
import Pending from '../PublicCpns/Pending.vue';
import ClassroomGraphWrapper from './ClassroomGraphWrapper.vue';
import { usePollingStatus } from '../../../utils/usePollingStatus';
import usePortrait from '../../../stores/dynamicEvaluation/portraitStore';
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
/* ********************变量定义******************** */
// props定义
// 普通变量
// pinia状态管理
const portraitStore = usePortrait();

// 轮询结构
const { status, result, errorMessage, startPolling } = usePollingStatus({
  onSuccess: res => ElMessage({ type: 'success', message: res }),
  onFail: err => ElMessage({ type: 'error', message: err })
});

/* ********************方法定义******************** */
const currentComponent = computed(() => {
  if (!portraitStore.taskid) return ClassroomGraphWrapper;
  if (status.value === 'success') {
    portraitStore.setTaskId('');
    return ClassroomGraphWrapper;
  }
  if (status.value === 'failed') {
    portraitStore.setTaskId('');
    return ClassroomGraphWrapper;
  }
  return Pending;
});

const startTask = () => {
  // 防止重复轮询
  if (portraitStore.taskid) {
    ElMessage({
      type: 'warning',
      message: '后台正在光速计算，请耐心等等哦'
    });
    startPolling(portraitStore.taskid);
  }
};
// TODO:对portraitMangt中的taskid进行轮询，检查渲染组件是哪一个
onMounted(() => startTask());
</script>

<style lang="less" scoped></style>
