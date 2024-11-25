// utils/uploadTeachingFile.js
import NProgress from 'nprogress';
import { ElMessage } from 'element-plus';
import request from './request.js';

export const uploadTeachingFile = async (file, uploadUrl, successCallback, errorCallback) => {
  // let flag = 0;
  const isDoc = file.type === 'application/msword'; // 支持 .doc 文件
  const isDocx =
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const isPDF = file.type === 'application/pdf';

  // 检查文件类型
  if (!isDoc && !isDocx && !isPDF) {
    ElMessage.error('只能上传 .doc、.docx 或 .pdf 格式的文件!');
    return false;
  }

  // 检查文件大小
  //   const isLt30M = file.size / 1024 / 1024 < 30;
  //   if (!isLt30M) {
  //     ElMessage.error('上传文件大小不能超过 30MB!');
  //     return false;
  //   }

  // 前端文件切片
  // const chunkSize = 2 * 1024 * 1024; // 2MB
  // const fileId = `${file.name}-${Date.now()}`; // 唯一标识文件
  // const promises = [];
  // const chunckSize = 2 * 1024 * 1024; //2mb
  // const totalChunks = Math.ceil(file.size / chunckSize);

  const formData = new FormData();
  formData.append('file', file);
  NProgress.start();
  return request.course
    .post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onDownloadProgress: progressEvent => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          console.log(percentCompleted);
          NProgress.set(percentCompleted / 100);
          // NProgress.set(percentCompleted / 100); // 更新进度条
        }
      }
    })
    .then(res => {
      if (res.code === 200) {
        ElMessage.success(`${file.name} 上传成功`);
        if (successCallback) successCallback(res);
        NProgress.done();
      } else {
        ElMessage.error(`${file.name} 上传失败: ${res.msg}`);
        if (errorCallback) errorCallback(res);
        NProgress.done();
      }
    })
    .catch(() => {
      ElMessage.error(`${file.name} 上传失败`);
      if (errorCallback) errorCallback();
      NProgress.done();
    });

  // for (let i = 0; i < totalChunks; i++) {
  //   const start = i * chunkSize;
  //   const end = Math.min(start + chunkSize, file.size);
  //   const chunk = file.slice(start, end);

  //   const formData = new FormData();
  //   formData.append('file', chunk);
  //   formData.append('chunkIndex', i);
  //   formData.append('totalChunks', totalChunks);
  //   formData.append('fileId', fileId); // 文件唯一标识

  //   // 记录每个切片上传的 Promise
  //   promises.push(
  //     request.course
  //       .post(uploadUrl, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data'
  //         }
  //       })
  //       .catch(err => {
  //         ElMessage.error(`第 ${i + 1} 块切片上传失败`);
  //         throw err; // 如果某个切片失败，抛出错误
  //       })
  //   );
  // }

  // try {
  //   // 并行上传所有切片
  //   await Promise.all(promises);
  //   ElMessage.success('所有切片上传成功，正在合并文件...');

  //   // 通知后端合并文件
  //   // const mergeResponse = await request.course.post(mergeUrl, { fileId, fileName: file.name });
  //   const mergeResponse = {
  //     code: 200
  //   };
  //   if (mergeResponse.code === 200) {
  //     ElMessage.success(`${file.name} 上传完成`);
  //     if (successCallback) successCallback(mergeResponse);
  //   } else {
  //     ElMessage.error(`文件合并失败: ${mergeResponse.msg}`);
  //     if (errorCallback) errorCallback(mergeResponse);
  //   }
  // } catch (err) {
  //   ElMessage.error('文件上传失败');
  //   if (errorCallback) errorCallback(err);
  // }
};
