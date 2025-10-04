<template>
  <Earth
    v-if="dataReady"
    :sendlink="links"
    :linkNodes="nodes"
    :nodeColor="d => handleNode(d).color"
    :nodeRadical="d => handleNode(d).radical"
  />
</template>

<script lang="ts" setup>
import '@/assets/css/taildwind.css';
import { Earth, EarthLinkNode } from '@ui';
import useVisual from '../../../stores/dynamicEvaluation/useVisual';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { AtomCategory } from './type';

const { fetchCourseTarget, fetchKwaDick } = useVisual();
const { courseTarget, kwaDick } = storeToRefs(useVisual());

const dataReady = ref(false);

const links = ref<Array<{ source: string; target: string; value: number; type: string }>>([]);
const nodes = ref<any[]>([]);
const kwaMap = ref<Map<string, any[]>>(new Map());

const handleNode = (d: EarthLinkNode): { color: string; radical: number } => {
  switch (d.type) {
    case AtomCategory.AIM:
      return {
        color: '#4ECDC4',
        radical: 50
      };
    case AtomCategory.KWA:
      return {
        color: '#FF6B6B',
        radical: 150
      };
    case AtomCategory.ABILITY:
      return {
        color: '#FFD93D',
        radical: 300
      };
    case AtomCategory.KEYWORD:
      return {
        color: '#0a52e4',
        radical: 300
      };
    default:
      return {
        color: 'steelblue',
        radical: 900
      };
  }
};

onMounted(async () => {
  await fetchCourseTarget();
  await fetchKwaDick();
  const nodeMap = new Map<string, EarthLinkNode>();

  // 处理 AIM 节点和 KWA 节点
  courseTarget.value.forEach(c => {
    if (c.kwas) {
      c.kwas.forEach(kwa => {
        links.value.push({
          source: kwa.id,
          target: c.id,
          type: AtomCategory.KWA,
          value: kwa.datavalue
        });
        nodeMap.set(kwa.id, { ...kwa, type: AtomCategory.KWA });
        kwaMap.value.set(kwa.id, []);
      });
    }
    nodeMap.set(c.id, { ...c, type: AtomCategory.AIM });
  });

  // 处理 ability / keyword
  kwaDick.value.forEach(kwa => {
    const kwaNodeArray = kwaMap.value.get(kwa.id);
    if (!kwaNodeArray) return;

    // ABILITY 节点
    links.value.push({
      source: kwa.abilityid,
      target: kwa.id,
      type: AtomCategory.ABILITY,
      value: kwa.datavalue
    });
    const abilityNode: EarthLinkNode = {
      id: kwa.abilityid,
      name: kwa.abilityname,
      type: AtomCategory.ABILITY,
      value: kwa.datavalue
    };
    nodeMap.set(abilityNode.id, abilityNode);
    kwaNodeArray.push(abilityNode);

    // KEYWORD 节点
    links.value.push({
      source: kwa.keywordid,
      target: kwa.id,
      type: AtomCategory.KEYWORD,
      value: kwa.datavalue
    });
    const keywordNode: EarthLinkNode = {
      id: kwa.keywordid,
      name: kwa.keywordname,
      type: AtomCategory.KEYWORD,
      value: kwa.datavalue
    };
    nodeMap.set(keywordNode.id, keywordNode);
    kwaNodeArray.push(keywordNode);
  });

  // 最终节点数组
  nodes.value = Array.from(nodeMap.values());
  dataReady.value = true;
});
</script>

<style lang="less"></style>
