import { defineStore } from 'pinia';
import { ref } from 'vue';
import { addAim, delAim, fuzzyAim, getAim } from '../api/evaluationNew';
import { updateAim } from '../api/evaluationNew';

const useCourseAim = defineStore('courseAim', () => {
  const aimList = ref([]);

  const fetchAim = async ({ courseId, current, size }) => {
    const { data, code, msg } = await getAim(courseId, current, size);
    if (code === 200 && msg === 'success') {
      aimList.value = data.records;
    }
  };

  const fetchAddAim = async ({
    courseId, // 课程ID（必填）
    objectiveName, // 目标名称（必填）
    objectiveDescription, // 目标描述（可选）
    weight, // 权重，0-1之间（必填）
    sortOrder
  }) => {
    const data = await addAim(
      courseId, // 课程ID（必填）
      objectiveName, // 目标名称（必填）
      objectiveDescription, // 目标描述（可选）
      weight, // 权重，0-1之间（必填）
      sortOrder
    );
    return data;
  };

  const fetchDelList = async ({ idList }) => {
    const data = await delAim(idList);
    return data;
  };

  const fuzzyQuery = async payload => {
    const { data } = await fuzzyAim(payload);
    aimList.value = data.records;
  };

  const fetchUpdateAim = async payload => {
    const data = await updateAim(payload);
    return data;
  };

  return {
    aimList,
    fetchAim,
    fetchAddAim,
    fetchDelList,
    fuzzyQuery,
    fetchUpdateAim
  };
});

export default useCourseAim;
