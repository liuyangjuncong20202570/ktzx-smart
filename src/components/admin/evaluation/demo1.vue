<template>
	<div class="container" id="container"
		style="height: 92vh; width: 100%; background-color: #fdfdfd; position: relative;"></div>
</template>

<script lang="ts" setup>
import G6 from '@antv/g6';
import { ElNotification } from 'element-plus';
import { onMounted } from 'vue';

onMounted(() => {

	const contextMenu = new G6.Menu({
		getContent(evt) {
			// console.log(evt)
			let header;
			if (evt.item) {
				const itemType = evt.item.getType();
				header = `${itemType.toUpperCase()} ContextMenu`;
			}
			return `<h3>${header}</h3>`;
		},
		handleMenuClick: (target, item) => {
			console.log(target, item);
		},
		// 需要加上父级容器的 padding-left 16 与自身偏移量 10
		offsetX: -285,
		// 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
		offsetY: -60,
		// 在哪些类型的元素上响应
		itemTypes: ['node'],
	});

	const data = {
		nodes: [
			{
				id: '1',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo1',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '2',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo1',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '3',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo1',
				status: 0,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '4',
				label: fittingString('串口并口通讯-代码编写能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo2',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '5',
				label: fittingString('串口并口通讯-实验能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo2',
				status: 0,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '6',
				label: fittingString('串口并口通讯-工具与设备的使用能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo2',
				status: 0,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '7',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo3',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '8',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo3',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '9',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo3',
				status: 0,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '10',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo4',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '11',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo4',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '12',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo4',
				status: 0,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '13',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo5',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '14',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo5',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '15',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo5',
				status: 0,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '16',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo6',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '17',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo6',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '18',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo6',
				status: 0,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '19',
				label: fittingString('中断系统-概念识辩能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo1',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '20',
				label: fittingString('中断系统-代码编写能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo1',
				status: 1,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
			},
			{
				id: '21',
				label: fittingString('中断系统-直接应用能力', 80, 12),
				labelCfg: {
					position: 'bottom'
				},
				comboId: 'combo1',
				status: 0,
				style: {
					fill: 'red',
					stroke: 'gray',
					cursor: 'pointer',
				}
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
		],
		combos: [
			// {
			// 	id: 'main',
			// },
			{
				id: 'combo1',
				label: '第一章',
				x: 100,
				y: 100
				// parentId: 'main'
			},
			{
				id: 'combo2',
				label: '第二章',
				x: 200,
				y: 100
				// parentId: 'main'
			},
			{
				id: 'combo3',
				label: '第三章',
				x: 300,
				y: 100
				// parentId: 'main'
			},
			{
				id: 'combo4',
				label: '第四章',
				x: 400,
				y: 100
				// parentId: 'main'
			},
			{
				id: 'combo5',
				label: '第五章',
				x: 500,
				y: 100
				// parentId: 'main'
			},
			{
				id: 'combo6',
				label: '第六章',
				x: 600,
				y: 100
				// parentId: 'main'
			},
		],
	};

	data.nodes.forEach((node) => {
		if (node.status) {
			node.style.fill = 'green';
		}
		else node.style.fill = 'red';
	})

	const container = document.getElementById('container');
	const width = container.scrollWidth;
	const height = (container.scrollHeight || 500) - 10;
	const graph = new G6.Graph({
		container: 'container',
		width,
		height,
		animate: true,
		fitView: true,
		fitViewPadding: 60,
		plugins: [contextMenu],
		layout: {
			type: 'comboCombined',
			spacing: 45,
		},
		defaultNode: {
			style: {
				lineWidth: 1,
				fill: 'red',
			},
			labelCfg: {
				style: {
					fill: '#2f2f2f',
					fontSize: 8
				}
			}
		},
		defaultEdge: {
			size: 2,
			color: 'orange',
			style: {
				endArrow: true,
				cursor: 'pointer',
			}
		},
		edgeStateStyles: {
			active: {
				stroke: 'dodgerblue',
				lineWidth: 3
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
		console.log(e)
		const edges = graph.save().edges;
		G6.Util.processParallelEdges(edges);
		graph.getEdges().forEach((edge, i) => {
			graph.updateItem(edge, {
				curveOffset: edges[i].curveOffset,
				curvePosition: edges[i].curvePosition,
			});
		});
		if (e.edge._cfg.source._cfg.id === 'main' || e.edge._cfg.target._cfg.id === 'main') {
			e.edge._cfg.visible = false;
		}
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
			const edge = evt.item;
			// graph.setItemState(edge, 'active', true);
			graph.removeItem(edge);
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

<style scoped>
</style>