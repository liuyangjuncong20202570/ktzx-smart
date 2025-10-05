<template>
  <div class="links-container">
    <h3>{{ title ? title : 'D3 Links Visualization' }}</h3>
    <div
      class="h-[100vh] border-[#ddd] radius-[8px] overflow-hidden bg-[#f9f9f9]"
      ref="chartContainer"
    ></div>
  </div>
</template>

<script setup lang="ts">
import d3 from '../../utils/d3';
import { onMounted, onUnmounted, ref, toRefs } from 'vue';
import { Link, LinkNode } from './data';

const props = defineProps<{
  title: string;
  sendlink: Link[];
  linkNodes: LinkNode[];
}>();

const { title, sendlink, linkNodes } = toRefs(props);

const emit = defineEmits<{
  (e: 'nodeClick', node: LinkNode, event?: MouseEvent): void;
  (e: 'nodeHover', node: LinkNode, event?: MouseEvent): void;
  (e: 'nodeMove', node: LinkNode, event?: MouseEvent): void;
  (e: 'nodeOut', node: LinkNode, event?: MouseEvent): void;
}>();

if (!(sendlink.value && sendlink.value.length && linkNodes.value && linkNodes.value.length)) {
  throw new Error('sendlink和linkNodes数组不能为空！');
}
const types = Array.from(new Set(sendlink.value.map(d => d.value)));
const chartContainer = ref<HTMLDivElement | null>();
const width = 1000;
const height = 1000;

const linkArc = (d: Link) => {
  const s = d.source as unknown as LinkNode;
  const t = d.target as unknown as LinkNode;
  const r = Math.hypot(t.x! - s.x!, t.y! - s.y!);
  return `
    M${s.x},${s.y}
    A${r},${r} 0 0,1 ${t.x},${t.y}
  `;
};

const simulation = () => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
};

const drag = (simulation: d3.Simulation<LinkNode, Link>) => {
  function dragstarted(event: any, d: LinkNode) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event: any, d: LinkNode) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event: any, d: LinkNode) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
};

const color = d3.scaleOrdinal(types, d3.schemeCategory10);

const initialize = () => {
  const links = sendlink.value.map(d => Object.create(d));
  const nodes = linkNodes.value.map(d => Object.create(d));
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3.forceLink(links).id(d => d.id)
    )
    .force('charge', d3.forceManyBody().strength(-400))
    .force('x', d3.forceX())
    .force('y', d3.forceY());

  const svg = d3
    .create('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .style('font', '12px sans-serif');

  const g = svg.append('g').attr('class', 'everything');

  svg
    .append('defs')
    .selectAll('marker')
    .data(types)
    .join('marker')
    .attr('id', d => `arrow-${d}`)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15)
    .attr('refY', -0.5)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('fill', color)
    .attr('d', 'M0,-5L10,0L0,5');

  const link = g
    .append('g')
    .attr('fill', 'none')
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('stroke', d => color(d.value))
    .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location)})`);

  const node = g
    .append('g')
    .attr('fill', 'currentColor')
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(drag(simulation))
    .on('click', (event: MouseEvent, d: LinkNode) => {
      emit('nodeClick', d, event);
    })
    .on('mouseover', (event: MouseEvent, d: LinkNode) => {
      emit('nodeHover', d, event);
    })
    .on('mousemove', (event: MouseEvent, d: LinkNode) => {
      emit('nodeMove', d, event);
    })
    .on('mouseout', (event: MouseEvent, d: LinkNode) => {
      emit('nodeOut', d, event);
    });

  node.append('circle').attr('stroke', 'white').attr('stroke-width', 1.5).attr('r', 4);

  node.append('title').text(d => d.name);

  const textElems = g
    .append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text(d => (d.show ? d.name : null))
    .attr('font-size', 12)
    .attr('font-size', 12)
    .call(drag(simulation));

  textElems.append('title').text(d => d.id);

  simulation.on('tick', () => {
    link.attr('d', linkArc);
    node.attr('transform', d => `translate(${d.x},${d.y})`);
    textElems.attr('x', d => d.x + 10).attr('y', d => d.y);
  });

  function zoomed({ transform }: { transform: any }) {
    g.attr('transform', transform);
  }

  svg.call(
    d3
      .zoom()
      .extent([
        [0, 0],
        [width, height]
      ])
      .scaleExtent([0, 8])
      .on('zoom', zoomed)
  );

  if (chartContainer.value) {
    chartContainer.value.appendChild(svg.node() as Node);
  }

  return svg.node();
};

onMounted(() => {
  initialize();
});

onUnmounted(() => simulation.stop());
</script>

<style lang="less" scoped>
.links-container {
  padding: 20px;

  h3 {
    margin-bottom: 20px;
    color: #333;
  }

  .chart-container {
    height: '1000px';
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: #f9f9f9;
  }
}

:deep(.links line) {
  stroke: #999;
  stroke-opacity: 0.6;
}

:deep(.nodes circle) {
  cursor: pointer;
  stroke: #fff;
  stroke-width: 2px;

  &:hover {
    stroke-width: 3px;
  }
}

:deep(.labels text) {
  pointer-events: none;
  user-select: none;
}
</style>
