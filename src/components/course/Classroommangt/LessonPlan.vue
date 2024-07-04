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
      <el-table :data="filelist" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="size" label="大小"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" @click="previewFile(scope.row)">预览</el-button>
            <el-button size="mini" @click="downloadFile(scope.row)">下载</el-button>
            <el-button size="mini" @click="editFile(scope.row)">编辑</el-button>
            <el-button size="mini" @click="deleteFile(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {ElMessage, ElMessageBox} from "element-plus";
import request from "../../utils/request.js";
import blurOnClick from '../../directives/blur-on-click.js';

const filelist = ref([]);

const fetchCourseList = async () => {
  console.log("Fetching course list...");
  await request.course.get('/coursemangt/instructionalprogram')
      .then(res => {
        console.log("Response received from fetchCourseList:", res);
        if (res.code === 200) {
          // 确保将返回的数据映射到正确的格式
          filelist.value = res.data.split(',').map(filename => ({
            name: filename,
            size: '未知',
            uploadTime: '未知'
          }));
          console.log("File list updated:", filelist.value); // 打印filelist
        } else {
          ElMessage({
            type: 'error',
            message: '获取教学大纲失败'
          });
        }
      })
      .catch(error => {
        console.error("Error fetching course list:", error);
        ElMessage({
          type: 'error',
          message: '获取教学大纲失败'
        });
      });
};

const beforeUpload = (file) => {
  console.log("Before upload:", file);

  // 检查文件类型
  const isWord = file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const isPDF = file.type === 'application/pdf';

  if (!isWord && !isPDF) {
    ElMessage.error('只能上传 Word 或 PDF 文件!');
    return false;
  }

  // 检查文件大小
  const isLt20M = file.size / 1024 / 1024 < 20;
  if (!isLt20M) {
    ElMessage.error('上传文件大小不能超过 20MB!');
    return false;
  }

  const formData = new FormData();
  formData.append('file', file);
  console.log("Form data prepared for upload:", formData);

  request.course.post('/coursemangt/instructionalprogram/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    console.log("Upload response:", res);
    if (res.code === 200) {
      ElMessage.success(`${file.name} 上传成功`);
      fetchCourseList();
    } else {
      ElMessage.error(`${file.name} 上传失败: ${res.msg}`);
    }
  }).catch(error => {
    console.error("Upload error:", error);
    ElMessage.error(`${file.name} 上传失败`);
  });

  return false; // 阻止默认上传行为
};


const handleUploadSuccess = (response, file) => {
  console.log("Upload success:", response, file);
  if (response.code === 200) {
    ElMessage.success(`${file.name} 上传成功`);
    fetchCourseList();
  } else {
    ElMessage.error(`${file.name} 上传失败`);
  }
};

const handleUploadError = (error, file) => {
  console.error("Handle upload error:", error, file);
  ElMessage.error(`${file.name} 上传失败`);
};

const deleteFile = async (file) => {
  console.log("Deleting file:", file);
  try {
    await ElMessageBox.confirm('此操作将永久删除该课程, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await request.course.post('/coursemangt/instructionalprogram/delete', {filename: file.name})
        .then(res => {
          console.log("Delete response:", res);
          if (res.code === 200) {
            ElMessage.success('删除成功');
            fetchCourseList();
          } else {
            ElMessage.error('删除失败');
          }
        })
        .catch(error => {
          console.error("Delete error:", error);
          ElMessage.error('删除失败');
        });
  } catch (error) {
    console.error("Delete error in try-catch:", error);
    ElMessage.error('删除失败');
  }
};

const previewFile = (file) => {
  console.log("Preview file:", file);
  // 预览课程功能
};

const downloadFile = (file) => {
  console.log("Download file:", file);
  const link = document.createElement('a');
  link.href = `http://127.0.0.1:8082/api/coursemangt/instructionalprogram/download/${file.name}`;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// const downloadFile = (file) => {
//   console.log("Download file:", file);
//
//   const url = `/coursemangt/instructionalprogram/download/${file.name}`;
//
//   request.course.get(url, {responseType: 'blob'})
//       .then(response => {
//         if (response && response.data) {
//           const blob = new Blob([response.data], {type: response.headers['content-type'] || 'application/octet-stream'});
//           const link = document.createElement('a');
//           link.href = window.URL.createObjectURL(blob);
//           link.download = file.name;
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//           window.URL.revokeObjectURL(link.href);
//           ElMessage.success(`${file.name} 下载成功`);
//         } else {
//           ElMessage.error(`${file.name} 下载失败: 无响应数据`);
//         }
//       })
//       .catch(error => {
//         console.error("Download error:", error);
//         ElMessage.error(`${file.name} 下载失败`);
//       });
// };

const editFile = (file) => {
  console.log("Edit file:", file);
  // 编辑课程功能
};

onMounted(() => {
  console.log("Component mounted");
  fetchCourseList();
});
</script>


<style scoped>
::v-deep(.el-table .cell) {
  text-align: center;
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
