import { ref, onMounted, onBeforeUnmount } from 'vue';
import { circleSearch } from '../api/dynamic';
import axios from 'axios';

// 默认5s轮询
export function usePollingStatus(options) {
  const {
    interval = 5000,
    maxRetries = 12,
    extractStatus = res => res.status ?? 'success',
    onSuccess = () => {},
    onFail = () => {}
  } = options;

  const status = ref('');
  const result = ref(null);
  const errorMessage = ref(null);

  let timer = null;
  let retryCount = 0;
  let currentTaskId = null; //当前任务ID，用于去重或状态判断

  const clearPolling = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const startPolling = async taskid => {
    // 如果已在轮询相同的 taskid，就不重复开启
    if (status.value === 'pending' && taskid === currentTaskId) {
      return;
    }

    // 清理之前的轮询
    clearPolling();

    currentTaskId = taskid;
    retryCount = 0;
    status.value = 'pending';

    // 启动首次请求,定时轮询
    poll(taskid);
    timer = setInterval(() => poll(taskid), interval);
  };

  const poll = async taskid => {
    if (retryCount >= maxRetries) {
      clearPolling();
      status.value = 'failed';
      errorMessage.value = '轮询超时，数据暂未更新，请悉知';
      onFail(errorMessage.value);
      return;
    }

    try {
      const { code, msg, data } = await circleSearch(taskid);

      const currentStatus = extractStatus(data);

      if (currentStatus === 'success') {
        clearPolling();
        status.value = 'success';
        result.value = data.result;
        onSuccess('计算成功，数据已更新');
      } else if (currentStatus === 'failed') {
        clearPolling();
        status.value = 'failed';
        errorMessage.value = data.message || '任务失败';
        onFail(errorMessage.value);
      } else {
        status.value = 'pending';
        // 继续轮询
      }
    } catch (err) {
      clearPolling();
      status.value = 'failed';
      errorMessage.value = err.message;
      onFail(errorMessage.value);
    }

    retryCount++;
  };

  onBeforeUnmount(() => {
    clearPolling();
  });

  return {
    status,
    result,
    errorMessage,
    startPolling
  };
}
