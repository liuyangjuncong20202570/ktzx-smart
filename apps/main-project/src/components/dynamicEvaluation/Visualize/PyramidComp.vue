<template>
  <div v-if="dataValue" class="overflow-auto flex flex-col gap-4">
    <div @click="outerClick" class="flex flex-start">
      <ElButton :data-name="AtomCategory.AIM">课程目标</ElButton>
      <ElButton :data-name="AtomCategory.KWA">关键字-能力</ElButton>
      <ElButton :data-name="AtomCategory.KEYWORD">关键字</ElButton>
      <ElButton :data-name="AtomCategory.ABILITY">能力</ElButton>
    </div>
    <PyramidCombo v-if="dataValue" :Reinin="total" :polLength="total.length" />
    <CategoryDetail v-model="drawer" @close="handleClose" :show="drawer" v-bind="detailProps" />
  </div>
</template>

<script lang="ts" setup>
import '../../../assets/css/taildwind.css';
import { Pyramid, ReininData, PyramidCombo } from '@ui';
import { onMounted, reactive, ref } from 'vue';
import useVisual from '../../../stores/dynamicEvaluation/useVisual';
import { storeToRefs } from 'pinia';
import { AtomCategory, DetailProps, PyramidDetail } from './type';
import { ElButton, ElLoading } from 'element-plus';
import { useValueEffect } from './sideEffect';
import CategoryDetail from './CategoryDetail.vue';

const { fetchCourseTarget, fetchKwaDick } = useVisual();
const { courseTarget, kwaDick } = storeToRefs(useVisual());

const N = 16;

const dataValue = ref(false);
const kwaMap = ref<Map<string, any[]>>(new Map());

const targets = ref<Array<ReininData[]>>([]);
const kwas = ref<Array<ReininData>>([]);

const keywords = ref<Array<ReininData>>([]);
const abilities = ref<Array<ReininData>>([]);

const total = ref<ReininData[]>([]);
const { setDrawer, drawer } = useValueEffect();

const detailProps = reactive<DetailProps & PyramidDetail>({
  title: '',
  Reinin: []
});

const outerClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  // 找到最近的 button 元素
  const btn = target.closest('button');
  if (!btn) return; // 不是按钮点击，直接返回
  // 读取 data-name
  const name = btn.dataset.name;
  setDrawer(true);
  switch (name) {
    case AtomCategory.AIM:
      detailProps.title = '课程目标';
      detailProps.Reinin = targets.value;
      detailProps.labelColor = () => ({ bgColor: '#070707', labelColor: '#ffffd1' });
      return;
    case AtomCategory.KWA:
      detailProps.title = '关键字 - 能力';
      detailProps.Reinin = kwas.value;
      return;
    case AtomCategory.KEYWORD:
      detailProps.title = '关键字';
      detailProps.Reinin = keywords.value;
      return;
    case AtomCategory.ABILITY:
      detailProps.title = '能力';
      detailProps.Reinin = abilities.value;
      return;
  }
};

const handleClose = (value: boolean) => {
  setDrawer(value);
};

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
  total.value = [...kwas.value, ...targets.value, ...keywords.value, ...abilities.value];
  kwas.value = reducer(kwas.value);
  targets.value = reducer(targets.value);
  keywords.value = reducer(keywords.value);
  abilities.value = reducer(abilities.value);
  dataValue.value = true;
});
</script>

<style lang="less"></style>
