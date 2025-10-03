<template>
  <div class="swiper-outer-container">
    <div class="swiper-container">
      <swiper
        :modules="modules"
        :slides-per-view="source == 'view' ? 2 : 2"
        :space-between="5"
        :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          enabled: props.images.length > 2,
          hideOnClick: false
        }"
        :pagination="false"
        :slidesPerGroup="1"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        class="my-swiper"
        :initial-slide="0"
      >
        <swiper-slide v-for="(url, index) in images" :key="index">
          <div class="swiper-slide-content">
            <div class="image-wrapper">
              <div class="file-name" v-if="getFileExtensionFromUrl(url) === 'pdf' || getFileExtensionFromUrl(url) === 'doc' || getFileExtensionFromUrl(url) === 'docx' || getFileExtensionFromUrl(url) === 'zip' || getFileExtensionFromUrl(url) === 'rar'">格式：{{ getFileExtensionFromUrl(url) }}</div>
              <div class="file-name" v-else-if="type === 'video'">格式：{{ getFileExtensionFromUrl(url) }}</div>
              <img v-else :src="url" :alt="`图片${index + 1}`" />
            </div>
            <div class="button-wrapper">
              <el-button v-if="getFileExtensionFromUrl(url) === 'pdf'" @click="handlePreviewPdf(url, index+1)" type="primary" class="view-button"><el-icon style="margin-right: 5px;background: #32B16C;"><View /></el-icon>查看</el-button>
              <el-button v-else-if="getFileExtensionFromUrl(url) === 'doc' || getFileExtensionFromUrl(url) === 'docx'" @click="lockDoc(url, index+1)" type="primary" class="view-button"><el-icon style="margin-right: 5px;background: #32B16C;"><View /></el-icon>查看</el-button>
              <el-button v-else-if="getFileExtensionFromUrl(url) == 'zip' || getFileExtensionFromUrl(url) == 'rar'" type="primary" class="view-button" @click="downloadZip(url, index+1)"><el-icon style="margin-right: 5px;background: #32B16C;"><Download /></el-icon>下载</el-button>
              <el-button v-else-if="type === 'video'" type="primary" class="view-button" @click="handleVideoPreview(url, index+1)"><el-icon style="margin-right: 5px;background: #32B16C;"><View /></el-icon>查看</el-button>
              <el-button v-else type="primary" class="view-button" @click="handlePreview(url, index+1)"><el-icon style="margin-right: 5px;background: #32B16C;"><View /></el-icon>查看</el-button>
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <!-- 自定义导航按钮 -->
      <template v-if="props.images.length > 2">
        <div class="swiper-button-prev custom-nav-button"></div>
        <div class="swiper-button-next custom-nav-button"></div>
      </template>
    </div>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="previewVisible" :title="titleDialog" width="90%" :close-on-click-modal="true" :destroy-on-close="true" center class="preview-dialog">
      <div class="preview-container">
       
        <img v-if="previewType === 'image'" :src="currentPreviewImage" alt="预览图" class="preview-image" />
        <!-- <div v-else-if="previewType === 'doc'" class="doc-preview" v-html="docContent"></div> -->
        <WordPreview v-else-if="previewType === 'doc'" :isImageShow="isImageShow" :isDocToImageData="isDocToImageData" :itemId="itemId"  ref="wordPreviewRef" :fileUrl="currentPreviewUrl" />
        <iframe 
          v-else-if="previewType === 'pdf'" 
          :src="currentPreviewUrl" 
          class="pdf-preview" 
          type="application/pdf"
          width="100%"
          height="1000px"
          frameborder="0"
        ></iframe>
        <div v-else-if="previewType === 'video'" class="video-preview">
          <video
            ref="videoPlayer"
            class="video-player"
            controls
            autoplay
            :src="currentPreviewUrl"
            @error="handleVideoError"
          >
            您的浏览器不支持 video 标签
          </video>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button 
            @click="handlePrevious" 
            :disabled="!hasPrevious"
            type="primary"
          ><el-icon><ArrowLeft /></el-icon>
            上一个
          </el-button>
          <el-button 
            @click="handleNext" 
            :disabled="!hasNext"
            type="primary"
          >
            下一个
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { getFileExtensionFromUrl } from "@/utils/index.js";
import mammoth from 'mammoth';
import WordPreview from '@/components/WordPreview/WordPreview.vue';
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const props = defineProps<{
  images: string[];
  type: string;
  defaultName: string;
  source: string;
  isImageShow: boolean;
  isDocToImageData: any;
  itemId: string;
}>();
// Swiper modules
const modules = [Navigation, Pagination, Autoplay];

