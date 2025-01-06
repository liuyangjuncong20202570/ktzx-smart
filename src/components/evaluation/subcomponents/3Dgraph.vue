<template>
	<div id="container" v-loading="loading" element-loading-background="black">
		<!-- 弹窗元素 -->
		<div v-if="showPopup" :style="popupStyle" class="popup">
			<div>{{ popupContent }}</div>
		</div>
	</div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import _ from "lodash";
import request from "../../../utils/request";
import { ElMessage } from "element-plus";

const loading = ref(true);

let data = {
	units: [],
	keywords: [],
	abilities: [],
	targets: [],
	kwaLines: [], // kwa之间的连线
};

const courseid = ref("2c918af681fa6ea7018209a505c30672");

const sectionChapterMap = new Map(); // 创建知识单元中各个小节和章的映射

const kwaUnitPositionMap = new Map(); // 以kwaid和其所在的章的id为主键创建kwa与其位置的映射

const keywordPositionMap = new Map(); // 以keyword的id为键创建其位置的映射

const abilityPositionMap = new Map(); // ability的id为键创建其位置的映射

const getData = async () => {
	// 获取能力数据据
	try {
		const abilitiesRes = await request.evaluation.get(
			`/evaluation/getability?courseid`
		);
		if (abilitiesRes.code === 200) {
			// console.log(abilitiesRes.data);
			acquireAbilities(abilitiesRes.data);
		} else ElMessage.error(abilitiesRes.msg);
	} catch (error) {
		ElMessage.error("获取能力失败" + error);
	}
	// 获取关键字数据
	try {
		const keywordsRes = await request.evaluation.get(
			`/evaluation/keywords`
		);
		if (keywordsRes.code === 200) {
			data.keywords = _.cloneDeep(keywordsRes.data);
		} else ElMessage.error(keywordsRes.msg);
		// console.log('keywords', data.units);
	} catch (error) {
		ElMessage.error("获取关键字失败" + error);
	}
	// 获取知识单元数据
	try {
		const unitsRes = await request.evaluation.get(
			`/evaluation/knowledgeUnit/getKnowledgeUnitTree`
		);
		if (unitsRes.code === 200) {
			data.units = _.cloneDeep(unitsRes.data);
		} else ElMessage.error(unitsRes.msg);
		// console.log('units', data.units);
	} catch (error) {
		ElMessage.error("获取知识单元失败" + error);
	}
	// 获取课程目标
	try {
		const targetsRes = await request.evaluation.get(
			`/evaluation/coursetarget`
		);
		if (targetsRes.code === 200) {
			data.targets = _.cloneDeep(targetsRes.data);
		} else ElMessage.error(targetsRes.msg);
	} catch (error) {
		ElMessage.error("获取课程目标失败" + error);
	}
	// 获取知识单元kwa间的连线
	try {
		const lineRes = await request.evaluation.get(`/evaluation/lines`);
		if (lineRes.code === 200) {
			data.kwaLines = _.cloneDeep(lineRes.data);
			// console.log(data.kwaLines);
		} else ElMessage.error(lineRes.msg);
	} catch (error) {
		ElMessage.error("获取知识单元间、KWA间连线失败" + error);
	}
};

// 弹窗相关数据
const showPopup = ref(false);
const popupContent = ref("");
const popupStyle = ref({
	top: "0px",
	left: "0px",
});

const acquireAbilities = (resData) => {
	resData.forEach((item) => {
		if (item.children && item.children.length > 0) {
			acquireAbilities(item.children);
		} else {
			data.abilities.push(item);
		}
	});
};

