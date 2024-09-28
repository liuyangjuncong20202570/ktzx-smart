<template>
	<el-dialog v-model="editDialogVisible" title="编辑" width="550">
		<div style="padding: 0 25%; display: flex; justify-content: space-between; margin: -25px 0 15px 0">
			<el-button @click="uploadDialogVisible = true">上传</el-button>
			<el-button>关联该考核项</el-button>
		</div>
		<div style="font-weight: bolder; border: 1px solid #ebebeb; height: 30px; line-height: 30px;
			color: #969696; user-select: none;">
			课程名称：考核项名称
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

	<el-container style="height: 92vh;">
		<!--两个按钮，靠最左-->
		<el-header
			style="height: auto; padding: 5px 0; width:100%; background-color: #deebf7; display: flex; align-items: center;">
			<el-button style="margin-left: 0.8vw;" type="success" @click=""> 保存</el-button>
			<el-button type="primary" style="margin-left: 0.8vw;" @click="">上传成绩</el-button>
			<el-button type="primary" style="margin-left: 0.8vw;" @click="">下载成绩</el-button>
			<div style="width: 100%; font-weight: bold; font-size: 25px;">课程名称</div>
		</el-header>
		<el-main style="padding: 0; background-color: white;">
			<el-table :data="tableData" style="height: 85%; width: 100%;" size="large" border>
				<el-table-column align="center" prop="name" label="课程目标" width="260">
				</el-table-column>
				<el-table-column align="center" label="平时">
					<template v-if="tableColumns[0].childrens && tableColumns[0].childrens.length > 0">
						<el-table-column v-for="(child1, childIndex1) in tableColumns[0].childrens" align="center"
							:label="child1.itemName" :key="childIndex1">
							<template #header>
								<div style="display: flex; justify-content:space-evenly;">
									<div>{{ child1.itemName }}</div>
									<el-button size="small" type="primary" @click="editDialogVisible = true">
										编辑
									</el-button>
								</div>
							</template>
							<template #default="scope">
								<el-input v-if="scope.row.edit[child1.id]" style="height: 28px;"
									:ref="el => setInputRef(el, scope.row)" @blur="handleBlur(scope.row, child1.id)"
									v-model="scope.row[child1.id]"></el-input>
								<div v-else @dblclick="handleClick(scope.row, child1.id)"
									style="width: 100%; height: 28px;">{{ scope.row[child1.id] }}
								</div>
							</template>
						</el-table-column>
					</template>
				</el-table-column>
				<el-table-column align="center" label="期末" width="270">
					<template v-slot="scope">
						<el-input v-if="scope.row.edit[tableColumns[1].id]" style="height: 28px;"
							:ref="el => setInputRef(el, scope.row)" @blur="handleBlur(scope.row, tableColumns[1].id)"
							v-model="scope.row[tableColumns[1].id]"></el-input>
						<div v-else @dblclick="handleClick(scope.row, tableColumns[1].id)"
							style="width: 100%; height: 28px;">
							{{ scope.row[tableColumns[1].id] }}
						</div>
					</template>
				</el-table-column>
			</el-table>

			<el-table :data="tableAppendDataFirst" style="height: 7.5%; width: 100%;" :show-header="false" size="large"
				:row-class-name="tableRowClassName" border>
				<el-table-column align="center" prop="name" width="260"></el-table-column>
				<el-table-column align="center" prop="usualSum">
					<template v-slot="scope">
						<span v-if="scope.row.usualSum !== 100" style="color: red;">
							分数合计需为100（当前为：{{ scope.row.usualSum }}）
						</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="finalSum" width="270">
					<template v-slot="scope">
						<span v-if="scope.row.finalSum !== 100" style="color: red;">
							分数合计需为100（当前为：{{ scope.row.finalSum }}）
						</span>
					</template>
				</el-table-column>
			</el-table>

			<el-table :data="tableAppendDataSecond" style="height: 7.5%; width: 100%;" :show-header="false" size="large"
				:row-class-name="tableRowClassName" border>
				<el-table-column align="center" prop="name" width="260"></el-table-column>
				<el-table-column align="center">
					<template v-if="tableColumns[0]" v-slot="scope">
						<el-input v-if="scope.row.edit[tableColumns[0].id]" style="height: 28px;"
							:ref="el => setInputRef(el, scope.row)" @blur="handleBlur(scope.row, tableColumns[0].id, 1)"
							v-model="scope.row[tableColumns[0].id]"></el-input>
						<div v-else @dblclick="handleClick(scope.row, tableColumns[0].id)" :style="{
							color: scope.row[tableColumns[0].id] + scope.row[tableColumns[1].id] !== 100 ? 'red' :
								'black', width: '100%', height: '28px'
						}">
							{{ scope.row[tableColumns[0].id] }}
							<span v-if="scope.row[tableColumns[0].id] + scope.row[tableColumns[1].id] !== 100"
								style="color: red;">
								（总评合计不为100）
							</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column align="center" width="270" prop="finalPercent">
					<template v-if="tableColumns[1]" v-slot="scope">
						<el-input v-if="scope.row.edit[tableColumns[1].id]" style="height: 28px;"
							:ref="el => setInputRef(el, scope.row)" @blur="handleBlur(scope.row, tableColumns[1].id, 2)"
							v-model="scope.row[tableColumns[1].id]"></el-input>
						<div v-else @dblclick="handleClick(scope.row, tableColumns[1].id)" :style="{
							color: scope.row[tableColumns[0].id] + scope.row[tableColumns[1].id] !== 100 ? 'red' :
								'black', width: '100%', height: '28px'
						}">
							{{ scope.row[tableColumns[1].id] }}
							<span v-if="scope.row[tableColumns[0].id] + scope.row[tableColumns[1].id] !== 100"
								style="color: red;">
								（总评合计不为100）
							</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
	</el-container>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onScopeDispose, ref } from 'vue';
