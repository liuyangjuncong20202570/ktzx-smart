import request from '../utils/request.js';
export const getHistoryList = () => {
  return request.admin.post('/homes/history');
};

export const usrLogin = data => {
  return request.admin.post('/login/user', data);
};
