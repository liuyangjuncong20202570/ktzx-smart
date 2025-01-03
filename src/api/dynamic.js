import request from '../utils/request.js';
import qs from 'qs';
// 学生画像
//    课堂列表
export const getStuGraCourseList = courseId => {
  return request.evaluation.get('/dynamic/portrait/getClassroomList?courseId=' + courseId);
};

//    学生列表
export const getStuGraStudentList = classroomId => {
  return request.course.get('/coursemangt/classroommangt/student/list?obsid=' + classroomId);
};

//    搜索功能
export const getstuGraSearch = (courseId, classroomName) => {
  return request.evaluation.get(
    `/dynamic/portrait/getClassroomList?courseId=${courseId}&classroomName=${classroomName}`
  );
};

//    画像评价
export const getGraphEvaluation = (classroomId, stuId, courseId, num) => {
  return request.evaluation.get(
    `/dynamic/portrait/student?classroomId=${classroomId}&stuId=${stuId}&courseId=${courseId}&num=${num}`
  );
};

//    获取评价次数
export const getGraphAttendList = (classroomId, stuId, courseId) => {
  return request.evaluation.get(
    `/dynamic/portrait/getStudentEvalNums?classroomId=${classroomId}&stuId=${stuId}&courseId=${courseId}`
  );
};

// 学生报告
//    课堂列表
export const getStuRepCourseList = courseId => {
  return request.evaluation.get('/dynamic/portrait/testPaperInfo?courseId=' + courseId);
};

//    学生名单
export const getStuRepStudentList = testId => {
  return request.evaluation.get('/dynamic/portrait/getTestStudent?testId=' + testId);
};

//    搜索功能
export const getstuRepSearch = (courseId, search) => {
  return request.evaluation.get(
    `/dynamic/portrait/testPaperInfo?courseId=${courseId}&search=${search}`
  );
};

//    获取评价
export const getReportEvaluation = (classroomId, stuId, courseId, paperId) => {
  return request.evaluation.get(
    `/dynamic/portrait/studentPaper?classroomId=${classroomId}&stuId=${stuId}&courseId=${courseId}&paperId=${paperId}`
  );
};

// 课堂画像

//    课堂列表
export const getCourseList = obsid => {
  return request.evaluation.get('/dynamic/portrait/getClassroomList?courseId=' + obsid);
};

//    课堂评价
export const getCourseEvaluation = (classroomId, courseId, num) => {
  return request.evaluation.get(
    `/dynamic/portrait/classroom?classroomId=${classroomId}&courseId=${courseId}&num=${num}`
  );
};

//    搜索功能
export const getCourseSearch = (courseId, search) => {
  return request.evaluation.get(
    `/dynamic/portrait/getClassroomList?courseId=${courseId}&classroomName=${search}`
  );
};

// 获取总体评价次数
export const getEvaluationTimes = (courseId, classroomId) => {
  return request.evaluation.get(
    `/dynamic/portrait/getEvalTotal?courseId=${courseId}&classroomId=${classroomId}`
  );
};
