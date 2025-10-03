import request from './request';
export const getCourseId = classroomId => {
  return request.evaluation.get('/dynamic/portrait/getCourseId?classroomId=' + classroomId);
};
