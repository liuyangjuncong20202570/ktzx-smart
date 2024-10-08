<!-- 使用vxe-table组件开发 -->
<template>
	<div id="container" style="height: calc(92vh - 90px); overflow: auto; width: 100%;">
		<vxe-grid v-bind="gridOptions" v-on="gridEvents" :edit-config="gridOptions.editConfig"
			@edit-closed="handleEditClosed"></vxe-grid>
	</div>

	<el-table :data="footer1Data" :show-header="false" :row-class-name="tableRowClassName" border>
		<el-table-column prop="name" width="240" align="center"></el-table-column>
		<el-table-column show-overflow-tooltip align="center">
			<template v-slot="scope">
				<div v-if="scope.row.usualSum !== 100" style="color: red; height: 28px;">
					合计需为100（当前为：{{ scope.row.usualSum }}）
				</div>
				<div v-else style="height: 28px; color: black;">{{ scope.row.usualSum }}</div>
			</template>
		</el-table-column>
		<el-table-column width="148" show-overflow-tooltip align="center">
			<template v-slot="scope">
				<div v-if="scope.row.finalSum !== 100" style="color: red;">
					合计需为100（当前为：{{ scope.row.finalSum }}）
				</div>
				<div v-else style="height: 28px; color: black;">{{ scope.row.finalSum }}</div>
			</template>
		</el-table-column>
	</el-table>

	<el-table :data="footer2Data" :show-header="false" :row-class-name="tableRowClassName" border>
		<el-table-column prop="name" width="240" align="center"></el-table-column>
		<el-table-column show-overflow-tooltip align="center">
			<template v-slot="scope">
				<el-input v-if="scope.row.edit[scope.row.usualId]" style="height: 28px;"
					:ref="el => setInputRef(el, scope.row.usualId)" @blur="handleBlur(scope.row, scope.row.usualId)"
					v-model="scope.row[scope.row.usualId]"></el-input>
				<div v-else @dblclick="handleClick(scope.row, scope.row.usualId)" :style="{
					color: scope.row[scope.row.usualId] + scope.row[scope.row.finalId] !== 100 ? 'red' :
						'black', width: '100%', height: '28px'
				}">
					{{ scope.row[scope.row.usualId] }}
					<span v-if="scope.row[scope.row.usualId] + scope.row[scope.row.finalId] !== 100"
						style="color: red;">
						（总评合计不为100）
					</span>
				</div>
			</template>
		</el-table-column>
		<el-table-column show-overflow-tooltip width="148" align="center">
			<template v-slot="scope">
				<el-input v-if="scope.row.edit[scope.row.finalId]" style="height: 28px;"
					:ref="el => setInputRef(el, scope.row.finalId)" @blur="handleBlur(scope.row, scope.row.finalId)"
					v-model="scope.row[scope.row.finalId]"></el-input>
				<div v-else @dblclick="handleClick(scope.row, scope.row.finalId)" :style="{
					color: scope.row[scope.row.usualId] + scope.row[scope.row.finalId] !== 100 ? 'red' :
						'black', width: '100%', height: '28px'
				}">
					{{ scope.row[scope.row.finalId] }}
					<!-- <span v-if="scope.row[scope.row.usualId] + scope.row[scope.row.finalId] !== 100" style="color: red;">
							（总评合计不为100）
						</span> -->
				</div>
			</template>
		</el-table-column>
	</el-table>

	<el-dialog v-model="editDialogVisible" title="编辑" width="550">
		<div style="padding: 0 25%; display: flex; justify-content: space-between; margin: -25px 0 15px 0">
			<el-button @click="uploadDialogVisible = true">上传</el-button>
			<el-button>关联该考核项</el-button>
		</div>
		<div style="font-weight: bolder; border: 1px solid #ebebeb; height: 30px; line-height: 30px;
			color: #969696; user-select: none;">
			考核项：{{ rightClickItem.title }}
		</div>
		<el-table :data="hwkTableData" style="height: 350px;" v-model="hwkTableSelected" @select="hwkHandleSelect"
			@select-all="hwkHandleSelectAll" border>
			<el-table-column align="center" type="selection" width="40"></el-table-column>
			<el-table-column align="center" label="名称" prop="name"></el-table-column>
			<el-table-column align="center" label="上传时间" width="200" prop="time"></el-table-column>
			<el-table-column align="center" label="操作" width="150">
				<div style="display: flex; justify-content: space-between; padding: 0 10px;">
					<el-button type="primary" size="small">预览</el-button>
					<el-button type="danger" size="small">删除</el-button>
				</div>
			</el-table-column>
		</el-table>
	</el-dialog>
	<el-dialog v-model="uploadDialogVisible" title="上传" width="550">
		<el-upload ref="upload" class="upload-demo"
			action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :limit="1" :on-exceed="handleExceed"
			:auto-upload="false" accept=".xls,.xlsx">
			<template #trigger>
				<el-button type="primary">选择文件</el-button>
			</template>
		</el-upload>
		<el-button>确定</el-button>
	</el-dialog>

