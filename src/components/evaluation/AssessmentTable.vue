<!-- 使用vxe-table组件开发 -->
<template>
	<el-header style="height: 40px; padding: 5px 0px; width: 100%; text-align: left; background-color: #deebf7;">
		<el-button type="success" @click="save()" style="margin-left: 0.8vw;">保存</el-button>
	</el-header>
	<div id="container" style="height: calc(92vh - 130px); width: 100%;">
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
		<el-table-column width="270" show-overflow-tooltip align="center">
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
		<el-table-column show-overflow-tooltip width="270" align="center">
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

const usualLeafIds = ref();		// 存储平时项
const finalLeafIds = ref();

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

// 用于渲染表格的数据
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

const info = ref();		// 存储后端传来的的数据

const getData = (async () => {
	try {
		const res = await request.evaluation.get(`/evaluation/assessmentPlan/getAssessmentTable`);
		if (res.code === 200) {
			info.value = res.data;
			// console.log(info.value);
			initialize(info.value);
		} else {
			ElMessage.error(res.msg);
		}
	} catch (error) {
		ElMessage.error('获取考核方案失败', error);
	}
})

const initialize = ((info) => {
	usualLeafIds.value = getLeafIds(info.head[0]);		// 获取平时项的所有考核项id
	finalLeafIds.value = getLeafIds(info.head[1]);		// 获取期末项的所有考核项id

	creatHeader(info.head, 0);    // 创建表头

	info.items.forEach((item) => {      // 处理数据单元格
		item.target = item.name;		// 这里新加target是为了对应表格的课程目标列以显示数据，那列的field键值为'target'
	})
	gridOptions.value.data = info.items;


	footer1Data.value[0].usualSum = calcSumScore(info.items, usualLeafIds.value);		// 计算平时项的所有考核项的总分
	footer1Data.value[0].finalSum = calcSumScore(info.items, finalLeafIds.value);		// 计算期末项的所有考核项的总分

	footer2Data.value[0].usualId = info.head[0].id;
	footer2Data.value[0].finalId = info.head[1].id;
	footer2Data.value[0][info.head[0].id] = Number(info.percent[info.head[0].id]);
	footer2Data.value[0][info.head[1].id] = Number(info.percent[info.head[1].id]);
	footer2Data.value[0].edit[info.head[0].id] = false;
	footer2Data.value[0].edit[info.head[1].id] = false;
});


const creatHeader = (head, floor = 0) => {
	head.forEach((node, idx) => {
		node.title = node.itemName;
		node.field = node.id;
		if (node.children && node.children.length > 0) creatHeader(node.children, floor + 1);
		else {
			node.editRender = { name: 'input' };	// 多级表头的子节点对应的单元格可编辑
			// 期末项宽度为251
			if (finalLeafIds.value.includes(node.id)) node.width = (251 / (finalLeafIds.value.length)).toFixed(0);
		}
	})
	if (!floor) {
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
const postData = ref({});		// 存储批量传到后端的数据

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
	row[column.field] = row[column.field] ? Number(row[column.field]) : 0;	// 清空数值则设为0
	let num = row[column.field];
	if (Number.isNaN(num)) {			// 判断输入的是不是数字
		row[column.field] = oldData.value;
		return;
	}
	if (row[column.field] !== oldData.value) {		// 当数据变化时再执行
		if (!postData.value.items) postData.value.items = {};		// 初始化post的数据
		row[column.field] = Number(Number(row[column.field]).toFixed(0));		// 若输入小数则四舍五入为整数
		if (num < 0) {			// 若输入负数则撤销本次操作
			row[column.field] = oldData.value;
			return;
		}

		if(!postData.value.items) postData.value.items = {};
		if(!postData.value.items[row.id]) postData.value.items[row.id] = {}; 		// 以课程目标的id为键存储其内部所有考核项
		postData.value.items[row.id][column.field] = row[column.field];				// 以考核项的id为键存储其分数
		// 每次改变考核项的分数重新计算
		footer1Data.value[0].usualSum = calcSumScore(gridOptions.value.data, usualLeafIds.value);
		footer1Data.value[0].finalSum = calcSumScore(gridOptions.value.data, finalLeafIds.value);
	}

};

const tableRowClassName = ({ row, rowIndex }) => {
	return 'footer-row'
}

const save = async () => {
	if (Object.keys(postData.value).length === 0) return;		// 未改变任何值则不执行
	if (footer1Data.value[0].usualSum !== 100 || footer1Data.value[0].finalSum !== 100 ||
		footer2Data.value[0][footer2Data.value[0].usualId] + footer2Data.value[0][footer2Data.value[0].finalId] !== 100) {
		ElMessage.error('数据不合法，无法保存');
		return;
	}
	// 数据合理再传给后端
	try {
		const res = await request.evaluation.post(`/evaluation/assessmentPlan/updateAssessmentTable`, postData.value);
		if (res.code === 200) {
			ElMessage.success('修改成功');
			await getData();
		} else {
			ElMessage.error(res.msg);
		}
	} catch (error) {
		ElMessage.error('修改失败' + error);
	}
};

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
			row[field] = Number(Number(row[field]).toFixed(0));
			if (row[field] === '') row[field] = 0;

			if(!postData.value.percent) postData.value.percent = {};
			postData.value.percent[field] = row[field];			// 以id为键存储其总评占比
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