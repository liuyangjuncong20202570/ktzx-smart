<template>
  <div class="relative">
    <div ref="container"></div>
  </div>
</template>

<script setup lang="ts">
import '../styles/index.css';
import { onMounted, onBeforeUnmount, ref, watch, toRefs } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ReininData } from './data';

const props = defineProps<{
  width?: number;
  Reinin: ReininData[];
  polLength: number;
  labelColor?: (charge: number) => { bgColor: string; labelColor: string };
}>();

const { Reinin, polLength, labelColor } = toRefs(props);

const container = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!container.value) return;

  const width = props.width || 800;
  const radius = 7;
  const s = (((0.25 * width) / 900) * radius) / 7;

  const aspect = 0.58125;
  const height = width * aspect;

  // 场景
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 45, 80);

  // 相机
  const camera = new THREE.PerspectiveCamera(32, width / height, 1, 1000);
  camera.position.set(42, 12, -30);
  camera.lookAt(0, 0, 0);

  // 渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor('#ffffff');
  renderer.setSize(width, height);
  container.value.appendChild(renderer.domElement);

  // 控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = -1.5;

  // 材质
  const material = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    opacity: 0.3,
    emissive: 0xffff00
  });

  const matNormal = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    opacity: 0.1
  });

  const matSolidLine = new THREE.LineBasicMaterial({
    color: 0x66ee88,
    transparent: true,
    opacity: 1
  });

  // 几何点
  const pyramidPoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1, 1, -1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(-1 / 3, -1 / 3, -1 / 3),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(1 / 3, 1 / 3, -1 / 3),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(-1 / 3, 1 / 3, 1 / 3),
    new THREE.Vector3(1 / 3, -1 / 3, 1 / 3),
    new THREE.Vector3(0, 0, 0)
  ];

  const axis = new THREE.Vector3(1, 0, -1);
  for (const p of pyramidPoints) {
    p.multiplyScalar(radius);
    p.applyAxisAngle(axis, -0.7);
  }

  // 标签绘制函数
  function makeLabelCanvas(baseWidth: number, size: number, name: string, charge: number) {
    const borderSize = 10;
    const ctx = document.createElement('canvas').getContext('2d')!;
    const font = `bold ${size}px calibri`;
    ctx.font = font;
    const textWidth = ctx.measureText(name).width;
    const spriteWidth = baseWidth + borderSize * 2 * s;
    const spriteHeight = size + borderSize * 2 * s;
    ctx.canvas.width = spriteWidth;
    ctx.canvas.height = spriteHeight;
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    // 背景色
    // ctx.fillStyle = charge === 1 ? '#000000' : '#80FF9E';
    ctx.fillStyle = labelColor.value ? labelColor.value(charge).bgColor : '#000000';
    ctx.fillRect(0, 0, spriteWidth, spriteHeight);
    const scaleFactor = Math.min(1, baseWidth / textWidth);
    ctx.translate(spriteWidth / 2, spriteHeight / 1.85);
    ctx.scale(scaleFactor, 1);
    // 文字颜色
    // ctx.fillStyle = charge === 1 ? '#FFFFD0' : '#000000';
    ctx.fillStyle = labelColor.value ? labelColor.value(charge).labelColor : '#FFFFD0';
    ctx.fillText(name, 0, 0);
    return ctx.canvas;
  }

  // 场景节点
  const root = new THREE.Group();
  const rootSprite = new THREE.Group();

  for (let i = 1; i < polLength.value; i++) {
    let trait = Reinin.value[i].label;
    let typo = Reinin.value[i].type;

    // function makeLabelCanvas(baseWidth: number, size: number, name: string, charge: number) pol[i]
    const canvas = makeLabelCanvas(s * (String(trait).length * 37 + 80), s * 100, trait, typo);
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const labelBaseScale = ((0.01 / s) * radius) / 7;
    const label = new THREE.Sprite(labelMaterial);
    label.position.copy(pyramidPoints[i]);
    label.scale.set(canvas.width * labelBaseScale, canvas.height * labelBaseScale, 1);
    rootSprite.add(label);
  }

  // 连线
  // 规定三角锥的6条边，端点为2 * i，2 * i + 1
  const pyramidLines = [8, 4, 8, 2, 8, 1, 4, 2, 4, 1, 2, 1];
  for (let i = 0; i < pyramidLines.length / 2; i++) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      pyramidPoints[pyramidLines[2 * i]],
      pyramidPoints[pyramidLines[2 * i + 1]]
    ]);
    const line = new THREE.Line(geometry, matSolidLine.clone());
    // if (pol[pyramidLines[2 * i]] === 1 && pol[pyramidLines[2 * i + 1]] === 1) {
    //   line.material.color.setHex(0x000000);
    // }
    root.add(line);
  }

  // 光照
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.position.set(0, 50, 0);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-1, 1.75, 1).multiplyScalar(30);
  scene.add(hemiLight, dirLight, rootSprite, root);

  // 射线检测
  const mouse = new THREE.Vector2(-0.5, 0.25);
  const raycaster = new THREE.Raycaster();

  renderer.domElement.addEventListener('mousemove', event => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
  });

  // 动画循环
  const animate = () => {
    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, camera);
    controls.update();
    renderer.render(scene, camera);
  };

  animate();

  // 销毁时清理资源
  onBeforeUnmount(() => {
    renderer.dispose();
    container.value?.removeChild(renderer.domElement);
  });
});
</script>

<style scoped></style>
