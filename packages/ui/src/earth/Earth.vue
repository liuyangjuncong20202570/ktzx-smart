<template>
  <div class="relative">
    <div ref="graphContainer"></div>
    <div style="position: absolute; top: 0; right: 0">
      <button v-if="utilBoxShow" @click="handlePause" class="custom-button">暂停</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, toRefs } from 'vue';
import { ForceGraph3D, d3Force3d } from '../../utils/d3';
import { EarthLinkNode, EarthLink } from './data';
import { ForceGraph3DInstance } from '3d-force-graph';

let angle = 0;
const N = 700;

const rotating = ref(true);
const graphContainer = ref<HTMLDivElement | null>(null);

const subsetData = ref<any>();

const props = withDefaults(
  defineProps<{
    linkNodes: EarthLinkNode[];
    sendlink: EarthLink[];
    nodeColor?: (d: EarthLinkNode) => string;
    nodeRadical?: (d: EarthLinkNode) => number;
    utilBoxShow?: boolean;
    rotateConfig?: {
      // 相机距离图中心的半径，可根据图大小调节
      radius: number;
      // 旋转速度
      rotationSpeed: number;
      // 图中心点，可根据需要调整
      center: {
        x: number;
        y: number;
        z: number;
      };
    };
    // 金字塔布局配置
    pyramidConfig?: Record<string, { level: number; radius: number; height: number }>;
  }>(),
  {
    utilBoxShow: true,
    rotateConfig: () => ({
      radius: 800,
      rotationSpeed: 0.002,
      center: {
        x: 0,
        y: 0,
        z: 0
      }
    }),
    pyramidConfig: () => ({
      top: { level: 0, radius: 50, height: 300 }, // 顶层
      middle: { level: 1, radius: 150, height: 150 }, // 中层
      bottom: { level: 2, radius: 300, height: 0 }, // 底层
      a: { level: 0, radius: 50, height: 300 }, // 兼容原有类型
      b: { level: 1, radius: 200, height: 100 } // 兼容原有类型
    })
  }
);

let count = 0;

const {
  linkNodes,
  sendlink,
  nodeColor,
  nodeRadical,
  utilBoxShow = true,
  rotateConfig
} = toRefs(props);

const emit = defineEmits<{
  (e: 'onNodeClick', node: EarthLinkNode, prevPos: number, currPos: number): void;
}>();

console.log(linkNodes.value, sendlink.value);
if (!(linkNodes && linkNodes.value.length && sendlink && sendlink.value.length)) {
  console.info('linkNodes、sendlink数组为空，当前展示默认数据');
}

const handlePause = () => {
  rotating.value = false;
};

const resizeGraph = () => ({});

const rotateCamera = (forceGraph: ForceGraph3DInstance) => {
  angle += rotateConfig.value.rotationSpeed;
  const x = rotateConfig.value.radius * Math.sin(angle);
  const z = rotateConfig.value.radius * Math.cos(angle);
  const y = 200; // 相机高度
  forceGraph.cameraPosition({ x, y, z }, rotateConfig.value.center, 0);
};

const initialize = (linkNodes: EarthLinkNode[], sendlink: EarthLink[]) => {
  if (!graphContainer.value) return;

  // 初始化 ForceGraph3D
  const forceGraph = ForceGraph3D()(graphContainer.value)
    .d3AlphaDecay(0.01)
    .d3VelocityDecay(0.1)
    .d3Force('charge', null)
    .d3Force(
      'radial',
      d3Force3d.forceRadial((d: EarthLinkNode) => (nodeRadical.value ? nodeRadical.value(d) : 600))
    )
    .d3Force('collide', d3Force3d.forceCollide(16))
    .d3Force('collide', d3Force3d.forceCollide(16))
    .nodeRelSize(8)
    .nodeColor((d: EarthLinkNode) => (nodeColor.value ? nodeColor.value(d) : 'steelblue'))
    .enableNodeDrag(true);

  const resizeGraph = () => {
    if (!graphContainer.value || !forceGraph) return;
    const { clientWidth, clientHeight } = graphContainer.value;
    forceGraph.width(clientWidth).height(clientHeight);
  };
  resizeGraph();

  // 监听窗口大小变化
  window.addEventListener('resize', resizeGraph);

  // 生成节点数据
  const nodes =
    linkNodes && linkNodes.length
      ? linkNodes
      : Array.from({ length: N * 4 }, (_, i) => ({
          type: i > N ? 'b' : 'a'
        }));

  const links = sendlink && sendlink.length ? sendlink : [];

  // 设置图数据
  forceGraph.graphData({ nodes, links: [] });

  // 设置节点点击事件
  forceGraph.onNodeClick((node: EarthLinkNode, prevPos: number, currPos: number) => {
    emit('onNodeClick', node, prevPos, currPos);
    // TODO：设置形态变换
    forceGraph
      .graphData({
        nodes: linkNodes,
        links: sendlink
      })
      .nodeId('id')
      .nodeVal('value')
      .nodeLabel((as: EarthLinkNode) => {
        return `'当前单位：${as.name} - ${as.type} 权重：${as.value || 0}`;
      })
      .linkSource('source')
      .linkTarget('target')
      .nodeAutoColorBy('type')
      .warmupTicks(250)
      .cooldownTicks(0)
      .nodeRelSize(8)
      .linkOpacity(0.5);
  });

  forceGraph.onNodeDrag(() => {});

  forceGraph.onNodeDragEnd(() => {});
  // animate
  const animate = () => {
    if (rotating.value) {
      rotateCamera(forceGraph); // 只有 rotating=true 才更新相机位置
    }
    requestAnimationFrame(animate);
  };
  // animate();

  let lastX = 0;
  graphContainer.value.addEventListener('mousedown', e => {
    lastX = e.clientX;
  });

  graphContainer.value.addEventListener('mouseup', e => {
    const dx = e.clientX - lastX;
    rotateConfig.value.rotationSpeed = dx > 0 ? -0.002 : 0.002;
    rotating.value = true;
  });
};

onMounted(() => {
  initialize(linkNodes.value, sendlink.value);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeGraph);
});
</script>

<style lang="less">
.custom-button {
  position: absolute;
  top: 1rem; // top-4
  right: 1rem; // right-4
  z-index: 50;

  background: linear-gradient(to right, #3b82f6, #6366f1); // from-blue-500 to-indigo-600
  color: #fff;
  font-weight: 600;
  padding: 0.5rem 1.25rem; // py-2 px-5
  border-radius: 0.5rem; // rounded-lg
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); // shadow-lg
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  outline: none;

  &:hover {
    background: linear-gradient(
      to right,
      #2563eb,
      #4f46e5
    ); // hover:from-blue-600 hover:to-indigo-700
  }

  &:active {
    transform: scale(0.95); // active:scale-95
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); // focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
  }
}
</style>
