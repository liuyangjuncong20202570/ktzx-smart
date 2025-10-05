<template>
  <div class="overflow-auto">
    <!-- 课程目标 -->
    <template v-for="target in targets">
      <Pyramid v-if="dataValue" :Reinin="target" :polLength="target.length" />
    </template>

    <!-- kwa -->
    <template v-for="kwa in kwas">
      <Pyramid v-if="dataValue" :Reinin="kwa" :polLength="kwa.length" />
    </template>
    <!-- kw -->
    <template v-for="kw in keywords">
      <Pyramid v-if="dataValue" :Reinin="kw" :polLength="kw.length" />
    </template>
    <!-- a -->
    <template v-for="a in abilities">
      <Pyramid v-if="dataValue" :Reinin="a" :polLength="a.length" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import '../../../assets/css/taildwind.css';
import { Pyramid, ReininData } from '@ui';
import { onMounted, reactive, ref } from 'vue';
import useVisual from '../../../stores/dynamicEvaluation/useVisual';
import { storeToRefs } from 'pinia';
import { AtomCategory } from './type';

const { fetchCourseTarget, fetchKwaDick } = useVisual();
const { courseTarget, kwaDick } = storeToRefs(useVisual());

const generateRandomBinaryArray = (length = 16) =>
  Array.from({ length }, () => (Math.random() < 0.5 ? 0 : 1));

const N = 16;
const types = ref<any[]>([]);
const reinin = ref<any[]>([]);

const dataValue = ref(false);
const kwaMap = ref<Map<string, any[]>>(new Map());

const targets = ref<Array<ReininData[]>>([]);
const kwas = ref<Array<ReininData>>([]);

const keywords = ref<Array<ReininData>>([]);
const abilities = ref<Array<ReininData>>([]);

const Reinin = [
  { num: '0', vector: '0000', labelPlus: 'Valid', labelMinus: 'Null', type: 'aim' },
  { num: '1', vector: '0001', labelPlus: '111', labelMinus: '222', type: 'kwa' },
  { num: '2', vector: '0010', labelPlus: 'Logical', labelMinus: '333', type: 'kw' },
  { num: '3', vector: '0011', labelPlus: 'Constructivist', labelMinus: '444', type: 'a' }
];

const reducer = (arr: any[]) => {
  const result = arr.reduce((acc, curr, idx) => {
    const groupIndex = Math.floor(idx / N);
    if (!acc[groupIndex]) acc[groupIndex] = [];
    acc[groupIndex].push(curr);
    return acc;
  }, []);
  return result;
};

onMounted(async () => {
  await fetchCourseTarget();
  await fetchKwaDick();

  // 计算所有courseTarget、Kwa、Kw、A

  const nodeSet = new Set<string>();

  courseTarget.value.forEach((c, index) => {
    targets.value.push({
      num: index,
      label: c.name, // 或者 label，根据你的数据结构
      type: 0
    });

    if (c.kwas) {
      c.kwas.forEach((kw, index) => {
        nodeSet.add(kw.id);
        kwas.value.push({
          source: kw.id,
          target: c.id,
          num: index,
          label: kw.name,
          type: 1
        });
      });
    }
  });

  kwaDick.value.forEach((kw, index) => {
    if (!nodeSet.has(kw.id)) return;
    keywords.value.push({
      source: kw.id,
      target: kw.keywordid,
      num: index,
      label: kw.keywordname,
      type: 2
    });

    abilities.value.push({
      source: kw.id,
      target: kw.abilityid,
      num: index,
      label: kw.abilityname,
      type: 3
    });
  });
  kwas.value = reducer(kwas.value);
  targets.value = reducer(targets.value);
  keywords.value = reducer(keywords.value);
  abilities.value = reducer(abilities.value);

  dataValue.value = true;
});
</script>

<style lang="less"></style>
