<template>
  <!-- <div class="word-container" v-html="wordContent"></div> -->
  <div v-if="isImageShow">
    <div v-if="!imageShowLoading">
      <div v-if="imageShowUrl" class="word-wrapper image-wrapper">
        <img :src="imageShowUrl" alt="图片" />
      </div>
      <div v-else class="word-wrapper doc-wrapper">
        <p>文件加载失败，请下载文件查看</p>
        <br />
        <el-button type="primary" @click="handleDownload">
          <el-icon><Download /></el-icon>
          下载文件
        </el-button>
      </div>
    </div>
    <div v-else class="word-wrapper doc-wrapper">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>文档加载中...</span>
    </div>
  </div>
  <div v-else>
    <div v-if="error" class="word-wrapper doc-wrapper">
      <p>{{ error }}</p>
      <br />
      <el-button type="primary" @click="handleDownload">
        <el-icon><Download /></el-icon>
        下载文件
      </el-button>
    </div>
    <div v-else>
      <div v-if="fileType == 'docx' && wordContent" class="word-wrapper">
        <vue-office-docx :src="wordContent" @rendered="handleRendered" @error="handleError" />
      </div>
      <div v-else-if="fileType == 'doc'" class="word-wrapper doc-wrapper">
        <p>doc格式暂不支持预览,请下载文件查看</p>
        <br />
        <el-button type="primary" @click="handleDownload">
          <el-icon><Download /></el-icon>
          下载文件
        </el-button>
      </div>
      <div v-else class="word-wrapper doc-wrapper">
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
import { ref, watch, onMounted, defineExpose } from "vue";
import request from "@/utils/request";
import { getFileExtensionFromUrl } from "@/utils/index.js";
import { synthesisImgApi } from "@/api/practice/index.ts";
import { host } from "@/utils/request.js";
const props = defineProps({
  fileUrl: {
    type: String,
    required: true,
  },
  isImageShow: {
    type: Boolean,
    default: false,
  },
  isDocToImageData: {
    type: Object,
    default: () => ({}),
  },
  itemId: {
    type: String,
    default: "",
  },
});

const fileType = getFileExtensionFromUrl(props.fileUrl);
const wordContent = ref("");
const error = ref("");
const imageShowUrl = ref("");

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
const imageShowLoading = ref(false);
const handleSynthesisImg = () => {
  console.log("itemId", props.itemId);
  console.log("isDocToImageData", props.isDocToImageData);
  synthesisImgApi({ practiceId: props.isDocToImageData.practiceId, stuId: props.isDocToImageData.stuId, itemId: props.itemId }).then((res) => {
    console.log(res);
    imageShowLoading.value = false;
    if (res.data) {
      imageShowUrl.value = host + res.data;
    } else {
      imageShowUrl.value = "";
    }
  }).catch(() => {
    imageShowLoading.value = false;
  });
};

watch(
  () => props.fileUrl,
  (newUrl) => {
    if (newUrl) {
      if (props.isImageShow) {
        handleSynthesisImg();
      } else {
        fetchWordFile(newUrl);
      }
    }
  }
);

const resetContent = () => {
  wordContent.value = "";
  error.value = "";
};

onMounted(() => {
  console.log(props.isImageShow, "props.isImageShow");
  console.log(props.isDocToImageData, "props.isDocToImageDataisDocToImageData");
  console.log(props.itemId, "props.itemId");
  if (props.fileUrl) {
    if (props.isImageShow) {
      handleSynthesisImg();
    } else {
      fetchWordFile(props.fileUrl);
    }
  }
});

defineExpose({ resetContent });
</script>

<style scoped>
.word-wrapper {
  overflow: auto;
  height: 1000px;
  scrollbar-width: none;
}

.image-wrapper {
  background-color: gray;
  margin-top: 0;
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 改为顶部对齐 */
  min-height: 100%;
}

.image-wrapper img {
  min-width: 500px;
  max-width: 90%;
  height: auto;
  object-fit: contain;
  display: block; /* 防止图片底部有空隙 */
}

/* 自定义滚动条样式 */
.word-wrapper::-webkit-scrollbar {
  width: 8px;
}

.word-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.word-wrapper::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.word-wrapper::-webkit-scrollbar-thumb:hover {
  background: #555;
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
.doc-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  gap: 10px;
  margin-top: 150px;
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
