<template>
	<div v-if="!nodes.length && !edges.length && !combos.length" style="display: flex; justify-content: center; 
		align-items: center; height: 92vh; background-color: white;" v-loading="loading">
		<el-empty description="No Data" />
	</div>
	<div v-else class="container" id="container" 
		style="height: 92vh; width: 100%; background-color: #fdfdfd; position: relative;"></div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import request from '../../utils/request';
import _ from 'lodash';

const courseid = ref('2c918af681fa6ea7018209a505c30672');

const loading = ref(true);

const nodes = ref([]);
const edges = ref([]);
const combos = ref([]);

const promise = ref([]);

/* 由于组件渲染需要用到特定格式的id故存一下与原id的映射，同时也是为了更改数据时不去刷新页面，因为id是后端生成的，
获取更新的数据后刷新页面又会导致缩放重置，故采用只更新数据，而不重绘页面的方式，这样前端可以获得自己可控的id并映
射到后端的id上，达到同样效果 */
let nodesMap = new Map();
let combosMap = new Map();
let edgesMap = new Map();

let nodesId = 0;
let combosId = 0;
let edgesId = 0;

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

const open1 = () => {
	ElNotification({
		title: '按住shift点击节点以创建边，按住ctrl点击边即可删除',
		duration: 5000,
	})
}

const getData = () => {
	let nodesCombosPromise = request.evaluation.get(`/evaluation/knowledgeUnit/getKnowledgeUnitTree?courseid=${courseid.value}`).then((res) => {
		if (res.code === 200) {
			let data = res.data;
			// console.log(res.data);
			getNodesCombosProp(data);

			return request.evaluation.get(`/evaluation/lines`).then((res) => {
				if (res.code === 200) {
					// console.log(res.data);
					// console.log(nodesMap);
					res.data.forEach((edge) => {
						edges.value.push({
							id: 'edge' + edgesId++,
							edgeid: edge.id,
							source: nodesMap.get(JSON.stringify([edge.startunitid, edge.startkwaid])),
							startkwaid: edge.startkwaid,
							sourceunitid: edge.startunitid,
							target: nodesMap.get(JSON.stringify([edge.endunitid, edge.endkwaid])),
							endkwaid: edge.endkwaid,
							targetunitid: edge.endunitid,
							reamrk: edge.remark,
							courseid: edge.courseid
						});
						// console.log([edge.startunitid, edge.startkwaid]);
						// console.log(nodesMap);
						edgesMap.set(edge.id, edges.value[edges.value.length - 1].id);
					})
					// console.log(edges.value);
				}
				else {
					ElMessage.error(res.msg);
				}
			}).catch((error) => {
				ElMessage.error('获取边信息失败' + error);
			})
		}
		else {
			ElMessage.error(res.msg);
		}
	}).catch((error) => {
		ElMessage.error('获取节点和combo失败' + error);
	})
	promise.value.push(nodesCombosPromise);
}

const getNodesCombosProp = (data, parent = null) => {
	data.forEach((item) => {
		combos.value.push({
			id: 'combo' + combosId++,
			comboid: item.id,
			label: item.name,
		});
		combosMap.set(item.id, combos.value[combos.value.length - 1].id);
		// combosMap.set(combos.value[combos.value.length - 1].id, item.id);
		if (parent) combos.value[combos.value.length - 1].parentId = parent.id;

		if (parent) {
			item.kwas.forEach((node) => {
				// console.log(node)
				nodes.value.push({
					id: 'n' + String(nodesId++),	// id前面拼不同的字符会导致布局改变，我也不知道为什么
					unitid: node.unitid,
					kwaid: node.kwaid,
					label: fittingString(node.name, 80, 12),
					comboId: combosMap.get(item.id),
					status: node.status
				});
				nodesMap.set(JSON.stringify([node.unitid, node.kwaid]), nodes.value[nodes.value.length - 1].id);
			});
		}

		if (item.children && item.children.length > 0) {
			getNodesCombosProp(item.children, combos.value[combos.value.length - 1]);
		}
	})
}

