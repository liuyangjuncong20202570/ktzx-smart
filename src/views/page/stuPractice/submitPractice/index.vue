<!-- 作业答题 -->
<template>
  <!-- 预览 -->
  <div class="task-view view-experiment-box">
    <Header :title="disabled ? '查看实验' : '提交实验'" :pathData="pathData" />
    <div class="title-box">
      <div class="title-top">
        <div class="left-box">
          <span class="title-name"> {{ practiceDetail?.stu?.name }}</span>
          <span class="title-name"> {{ practiceDetail?.stu?.stuNo }}</span>
        </div>
        <div class="right-box" v-if="practiceDetail && practiceDetail?.items?.length && !disabled">
          <el-button class="custom-nav-button custom-nav-button-primary" @click="submit('save')"
            ><el-icon><CopyDocument /></el-icon>保存</el-button
          >
          <el-button class="custom-nav-button custom-nav-button-success" @click="submit('submit')"
            ><el-icon><Upload /></el-icon> 提交</el-button
          >
        </div>
      </div>
      <div class="title-bottom">
        <div class="line">
          <div class="item">
            <span class="item-name">所属课堂:</span>
            <span class="item-value">{{ practiceDetail?.courseName }}</span>
          </div>
          <div class="item" v-if="practiceDetail?.stu?.resultScore">
            <span class="item-name">总得分:</span>
            <span class="item-value">{{ practiceDetail?.stu?.resultScore }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!practiceDetail?.items?.length" class="flex-center task-no-data">暂无数据</div>

    <div class="task-upload-url flex-start template-task" v-if="teacherTask && teacherTask.length">
      <!-- <div class="teacher-task flex-center" v-for="(item, i) in teacherTask" :key="i">
        <div>
          <div class="item-title">{{ item.itemName }}</div>
          <el-button v-if="getFileExtensionFromUrl(item.defaultPath) === 'pdf'" @click="lock(host + '/static/' + item.defaultPath)">查看</el-button>
          <el-button v-else @click="download(host + '/static/' + item.defaultPath, item.itemName)">下载</el-button>
        </div>
      </div> -->
      <div v-for="(item, i) in teacherTask" :key="i">
        <div class="practice-list">
          <div class="item-title" style="flex-wrap: wrap">{{ item.itemName }}</div>
          <div class="flex-start" style="min-height: 178px; justify-content: center;overflow-x: hidden">
            <div style="display: flex; justify-content: center; align-items: center">
              <div class="task-upload-url flex-start">
                <div class="file-msg flex-center">
                  <div>格式：{{ getFileExtensionFromUrl(item.defaultPath) }}</div>
                </div>
                <div class="button-wrapper">
                  <el-button
                    v-if="getFileExtensionFromUrl(item.defaultPath) === 'pdf'"
                    @click="handlePreviewPdf(host + '/static/' + item.defaultPath, '', item.itemName)"
                    class="custom-nav-button custom-nav-button-success"
                    ><el-icon style="margin-right: 5px; background: #32b16c"><View /></el-icon>查看</el-button
                  >
                  <el-button
                    v-else-if="getFileExtensionFromUrl(item.defaultPath) === 'doc' || getFileExtensionFromUrl(item.defaultPath) === 'docx'"
                    @click="lockDoc(host + '/static/' + item.defaultPath, '', item.itemName, item.id)"
                    class="custom-nav-button custom-nav-button-success"
                    ><el-icon style="margin-right: 5px; background: #32b16c"><View /></el-icon>查看</el-button
                  >
                  <el-button v-else-if="type === 'video'" class="custom-nav-button custom-nav-button-success" @click="handleVideoPreview(host + '/static/' + item.defaultPath, '', item.itemName)"
                    ><el-icon style="margin-right: 5px; background: #32b16c"><View /></el-icon>查看</el-button
                  >
                  <el-button v-else class="custom-nav-button custom-nav-button-success" @click="handlePreview(host + '/static/' + item.defaultPath, '', item.itemName)"
                    ><el-icon style="margin-right: 5px; background: #32b16c"><View /></el-icon>查看</el-button
                  >
                  <el-button  class="custom-nav-button custom-nav-button-success" @click="download(host + '/static/' + item.defaultPath, item.itemName)"
                    ><el-icon style="margin-right: 5px; background: #32b16c"><Download /></el-icon>下载</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="task-item" v-for="(item, i) in practiceDetail.items" :key="i">
      <template v-if="item.beDefault === 0 && item.beValid">
        <div class="practice-list">
          <div class="item-title" style="flex-wrap: wrap">{{ item.itemName }}</div>
          <div class="flex-start item-content" style="min-height: 178px;overflow-x: auto">
            <div v-if="disabled" style="display: flex; justify-content: space-between;width: 100%;">
              <div v-if="!item.urlArr || !item.urlArr.length" class="flex-center task-no-data">当前实验未提交</div>
              <div :style="'width: 530px'" v-else>
                <ImageSwiper :images="item.urlArr" :isImageShow="practiceDetail.stu.status == 2 || practiceDetail.stu.status == 1 ? true : false" :itemId="item.id" :isDocToImageData="isDocToImageData" :type="item.itemCode" :defaultName="item.itemName" :source="'view'" />
              </div>
              <div class="pg-score">
                <p>此项得分：{{ item.other?.realScore || 0 }}</p>
                <br>
                <el-button v-if="item?.other?.correctImg && practiceDetail.stuCanReadCorrect == 1" class="custom-link-button custom-link-active-button" @click="handleViewCorrection(item?.other?.correctImg)">查看批改</el-button>
              </div>
            </div>
            <div v-else style="display: flex; justify-content: flex-start;">
              <div class="task-upload-url flex-start" v-if="item.urlArr && item.urlArr.length">
                <div class="url-wrap" v-for="(url, index) in item.urlArr" :key="url">
                  <!-- isImageURL -->
                  <el-image
                    v-if="isImageURL(url)"
                    style="width: 178px; height: 178px"
                    :src="url"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="[url]"
                    :initial-index="4"
                    fit="cover"
                  />

                  <div class="file-msg flex-center" v-else>
                    <div>
                      <div class="file-name">格式：{{ getFileExtensionFromUrl(url) }}</div>
                      <!-- <el-button v-if="getFileExtensionFromUrl(url) === 'pdf'" @click="lock(url || host + '/static/' + item.defaultPath)">查看</el-button>
                      <el-button v-else @click="download(url || host + '/static/' + item.defaultPath, item.itemName)">下载</el-button> -->
                    </div>
                  </div>
                  <el-icon class="file-close cursor-pointer" v-if="!disabled">
                    <Close @click="delItemUrl(item, index)" />
                  </el-icon>
                  <div class="button-wrapper">
                    <!-- <el-button type="primary" class="view-button" @click="handlePreview(image)"
                      ><el-icon style="margin-right: 5px; background: #32b16c"><View /></el-icon>查看</el-button
                    > -->

                    <el-button v-if="getFileExtensionFromUrl(url) === 'pdf'" @click="handlePreviewPdf(url, index, item.itemName)" type="primary" class="view-button"
                      ><el-icon style="margin-right: 5px; background: #32b16c"><View /></el-icon>查看</el-button
                    >
                    <el-button
                      v-else-if="getFileExtensionFromUrl(url) === 'doc' || getFileExtensionFromUrl(url) === 'docx'"
                      @click="lockDoc(url, index, item.itemName, item.id)"
                      type="primary"
                      class="view-button"
                      ><el-icon style="margin-right: 5px; background: #32b16c"><View /></el-icon>查看</el-button
                    >
                    <el-button v-else-if="type === 'video'" type="primary" class="view-button" @click="handleVideoPreview(url, index, item.itemName)"
                      ><el-icon style="margin-right: 5px; background: #32b16c"><View /></el-icon>查看</el-button
                    >
                    <el-button
                      v-else-if="getFileExtensionFromUrl(url) == 'zip' || getFileExtensionFromUrl(url) == 'rar'"
                      @click="downloadZip(url, item.itemName)"
                      type="primary"
                      class="view-button"
                      ><el-icon style="margin-right: 5px; background: #32b16c"><Download /></el-icon>下载</el-button
                    >
                    <el-button v-else type="primary" class="view-button" @click="handlePreview(url, index, item.itemName)"
                      ><el-icon style="margin-right: 5px; background: #32b16c"><View /></el-icon>查看</el-button
                    >
                  </div>
                </div>
              </div>
              <div class="task-no-data" v-else-if="disabled">暂无提交实验材料</div>
              <div class="task-upload" v-if="!disabled">
                <el-upload 
                  :action="action" 
                  :data="data" 
                  :show-file-list="false"
                  :accept="getAcceptTypes(item.fileTypes)"
                  :on-success="(response, file) => handleAvatarSuccess(response, file, item)"
                  :on-exceed="(files, uploadFiles) => handleExceed(files, uploadFiles, item)"
                  :before-upload="(file) => beforeUpload(file, item)"
                  class="upload-container"
                >
                  <div class="upload-content">
                    <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                    <div class="upload-tip">
                      <p>支持格式：{{ 
                        typeof item.fileTypes === 'string' 
                          ? item.fileTypes.split(',').join('、') 
                          : (item.fileTypes?.join('、') || '所有格式') 
                      }}</p>
                      <p>最大数量：{{ item.maxCount || '不限' }}个</p>
                    </div>
                  </div>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="previewVisible" :title="titleDialog" width="90%" :close-on-click-modal="true" :destroy-on-close="true" center class="preview-dialog">
      <div class="preview-container">
        <img v-if="previewType === 'image'" :src="currentPreviewImage" alt="预览图" class="preview-image" />
        <!-- <div v-else-if="previewType === 'doc' || previewType === 'docx'" class="doc-preview" v-html="docContent"></div> -->
        <WordPreview v-else-if="previewType === 'doc'" ref="wordPreviewRef" :isImageShow="false" :itemId="currentItemId" :isDocToImageData="isDocToImageData" :fileUrl="currentPreviewUrl" />
        <iframe v-else-if="previewType === 'pdf'" :src="currentPreviewUrl" class="pdf-preview" type="application/pdf" width="100%" height="1000px" frameborder="0"></iframe>
        <div v-else-if="previewType === 'video'" class="video-preview">
          <video ref="videoPlayer" class="video-player" controls autoplay :src="currentPreviewUrl" @error="handleVideoError">您的浏览器不支持 video 标签</video>
        </div>
      </div>
      <template #footer v-if="false">
        <div class="dialog-footer">
          <el-button @click="handlePrevious" :disabled="!hasPrevious" type="primary"
            ><el-icon><ArrowLeft /></el-icon>
            上一个
          </el-button>
          <el-button @click="handleNext" :disabled="!hasNext" type="primary">
            下一个
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </template>
    </el-dialog>
    <ViewCorrectionDialog v-model="viewCorrectionVisible" :img-url="viewCorrectionImg" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Plus, Close } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import Header from "@/views/page/components/header/index.vue";
