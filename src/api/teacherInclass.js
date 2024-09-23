import request from '../utils/request.js';
import qs from 'qs';
// 获取学生名单
export const getStuList = obsid => {
  return request.course.get('/coursemangt/classroommangt/student/list?obsid=' + obsid);
};

// 删除某一学生信息
export const delSingleStudent = (classRoomId, stuIds) => {
  return request.course.delete('/coursemangt/classroommangt/student/delete', {
    params: {
      classRoomId,
      stuIds
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' }); // 序列化为用逗号分隔的格式
    }
  });
};

// 删除全部学生
export const delAllStudent = classRoomId => {
  return request.course.delete('/coursemangt/classroommangt/student/deleteAll', {
    params: {
      classRoomId
    }
  });
};

// 获取学生信息
export const getOrgnization = () => {
  return request.course.get('/coursemangt/classroommangt/student/studentRP');
};

// 模板导入学生
export const importStudentList = fd => {
  return request.course.post('/coursemangt/classroommangt/student/import', fd);
};

// 批量导入学生
export const importStudentmenu = list => {
  return request.course.post('/coursemangt/classroommangt/student/create', list);
};