// 预览相关
const previewVisible = ref(false);
const currentPreviewImage = ref("");
const currentPreviewUrl = ref("");
const previewType = ref('image');
const docContent = ref('');
const titleDialog = ref('');
const videoPlayer = ref(null);

// 当前预览的索引
const currentIndex = ref(0);

// 计算是否有上一个/下一个
const hasPrevious = computed(() => {
  if (previewType.value === 'image') {
    // 获取所有图片文件
    const imageFiles = props.images.filter(url => 
      !['pdf', 'doc', 'docx', 'mp4', 'webm', 'ogg'].includes(getFileExtensionFromUrl(url).toLowerCase())
    );
    const currentImageIndex = imageFiles.findIndex(url => url === currentPreviewImage.value);
    return currentImageIndex > 0;
  }
  return currentIndex.value > 0;
});

const hasNext = computed(() => {
  if (previewType.value === 'image') {
    // 获取所有图片文件
    const imageFiles = props.images.filter(url => 
      !['pdf', 'doc', 'docx', 'mp4', 'webm', 'ogg'].includes(getFileExtensionFromUrl(url).toLowerCase())
    );
    const currentImageIndex = imageFiles.findIndex(url => url === currentPreviewImage.value);
    return currentImageIndex < imageFiles.length - 1;
  }
  return currentIndex.value < props.images.length - 1;
});

// Swiper instance
const onSwiper = (swiper: any) => {
  // 确保导航按钮在初始化时就正确显示
  if (props.images.length > 2) {
    swiper.navigation.init();
    swiper.navigation.update();
  }
};

// Slide change event
const onSlideChange = () => {
  console.log("slide change");
};

// 查看大图
const handlePreview = (url: string, index: number) => {
  const fileType = getFileExtensionFromUrl(url).toLowerCase();
  if (['mp4', 'webm', 'ogg'].includes(fileType)) {
    handleVideoPreview(url, index);
  } else {
    previewType.value = 'image';
    currentPreviewImage.value = url;
    previewVisible.value = true;
    titleDialog.value = `${props.defaultName}-${index}`;
  }
};

// 查看doc
const lockDoc = async (url: string, index: number) => {
  currentPreviewUrl.value = url;
  previewType.value = 'doc';
  previewVisible.value = true;
  titleDialog.value = `${props.defaultName}-${index}`;
  return
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    docContent.value = result.value;
    previewType.value = 'doc';
    previewVisible.value = true;
    titleDialog.value = `${props.defaultName}-${index}`;
  } catch (error) {
    console.error('Error loading doc:', error);
    // 如果预览失败，回退到直接打开
    window.open(url);
  }
}
// 查看pdf
const handlePreviewPdf = async (url: string, index: number) => {
  previewType.value = 'pdf';
  currentPreviewUrl.value = url;
  previewVisible.value = true;
  titleDialog.value = `${props.defaultName}-${index}`;
};

// 处理视频预览
const handleVideoPreview = (url: string, index: number) => {
  previewType.value = 'video';
  currentPreviewUrl.value = url;
  previewVisible.value = true;
  titleDialog.value = `${props.defaultName}-${index}`;
};

// 处理视频错误
const handleVideoError = () => {
  ElMessage.error('视频加载失败');
};

// 处理关闭弹窗
const handleClose = () => {
  // 如果是视频，停止播放
  if (previewType.value === 'video' && videoPlayer.value) {
    videoPlayer.value.pause();
    videoPlayer.value.currentTime = 0;
  }
  previewVisible.value = false;
};

// 处理上一个/下一个
const handlePrevious = () => {
  if (!hasPrevious.value) return;
  
  if (previewType.value === 'image') {
    const imageFiles = props.images.filter(url => 
      !['pdf', 'doc', 'docx', 'mp4', 'webm', 'ogg'].includes(getFileExtensionFromUrl(url).toLowerCase())
    );
    const currentImageIndex = imageFiles.findIndex(url => url === currentPreviewImage.value);
    if (currentImageIndex > 0) {
      currentPreviewImage.value = imageFiles[currentImageIndex - 1];
      titleDialog.value = `${props.defaultName}-${currentIndex.value}`;
    }
  }
  currentIndex.value--;
};