import { stuDetail, practiceSave, practiceSubmit } from "@/api/stuPractice.js";
import { host } from "@/utils/request.js";
import { getFileExtensionFromUrl, isImageURL, downloadFile } from "@/utils/index.js";
import ImageSwiper from "@/views/page/practice/components/ImageSwiper.vue";
import WordPreview from "@/components/WordPreview/WordPreview.vue";
import ViewCorrectionDialog from "@/views/page/practice/components/ViewCorrectionDialog.vue";
import mammoth from "mammoth";
const routes = useRouter();
const { currentRoute } = routes;
const route = currentRoute.value;
const practiceId = route.query?.id;
const type = route.query?.type;
const action = ref(host + "/common/upload");
const data = ref({});
const teacherTask = ref([]);
const isDocToImageData = ref({});
const currentItemId = ref('');

const pathData = [
  {
    name: "我的实验",
    path: "/homes/studentcourses/exam/myexperiment",
  },
  {
    name: type === "view" ? "查看实验" : "编辑实验",
    path: "",
  },
];

data.value = {
  tag: "test",
};

const practiceDetail = ref({});
const disabled = type === "view" ? true : false;
onMounted(() => {
  getStuDetail();
});

const viewCorrectionVisible = ref(false);
const viewCorrectionImg = ref("");
const handleViewCorrection = (imgUrl) => {
  viewCorrectionVisible.value = true;
  viewCorrectionImg.value = imgUrl;
};

