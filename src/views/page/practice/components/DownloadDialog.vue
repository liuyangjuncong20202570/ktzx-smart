<template>
  <el-dialog class="custom-dialog" v-model="visible" title="下载状态" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="download-status">
      <div class="status-section">
        <div v-if="downloadInfo.job">
          <div v-if="downloadInfo.job.state === 'ready'" class="status-text">
            <el-icon><CircleCheck color="#409efc" /></el-icon>
            已经准备好，可以执行
          </div>
          <div v-if="downloadInfo.job.state === 'running'" class="status-text">
            <el-icon class="running-icon"><Loading color="#999" /></el-icon>
            任务正在执行中，请等待...
          </div>
          <div v-if="downloadInfo.job.state === 'complete'" class="status-text">
            <el-icon><Download color="#67c23a" /></el-icon>已完成

            <a :href="host + '/static/' + downloadInfo.job.url" :download="getFileName(downloadInfo.job.url)" class="download-link">
              {{ downloadInfo.job.url }}
            </a>
          </div>
          <div v-if="downloadInfo.job.state === 'failed'" class="status-text1 error">
            <div style="width: 100%" class="status-text">
              <el-icon><Warning color="#f56c6c" /></el-icon>
              任务执行失败，可重新开始
            </div>
            <div style="width: 100%; margin-left: 20px" v-if="downloadInfo.job.msg" class="error-msg">失败原因: {{ downloadInfo.job.msg }}</div>
          </div>
        </div>
      </div>

      <div class="download-items">
        <h4 class="task-title">启动下载任务</h4>
        <el-divider style="margin: 10px 0 20px 0" />
        <el-checkbox-group v-model="selectedItems" class="checkbox-group">
          <el-checkbox v-for="item in downloadInfo.items" :key="item.id" :label="item.id" class="custom-checkbox">
            {{ item.itemName }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer custom-dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleStartDownload" :disabled="!selectedItems.length || downloadInfo.job?.state === 'running'"> 启动 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { host } from "@/utils/request.js";

const props = defineProps({
  modelValue: Boolean,
  downloadInfo: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "start-download"]);

const visible = ref(false);
const selectedItems = ref([]);

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
  }
);

watch(
  () => visible.value,
  (val) => {
    emit("update:modelValue", val);
    if (!val) {
      selectedItems.value = [];
    }
  }
);

const handleClose = () => {
  visible.value = false;
};

const handleStartDownload = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning("请选择要下载的项目");
    return;
  }

  emit("start-download", {
    itemIds: selectedItems.value,
    practiceId: props.downloadInfo.practiceId,
  });
};

const getFileName = (url) => {
  if (!url) return "";
  return url.split("/").pop();
};
</script>

<style scoped>
.download-status {
  padding: 20px;
}

.status-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: normal;
  text-align: left;
}

.status-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.status-text {
  display: flex;
  align-items: center;
  gap: 8px;
}
.status-text1 {
  text-align: left;
}

.error {
  color: #f56c6c;
}

.error-msg {
  margin-top: 8px;
  font-size: 14px;
}

.download-items {
  margin-top: 20px;
}

.task-title {
  margin: 0 0 0 0;
  font-size: 14px;
  font-weight: normal;
  text-align: left;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 10px;
}

/* 覆盖 element-plus 默认样式 */
:deep(.el-checkbox) {
  height: auto !important;
  margin-left: 0 !important;
}

:deep(.el-checkbox__input) {
  background: rgba(39, 165, 255, 0.1) !important;
  border-radius: 5px !important;
}

:deep(.el-checkbox__inner) {
  background: rgba(39, 165, 255, 0.1) !important;
  border-radius: 3px !important;
  border: 1px solid #27a5ff !important;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #27a5ff !important;
  border-color: #27a5ff !important;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #1b1b1b;
  font-weight: normal;
}

.download-link {
  color: #409eff;
  text-decoration: none;
}

.download-link:hover {
  text-decoration: underline;
}
.running-icon {
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

