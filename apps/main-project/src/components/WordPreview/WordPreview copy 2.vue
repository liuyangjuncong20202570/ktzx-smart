<template>
  <!-- <div class="word-container" v-html="wordContent"></div> -->
  <div class="word-wrapper">
    <!-- docx预览容器 - 始终存在 -->
    <div ref="previewContainerRef" class="preview-container">
      <!-- 错误提示 -->
      <div v-if="error" class="doc-wrapper">
        <p>{{ error }}</p>
        <br />
        <el-button type="primary" @click="handleDownload">
          <el-icon><Download /></el-icon>
          下载文件
        </el-button>
      </div>
      
      <!-- doc格式提示 -->
      <div v-if="fileType === 'doc'" class="doc-wrapper">
        <p>doc格式暂不支持预览,请下载文件查看</p>
        <br />
        <el-button type="primary" @click="handleDownload">
          <el-icon><Download /></el-icon>
          下载文件
        </el-button>
      </div>
      
      <!-- 加载提示 -->
      <div v-if="loading && !error" class="doc-wrapper">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>文档加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { Download, Loading } from "@element-plus/icons-vue";
import VueOfficeDocx from "@vue-office/docx";
import { ref, watch, onMounted, defineExpose, computed } from "vue";
import request from "@/utils/request";
import { getFileExtensionFromUrl } from "@/utils/index.js";
import { synthesisImgApi } from "@/api/practice/index.ts";
import * as docxPreview from "docx-preview";
import axios from "axios";

const props = defineProps({
  fileUrl: {
    type: String,
    required: true,
  },
});

const fileType = computed(() => {
  return props.fileUrl ? getFileExtensionFromUrl(props.fileUrl).toLowerCase() : '';
});

const loading = ref(true)
const error = ref('')
const previewContainerRef = ref(null)
const wordContent = ref('')

const fetchWordFile = async (url) => {
  error.value = "";
  wordContent.value = "";

  try {
    const response = await request.course({
      url: url,
      method: "GET",
      responseType: "blob",
    });

    const arrayBuffer = await response.arrayBuffer();
    wordContent.value = arrayBuffer;
  } catch (err) {
    console.error("Error fetching Word file:", err);
    error.value = "文档加载失败";
    ElMessage.error("文档加载失败，请尝试直接下载");
  }
};

const handleDownload = () => {
  window.open(props.fileUrl, "_blank");
};

const handleRendered = () => {
  console.log("Document rendered successfully");
};

const handleError = (err) => {
  console.error("Document render error:", err);
  error.value = "文档预览失败，请尝试直接下载";
  // ElMessage.error("文档预览失败，请尝试直接下载");
};

const fetchAndPreviewDocx = async (url) => {
  try {
    loading.value = true
    error.value = ''
    
    // 清空预览容器
    if (previewContainerRef.value) {
      previewContainerRef.value.innerHTML = ''
    }
    
    const response = await axios.get(url, {
      responseType: "blob",
    })
    
    const blob = new Blob([response.data], { 
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    })
    
    console.log('Preview container:', previewContainerRef.value)
    
    if (previewContainerRef.value) {
      console.log(docxPreview, "docxPreview");
      await docxPreview.renderAsync(blob, previewContainerRef.value)
    } else {
      throw new Error('预览容器未找到')
    }
  } catch (err) {
    console.error("Failed to fetch or preview docx:", err)
    handleError(err)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.fileUrl,
  async (newUrl) => {
    if (newUrl) {
      console.log('File type:', fileType.value);
      if (fileType.value === 'docx') {
        await fetchAndPreviewDocx(newUrl);
      }
    }
  },
  { immediate: true } // 添加 immediate 选项，确保首次加载时也执行
);

const resetContent = () => {
  wordContent.value = "";
  error.value = "";
};
</script>

<style scoped>
.word-wrapper {
  height: 1000px;
  position: relative;
}

.preview-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  background: #fff;
}

/* 自定义滚动条样式 */
.preview-container::-webkit-scrollbar {
  width: 8px;
}

.preview-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.preview-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.preview-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* docx-preview 生成的内容样式覆盖 */
:deep(.docx) {
  padding: 20px;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 800px;
}

.doc-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 20px;
  border-radius: 4px;
  z-index: 1;
}

.word-container {
  width: 100%;
  height: 80vh;
  overflow: auto;
  padding: 10px; /* 添加适当的内边距 */
  background-color: #fff; /* 白色背景 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.word-container * {
  font-family: Arial, sans-serif; /* 使用统一的字体 */
  line-height: 1.6; /* 设置行高 */
  margin: 0;
  padding: 0;
}

.word-container p {
  margin-bottom: 10px; /* 段落之间添加间距 */
}

.word-container b {
  font-weight: bold; /* 加粗 */
}

.word-container i {
  font-style: italic; /* 斜体 */
}

.word-container u {
  text-decoration: underline; /* 下划线 */
}

.word-container h1,
.word-container h2,
.word-container h3,
.word-container h4,
.word-container h5,
.word-container h6 {
  margin-top: 20px; /* 标题上方添加间距 */
  margin-bottom: 10px; /* 标题下方添加间距 */
}

.is-loading {
  font-size: 24px;
  color: #909399;
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
