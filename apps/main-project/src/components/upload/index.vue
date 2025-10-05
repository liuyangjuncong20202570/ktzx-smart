<!--
 * @Date: 2024-07-17 15:39:30
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-19 09:51:15
 * @FilePath: \smarttt_ktzx\src\components\upload\index.vue
-->
<template>
  <el-upload
    class="upload-demo"
    v-model:file-list="fileList"
    drag
    :action="action"
    :data="{ tag: tag }"
    :on-success="upLoadSuccess"
    :on-preview="previewFile"
    :on-remove="removeFile"
    :before-upload="beforeUpload"
    :on-exceed="handleExceed"
    :limit="1"
    multiple
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">拖拽/<em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">请上传格式为{{ fileTypeStr }}的文件</div>
    </template>
  </el-upload>
  <el-dialog
    v-model="isOpenDialog"
    :fullscreen="isFullscreen"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="dialogTitle"
    :width="dialogWidth"
  >
    <el-image style="width: 100%" :src="fileUrl" fit="cover" v-if="isImg" />
    <iframe
      ref="iframe"
      style="width: 100%; height: calc(100vh - 200px)"
      :src="fileUrl"
      frameborder="0"
      v-if="isPdf"
    ></iframe>
    <VideoPlayer v-if="isVideo" :src="fileUrl" :options="playerOptions"></VideoPlayer>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="isOpenDialog = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- <el-image style="width: 100px; height: 100px"  :src="fileUrl" fit="cover" /> -->
  <!-- <iframe ref="iframe" style="width: 100%; height: 500px" :src="fileUrl" frameborder="0"></iframe> -->
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { VideoPlayer } from '@videojs-player/vue';
import 'video.js/dist/video-js.css';
import { host } from '@/utils/request.js';
import { UploadFilled } from '@element-plus/icons-vue';
import { ElMessage, UploadFile, UploadFiles, UploadRawFile, UploadUserFile } from 'element-plus';
const props = defineProps({
  tag: {
    type: String,
    default: ''
  },
  fileType: {
    type: Array,
    default: () => ['.doc', '.docx', '.png', '.jpg', '.pdf', '.bmp', '.mp4', '.avi']
  }
});
const { fileType } = props;
const fileTypeStr = fileType.toString().replace(/,/g, '/');
const action = ref(host + '/common/upload');
const fileList = reactive<UploadFiles>([]);
const fileUrl = ref('');
const isImg = ref<boolean>(false);
const isVideo = ref<boolean>(false);
const isPdf = ref<boolean>(false);
const isWord = ref<boolean>(false);
const isOpenDialog = ref<boolean>(false);
const isFullscreen = ref<boolean>(false);
const dialogTitle = ref<string>('展示');
const dialogWidth = ref<number | string>(650);
const playerOptions = ref({
  height: 500,
  width: 500, //播放器宽度
  playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
  autoplay: 'any', // 如果true,浏览器准备好时开始回放。
  muted: true, // 默认情况下将会消除任何音频。
  loop: true, // 导致视频一结束就重新开始。
  preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  language: 'zh-CN',
  aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
  fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
  notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
  controls: true,
  controlBar: {
    timeDivider: true,
    durationDisplay: true,
    remainingTimeDisplay: false,
    fullscreenToggle: true // 全屏按钮
  }
});
const upLoadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response.code == 200) {
    fileList.length = 0;
    fileList.push(uploadFile);
    computeFileType(uploadFile);
  }
};
const computeFileType = (file: UploadFile) => {
  const imgType = <string[]>['png', 'jpg', 'bmp'];
  const videoType = <string[]>['mp4', 'avi'];
  const pdfType = <string[]>['pdf'];
  const wordType = <string[]>['doc', 'docx'];
  const fileType = file.name.slice(file.name.lastIndexOf('.') + 1);
  if (imgType.includes(fileType)) {
    isImg.value = true;
  }
  if (videoType.includes(fileType)) {
    isVideo.value = true;
  }
  if (pdfType.includes(fileType)) {
    isPdf.value = true;
  }
  if (wordType.includes(fileType)) {
    isWord.value = true;
  }
};
const previewFile = (uploadFile: UploadFile) => {
  isOpenDialog.value = false;
  fileUrl.value = host + '/static/' + uploadFile.response.data;
  if (isImg.value) {
    dialogTitle.value = '图片展示';
    dialogWidth.value = 650;
    isFullscreen.value = false;
    isOpenDialog.value = true;
    return;
  }
  if (isPdf.value) {
    dialogTitle.value = '文件展示';
    dialogWidth.value = '100vw';
    isFullscreen.value = true;
    isOpenDialog.value = true;
    return;
  }
  if (isWord.value) {
    window.location.href = fileUrl.value;
    return;
  }
  if (isVideo.value) {
    dialogTitle.value = '视频展示';
    dialogWidth.value = '1200px';
    isFullscreen.value = false;
    isOpenDialog.value = true;
    console.info(fileUrl.value);
    return;
  }
};
const removeFile = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  fileList.length = 0;
};
const beforeUpload = (rawFile: UploadRawFile) => {
  // 校检文件类型
  let fileExtension = <string>'';
  if (rawFile.name.lastIndexOf('.') > -1) {
    fileExtension = rawFile.name.slice(rawFile.name.lastIndexOf('.') + 1);
  }
  let isTypeOk = <boolean>true;
  let fileTypeArr = <string[]>[];
  fileType.forEach((item: any) => {
    fileTypeArr.push(item.replace('.', ''));
  });
  isTypeOk = fileTypeArr.some((type: any): boolean => {
    if (rawFile.type.indexOf(type) > -1) return true;
    if (fileExtension && fileExtension.indexOf(type) > -1) return true;
    return false;
  });
  if (!isTypeOk) {
    ElMessage.error(`文件格式不正确, 请上传${fileTypeStr}格式文件!`);
    return false;
  }
};
const handleExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
  ElMessage.error(`上传文件数量不能超过1个!`);
};
const getFilePath = async () => {
  let path: string = '';
  if (fileList.length <= 0) {
    ElMessage.error(`请上传文件后提交！`);
    return '';
  }
  path = fileList[0].response.data;
  return path;
};
defineExpose({ getFilePath });
onMounted(() => {});
</script>
