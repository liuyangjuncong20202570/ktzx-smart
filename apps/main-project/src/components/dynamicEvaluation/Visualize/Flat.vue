<template>
  <Links
    v-if="links.length && nodes.length"
    title="2D图谱"
    :sendlink="links"
    :linkNodes="nodes"
    @nodeHover="handleHover"
    @nodeMove="handleMove"
    @nodeOut="handleOut"
  />
</template>

<script setup lang="ts">
import { Links, LinkNode, tooltip } from '@ui';
import { onMounted, ref, watch } from 'vue';
import useVisual from '../../../stores/dynamicEvaluation/useVisual';
import { storeToRefs } from 'pinia';

const { fetchKnowledge } = useVisual();
const { knowledgeList } = storeToRefs(useVisual());

const links = ref<Array<{ source: string; target: string; value: number }>>([]);
const nodes = ref<Array<any>>([]);

const handleHover = (node: LinkNode, event) => {
  tooltip
    .html(
      `<strong>${node.name}</strong><br/>${node.type === 'subject' ? '得分' : '权重'}: ${
        node.type === 'subject' ? node.datavalue : node.status
      }`
    )
    .style('opacity', '1')
    .style('left', `${event.pageX + 10}px`)
    .style('top', `${event.pageY + 10}px`);
};

const handleMove = (node: LinkNode, event) => {
  tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY + 10}px`);
};

const handleOut = (node: LinkNode, event) => {
  tooltip.style('opacity', '0');
};

onMounted(async () => {
  await fetchKnowledge();
  knowledgeList.value.forEach((item, index) => {
    if (item.kwas) {
      item.kwas.map(kwa => {
        links.value.push({ source: kwa.id, target: item.id, value: index });
        nodes.value.push({ ...kwa, type: 'kwa' });
      });
    }
    nodes.value.push({ ...item, type: 'subject', show: true });
  });
});
</script>

<style lang="less"></style>
