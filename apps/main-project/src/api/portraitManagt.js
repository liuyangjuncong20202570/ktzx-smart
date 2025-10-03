import request from '../utils/request.js';
import qs from 'qs';

// 获取作业列表
export const getTestList = classroomId => {
  return request.evaluation.get(`/evaluation/conf/getConfTestInfoList?classroomId=${classroomId}`);
};

// 获取对应作业学生列表
export const getStuList = testId => {
  return request.evaluation.get(`/dynamic/portrait/getTestStudent?testId=${testId}`);
};

// 删除作业
export const delStuList = arr => {
  return request.evaluation.delete('/evaluation/conf/removeConfPaper', {
    data: arr
  });
};

// 一键计算
export const generatePortrait = (courseId, classroomId, stuIdList = [], paperIdList = []) => {
  const data = {
    courseId,
    classroomId,
    stuIdList,
    paperIdList
  };
  return request.evaluation.post('/dynamic/portrait/calculate', data);
};

// 改变作业列表顺序
export const changeOrder = (classroomId, arr) => {
  return request.evaluation.put(
    `/evaluation/conf/updateConfTestInfoListRow?classroomId=${classroomId}`,
    arr
  );
};

// 获取所有作业信息
export const getTestAllList = classroomId => {
  return request.evaluation.get(`/evaluation/conf/getTestInfoList?classroomId=${classroomId}`);
};

// 插入作业信息
export const insertTests = arr => {
  return request.evaluation.post('/evaluation/conf/saveConfPaper', arr);
};