onMounted(() => {

	getData();

	Promise.all(promise.value).then(() => {
		loading.value = false;
		if (!nodes.value.length && !edges.value.length && !combos.value.length) return;
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
				// console.log(item);
				let postData = {
					unitid: item._cfg.model.unitid,
					kwaid: item._cfg.model.kwaid,
					status: 0
				};
				if (target.innerHTML === '达成') {
					item._cfg.model.status = 1;
					graph.setItemState(item, 'status1', true);
					postData.status = 1;
				}
				else if (target.innerHTML === '未达成') {
					item._cfg.model.status = 0;
					graph.setItemState(item, 'status1', false);
					graph.setItemState(item, 'status0', true);
					postData.status = 0;
				}
				// console.log(postData);

				request.evaluation.post('/evaluation/knowledgeUnit/updateKnowledgeUnitKwa', postData).then((res) => {
					if (res.code === 200) {

					}
					else {
						ElMessage.error(res.msg);
					}
				}).catch((error) => {
					ElMessage.error('更新状态失败' + error);
				})
			},
			// 需要加上父级容器的 padding-left 16 与自身偏移量 10
			offsetX: -290,
			// 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
			offsetY: -50,
			// 在哪些类型的元素上响应
			itemTypes: ['node'],
		});

		let data = {
			nodes: _.cloneDeep(nodes.value),
			edges: _.cloneDeep(edges.value),
			combos: _.cloneDeep(combos.value),
		};

		// console.log(data.edges);
		data.nodes.forEach((node) => {		// 根据节点status设置颜色，1为绿，0为红
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
			tx += 250;
		})

		const container = document.getElementById('container');
		const width = container.scrollWidth;
		const height = (container.scrollHeight || 500) - 10;
		const graph = new G6.Graph({
			container: 'container',
			width,
			height,
			animate: true,
			minZoom: 0.2,
			// maxZoom: 1.3,
			fitView: true,	// 自适应画布
			fitViewPadding: 60,		// 自适应画布后内四周的内边距
			linkCenter: true,	// 让箭头居中
			plugins: [contextMenu],
			layout: {
				type: 'comboCombined',
				spacing: 60,
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
						fontSize: 12
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
				size: [60, 60],
				labelCfg: {
					style: {
						fontSize: 20,
					}
				},
				style: {
					fill: '#fffff2'
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
				default: ['drag-combo', 'drag-canvas', 'zoom-canvas', 'collapse-expand-combo',
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
			setTimeout(() => {
				// console.log(e);
				let newEdge = {
					id: '',
					startkwaid: e.edge._cfg.sourceNode._cfg.model.kwaid,
					startunitid: e.edge._cfg.sourceNode._cfg.model.unitid,
					endkwaid: e.edge._cfg.targetNode._cfg.model.kwaid,
					endunitid: e.edge._cfg.targetNode._cfg.model.unitid,
					remark: '',
					courseid: courseid.value,
				};
				// console.log('source:',e.edge._cfg.source._cfg.model.kwaid,e.edge._cfg.source._cfg.model.label);
				// console.log('target', e.edge._cfg.target._cfg.model.kwaid, e.edge._cfg.target._cfg.model.label)
				// console.log(newEdge);

				request.evaluation.post('/evaluation/lines/create', newEdge).then((res) => {
					if (res.code === 200) {
						return request.evaluation.get(`/evaluation/lines`).then((res) => {
							if (res.code === 200) {
								let newEdge = res.data.filter(resEdge => {
									return !data.edges.find(localEdge => localEdge.edgeid === resEdge.id);
								});
								// console.log(newEdge[0].id);
								edgesMap.set(newEdge[0].id, 'edge' + edgesId++);
								const edges = graph.save().edges;
								edges[edges.length - 1].edgeid = newEdge[0].id;
								// console.log(graph.save().edges);
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
							ElMessage.error('获取边信息失败' + error);
						})
					}
					else {
						ElMessage.error(res.msg);
					}
				}).catch((error) => {
					ElMessage.error('创建边失败' + error);
				});
			}, 600);
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
			// console.log(evt.item._cfg.model.edgeid);
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
					const deletedEdgeId = [edge._cfg.model.edgeid];
					request.evaluation.post('/evaluation/lines/delete', deletedEdgeId).then((res) => {
						if (res.code === 200) {
							graph.removeItem(edge);
							// console.log(edgesMap.get(deletedEdgeId[0]))
							edgesMap.delete(deletedEdgeId[0]);
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
	})

	/*******************************************/
});

</script>

<style scoped></style>