</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import request from '../../utils/request';
import { ElMessage, genFileId } from 'element-plus';
import _ from 'lodash';
import { UploadInstance } from 'element-plus';
import { UploadProps } from 'element-plus';
import { UploadRawFile } from 'element-plus';

const container = ref();

const courseid = '2c918af681fa6ea7018209a505c30672';

const footer1Data = ref([
	{
		name: '分数合计',
		usualSum: 0,
		finalSum: 0
	}
])

const footer2Data = ref([
	{
		name: '总评占比',
		edit: {},
	}
])

const rightClickItem = ref();		// 存储被右键的考核项
const gridOptions = ref({
	size: 'mini',
	border: true,
	height: 500,	// 表格默认高度，在钩子函数中会修改
	align: 'center',
	showOverflow: true,
	showHeaderOverflow: true,
	editConfig: {
		trigger: 'dblclick',
		mode: 'cell',
	},
	columnConfig: {
		resizable: true
	},
	menuConfig: {
		header: {
			options: [
				[
					{ code: 'edit', name: '编辑', suffixConfig: { icon: 'vxe-icon-edit' } },
				]
			]
		},
		visibleMethod({ options, column }) {
			rightClickItem.value = column;
			let isDisabled = true;		// 菜单项是否可点击
			let isVisible = false;		// 菜单项是否可见
			if (usualLeafIds.value.includes(column.field) || finalLeafIds.value.includes(column.field)) {
				isDisabled = false;
				isVisible = true;
			}
			options.forEach(list => {
				list.forEach(item => {
					if (item.code === 'edit') {
						item.visible = isVisible;
					}
				});
			})
			return true;
		}
	},
	columns: [],
	data: []
})

onMounted(async () => {
	container.value = document.getElementById('container');
	gridOptions.value.height = container.value.clientHeight;

	await getData();
})

const info = ref();

const getData = (async () => {
	try {
		const res = await request.evaluation.get(`/evaluation/assessmentPlan/getAssessmentTable?courseid=${courseid}`);
		if (res.code === 200) {
			info.value = res.data;
			console.log(info.value);
			initialize(info.value);
		} else {
			ElMessage.error(res.msg);
		}
	} catch (error) {
		ElMessage.error('获取考核方案失败', error);
	}
})

const usualLeafIds = ref();
const finalLeafIds = ref();

