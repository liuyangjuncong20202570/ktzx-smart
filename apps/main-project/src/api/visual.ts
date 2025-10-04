import request from '../utils/request.js';
import { UniExport } from './type.js';

export const getKnowledgeUnit: () => Promise<UniExport> = () => {
  return request.evaluation.get('/evaluation/knowledgeUnit/getKnowledgeUnitTree');
};

// 获取课程目标和kwas映射
export const getCourseTarget: () => Promise<UniExport> = () => {
  return request.evaluation.get(`/evaluation/coursetarget`);
};

// 获取所有kwa以及kw和a映射
export const getKwaDick: () => Promise<UniExport> = () => {
  return request.evaluation.get(`/evaluation/kwadict`);
};