onMounted(async () => {
	data.units = [];
	data.abilities = [];
	data.keywords = [];
	data.targets = [];

	await getData();

	loading.value = false;

	// 获取页面中ID为'container'的DOM元素
	const container = document.getElementById("container");

	// 创建一个新的Three.js场景
	const scene = new THREE.Scene();

	// 创建WebGL渲染器
	const renderer = new THREE.WebGLRenderer({
		antialias: true, // 开启抗锯齿
	});
	// 设置渲染器的大小为container的滚动宽度和滚动高度
	renderer.setSize(container.scrollWidth, container.scrollHeight);
	// 使用设备的分辨率渲染几何体
	renderer.setPixelRatio(window.devicePixelRatio);
	// 将渲染器的DOM元素附加到container中
	container.appendChild(renderer.domElement);

	// 创建一个透视摄像机
	const camera = new THREE.PerspectiveCamera(
		75, // 视野角度
		container.scrollWidth / container.scrollHeight, // 宽高比
		0.1, // 近裁剪面
		1000 // 远裁剪面
	);

	// 设置摄像机的位置
	camera.position.x = 0;
	camera.position.y = 1.5;
	camera.position.z = 4.5;
	camera.lookAt(0, 0, 0);

	// 初始化Raycaster和鼠标向量
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// container非全屏，需要获取其位置
	const containerRect = container.getBoundingClientRect();
	const onMouseClick = (event) => {
		// 计算鼠标在container中的位置
		mouse.x =
			((event.clientX - containerRect.left) / containerRect.width) * 2 - 1;
		mouse.y =
			-((event.clientY - containerRect.top) / containerRect.height) * 2 + 1;

		// 从相机和鼠标位置更新射线
		raycaster.setFromCamera(mouse, camera);

		// 计算射线与场景中物体的交集
		const intersects = raycaster.intersectObjects(scene.children, true);

		if (intersects.length > 0) {
			// 存储合法的点的物体
			let clickedObject = null;
			for (let item of intersects) {		// 检查点击的地方有没有球型节点或者章平面
				if(item.object.userData.type === "plane") break;		// 防止透过三层平面中的几面点击到本不该被点击的节点或章平面
				if (item.object.userData.type === "node" || item.object.userData.type === "unit") {
					clickedObject = item.object;
					break;
				}
			}
			if (!clickedObject) {		// 点击的地方没有球型节点或者章平面
				showPopup.value = false;
				return;
			}

			// 点击节点会显示名称
			if (clickedObject.userData.type === "node" || clickedObject.userData.type === "unit") {
				popupContent.value = clickedObject.userData.name;
				// 设置弹框位置
				popupStyle.value.top = `${event.clientY}px`;
				popupStyle.value.left = `${event.clientX}px`;
				showPopup.value = true;
			} else showPopup.value = false;
		} else showPopup.value = false;
	};

	// 为container添加点击事件监听器
	container.addEventListener("click", onMouseClick, false);

	const onMouseMove = (event) => {
		const containerRect = container.getBoundingClientRect();
		mouse.x =
			((event.clientX - containerRect.left) / containerRect.width) * 2 - 1;
		mouse.y =
			-((event.clientY - containerRect.top) / containerRect.height) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObjects(scene.children, true);

		if (intersects.length) {
			// 存储合法的光标悬浮的物体
			let hoverObject = null;
			for (let item of intersects) {		// 检查悬浮的地方有没有球型节点或者章平面
				if(item.object.userData.type === "plane") break;		// 防止透过三层平面中的几面点击到本不该被点击的节点或章平面
				if (item.object.userData.type === "node") {
					hoverObject = item.object;
					break;
				}
			}
			if (!hoverObject) {		// 悬浮的地方没有球型节点或者章平面
				container.style.cursor = "default";
				return;
			}
			if (hoverObject.userData.type === "node") {
				container.style.cursor = "pointer";
			} else container.style.cursor = "default";
		} else {
			container.style.cursor = "default";
		}
	};
	container.addEventListener("mousemove", onMouseMove, false);

	// 三层模型平面的基准大小，其值为圆形平面最大内切正方形的边长，用于调整视角
	let planeSize = 4;
	// 平面之间的距离
	let planeDist = 1.2;

	// 添加能照亮整个球型节点的光源
	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000520, 4); // 三个参数分别是上光源颜色，下光源颜色，光源强度
	hemisphereLight.castShadow = true;
	scene.add(hemisphereLight);

	// 每个平面上的节点颜色
	const nodeColors = [
		"rgb(236, 237, 231)",
		"rgb(0, 255, 0)",
		"rgb(246, 228, 0)",
	];

	// 关键字和能力平面的大小，先计算用于求第一层平面的大小
	let keywordPlaneSize = 2;
	let abilityPlaneSize = 2;
	let keywordPlaneGridCount = 1;
	let abilityPlaneGridCount = 1;
	let kwAndAbPadding = 0.5;
	while (
		keywordPlaneGridCount * keywordPlaneGridCount <=
		data.keywords.length
	) {
		keywordPlaneSize += 2;
		keywordPlaneGridCount++;
	}
	while (
		abilityPlaneGridCount * abilityPlaneGridCount <=
		data.abilities.length
	) {
		abilityPlaneSize += 2;
		abilityPlaneGridCount++;
	}

	// 第一层平面的大小(最下层)
	let firstPlaneSize =
		data.keywords.length || data.abilities.length
			? 
			Math.max(keywordPlaneSize, abilityPlaneSize) * 2.5
			: 6;

	// 计算每个知识单元上的节点数量，以其中的最大值确定知识单元的大小
	let unitKwaAmount = {};

	// 将每一章中的小节里的kwa合并到这一章中，以下在对重复的kwa进行处理
	data.units.forEach((unit) => {
		const kwaidStatusMap = new Map();		// 将kwa的id和status之间创建映射，用于确定一章里存在重复的kwa的status值

		let uniqueChildKwas = [];		// 存储去重后的所有小节中的kwa
		sectionChapterMap.set(unit.id, unit.id);

		unit.kwas.forEach((kwa) => {
			kwaidStatusMap.set(kwa.kwaid, kwa.status);		// 首先记录每章自带的kwa
			uniqueChildKwas.push(kwa);
		})
		unit.children.forEach((child) => {			// 再对每一章的所有小节进行kwa整合
			sectionChapterMap.set(child.id, unit.id);
			child.kwas.forEach((kwa) => {
				if (!kwaidStatusMap.has(kwa.kwaid)) {		// 若这个kwa没有出现过，则记录
					uniqueChildKwas.push(kwa);
					uniqueChildKwas[uniqueChildKwas.length - 1].unitid = unit.id;		// 将小节中未在章中出现的kwa放入章中时将其的unitid由原来的小节id变为章的id
					kwaidStatusMap.set(kwa.kwaid, kwa.status);
				}
				// 如果重复的kwa中存在status为0的，则显示的章中的kwa的status为0，重复的kwa的status字段是与的关系
				else if (kwa.status === 0 && kwaidStatusMap.get(kwa.kwaid) === 1) {
					kwaidStatusMap.set(kwa.kwaid, kwa.status);			// 更新映射的值用于减少本分支的执行次数
					uniqueChildKwas.forEach((uniqueKwa) => {
						if (uniqueKwa.kwaid === kwa.kwaid) {
							uniqueKwa.status = kwa.status;
						}
					});
				}
			});
		});
		unit.kwas = _.cloneDeep(uniqueChildKwas);

		if (!unitKwaAmount[unit.id]) unitKwaAmount[unit.id] = 0;
		unitKwaAmount[unit.id] = unit.kwas.length;		// 记录记录每一章整合完其内所有小节后的kwa数量

		unit.size = 2;		// 每一章平面的大小
		unit.gridCount = 1; // 平面中一行或一列上可以有多少个节点，用于创建网格的大小gridCount * gridCount
		while (unit.gridCount * unit.gridCount <= unitKwaAmount[unit.id]) {
			unit.size++;
			unit.gridCount++;
		};
	});

	// 找到最大的知识单元的尺寸
	const maxUnitSize = Math.max(...data.units.map((unit) => unit.size));
	// 第二层平面的内边距
	const unitPlanePadding = 0.5;
	// 创建第二层平面的网格点
	const secondPlaneGridPoints = createGridPointsByNodeSize(
		9999, // 假定的第二层平面的大小，为了计算指定数量及大小的节点的分布，这个值需要取得比较大使其能容纳所有结点
		data.units.length,
		maxUnitSize
	);
	// 第二层平面的大小
	const secondPlaneSize = data.units.length
		? findSecondPlaneGridSize(
			secondPlaneGridPoints,
			data.units.length,
			maxUnitSize / 5
		)
		: 4;

	// 第三层平面大小
	let thirdPlaneSize = 2;
	let targetPlaneGridCount = 1;
	const targetPlanePadding = 0.8;
	while (targetPlaneGridCount * targetPlaneGridCount <= data.targets.length) {
		thirdPlaneSize += 2.5;
		targetPlaneGridCount++;
	}
	// console.log(targetPlaneGridCount);

	// 求出三层的平面中最大的一层，用于调整视角
	const maxPlaneSize = Math.max(
		firstPlaneSize,
		secondPlaneSize,
		thirdPlaneSize
	);

	// 设置俯视的最高视角，显示更美观
	while (planeSize < maxPlaneSize) {
		if (camera.position.y > 0.6) camera.position.y += 0.9;
		camera.position.z += 1.5;
		planeSize++;
		planeDist += 0.4;
	}

	// 存储三个平面的大小
	let threePlanesSize = [firstPlaneSize, secondPlaneSize, thirdPlaneSize];
	// 创建三个平面的几何体
	let planeGeometries = [];
	for (let i = 0; i < 3; i++) {
		const temp = new THREE.CircleGeometry(
			Math.sqrt((threePlanesSize[i] * threePlanesSize[i]) / 2),
			100
		);
		planeGeometries.push(temp);
	}

	// 平面的透明度
	const opacity = 0.8;
	/***********************创建三个不同颜色的材质********************************/
	const material1 = new THREE.MeshBasicMaterial({
		color: "rgb(252, 151, 13)",
		side: THREE.DoubleSide,
		transparent: true,
		opacity,
	});
	const material2 = new THREE.MeshBasicMaterial({
		color: "rgb(74, 49, 153)",
		side: THREE.DoubleSide,
		transparent: true,
		opacity,
	});
	const material3 = new THREE.MeshBasicMaterial({
		color: "rgb(255, 0, 0)",
		side: THREE.DoubleSide,
		transparent: true,
		opacity,
	});
	/***************************************************************************/

	// 存储三层平面对象
	let planes = [];

	// 创建平面并添加到场景
	for (let i = -1; i < 2; i++) {
		let material;
		switch (i) {
			case -1:
				material = material1;
				break;
			case 0:
				material = material2;
				break;
			case 1:
				material = material3;
				break;
		}
		const plane = new THREE.Mesh(planeGeometries[i + 1], material);
		plane.userData = {
			type: "plane",
		};
		plane.rotation.x = Math.PI / 2;
		plane.position.y = (i + 0.5) * planeDist; // 设置每个平面沿Z轴的距离
		scene.add(plane);
		planes.push(plane);
	}

	// 存储每个知识单元的平面，以id为索引
	let unitPlanes = {};
	// 存储每个知识单元平面内的网格点的位置，以id为索引
	let unitPlaneGridPoints = {};

	// 存储第三层的网格节点位置
	const targetPlaneGridPoints = createGridPointsByNodeAmount(
		thirdPlaneSize,
		targetPlaneGridCount,
		targetPlanePadding
	);

	let kwadict; // 存储kwa字典的信息，用于获取每个kwa的keywordid和abilityid

	try {
		const kwadictRes = await request.evaluation.get(`/evaluation/kwadict`);
		if (kwadictRes.code === 200) {
			kwadict = _.cloneDeep(kwadictRes.data);
		} else {
			ElMessage.error(kwadictRes.msg);
		}
	} catch (error) {
		ElMessage.error("获取kwa字典信息失败" + error);
	}

	// 创建字体加载器
	const fontLoader = new FontLoader();

	// 加载字体，速度比较慢
	setTimeout(() => {
		// 创建关键字平面
		const keywordGeometry = new THREE.CircleGeometry(
			Math.sqrt((keywordPlaneSize * keywordPlaneSize) / 2),
			100
		);
		const keywordPlaneMaterial = new THREE.MeshBasicMaterial({
			color: "grey",
			side: THREE.DoubleSide,
			transparent: true,
			opacity,
		});
		const keywordPlane = new THREE.Mesh(keywordGeometry, keywordPlaneMaterial);
		keywordPlane.userData = {
			type: "plane",
		};
		keywordPlane.position.set(
			(-1 * Math.sqrt((firstPlaneSize * firstPlaneSize) / 2)) / 2,
			0,
			-0.1
		);
		planes[0].add(keywordPlane);

		// 创建能力平面
		const abilityGeometry = new THREE.CircleGeometry(
			Math.sqrt((abilityPlaneSize * abilityPlaneSize) / 2),
			100
		);
		const abilityPlaneMaterial = new THREE.MeshBasicMaterial({
			color: "grey",
			side: THREE.DoubleSide,
			transparent: true,
			opacity,
		});
		const abilityPlane = new THREE.Mesh(abilityGeometry, abilityPlaneMaterial);
		abilityPlane.userData = {
			type: "plane",
		};
		abilityPlane.position.set(
			Math.sqrt((firstPlaneSize * firstPlaneSize) / 2) / 2,
			0,
			-0.1
		);
		planes[0].add(abilityPlane);

		// 创建关键字节点
		data.keywords.forEach((keyword, index) => {
			// console.log(keyword);
			// 创建球形节点的材质
			const sphereMaterial = new THREE.MeshStandardMaterial({
				color: "#00ff00",
			});
			// 创建球形节点的几何体
			const sphereGeometry = new THREE.SphereGeometry(0.2, 64, 64); // 半径为0.2，水平和垂直分段数均为32

			const keywordPlaneGridPoints = createGridPointsByNodeAmount(
				keywordPlaneSize,
				keywordPlaneGridCount,
				kwAndAbPadding
			);

			const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			sphere.userData = {
				type: "node",
				name: keyword.name,
			};
			sphere.receiveShadow = true;
			sphere.position.set(
				keywordPlaneGridPoints[index].x,
				keywordPlaneGridPoints[index].y,
				keywordPlaneGridPoints[index].z
			);
			keywordPlane.add(sphere);

			// 将节点的位置信息存储在节点内
			keyword.position = sphere.position;
			// console.log(keyword);
			keywordPositionMap.set(keyword.id, keyword.position);
		});
		// 创建能力节点
		data.abilities.forEach((ability, index) => {
			// 创建球形节点的材质
			const sphereMaterial = new THREE.MeshStandardMaterial({
				color: "#00ff00",
			});
			// 创建球形节点的几何体
			const sphereGeometry = new THREE.SphereGeometry(0.2, 64, 64); // 半径为0.2，水平和垂直分段数均为32

			const abilityPlaneGridPoints = createGridPointsByNodeAmount(
				abilityPlaneSize,
				abilityPlaneGridCount,
				kwAndAbPadding
			);

			const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			sphere.userData = {
				type: "node",
				name: ability.name,
			};
			sphere.receiveShadow = true;
			sphere.position.set(
				abilityPlaneGridPoints[index].x,
				abilityPlaneGridPoints[index].y,
				abilityPlaneGridPoints[index].z
			);
			abilityPlane.add(sphere);

			// 将节点的位置信息存储在节点内
			ability.position = sphere.position;

			abilityPositionMap.set(ability.id, ability.position);
		});

		let kwaIdGlobalPositionMap = {};		// 拥有同样id的kwa在不同章中的全局位置
		kwadict.forEach(kwa => {
			kwaIdGlobalPositionMap[kwa.id] = [];
		})
		// 生成知识单元平面
		data.units.forEach((unit, index) => {
			// 知识单元的材质
			const unitMaterial = new THREE.MeshBasicMaterial({
				color: "grey",
				side: THREE.DoubleSide,
				transparent: true,
				opacity,
			});

			const unitGeometry = new THREE.CircleGeometry(
				Math.sqrt((maxUnitSize * maxUnitSize) / 2),
				100
			);

			// 创建一个知识单元的平面，添加为第二层平面的子对象
			const unitPlane = new THREE.Mesh(unitGeometry, unitMaterial);
			unitPlane.userData = {
				type: "unit",
				name: unit.name,
			};
			// unitPlane.rotation.x = Math.PI / 2;
			// console.log(index);
			unitPlane.position.set(
				secondPlaneGridPoints[index].x,
				secondPlaneGridPoints[index].y,
				-0.1
			);

			planes[1].add(unitPlane);

			if (!unitPlanes[unit.id]) unitPlanes[unit.id] = [];
			unitPlanes[unit.id] = unitPlane;

			if (!unitPlaneGridPoints[unit.id]) unitPlaneGridPoints[unit.id] = [];
			unitPlaneGridPoints[unit.id] = createGridPointsByNodeAmount(
				unit.size,
				unit.gridCount,
				unitPlanePadding
			);
			// console.log(unit.name, unit.kwas);
			// 创建每个知识单元里的kwa节点
			unit.kwas.forEach((kwa, index) => {
				// 创建球形节点的材质
				const sphereMaterial = new THREE.MeshStandardMaterial({
					color: kwa.status === 1 ? "#00ff00" : "#ff0000",
				});
				// 创建球形节点的几何体
				const sphereGeometry = new THREE.SphereGeometry(0.2, 64, 64); // 半径为0.2，水平和垂直分段数均为32

				const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
				sphere.userData = {
					type: "node",
					name: kwa.name,
				};
				sphere.receiveShadow = true;
				sphere.position.set(
					unitPlaneGridPoints[kwa.unitid][index].x,
					unitPlaneGridPoints[kwa.unitid][index].y,
					unitPlaneGridPoints[kwa.unitid][index].z
				);

				unitPlanes[kwa.unitid].add(sphere);
				// 将节点的位置信息存储在节点内
				kwa.position = sphere.position;

				kwaUnitPositionMap.set(
					JSON.stringify([kwa.kwaid, sectionChapterMap.get(kwa.unitid)]),
					kwa.position
				);

				const kwainfo = kwadict.find((item) => item.id === kwa.kwaid);
				const startPosition = kwa.position;
				const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf6e432 });

				const abilityPosition = abilityPositionMap.get(kwainfo.abilityid);
				// 将局部坐标转换为全局坐标
				const globalStartPosition = unitPlanes[kwa.unitid].localToWorld(
					startPosition.clone()
				);
				const globalAbilityPosition = abilityPlane.localToWorld(
					abilityPosition.clone()
				);
				const abilityVertices = [globalStartPosition, globalAbilityPosition];
				const abilityLineGeometry = new THREE.BufferGeometry();
				abilityLineGeometry.setFromPoints(abilityVertices);
				// 创建连线
				const abilityLine = new THREE.Line(abilityLineGeometry, lineMaterial);
				// 将连线添加为场景的子对象
				scene.add(abilityLine);

				const keywordVertex = keywordPositionMap.get(kwainfo.keywordid);
				// 将局部坐标转换为全局坐标
				const globalKeywordVertex = keywordPlane.localToWorld(
					keywordVertex.clone()
				);
				const keywordVertices = [globalStartPosition, globalKeywordVertex];
				const keywordLineGeometry = new THREE.BufferGeometry();
				keywordLineGeometry.setFromPoints(keywordVertices);
				// 创建连线
				const keywordLine = new THREE.Line(keywordLineGeometry, lineMaterial);
				// 将连线添加为场景的子对象
				scene.add(keywordLine);

				// 将每个kwa节点的全局位置存起来，用于和课程目标连线
				kwaIdGlobalPositionMap[kwa.kwaid].push(globalStartPosition);
			});
		});
		// 创建课程目标节点
		data.targets.forEach((target, index) => {
			// 创建球形节点的材质
			const sphereMaterial = new THREE.MeshStandardMaterial({
				color: "#00ff00",
			});
			// 创建球形节点的几何体
			const sphereGeometry = new THREE.SphereGeometry(0.2, 64, 64); // 半径为0.2，水平和垂直分段数均为64

			const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			sphere.userData = {
				type: "node",
				name: target.name,
			};
			sphere.receiveShadow = true;
			sphere.position.set(
				targetPlaneGridPoints[index].x,
				targetPlaneGridPoints[index].y,
				targetPlaneGridPoints[index].z
			);
			planes[2].add(sphere);

			// 将节点的位置信息存储在节点内
			target.position = sphere.position;
			const startPosition = target.position;
			// 将局部坐标转换为全局坐标
			const globalStartPosition = planes[2].localToWorld(
				startPosition.clone()
			);

			const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf6e432 });
			target.kwas.forEach(kwa => {
				kwaIdGlobalPositionMap[kwa.id].forEach(position => {
					const keywordVertices = [globalStartPosition, position];
					const keywordLineGeometry = new THREE.BufferGeometry();
					keywordLineGeometry.setFromPoints(keywordVertices);
					// 创建连线
					const keywordLine = new THREE.Line(keywordLineGeometry, lineMaterial);
					// 将连线添加为场景的子对象
					scene.add(keywordLine);
				})
			})
		});

		// 创建知识单元间kwa的连线
		data.kwaLines.forEach((line) => {
			// 创建连线
			const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf6e432 });
			const lineGeometry = new THREE.BufferGeometry();
			// 获取球形节点的位置并创建连线的顶点
			const startPosition = kwaUnitPositionMap.get(
				JSON.stringify([
					line.startkwaid,
					sectionChapterMap.get(line.startunitid),
				])
			);
			const endVertex = kwaUnitPositionMap.get(
				JSON.stringify([line.endkwaid, sectionChapterMap.get(line.endunitid)])
			);

			// 将局部坐标转换为全局坐标，因为每章里的点的位置是相对于章平面而不是全局的
			const globalStartPosition = unitPlanes[
				sectionChapterMap.get(line.startunitid)
			].localToWorld(startPosition.clone());
			const globalEndVertex = unitPlanes[
				sectionChapterMap.get(line.endunitid)
			].localToWorld(endVertex.clone());

			const pointsVertices = [globalStartPosition, globalEndVertex];
			lineGeometry.setFromPoints(pointsVertices);
			// 创建连线
			const kwaLine = new THREE.Line(lineGeometry, lineMaterial);

			// 将连线添加为平面的子对象
			scene.add(kwaLine);
		});
	}, 500);
	// console.log(data)
	// 添加世界坐标辅助器
	const axesHelper = new THREE.AxesHelper(50);
	// scene.add(axesHelper);

	// 添加轨道控制器
	const controls = new OrbitControls(camera, renderer.domElement);

	// 创建一个动画函数，用于不断渲染场景，例如缩放和，旋转
	function animate() {
		requestAnimationFrame(animate); // 请求动画帧
		planes.forEach((plane) => {
			// plane.rotation.x += 0.01;
			// plane.rotation.z -= 0.0005;
		});
		renderer.render(scene, camera); // 渲染场景
	}

	// 调用动画函数
	animate();

	// 监听窗口的resize事件
	window.addEventListener("resize", function () {
		// 调整渲染器的大小
		renderer.setSize(container.offsetWidth, container.offsetHeight - 0.5);

		// 调整摄像机的宽高比
		camera.aspect = container.offsetWidth / container.offsetHeight;

		// 更新摄像机的投影矩阵
		camera.updateProjectionMatrix();
		// console.log('resize')
	});
});