const initialize = ((info) => {
	usualLeafIds.value = getLeafIds(info.head[0]);		// 获取平时项的所有考核项id
	finalLeafIds.value = getLeafIds(info.head[1]);		// 获取期末项的所有考核项id

	creatHeader(info.head, 0, usualLeafIds.value.length);    // 创建表头

	info.items.forEach((item) => {      // 处理数据单元格
		item.target = item.name;		// 这里新加target是为了对应表格的课程目标列以显示数据，那列的field键值为'target'
	})
	gridOptions.value.data = info.items;


	footer1Data.value[0].usualSum = calcSumScore(info.items, usualLeafIds.value);		// 计算平时项的所有考核项的总分
	footer1Data.value[0].finalSum = calcSumScore(info.items, finalLeafIds.value);		// 计算期末项的所有考核项的总分

	footer2Data.value[0].usualId = info.head[0].id;
	footer2Data.value[0].finalId = info.head[1].id;
	footer2Data.value[0][info.head[0].id] = info.percent[info.head[0].id];
	footer2Data.value[0][info.head[1].id] = info.percent[info.head[1].id];
	footer2Data.value[0].edit[info.head[0].id] = false;
	footer2Data.value[0].edit[info.head[1].id] = false;
});


const creatHeader = (head, floor = 0, leafNodeNum) => {
	head.forEach((node, idx) => {
		node.title = node.itemName;
		node.field = node.id;
		if (node.children && node.children.length > 0) creatHeader(node.children, floor + 1, leafNodeNum);
		else {
			node.editRender = { name: 'input' };
			if (finalLeafIds.value.includes(node.id)) node.width = 130 / (finalLeafIds.value.length);
			// node.titlePrefix = { content: '自定义前缀图标', icon: 'vxe-icon-question-circle-fill' };
			// node.width = ((container.value.clientWidth - (240 + 130 + )) / (leafNodeNum)).toFixed(1);	// 舍去小数点用于表格单元宽度去抖
			// for (let i = 0; i < 2; i++) {
			// 	node.children.push({
			// 		field: 'target',
			// 		title: '课程目标',
			// 		width: 240,
			// 		editRender: {
			// 			name: 'input'
			// 		},
			// 		children: [
			// 			{
			// 				field: 'target',
			// 				title: '课程目标',
			// 				width: 240,
			// 				editRender: {
			// 					name: 'input'
			// 				},
			// 				width: (container.value.clientWidth - (240 + 130 + 15)) / 8
			// 			},
			// 			{
			// 				field: 'target',
			// 				title: '课程目标',
			// 				width: 240,
			// 				editRender: {
			// 					name: 'input'
			// 				},
			// 				width: (container.value.clientWidth - (240 + 130 + 15)) / 8
			// 			},
			// 		]
			// 	})
			// }
		}
	})
	if (!floor) {
		head[head.length - 1].width = 130;		// 设置期末列的宽度
		gridOptions.value.columns = [{
			field: 'target',
			title: '课程目标',
			width: 240,
			editRender: {
				name: 'input'
			}
		}];
		gridOptions.value.columns = gridOptions.value.columns.concat(head);
	}


};

const getLeafIds = (node, result = []) => {
	if (node.children && node.children.length > 0) {
		node.children.forEach(child => { getLeafIds(child, result); })
	} else {
		result.push(node.id);
	}
	return result;
};

const calcSumScore = (array, ids) => {
	let sum = 0;
	array.forEach((item) => {
		ids.forEach((id) => {
			if (item[id]) sum += Number(item[id]);
		})
	})
	return sum;
}

/**********************表格数据单元双击编辑*********************/
const oldData = ref();

const gridEvents = {
	cellDblclick({ row, column }) {
		oldData.value = row[column.field];
	},
	menuClick({ menu }) {
		if (menu.code === 'edit') {
			editDialogVisible.value = true;
		}
	}
}

