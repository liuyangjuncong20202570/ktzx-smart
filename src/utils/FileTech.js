import NProgress from 'nprogress';
import request from './request';
import { ElMessage, ElMessageBox } from 'element-plus';

export const download = (file, url) => {
  const dotIndex = file.filename.lastIndexOf('.');
  let suffix = file.filename.substring(dotIndex + 1);
  let fileUrl = `${request.course.defaults.baseURL}${url + encodeURIComponent(file.id)}.${suffix}`;

  // 创建一个用于显示下载进度的元素（可以是进度条）
  NProgress.start();

  request
    .course({
      url: fileUrl,
      method: 'GET',
      responseType: 'blob', // 重要：设置响应类型为blob
      onDownloadProgress: progressEvent => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          // console.log(percentCompleted);
          NProgress.set(percentCompleted / 100); // 更新进度条
        }
      }
    })
    .then(response => {
      // console.log(response);
      const reader = new FileReader();
      reader.readAsDataURL(response);
      //  读取完的回调事件
      reader.onload = e => {
        let a = document.createElement('a');
        a.download = file.filename;
        a.style.display = 'none';
        let url = reader.result;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // 移除进度条
        NProgress.done();
        ElMessage.success('下载成功');
      };
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      ElMessage.error('文件下载失败');
      // 移除进度条
      NProgress.done();
    });
};
