<template>
  <div style="height: 92vh; display: flex; flex-direction: column;">
    <el-header
        style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; justify-content: flex-end;">
      <el-upload
          ref="upload"
          :before-upload="beforeUpload"
          :show-file-list="false">
        <el-button type="primary" v-blur-on-click>上传</el-button>
      </el-upload>
    </el-header>
    <div style="max-height: 100%; height: 100%; overflow:auto;">
      <el-table :data="formattedFilelist" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="filename" label="名称"></el-table-column>
        <el-table-column label="大小">
          <template #default="scope">
            <div>
              {{ scope.row.formattedSize }}
              <span v-if="scope.row.size < 1024 * 1024"></span>
              <span v-else-if="scope.row.size < 1024 * 1024 * 10"></span>
              <span v-else>(Large File)</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="上传时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="previewFile(scope.row)">预览</el-button>
            <el-button size="small" @click="downloadFile(scope.row)">下载</el-button>
            <el-button size="small" @click="deleteFile(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 预览模态框 -->
    <el-dialog v-model="previewVisible" custom-class="preview-dialog" @close="handleClosePreview">
      <template #title>
        <span>预览文件</span>
      </template>
      <div v-if="previewFileType === 'pdf'" id="pdf-preview-container" class="preview-container">
        <canvas ref="pdfCanvas"></canvas>
      </div>
      <div v-if="previewFileType === 'word'" id="word-preview-container" class="preview-container" v-html="wordHtml">
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClosePreview">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, nextTick} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import request from '../../utils/request.js';
import blurOnClick from '../../directives/blur-on-click.js';
import mammoth from 'mammoth';
import {pdfjsLib} from '../../utils/pdfjsWorker';

const filelist = ref([]);
const previewVisible = ref(false);
const previewFileType = ref('');
const previewFileUrl = ref('');
const wordHtml = ref('');
const pdfCanvas = ref(null);

const fetchCourseList = async () => {
  await request.course.get('/coursemangt/instructionalprogram')
      .then(res => {
        if (res.code === 200) {
          filelist.value = res.data;
        } else {
          ElMessage.error('获取教学大纲失败');
        }
      })
      .catch(() => {
        ElMessage.error('获取教学大纲失败');
      });
};

const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
};

const formattedFilelist = computed(() => {
  return filelist.value.map(file => ({
    ...file,
    formattedSize: formatFileSize(file.size),
  }));
});

const beforeUpload = (file) => {
  const isWord = file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const isPDF = file.type === 'application/pdf';

  if (!isWord && !isPDF) {
    ElMessage.error('只能上传 Word 或 PDF 文件!');
    return false;
  }

  const isLt20M = file.size / 1024 / 1024 < 20;
  if (!isLt20M) {
    ElMessage.error('上传文件大小不能超过 20MB!');
    return false;
  }

  const formData = new FormData();
  formData.append('file', file);

  request.course.post('/coursemangt/instructionalprogram/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    if (res.code === 200) {
      ElMessage.success(`${file.name} 上传成功`);
      fetchCourseList();
    } else {
      ElMessage.error(`${file.name} 上传失败: ${res.msg}`);
    }
  }).catch(() => {
    ElMessage.error(`${file.name} 上传失败`);
  });

  return false;
};

const previewFile = async (file) => {
  if (file.filename.endsWith('.pdf')) {
    previewFileType.value = 'pdf';
    previewVisible.value = true;
    await nextTick();
    previewFileUrl.value = `http://127.0.0.1:8082/api/coursemangt/instructionalprogram/download/${file.filename}`;
    const loadingTask = pdfjsLib.getDocument(previewFileUrl.value);
    loadingTask.promise.then(pdf => {
      pdf.getPage(1).then(page => {
        const viewport = page.getViewport({scale: 1.5});
        const canvas = pdfCanvas.value;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    }).catch(() => {
      ElMessage.error('PDF 加载失败');
    });
  } else if (file.filename.endsWith('.doc') || file.filename.endsWith('.docx')) {
    previewFileType.value = 'word';
    const fileUrl = `http://127.0.0.1:8082/api/coursemangt/instructionalprogram/download/${file.filename}`;
    previewFileUrl.value = fileUrl;
    previewVisible.value = true;
    fetch(fileUrl)
        .then(response => response.arrayBuffer())
        .then(data => mammoth.convertToHtml({arrayBuffer: data}))
        .then(result => {
          wordHtml.value = result.value;
        })
        .catch(() => {
          ElMessage.error('文档转换失败');
        });
  }
};

const downloadFile = (file) => {
  const link = document.createElement('a');
  link.href = `http://127.0.0.1:8082/api/coursemangt/instructionalprogram/download/${file.filename}`;
  link.download = file.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleClosePreview = () => {
  previewVisible.value = false;
  previewFileType.value = '';
  previewFileUrl.value = '';
  wordHtml.value = '';
};

const deleteFile = async (file) => {
  try {
    await ElMessageBox.confirm('此操作将永久删除该课程, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    console.log(file.filename);
    await request.course.get(`/coursemangt/instructionalprogram/delete/${file.filename}`)
        .then(res => {
          if (res.code === 200) {
            ElMessage.success('删除成功');
            fetchCourseList();
          } else {
            ElMessage.error('删除失败');
          }
        })
        .catch(() => {
          ElMessage.error('删除失败');
        });
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

onMounted(() => {
  fetchCourseList();
});
</script>

<style scoped>
::v-deep(.el-table .cell) {
  text-align: center;
}

.preview-container {
  width: 100%;
  height: 100%;
}

.custom-icon:hover {
  color: rgb(0, 115, 255) !important;
  cursor: pointer;
}

.user-bubbles {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  align-items: center;
}

.user-bubble {
  background-color: #E6F7FF;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.more-users {
  background-color: #e4e6eb;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}

.edit-icon {
  cursor: pointer;
  white-space: nowrap;
  margin-left: 8px;
}

.edit-icon:hover {
  color: #409EFF;
}

.dynamic-font-size {
  font-size: calc(3px + 0.8vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
