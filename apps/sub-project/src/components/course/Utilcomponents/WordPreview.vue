<template>
  <!-- <div class="word-container" v-html="wordContent"></div> -->
  <div v-if="wordContent" class="word-wrapper">
    <vue-office-docx :src="wordContent" />
  </div>
  <LoadingSpinner v-else />
</template>

<script setup>
import LoadingSpinner from '../Classroommangt/LoadingSpinner.vue';
import VueOfficeDocx from '@vue-office/docx';
import { ref, watch, onMounted, defineExpose } from 'vue';
import mammoth from 'mammoth';
import request from '../../../utils/request';

const props = defineProps({
  fileUrl: {
    type: String,
    required: true
  }
});

const wordContent = ref('');

const fetchWordFile = async url => {
  try {
    console.log('Fetching Word file from URL:', url);
    const response = await request.course({
      url: url,
      method: 'GET',
      responseType: 'blob' // 重要：设置响应类型为blob
    });
    console.log(response);
    const arrayBuffer = await response.arrayBuffer();
    wordContent.value = arrayBuffer;
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    console.log('Word file converted to HTML:', result.value);
    // wordContent.value = result.value;
  } catch (error) {
    console.error('Error fetching or converting Word file:', error);
  }
};

watch(
  () => props.fileUrl,
  newUrl => {
    if (newUrl) {
      fetchWordFile(newUrl);
    }
  }
);

const resetContent = () => {
  if (wordContent.value) {
    wordContent.value = ''; // 清空内容
  }
};

onMounted(() => {
  if (props.fileUrl) {
    fetchWordFile(props.fileUrl);
  }
});

defineExpose({ resetContent });
</script>

<style scoped>
.word-wrapper {
  overflow: auto;
  height: 500px;
  scrollbar-width: none;
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
</style>
