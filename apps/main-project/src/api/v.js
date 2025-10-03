import request from '../utils/request.js';
import qs from 'qs';

// 查询所有v
export const getV = () => {
  return request.evaluation.get('/evaluation/value/type');
};

// 绑定v
export const bindV = (kwaId, kwaValueTagBindReqList) => {
  return request.evaluation.post('/evaluation/value/bindKwaAndValue', {
    kwaId,
    kwaValueTagBindReqList
  });
};

// 修改v
export const updateV = ({ id, name, remark, typeId }) => {
  return request.evaluation.put('/evaluation/value/update', {
    id,
    name,
    remark,
    typeId
  });
};

// 修改类型
export const updateType = ({ id, name, remark }) => {
  return request.evaluation.put('/evaluation/value/type/update', {
    id,
    name,
    remark
  });
};

// 新增v
export const createV = ({ name, typeId, remark }) => {
  return request.evaluation.post('/evaluation/value/create', {
    name,
    typeId,
    remark
  });
};

// 新增类型
export const createType = ({ name, remark }) => {
  return request.evaluation.post('/evaluation/value/type/create', {
    name,
    remark
  });
};

// 删除属性
export const deleteValue = idList => {
  return request.evaluation.delete('/evaluation/value/delete', {
    params: {
      idList
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' }); // 序列化为用逗号分隔的格式
    }
  });
};

// 删除类型
export const deleteType = idList => {
  return request.evaluation.delete('/evaluation/value/type/delete', {
    params: {
      idList
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' }); // 序列化为用逗号分隔的格式
    }
  });
};
