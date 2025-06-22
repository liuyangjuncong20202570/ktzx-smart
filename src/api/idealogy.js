import request from '../utils/request.js';
import qs from 'qs';

// 查询所有idealogy
export const getIdea = () => {
  return request.evaluation.get('/evaluation/ideology');
};

// 增加idealogy
export const addIdea = (vname, remark) => {
  return request.evaluation.post('evaluation/ideology/add', {
    vname,
    remark
  });
};

export const updateIdea = payload => {
  return request.evaluation.post('evaluation/ideology/update', { ...payload });
};

// id数组删除
export const delIdea = idList => {
  return request.evaluation.delete('evaluation/ideology', {
    params: {
      idList
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' }); // 序列化为用逗号分隔的格式
    }
  });
};

// 模糊查询
export const fuzzyIdea = payload => {
  return request.evaluation.post('evaluation/ideology', { ...payload });
};
