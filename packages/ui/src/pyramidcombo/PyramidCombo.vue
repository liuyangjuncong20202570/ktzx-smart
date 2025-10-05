<template>
  <div ref="container" class="flex items-center justify-center w-[10000px] h-[1000px]"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, toRefs } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Props 或常量
const container = ref<HTMLDivElement | null>(null);
const props = defineProps<{
  width?: number;
  Reinin: any[];
  polLength: number;
  labelColor?: (charge: number) => { bgColor: string; labelColor: string };
}>();

const { labelColor, polLength, Reinin } = toRefs(props);

// 示例 Types
const Types = [
  { type: 'IEI', pol: [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1] }, //0
  { type: 'IEE', pol: [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0] }, //1
  { type: 'ILI', pol: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0] }, //2
  { type: 'ILE', pol: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }, //3

  { type: 'LII', pol: [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1] }, //4
  { type: 'LIE', pol: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] }, //5
  { type: 'LSI', pol: [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0] }, //6
  { type: 'LSE', pol: [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1] }, //7

  { type: 'SLI', pol: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1] }, //8
  { type: 'SLE', pol: [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0] }, //9
  { type: 'SEI', pol: [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0] }, //10
  { type: 'SEE', pol: [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1] }, //11

  { type: 'ESI', pol: [1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1] }, //12
  { type: 'ESE', pol: [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0] }, //13
  { type: 'EII', pol: [1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0] }, //14
  { type: 'EIE', pol: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1] } //15
];