// 按节点数量生成一个gridCount * gridCount的网格，适用于球型节点的布局
const createGridPointsByNodeAmount = (size, gridCount, edgeWidth) => {
	// 存储每个网格节点的位置信息
	const points = [];

	/* spacing 是网格中每两个点之间的距离。它是通过 (size - 2 * edgeWidth) / (gridCount - 1) 这个公式计算出来的。
		size - 2 * edgeWidth 是网格的实际大小，因为我们从跳过边缘边距的位置开始创建网格，所以需要从总大小中减去两个边缘边
		距。然后，我们将这个实际大小除以 gridCount - 1，因为在一个网格中，点与点之间的间隔数量是 gridCount - 1。 */
	const spacing = (size - 2 * edgeWidth) / (gridCount - 1);

	/* centerX，centerY两个值表示网格的中心点的坐标。-size / 2 + edgeWidth + (gridCount - 1) / 2 * spacing 这个公式的含义是，
		首先我们找到网格的左边界（即 -size / 2 + edgeWidth），然后加上半个网格的大小（即 (gridCount - 1) / 2 * spacing）。
		这样我们就得到了网格中心的坐标。 */
	const centerX = -size / 2 + edgeWidth + ((gridCount - 1) / 2) * spacing;
	const centerY = -size / 2 + edgeWidth + ((gridCount - 1) / 2) * spacing;

	// 确定网格布局每个网格节点的位置
	for (let i = 0; i < gridCount; i++) {
		// i和j表示了网格中所有网格节点的位置
		for (let j = 0; j < gridCount; j++) {
			// -size / 2 + edgeWidth 是左边界，i * spacing 是当前节点x轴上的距离
			const x = -size / 2 + edgeWidth + i * spacing;

			// -size / 2 + edgeWidth 是下边界，j * spacing 是当前节点y轴上的距离
			const y = -size / 2 + edgeWidth + j * spacing;

			// 当前节点距离中心节点的距离
			const dx = x - centerX;
			const dy = y - centerY;

			// 计算当前节点相对于中心节点的角度
			const angle = Math.atan2(dy, dx);
			const distance = Math.sqrt(dx * dx + dy * dy);
			points.push({ point: new THREE.Vector3(x, y, -0.2), angle, distance });
		}
	}

	// 按照距离和角度进行螺旋排序，按照两个节点距离中心的距离升序排序，如果距离相同则按照角度逆时针排序
	points.sort((a, b) => a.distance - b.distance || a.angle - b.angle);

	return points.map((p) => p.point);
};