const submit = (name) => {
  ElMessageBox.confirm(`确定${name === "save" ? "保存" : "提交"}吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const answerMap = {};
      practiceDetail.value?.items?.forEach((item) => {
        let _urlArr = [];
        // 截取学生提交的资料url，提交到后台
        if (item.beDefault === 0 && item.urlArr && item.urlArr.length > 0) {
          _urlArr = item.urlArr.map((m) => {
            const value = m?.split("/static/")[1];
            if (value) return value;
          });
        }
        answerMap[item.id] = (item.beDefault === 0 ? _urlArr : [item.defaultPath]) ?? [];
      });
      const params = {
        practiceId,
        answerMap,
      };
      const api = name === "save" ? practiceSave : practiceSubmit;
      api(params).then((res) => {
        if (res.code === "200") {
          ElMessage.success(name === "save" ? "保存成功" : "提交成功");
          if (name === "submit") {
            routes.push("/homes/studentcourses/exam/myexperiment");
          }
        }
      });
    })
    .catch(() => {});
};

const delItemUrl = (item, idx) => {
  console.log(item,'item')
  item.urlArr.splice(idx, 1);
  console.log(item,'item')
}

const lock = (url) => {
  window.open(url);
};

const download = (url, name) => {
  downloadFile(url, name);
};
const downloadZip = (url, name) => {
  window.open(url);
}


const getStuDetail = () => {
  stuDetail(practiceId).then((res) => {
    if (res?.code === "200") {
      practiceDetail.value = res?.data;
      isDocToImageData.value = {
        practiceId: res?.data?.stu?.practiceId,
        stuId: res?.data?.stu?.stuId,
      };
      teacherTask.value = res?.data?.items?.filter((item) => item.beDefault === 1);
      const answerMap = res?.data?.stu?.answerMap;
      if (answerMap) {
        // 内容回显
        practiceDetail.value?.items?.forEach((item) => {
          if (item.beDefault === 0 && answerMap[item.id]) {
            item.urlArr = answerMap[item.id]?.map((url) => {
              return host + "/static/" + url;
            });
          }
        });
      }
    }
  });
};

// 预览相关
const previewVisible = ref(false);
const currentPreviewImage = ref("");
const currentPreviewUrl = ref("");
const previewType = ref("image");
const docContent = ref("");
const titleDialog = ref("");
const videoPlayer = ref(null);
// 查看大图
const handlePreview = (url, index, itemName) => {
  const fileType = getFileExtensionFromUrl(url).toLowerCase();
  if (["mp4", "webm", "ogg"].includes(fileType)) {
    handleVideoPreview(url, index);
  } else {
    previewType.value = "image";
    currentPreviewImage.value = url;
    previewVisible.value = true;
    titleDialog.value = `${itemName}-${index + 1}`;
  }
};

// 查看doc
const lockDoc = async (url, index, itemName, id) => {
  console.log(id,'id')
  currentPreviewUrl.value = url
  previewType.value = 'doc'
  currentItemId.value = id
  previewVisible.value = true
  titleDialog.value = `${itemName}`
}
// 查看pdf
const handlePreviewPdf = async (url, index, itemName) => {
  previewType.value = "pdf";
  currentPreviewUrl.value = url;
  previewVisible.value = true;
  titleDialog.value = `${itemName}-${index + 1}`;
};
// 处理视频预览
const handleVideoPreview = (url, index, itemName) => {
  previewType.value = "video";
  currentPreviewUrl.value = url;
  previewVisible.value = true;
  titleDialog.value = `${itemName}-${index + 1}`;
};
// 处理上一个/下一个
const handlePrevious = () => {
  if (!hasPrevious.value) return;

  if (previewType.value === "image") {
    const imageFiles = props.images.filter((url) => !["pdf", "doc", "docx", "mp4", "webm", "ogg"].includes(getFileExtensionFromUrl(url).toLowerCase()));
    const currentImageIndex = imageFiles.findIndex((url) => url === currentPreviewImage.value);
    if (currentImageIndex > 0) {
      currentPreviewImage.value = imageFiles[currentImageIndex - 1];
      titleDialog.value = `${props.defaultName}-${currentIndex.value}`;
    }
  }
  currentIndex.value--;
};

const handleNext = () => {
  if (!hasNext.value) return;

  if (previewType.value === "image") {
    const imageFiles = props.images.filter((url) => !["pdf", "doc", "docx", "mp4", "webm", "ogg"].includes(getFileExtensionFromUrl(url).toLowerCase()));
    const currentImageIndex = imageFiles.findIndex((url) => url === currentPreviewImage.value);
    if (currentImageIndex < imageFiles.length - 1) {
      currentPreviewImage.value = imageFiles[currentImageIndex + 1];
      titleDialog.value = `${props.defaultName}-${currentIndex.value + 2}`;
    }
  }
  currentIndex.value++;
};

// 获取accept属性值
const getAcceptTypes = (types) => {
  if (!types) return '';
  
  // 如果是字符串，转换为数组
  const typeArray = typeof types === 'string' 
    ? types.split(',').map(t => t.replace('.', '')) 
    : types;
  
  return typeArray.map(type => {
    // 处理常见文件类型
    switch(type.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'pdf':
        return 'application/pdf';
      case 'doc':
      case 'docx':
        return '.doc,.docx';
      case 'mp4':
        return 'video/mp4';
      case 'avi':
        return 'video/x-msvideo';
      default:
        return `.${type}`;
    }
  }).join(',');
};

// 上传前校验
const beforeUpload = (file, item) => {
  // 检查文件类型
  if (item.fileTypes) {
    // 将字符串转换为数组
    const allowedTypes = typeof item.fileTypes === 'string'
      ? item.fileTypes.split(',').map(t => t.replace('.', ''))
      : item.fileTypes;

    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(extension)) {
      ElMessage.error(`只能上传${allowedTypes.join('、')}格式的文件`);
      return false;
    }
  }
  
  // 检查当前数量
  const currentFiles = item.urlArr || [];
  if (item.maxCount && currentFiles.length >= item.maxCount) {
    ElMessage.error(`最多只能上传${item.maxCount}个文件`);
    return false;
  }
  
  return true;
};

// 处理超出数量限制
const handleExceed = (files, uploadFiles, item) => {
  const maxCount = item.maxCount || 1;
  const currentCount = item.urlArr?.length || 0;
  if (currentCount < maxCount) {
    // 如果当前数量小于限制，手动触发上传
    const upload = document.querySelector('.upload-container .el-upload__input');
    if (upload) {
      upload.click();
    }
    return;
  }
  ElMessage.warning(`上传文件数量已超出限制`);
};

// 修改原有的 handleAvatarSuccess 函数
const handleAvatarSuccess = (response, file, item) => {
  // 初始化 urlArr 如果不存在
  if (!item.urlArr) {
    item.urlArr = [];
  }
  if (response?.code === "200") {
    const updateUrl = host + "/static/" + response.data;
    item.urlArr.push(updateUrl);
  }
};
</script>
<style>
.task-upload {
  width: 200px;
  height: 290px;
  background: #ffffff;
  border-radius: 5px;
  border: 1px solid #d2d2d2;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  /* margin-top: 20px; */
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 50px;
  color: #d2d2d2;
  width: 200px;
  /* height: 288px; */
  /* line-height: 288px; */
  text-align: center;
  margin-top: 70px;
}
</style>
<style scoped lang="scss">
.flex-start {
  margin: 0 20px 20px;
}
.practice-list {
  border-radius: 10px;
  border: 1px solid rgba(50, 177, 108, 0.5);
  margin-bottom: 20px;
  .item-title {
    height: 50px;
    line-height: 50px;
    font-family: MicrosoftYaHei;
    font-size: 18px;
    color: #1b1b1b;
    background: rgba(50, 177, 108, 0.1);
    border-radius: 10px 10px 0px 0px;
    text-align: center;
  }
  .item-content {
    max-width: 100%;
    overflow-x: auto;
    
    &::-webkit-scrollbar {
      height: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
      
      &:hover {
        background: #555;
      }
    }
  }
  .practice-item {
    padding: 20px;
  }
}
.title-box {
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(39, 165, 255, 0.5);
  margin-bottom: 40px;
  margin-top: 30px;
  .title-top {
    height: 60px;
    background: rgba(39, 165, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .title-name {
      font-family: MicrosoftYaHei;
      font-size: 18px;
      color: #0078cd;
      margin-right: 40px;
    }
  }
  .title-bottom {
    .line {
      width: 100%;
      height: 50px;
      border-top: 1px solid rgba(39, 165, 255, 0.5);
      display: flex;
      align-items: center;
      .item {
        width: 31%;
        height: 100%;
        line-height: 50px;
        padding-left: 20px;
        border-right: 1px solid rgba(39, 165, 255, 0.5);
        &:nth-child(3) {
          border-right: 0;
        }
        .item-name {
          font-family: MicrosoftYaHei;
          font-size: 12px;
          color: #666666;
          margin-right: 10px;
        }
        .item-value {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #1b1b1b;
        }
      }
    }
  }
}
.task-view {
  text-align: left;
  padding-bottom: 10px;
  position: relative;
  background: #fff;
  padding: 20px;
  font-size: 13px;
  color: #000000;
}
.task-title {
  font-size: 13px;
  margin: 10px 0;
}
.task-msg span {
  margin-right: 20px;
}
.task-item {
  // padding: 10px 0;
}
.item-title {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 20px;
}
.url-wrap {
  width: 200px;
  height: 288px;
  background: #ffffff;
  border-radius: 5px;
  border: 1px solid #d2d2d2;
  overflow: hidden;
  margin: 0 10px 0 0;
  position: relative;
  .el-image {
    width: 100% !important;
    height: 224px !important;
    text-align: center;
    vertical-align: middle;
    .el-image__preview {
      width: 100%;
      height: auto;
    }
  }
  .button-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    background: #ffffff;
    box-shadow: 0px -5px 10px 0px rgba(0, 0, 0, 0.1);
    position: absolute;
    bottom: 0;

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
.file-msg {
  width: 200px;
  height: 248px;
  text-align: center;
  border-radius: 4px;
  overflow: hidden;
}
.file-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-weight: bold;
  font-size: 16px;
  // background: #fff;
  // border-radius: 50%;
  padding: 2px;
}
.file-name {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}
.teacher-task {
  width: 178px;
  height: 178px;
  border: 1px solid #d9d9d9;
  margin-right: 10px;
  border-radius: 5px;
}
.task-upload-url {
  padding: 0;
  margin-bottom: 0px;
  margin-left: 0px;
}
.task-no-data {
  width: 100%;
  text-align: center;
}
.template-task {
  width: 100%;
  margin-left: 0;
  & > div {
    width: calc(50% - 10px);
    margin: 0;
    display: inline-block;
  }
  & > div:nth-child(2n) {
    margin-left: 20px;
  }
  .practice-list {
    width: 100%;
    .task-upload-url{
      width: 260px;
      height: 288px;
      background: #FFFFFF;
      border-radius: 5px;
      border: 1px solid #d2d2d2;
      position: relative;
      .file-msg {
        width: 100%;
      }
      .button-wrapper {
        width: 100%;
        height: 50px;
        background: #ffffff;
        box-shadow: 0px -5px 10px 0px rgba(0,0,0,0.1);
        position: absolute;
        bottom: 0;
        text-align: center;
        line-height: 50px;
      }
    }
  }
}
</style>
<style lang="scss">
.view-experiment-box .preview-dialog {
  overflow: hidden;
  :deep(.el-dialog__body) {
    height: 80%;
    overflow: auto;
    padding: 0;

    .video-preview {
      background: #000;
      // height: 1000px;
      overflow-y: scroll;
      .video-player {
        height: 100%;
      }
    }
  }

  :deep(.el-dialog__header) {
    padding: 15px;
    margin: 0;
    border-bottom: 2px solid #27a5ff !important;
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
.view-experiment-box .el-dialog {
  border-radius: 8px;
  padding: 0;
  height: 90%;

  .el-dialog__header {
    margin: 0;
    padding: 15px 20px;
    border-bottom: 2px solid #27a5ff;
  }

  .el-dialog__body {
    padding: 20px;
    height: calc(100% - 150px);
    // padding-bottom: 100px;
    overflow-y: scroll;
    .preview-container {
      width: 90%;
      overflow: hidden;
      overflow-y: scroll;
      margin: 0 auto;
      img{
        margin: 0 auto;
      }
    }
    .video-preview {
      background: #000;
      height: 1000px;
      overflow-y: scroll;
      text-align: center;
      .video-player {
        height: 100%;
        margin: 0 auto;
      }
    }
  }
  .el-dialog__footer {
    background: rgba(39, 165, 255, 0.1);
    padding: 10px 20px;
    position: absolute;
    width: 100%;
    bottom: 0;
    .dialog-footer {
      display: flex;
      justify-content: space-between;
      width: 90%;
      margin: 0 auto;
    }
  }
}
.task-no-data{
  width: 200px  !important;
  height: 288px  !important;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  margin-left: 50px;
}

</style>
<style scoped>
.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
  text-align: center;
}

.upload-tip p {
  margin: 4px 0;
}
</style>
<style lang="scss" scoped>
.pg-score {
  display: flex;
  align-items: center;
  justify-content: center; 
  flex-direction: column;
  /* padding: 10px 20px;
  margin: 15px 0 0 auto; */
  /* background: rgba(39, 165, 255, 0.05);
  border-radius: 5px;
  border: 1px solid rgba(39, 165, 255, 0.2); */
  width: fit-content;
  min-width: 200px;
  text-align: right;

  p {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #1b1b1b;
    margin: 0;
    margin-right: 20px;
  }

  .custom-link-button {
    height: 32px;
    padding: 0 15px;
    border-radius: 4px;
    font-size: 14px;
    
    // &.custom-link-active-button {
    //   background: #32b16c;
    //   border-color: #32b16c;
    //   color: #fff;

    //   &:hover {
    //     background: #47c583;
    //     border-color: #47c583;
    //   }

    //   &:active {
    //     background: #2a9b5d;
    //     border-color: #2a9b5d;
    //   }
    // }
  }
}
</style>