const handleNext = () => {
  if (!hasNext.value) return;
  
  if (previewType.value === 'image') {
    const imageFiles = props.images.filter(url => 
      !['pdf', 'doc', 'docx', 'mp4', 'webm', 'ogg'].includes(getFileExtensionFromUrl(url).toLowerCase())
    );
    const currentImageIndex = imageFiles.findIndex(url => url === currentPreviewImage.value);
    if (currentImageIndex < imageFiles.length - 1) {
      currentPreviewImage.value = imageFiles[currentImageIndex + 1];
      titleDialog.value = `${props.defaultName}-${currentIndex.value + 2}`;
    }
  }
  currentIndex.value++;
};

// 下载zip
const downloadZip = (url: string, index: number) => {
  window.open(url);
};
</script>

<style scoped lang="scss">
.swiper-outer-container {
  position: relative;
  padding: 0 50px; // 为左右按钮留出空间
}

.swiper-container {
  width: 100%;
  padding: 20px 0;
  position: relative;

  .my-swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    // padding: 10px;
    width: 200px;
    height: 288px;
    background: #FFFFFF;
    border-radius: 5px;
    border: 1px solid #D2D2D2;
    overflow: hidden;

    .image-wrapper {
      width: 100%;
      height: 300px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .button-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;
background: #FFFFFF;
box-shadow: 0px -5px 10px 0px rgba(0,0,0,0.1);

      .view-button {
        width: 80px;
        height: 32px;
        background-color: #00b42a;
        border-color: #00b42a;

        &:hover {
          background-color: #23c343;
          border-color: #23c343;
        }
      }
    }
  }
}
.file-name{
  text-align: center;
  margin-top: 100px;
}

.preview-container {
  width: 90%;
  height: 100%;
  max-height: 70vh;
  overflow: auto;
  margin: 0 auto;

  .preview-image {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  .doc-preview {
    padding: 20px;
    background: white;
    
    :deep(p) {
      margin-bottom: 1em;
      line-height: 1.5;
    }
    
    :deep(table) {
      border-collapse: collapse;
      margin: 1em 0;
      
      td, th {
        border: 1px solid #ddd;
        padding: 8px;
      }
    }
  }

  .pdf-preview {
    width: 100%;
    height: 1000px;
    border: none;
  }

  .video-preview {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
    
    .video-player {
      width: 100%;
      max-height: 70vh;
      object-fit: contain;
    }
  }
}

.preview-dialog {
  :deep(.el-dialog__body) {
    max-height: 80vh;
    overflow: auto;
    padding: 0;
    
    .video-preview {
      background: #000;
      min-height: 400px;
    }
  }

  :deep(.el-dialog__header) {
    padding: 15px;
    margin: 0;
    border-bottom: 2px solid #27A5FF !important;
  }
  
  :deep(.el-dialog__footer) {
    padding: 15px;
    margin: 0;
    border-top: 1px solid #eee;
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 20px;
    
    .el-button {
      width: 100px;
      
      &:disabled {
        background-color: #f5f7fa;
        border-color: #e4e7ed;
        color: #c0c4cc;
      }
    }
  }
}
</style>

<style lang="scss">
.swiper-outer-container .custom-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  background: #D2D2D2;
  width: 32px !important;
  height: 32px !important;
  border-radius: 50% !important;
  padding: 0 !important;
  margin: 0;
  display: flex !important;
  justify-content: center;
  align-items: center;
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s ease;

  &.swiper-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::after {
    font-size: 16px;
    font-weight: bold;
  }
  
  &:hover {
    background: #27A5FF;
  }
}

.swiper-outer-container .custom-nav-button.swiper-button-prev {
  left: -50px;
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(45deg);
    margin-left: 4px;
  }
}

.swiper-outer-container .custom-nav-button.swiper-button-next {
  right: -40px;
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-right: 2px solid #fff;
    border-top: 2px solid #fff;
    transform: rotate(45deg);
    margin-right: 4px;
  }
}

.swiper-outer-container .swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  background: #d9d9d9;
  opacity: 1;

  &-active {
    background: #00b42a;
  }
}

// 预览弹窗样式
.swiper-outer-container .el-dialog {
  border-radius: 8px;
  padding: 0;

  .el-dialog__header {
    margin: 0;
    padding: 15px 20px;
    border-bottom: 2px solid #27A5FF;
  }

  .el-dialog__body {
    padding: 20px;
    max-height: 80vh;
    overflow-y: scroll;
    .video-preview {
      background: #000;
      height: 400px;
      overflow-y: scroll;
      text-align: center;
      .video-player{
        height: 100%;
      }
    }
  }
  .el-dialog__footer{
    background: rgba(39,165,255,0.1);
   padding: 10px 20px;
   .dialog-footer{
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
   }
  }
}
</style>
