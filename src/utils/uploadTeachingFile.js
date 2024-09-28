// utils/uploadTeachingFile.js
import { ElMessage } from 'element-plus';
import request from './request.js';

export const uploadTeachingFile = (file, uploadUrl, successCallback, errorCallback) => {
    const isDoc = file.type === 'application/msword'; // 支持 .doc 文件
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isPDF = file.type === 'application/pdf';

    // 检查文件类型
    if (!isDoc && !isDocx && !isPDF) {
        ElMessage.error('只能上传 .doc、.docx 或 .pdf 格式的文件!');
        return false;
    }

    // 检查文件大小
    const isLt30M = file.size / 1024 / 1024 < 30;
    if (!isLt30M) {
        ElMessage.error('上传文件大小不能超过 30MB!');
        return false;
    }

    const formData = new FormData();
    formData.append('file', file);

    return request.course.post(uploadUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => {
        if (res.code === 200) {
            ElMessage.success(`${file.name} 上传成功`);
            if (successCallback) successCallback(res);
        } else {
            ElMessage.error(`${file.name} 上传失败: ${res.msg}`);
            if (errorCallback) errorCallback(res);
        }
    }).catch(() => {
        ElMessage.error(`${file.name} 上传失败`);
        if (errorCallback) errorCallback();
    });
};