onMounted(() => {
  // ------------------- 基本场景 -------------------
  const radius = 1.5;
  const span = 4.5;
  const pi = Math.PI;
  const width = props.width || 800;
  const s = (((0.25 * width) / 900) * radius) / 7;

  const aspect = 1.02;
  const height = width * aspect;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 35, 70);

  const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
  camera.position.set(0, 30, 38);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor('#ffffff');
  renderer.setSize(width, height);

  if (container.value) {
    container.value.appendChild(renderer.domElement);
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.enableRotate = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = -1.5;

  // ------------------- 材质 -------------------
  const material = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    opacity: 0.4,
    emissive: 0xffff00
  });
  const matNormal = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    opacity: 0.15
  });
  const matBlack = new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.DoubleSide });
  const matSolidLine = new THREE.LineBasicMaterial({
    color: 'red',
    transparent: true,
    opacity: 1
  });
  const matDashedLine = new THREE.LineDashedMaterial({
    color: 'red',
    dashSize: 0.25,
    gapSize: 0.25,
    transparent: true,
    depthWrite: false,
    opacity: 0.4
  });

  // ------------------- 小金字塔点 -------------------
  let pyramidPoints = [
    new THREE.Vector3(-1, -1, -1),
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
  for (let i = 0; i < pyramidPoints.length; i++) {
    pyramidPoints[i].multiplyScalar(radius);
    pyramidPoints[i].applyAxisAngle(axis, -0.7);
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

  const root = new THREE.Group();
  const rootSprite = new THREE.Group();
  const dotList: THREE.Group[] = [];
  const n = 16;
  const lookup = [3, 10, 6, 15, 14, 7, 11, 2, 13, 4, 0, 9, 8, 1, 5, 12];

  for (let j = 1; j < 16; j++) {
    // 点
    for (let i = 1; i < n; i++) {
      const group1 = new THREE.Group();
      const square = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), matBlack.clone());
      group1.add(square);

      if (Types[lookup[j]].pol[i] != 1) {
        square.material.emissive.setHex(0x80ff9e);
      }

      group1.position.set(
        pyramidPoints[i].x + span * pyramidPoints[j].x,
        pyramidPoints[i].y + span * pyramidPoints[j].y,
        pyramidPoints[i].z + span * pyramidPoints[j].z
      );

      const trait = Reinin.value[i]?.label || 'node';
      const charge = Reinin.value[i]?.type || 0;
      const canvas = makeLabelCanvas(s * (String(trait).length * 200 + 80), s * 200, trait, charge); // 调整大小
      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const label = new THREE.Sprite(labelMaterial);

      label.position.set(0, 0.5, 0); // label 在 node 上方
      label.scale.set(canvas.width * 0.01, canvas.height * 0.01, 1); // 缩放合理
      group1.add(label);

      dotList.push(group1);
      rootSprite.add(group1);
    }

    // 线条
    const pyramidLines = [
      8, 4, 8, 2, 8, 1, 4, 2, 4, 1, 2, 1, 8, 3, 8, 6, 8, 5, 2, 12, 2, 9, 2, 5, 1, 10, 1, 12, 1, 6,
      4, 10, 4, 9, 4, 3, 8, 7, 2, 13, 4, 11, 1, 14, 10, 5, 12, 3, 9, 6
    ];

    const positions: any[] = [];

    for (let i = 0; i < pyramidLines.length / 2; i++) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        pyramidPoints[pyramidLines[2 * i]],
        pyramidPoints[pyramidLines[2 * i + 1]]
      ]);
      const line = new THREE.Line(geometry, matDashedLine.clone());
      line.position.set(
        span * pyramidPoints[j].x,
        span * pyramidPoints[j].y,
        span * pyramidPoints[j].z
      );
      root.add(line);
    }

    // 所有小金字塔的外层顶点（每个 pyramidPoints 的放大版）
    const outerPoints = pyramidPoints.map(p => p.clone().multiplyScalar(span));

    // // 找出最底部的顶点索引（y 值最小的）
    let minY = Infinity;
    let bottomIndex = -1;
    outerPoints.forEach((p, i) => {
      if (p.y < minY) {
        minY = p.y;
        bottomIndex = i;
      }
    });

    // 灰色连线材质
    const matGrayLine = new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.5
    });
    // const outerPoints = pyramidPoints.map(p => p.clone().multiplyScalar(span));
    // 连接任意两两小金字塔（跳过底点）
    for (let a = 0; a < outerPoints.length; a++) {
      for (let b = a + 1; b < outerPoints.length; b++) {
        // 跳过与底点相关的连接
        if (a === bottomIndex || b === bottomIndex) continue;

        const geometry = new THREE.BufferGeometry().setFromPoints([outerPoints[a], outerPoints[b]]);
        const line = new THREE.Line(geometry, matGrayLine.clone());
        root.add(line);
      }
    }

    outerPoints.forEach((a, i) => {
      outerPoints.forEach((b, j) => {
        if (i >= j || i === bottomIndex || j === bottomIndex) return;
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      });
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const lineSegments = new THREE.LineSegments(geometry, matGrayLine);
    root.add(lineSegments);
  }

  // 添加到场景
  const pickable = new THREE.Group();
  scene.add(pickable);
  scene.add(rootSprite);
  scene.add(root);

  // ------------------- 射线检测 -------------------
  const mouse = new THREE.Vector2(-0.5, 0.25);
  const raycaster = new THREE.Raycaster();
  let INTERSECTED: any = null;

  function onMouseMove(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    mouse.x = (x / width) * 2 - 1;
    mouse.y = -(y / height) * 2 + 1;
  }

  renderer.domElement.addEventListener('mousemove', onMouseMove);

  window.addEventListener('click', () => {
    if (INTERSECTED) INTERSECTED.material.color.setHex(Math.random() * 0xffffff);
  });

  window.addEventListener('mouseover', () => {
    controls.autoRotate = false;
  });
  window.addEventListener('mouseout', () => {
    controls.autoRotate = true;
  });

  // ------------------- 渲染循环 -------------------
  const animate = () => {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pickable.children);

    if (intersects.length > 0) {
      if (INTERSECTED != intersects[0].object) {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = intersects[0].object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex(0x444400);
      }
    } else {
      if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = null;
    }

    const camPos = camera.position.clone().normalize().multiplyScalar(0.3);
    rootSprite.position.set(camPos.x, camPos.y, camPos.z);

    dotList.forEach(dot => dot.quaternion.copy(camera.quaternion));

    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  onBeforeUnmount(() => {
    renderer.dispose();
    controls.dispose();
  });
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
