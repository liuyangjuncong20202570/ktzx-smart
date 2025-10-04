import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getCourseTarget, getKnowledgeUnit, getKwaDick } from '../../api/visual';
import { Info } from '../../api/type.d.ts';
import { courseTarget, Knowledge, KwaDick } from './type';

const useVisual = defineStore('visual', () => {
  const knowledgeList = ref<Knowledge[]>([]);
  const courseTarget = ref<courseTarget[]>([]);
  const kwaDick = ref<KwaDick[]>([]);

  const fetchKnowledge = async () => {
    const { code, msg, data } = await getKnowledgeUnit();
    if (code === 200 && msg === Info.SUCCESS) {
      knowledgeList.value = data;
    }
  };

  const fetchCourseTarget = async () => {
    const { code, msg, data } = await getCourseTarget();
    if (code === 200 && msg === Info.SUCCESS) {
      courseTarget.value = data;
    }
  };

  const fetchKwaDick = async () => {
    const { code, msg, data } = await getKwaDick();
    if (code === 200 && msg === Info.SUCCESS) {
      kwaDick.value = data;
    }
  };

  return { knowledgeList, courseTarget, kwaDick, fetchKnowledge, fetchCourseTarget, fetchKwaDick };
});

export default useVisual;