const handleEditClosed = async ({ row, column }) => {
	let num = Number(row[column.field] ? row[column.field] : 0);
	if (Number.isNaN(num)) {
		row[column.field] = oldData.value;
		return;
	}
	if (row[column.field] !== oldData.value) {		// 当数据变化时再执行
		if (num < 0) {
			row[column.field] = oldData.value;
			return;
		}
		footer1Data.value[0].usualSum = calcSumScore(gridOptions.value.data, usualLeafIds.value);
		footer1Data.value[0].finalSum = calcSumScore(gridOptions.value.data, finalLeafIds.value);
		if ((usualLeafIds.value.includes(column.field) && footer1Data.value[0].usualSum !== 100) ||
			(finalLeafIds.value.includes(column.field) && footer1Data.value[0].finalSum !== 100)) {
			ElMessage.warning('分数合计不为100, 无法保存');
		}

		const postData = {
			courseid,
			coursetargetId: row.id,
			checkitemId: column.field,
			standardScore: Number(row[column.field]).toFixed(0),
		};

		try {
			const res = await request.evaluation.post('/evaluation/assessmentPlan/updateStandardScore', postData);
			if (res.code === 200) {
				ElMessage.success('修改成功');
				await getData();
			} else {
				ElMessage.error(res.msg);
			}
		} catch (error) {
			ElMessage.error('修改失败' + error);
		}
	}

};

const tableRowClassName = ({ row, rowIndex }) => {
	return 'footer-row'
}

/**********************双击修改总评占比栏**********************/
const inputsRefs = ref({});
const oldPercent = ref('');

const setInputRef = (el, id) => {
	if (el) {
		inputsRefs.value[id] = el;
	}
};

const handleClick = (row, field) => {
	nextTick(() => {
		row.edit[field] = true;
		oldPercent.value = row[field];
		setTimeout(() => {
			if (inputsRefs.value[field] && inputsRefs.value[field].$refs.input) {
				inputsRefs.value[field].$refs.input.focus();
			}
		}, 0);
	});
};

const handleBlur = (row, field) => {
	nextTick(async () => {
		row.edit[field] = false;
		if (row[field] !== oldPercent.value) {
			if (row[field] === '') row[field] = 0;
			const postData = {
				id: field,
				percent: row[field],
			};
			try {
				const res = await request.evaluation.post('/evaluation/assessmentPlan/updatePercent', postData);
				if (res.code === 200) {
					ElMessage.success('修改成功');
					await getData();
				} else {
					ElMessage.error(res.msg);
				}
			} catch (error) {
				ElMessage.error('修改失败' + error);
			}
		}
	});
};

/*************************编辑弹窗*************************/
const editDialogVisible = ref(false);
//---------------------------------------------作业实验表格相关
const hwkTableData = ref([
	{
		name: '作业1',
		time: '2024-09-14 21:44:20',
	},
	{
		name: '作业2',
		time: '2024-09-14 21:45:12',
	},
	{
		name: '作业3',
		time: '2024-09-14 22:23:01',
	},
]);

const hwkTableSelected = ref([]);
/*判定哪些行被选中*/
const hwkHandleSelect = (selection) => {
	hwkTableSelected.value = selection;
};

const hwkHandleSelectAll = (selection) => {
	hwkTableSelected.value = selection;
};

//---------------------------------------------上传
const uploadDialogVisible = ref(false);

// upload使用ref定义的类型为UploadInstance的变量，代表el-upload组件的实例。可通过upload.value访问el-upload的实例方法和属性。
const upload = ref<UploadInstance>()
// 这是处理文件超过限制的事件钩子，类型为 UploadProps['onExceed']，即它是 el-upload 的 onExceed 事件处理函数。files 是用户在操作时尝试上传的文件列表。
const handleExceed: UploadProps['onExceed'] = (files) => {
	upload.value!.clearFiles()
	// 从传入的 files 数组中取第一个文件，这个文件即是用户新选择的文件，并将其类型强制转换为 UploadRawFile 类型（即原始的文件对象）。
	const file = files[0] as UploadRawFile
	// 给新选的文件生成一个唯一标识符 uid。Element Plus 内部依赖 uid 来区分不同的文件。如果这个文件对象没有 uid，上传时可能会出错。
	file.uid = genFileId()
	// 最后调用 handleStart(file) 方法，将这个文件手动加入到 el-upload 的上传队列中。handleStart() 是 el-upload 组件内部的方法。
	upload.value!.handleStart(file)
}

</script>

<style scoped>
.el-table>>>.footer-row {
	background-color: #fafafa;
}
</style>