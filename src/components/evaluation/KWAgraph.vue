<template>
	<div class="container" id="container"
		style="height: 92vh; width: 100%; background-color: #fdfdfd; position: relative;"></div>
</template>

<script lang="ts" setup>
import G6 from '@antv/g6';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { id } from 'element-plus/es/locales.mjs';
import { onMounted, ref } from 'vue';
import request from '../../utils/request';

const courseid = ref('');

const edges = ref([]);

const getLines = () => {
	request.evaluation.get(`/evaluation/lines`).then((res) => {
		if (res.code === 200) {
			edges.value.push({
				id: res.data.id,
				source: res.data.startid,
				target: res.data.endid,
				reamrk: res.data.remark,
				courseid: res.data.courseid
			});
		}
		else {
			ElMessage.error(res.msg);
		}
	}).catch((error) => {
		ElMessage.error('获取边信息失败' + error);
	})
}

onMounted(() => {

	getLines();

	const contextMenu = new G6.Menu({
		getContent(evt) {
			// console.log(evt)
			let header;
			if (evt.item) {
				header = evt.item._cfg.model.label.split('\n').join('');
				// console.log(header)
			}
			return `<h3>${header}</h3>
					<div>
						<button style="background-color: dodgerblue; border: 1px solid dodgerblue; color: white;
								margin-bottom: 5px;">达成</button>
					</div>
					<div>
						<button style="background-color: red; border: 1px solid red; color: white;">未达成</button>
					</div>
					`;
		},
		handleMenuClick: (target, item) => {
			// console.log(target.innerHTML);
			if (target.innerHTML === '达成') {
				item._cfg.model.status = 1;
				graph.setItemState(item, 'status1', true);
			}
			else if (target.innerHTML === '未达成') {
				item._cfg.model.status = 0;
				graph.setItemState(item, 'status1', false);
				graph.setItemState(item, 'status0', true);
			}
		},
		// 需要加上父级容器的 padding-left 16 与自身偏移量 10
		offsetX: -285,
		// 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
		offsetY: -60,
		// 在哪些类型的元素上响应
		itemTypes: ['node'],
	});

	let data = {
		nodes: [
			{
				id: '1',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				comboId: 'combo1',
				status: 1,
			},
			{
				id: '2',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				comboId: 'combo1',
				status: 1,
			},
			{
				id: '3',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				comboId: 'combo1',
				status: 0,
			},
			{
				id: '4',
				label: fittingString('串口并口通讯-代码编写能力', 80, 12),
				comboId: 'combo2',
				status: 1,
			},
			{
				id: '5',
				label: fittingString('串口并口通讯-实验能力', 80, 12),
				comboId: 'combo2',
				status: 0,
			},
			{
				id: '6',
				label: fittingString('串口并口通讯-工具与设备的使用能力', 80, 12),
				comboId: 'combo2',
				status: 0,
			},
			{
				id: '7',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				comboId: 'combo3',
				status: 1,
			},
			{
				id: '8',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				comboId: 'combo3',
				status: 1,
			},
			{
				id: '9',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				comboId: 'combo3',
				status: 0,
			},
			{
				id: '10',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				comboId: 'combo4',
				status: 1,
			},
			{
				id: '11',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				comboId: 'combo4',
				status: 1,
			},
			{
				id: '12',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				comboId: 'combo4',
				status: 0,
			},
			{
				id: '13',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				comboId: 'combo5',
				status: 1,
			},
			{
				id: '14',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				comboId: 'combo5',
				status: 1,
			},
			{
				id: '15',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				comboId: 'combo5',
				status: 0,
			},
			{
				id: '16',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				comboId: 'combo6',
				status: 1,
			},
			{
				id: '17',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				comboId: 'combo6',
				status: 1,
			},
			{
				id: '18',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				comboId: 'combo6',
				status: 0,
			},
			{
				id: '19',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				comboId: 'combo1',
				status: 1,
			},
			{
				id: '20',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				comboId: 'combo1',
				status: 1,
			},
			{
				id: '21',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				comboId: 'combo1',
				status: 0,
			},
		],
		edges: [
			{
				id: 'edge1',
				source: '1',
				target: '2',
			},
			{
				id: 'edge2',
				source: '2',
				target: '3',
			},
			{
				id: 'edge3',
				source: '4',
				target: '5',
			},
			{
				id: 'edge4',
				source: '5',
				target: '6',
			},
		]/*edges.value*/,
		combos: [
			{
				id: 'combo1',
				label: '第一章',
			},
			{
				id: 'combo2',
				label: '第二章',
			},
			{
				id: 'combo3',
				label: '第三章',
			},
			{
				id: 'combo4',
				label: '第四章',
			},
			{
				id: 'combo5',
				label: '第五章',
			},
			{
				id: 'combo6',
				label: '第六章',
			},
		],
	};

	let id = 1;
	data.nodes.forEach((node) => {		// 根据节点status设置颜色，1为绿，0为红
		node.id = '' + id++;	// id必须为字符'0'到'9'的纯数字组成否则布局会变化
		if (node.status) {
			if (!node.style) node.style = {};
			node.style.fill = 'green';
		}
		else {
			if (!node.style) node.style = {};
			node.style.fill = 'red';
		}
	})

	let tx = 100, ty = 100;		// 为每个combo设置固定的位置
	data.combos.forEach((combo) => {
		combo.x = tx;
		combo.y = ty;
		tx += 200;
	})

	const container = document.getElementById('container');
	const width = container.scrollWidth;
	const height = (container.scrollHeight || 500) - 10;
	const graph = new G6.Graph({
		container: 'container',
		width,
		height,
		animate: true,
		minZoom: 0.3,
		fitView: true,	// 自适应画布
		fitViewPadding: 60,		// 自适应画布后内四周的内边距
		linkCenter: true,	// 让箭头居中
		plugins: [contextMenu],
		layout: {
			type: 'comboCombined',
			spacing: 55,
		},
		defaultNode: {
			size: 17,
			lineWidth: 1,
			style: {
				fill: 'red',
				stroke: 'gray',
				cursor: 'pointer',
			},
			labelCfg: {
				style: {
					fill: '#000000',
					fontSize: 8
				},
				position: 'bottom',
			},
		},
		nodeStateStyles: {
			status0: {
				fill: 'red',
			},
			status1: {
				fill: 'green',
			}
		},
		defaultEdge: {
			size: 2,
			color: 'orange',
			style: {
				endArrow: {
					path: G6.Arrow.vee(),
					fill: 'orange'
				},
				cursor: 'pointer',
			}
		},
		edgeStateStyles: {
			active: {
				stroke: 'dodgerblue',
				lineWidth: 3,
				endArrow: {
					path: G6.Arrow.vee(),
					fill: 'dodgerblue'
				},
			}
		},
		defaultCombo: {
			type: "rect",
			padding: 40,
			size: [10, 10],
			labelCfg: {
				style: {
					fontSize: 20,
				}
			}
		},
		comboStateStyles: {
			active: {
				stroke: 'dodgerblue',
				fill: '#fdfdfd',
				lineWidth: 2,
			},
			dragenter: {
				lineWidth: 4,
				stroke: '#FE9797',
			},
		},
		modes: {
			default: ['drag-combo', 'drag-node', 'drag-canvas', 'zoom-canvas', 'collapse-expand-combo',
				{
					type: 'create-edge',
					key: 'shift', // undefined by default, options: 'shift', 'control', 'ctrl', 'meta', 'alt'
					shouldBegin: e => {
						// 确保创建边的起点是节点
						if (e.item.getType() === 'node') return true;
						return false;
					},
					shouldEnd: e => {
						// 确保创建边的目标是节点
						if (e.item.getType() === 'node') return true;
						return false;
					},
				},
			],
		},
	});
	graph.data(data);
	graph.render();

	/*****************节点的函数*****************/


	/*******************************************/


	/*****************combo的函数****************/
	graph.on('combo:mouseenter', (evt) => {
		const { item } = evt;
		graph.setItemState(item, 'active', true);
	});

	graph.on('combo:mouseleave', (evt) => {
		const { item } = evt;
		graph.setItemState(item, 'active', false);
	});

	graph.on('combo:dragenter', (e) => {
		graph.setItemState(e.item, 'dragenter', true);
	});

	graph.on('combo:dragleave', (e) => {
		graph.setItemState(e.item, 'dragenter', false);
	});

	graph.on('combo:dragend', (e) => {
		graph.getCombos().forEach((combo) => {
			graph.setItemState(combo, 'dragenter', false);
		});
	});
	/*******************************************/

	graph.on('aftercreateedge', (e) => {
		// console.log(e);
		const zoom = graph.getZoom();
		const newEdge = {
			id: '',
			startid: e.edge._cfg.source._cfg.model.id,
			endid: e.edge._cfg.target._cfg.model.id,
			remark: '',
			courseid: courseid.value,
		};

		request.evaluation.post('/evaluation/lines/create', newEdge).then((res) => {
			if (res.code === 200) {
				const edges = graph.save().edges;
				G6.Util.processParallelEdges(edges);
				graph.getEdges().forEach((edge, i) => {
					graph.updateItem(edge, {
						curveOffset: edges[i].curveOffset,
						curvePosition: edges[i].curvePosition,
					});
				});
			}
			else {
				ElMessage.error(res.msg);
			}
		}).catch((error) => {
			ElMessage.error('创建边失败' + error);
		});
	});

	/********************边的函数****************/

	graph.on("edge:mouseenter", (e) => {
		graph.setItemState(e.item, "active", true);
	});

	graph.on("edge:mouseleave", (e) => {
		graph.setItemState(e.item, "active", false);
	});

	graph.on("edge:click", (evt) => {
		// 获取被点击的边
		// console.log(evt)
		if (evt.originalEvent.ctrlKey) {
			ElMessageBox.confirm(
				'是否删除该边？',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			).then(() => {
				const edge = evt.item;
				// console.log(edge._cfg.model.id);
				const deletedEdgeId = edge._cfg.model.id;
				request.evaluation.post('/evaluation/lines/delete', deletedEdgeId).then((res) => {
					if (res.code === 200) {
						graph.removeItem(edge);
					}
					else {
						ElMessage.error(res.msg);
					}
				}).catch((error) => {
					ElMessage.error('删除边失败' + error);
				});

			}).catch((error) => { })
		}
	});

	open1();
	/*******************************************/
});

const open1 = () => {
	ElNotification({
		title: '按住shift点击节点以创建边，按住ctrl点击边即可删除',
		duration: 5000,
	})
}

const fittingString = (str, maxWidth, fontSize) => {
	let currentWidth = 0;
	let res = '';
	const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
	str.split('').forEach((letter, i) => {
		if (currentWidth > maxWidth) return;
		if (pattern.test(letter)) {
			// Chinese charactors
			currentWidth += fontSize;
		} else {
			// get the width of single letter according to the fontSize
			currentWidth += G6.Util.getLetterWidth(letter, fontSize);
		}
		if (currentWidth > maxWidth) {
			res += '\n';
			currentWidth = pattern.test(letter) ? fontSize : G6.Util.getLetterWidth(letter, fontSize);
		}
		res += letter;
	});
	return res;
};

</script>

<style scoped></style>