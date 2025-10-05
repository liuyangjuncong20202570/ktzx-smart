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
import * as THREE from 'three';

let angle = 0;
const N = 700;
let inactivityTimer: number | null = null; // 离开计时器

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

  const scene = forceGraph.scene();

  // ======================== 星星粒子 ========================
  const starCount = 1500; // 粒子数量
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 4000; // 空间分布范围
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

  // 发光材质
  const starMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(0xffffff),
    size: 3.5, // 粒子大小
    transparent: true,
    opacity: 0.95, // 更亮
    blending: THREE.AdditiveBlending, // 发光效果
    depthWrite: false,
    sizeAttenuation: true
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  stars.raycast = () => {};
  scene.add(stars);

  // ======================== 星系背景 ========================
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff, // 线条颜色（白色）
    transparent: true, // 允许透明
    opacity: 0.07, // 设置透明度
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const lineGeometry = new THREE.BufferGeometry();
  const linePositions: number[] = [];

  // 随机挑选部分粒子之间连线（类似星系的能量网）
  for (let i = 0; i < starCount; i++) {
    // 每个点随机连 2~3 条线
    const connectionCount = Math.floor(Math.random() * 3);
    for (let j = 0; j < connectionCount; j++) {
      const targetIndex = Math.floor(Math.random() * starCount);
      const i3 = i * 3;
      const t3 = targetIndex * 3;
      linePositions.push(
        starPositions[i3],
        starPositions[i3 + 1],
        starPositions[i3 + 2],
        starPositions[t3],
        starPositions[t3 + 1],
        starPositions[t3 + 2]
      );
    }
  }

  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  lines.raycast = () => {};
  scene.add(lines);

  // ======================== 漂浮动画 ========================
  const animateStars = () => {
    stars.rotation.y += 0.0002;
    stars.rotation.x += 0.0001;
    lines.rotation.y += 0.00015;
    requestAnimationFrame(animateStars);
  };
  animateStars();

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
    // forceGraph
    //   .graphData({
    //     nodes: linkNodes,
    //     links: sendlink
    //   })
    //   .nodeId('id')
    //   .nodeVal('value')
    //   .nodeLabel((as: EarthLinkNode) => {
    //     return `'当前单位：${as.name} - ${as.type} 权重：${as.value || 0}`;
    //   })
    //   .linkSource('source')
    //   .linkTarget('target')
    //   .nodeAutoColorBy('type')
    //   .warmupTicks(250)
    //   .cooldownTicks(0)
    //   .nodeRelSize(8)
    //   .linkOpacity(0.5);
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
  animate();

  // 鼠标交互
  const setupMouseEvents = () => {
    if (!graphContainer.value) return;

    // 鼠标进入立即暂停旋转
    graphContainer.value.addEventListener('mouseenter', () => {
      rotating.value = false;
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
      }
    });

    // 鼠标离开5s后旋转
    graphContainer.value.addEventListener('mouseleave', () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        rotating.value = true;
      }, 5000);
    });
  };

  setupMouseEvents();

  let lastX = 0;
  graphContainer.value.addEventListener('mousedown', e => {
    lastX = e.clientX;
  });

  graphContainer.value.addEventListener('mouseup', e => {
    const dx = e.clientX - lastX;
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