import { ElMessage, ElMessageBox, genFileId } from "element-plus";
import request from "../../utils/request";
import _ from 'lodash';
import { UploadInstance, UploadProps } from 'element-plus';
import { UploadRawFile } from 'element-plus';

//---------------------------------------------数据存储区
const courseid = '2c918af681fa6ea7018209a505c30672';
const tableColumns = ref([]);
const tableData = ref([]);

const tableAppendDataFirst = ref([{
	name: '分数合计',
	usualSum: 0,
	finalSum: 0,
}]);

const tableAppendDataSecond = ref([{
	id: '1',
	name: '总评占比',
	edit: {},
}]);

const editDialogVisible = ref(false);

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

//---------------------------------------------处理方法区
const tableRowClassName = ({ row, rowIndex }) => {
	if (rowIndex === 0) return 'warning-row'
};

//初始化分数合计
onMounted(async () => {
	await loadData();
});

const loadData = async () => {
	try {
		const res = await request.evaluation.get('/evaluation/assessmentPlan/getAssessmentTable?courseid=' + courseid);
		if (res.code === 200) {
			// console.log(res.data);
			initialize(_.cloneDeep(res.data));
		} else {
			ElMessage.error(res.msg);
		}
	} catch (error) {
		ElMessage.error('获取失败' + error);
	}
}

const initialize = (data) => {
	tableColumns.value = data.head;
	tableData.value = data.items;

	tableAppendDataFirst.value[0].usualSum = calcUsual();	// 计算平时项内所有考核项项的分数合计
	tableAppendDataFirst.value[0].finalSum = calcFinal();	// 计算期末项内所有项的分数合计
	// 以平时和期末项的id为键，存储它俩的总评占比
	tableAppendDataSecond.value[0][tableColumns.value[0].id] = data.percent[tableColumns.value[0].id];
	tableAppendDataSecond.value[0][tableColumns.value[1].id] = data.percent[tableColumns.value[1].id];
	// 是否允许编辑平时和期末的总评占比
	tableAppendDataSecond.value[0].edit[tableColumns.value[0].id] = false;
	tableAppendDataSecond.value[0].edit[tableColumns.value[1].id] = false;

	// 存储平时项内所有考核项的id，用于对每一项设置是否可以编辑的键值
	let usualLeafIds = collectLeafIds(tableColumns.value[0].childrens);

	tableData.value.forEach((item) => {		// 以每个课程目标为主体，设置其对应考核项是否可编辑
		item.edit = {};
		for (let id of usualLeafIds) {
			item.edit[id] = false;		// 设置每一个平时项内的考核项是否可以编辑
		}
		item.edit[tableColumns.value[1].id] = false;	// 设置期末项是否可以编辑
	});

	// console.log(tableColumns.value);
};

const calcUsual = () => {		// 计算平时的所有项的分值
	const usualChildItemIds = tableColumns.value[0].childrens.map(child => child.id);	// 存储平时项的所有叶子节点的id，用于计算平时所有项的总分
	let sum = 0;
	tableData.value.forEach(item => {
		for (let id of usualChildItemIds) {
			if (item[id]) sum += item[id];
		}
	})
	return sum;
};

const calcFinal = () => {		// 计算期末所有项的分值
	const finalId = tableColumns.value[1].id;
	let sum = 0;
	tableData.value.forEach(item => {
		if (item[finalId]) sum += item[finalId];
	})
	return sum;
};

const collectLeafIds = (array, result = []) => {
	array.forEach((item) => {
		if (!item.childrens || item.childrens.length === 0) {
			result.push(item.id);
		}
		else {
			collectLeafIds(item.childrens, result);
		}
	});
	return result;
};


//---------------------------------------------双击修改
const inputsRefs = ref({});
const tempScore = ref('');

const setInputRef = (el, row) => {
	if (el) {
		inputsRefs.value[row.id] = el;
	}
};

const handleClick = (row, field) => {
	// console.log(tableAppendDataSecond.value[0]);
	nextTick(() => {
		row.edit[field] = true;
		tempScore.value = row[field];
		setTimeout(() => {
			if (inputsRefs.value[row.id] && inputsRefs.value[row.id].$refs.input) {
				inputsRefs.value[row.id].$refs.input.focus();
			}
		}, 0);
	});
};

const handleBlur = (row, field, type = 0) => {		// 0-提交的信息来自于每个考核项，1-来自于总评占比的平时项，2-来自于总评占比的期末项
	nextTick(async () => {
		row.edit[field] = false;
		if (row[field] !== tempScore.value) {
			if (!row[field]) row[field] = 0;
			let postData;
			if (type === 0) {
				postData = {
					courseid,
					coursetargetId: row.id,
					checkitemId: field,
					standardScore: row[field]
				};
			} else {
				postData = {
					id: type === 1 ? tableColumns.value[0].id : tableColumns.value[1].id,
					percent: row[field],
				};
			}

			try {
				const res = !type ? await request.evaluation.post(`/evaluation/assessmentPlan/updateStandardScore`, postData) :
					await request.evaluation.post(`/evaluation/assessmentPlan/updatePercent`, postData);
				// console.log(res);
				if (res.code === 200) {
					await loadData()
					ElMessage.success('修改成功');
				} else {
					ElMessage.error(res.msg);
				}
			} catch (error) {
				ElMessage.error('修改失败' + error);
			}
		}
	});
};

</script>

<style scoped>

.el-table>>>.warning-row {
	background-color: #f4faff;
}

</style>