// 按节点大小生成一个gridCount * gridCount的网格，适用于平面节点的布局
const createGridPointsByNodeSize = (size, gridCount, nodeSize) => {
	// 存储每个网格节点的位置信息
	const points = [];

	nodeSize += 0.5 * nodeSize; // 稍加大一些节点大小，使容纳这些节点的平面存在内边距

	// spacing 是网格中每两个点之间的距离，现在我们将它修改为基于 nodeSize 的值
	const spacing = nodeSize;

	// 计算偏移量，使得网格始终以中心点开始
	const offset = (size - nodeSize * (gridCount - 1)) / 2;

	const centerX = -size / 2 + offset + ((gridCount - 1) / 2) * spacing;
	const centerY = -size / 2 + offset + ((gridCount - 1) / 2) * spacing;

	// 确定网格布局每个网格节点的位置
	for (let i = 0; i < gridCount; i++) {
		for (let j = 0; j < gridCount; j++) {
			const x = -size / 2 + offset + i * spacing;
			const y = -size / 2 + offset + j * spacing;

			const dx = x - centerX;
			const dy = y - centerY;

			const angle = Math.atan2(dy, dx);
			const distance = Math.sqrt(dx * dx + dy * dy);
			points.push({ point: new THREE.Vector3(x, y, -0.2), angle, distance });
		}
	}

	points.sort((a, b) => a.distance - b.distance || a.angle - b.angle);

	return points.map((p) => p.point);
};

const findSecondPlaneGridSize = (array, len, maxUnitSizeR) => {
	// 第二层平面（知识单元平面）的直径
	let d = -0x3f3f3f3f;
	for (let i = 0; i < len; i++) {
		// 找到最大的正方形对角线长
		const res = Math.sqrt(Math.pow(Math.abs(array[i].x) + maxUnitSizeR, 2) + Math.pow(Math.abs(array[i].y) + maxUnitSizeR, 2)) * 2;
		if (d < res) d = res;
	}
	return d > 4 ? d : 4;		// 最小直径是4
}
</script>

<style scoped>
#container {
	width: 100%;
	height: 100%;
}

.popup {
	position: absolute;
	background-color: rgba(255, 255, 255, 0.714);
	color: black;
	padding: 10px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	z-index: 99;
	border-radius: 7px;
}
</style>
