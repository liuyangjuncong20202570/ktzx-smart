<template>
	<el-container style="height: 92vh;">
		<el-header style="height: auto; padding: 5px 0px; width:100%; text-align: left; background-color:#deebf7;">
			<el-button type="success" style="margin-left: 0.8vw;" @click="addCourseTarget">新增</el-button>
			<!-- <el-button type="primary" @click="openDictionary">从关键字字典选择</el-button> -->
			<el-button type="danger" @click="openDeleteDialog">删除</el-button>
			<el-button type="primary">保存</el-button>
			<el-input v-model="tableSearchData" style="margin-left: 0.8vw; width: 250px" placeholder="查找关键字">
				<template #append><el-button :icon="Search" /></template>
			</el-input>
		</el-header>
		<el-main style="padding: 0;">

			<!----------------------------------确认删除的弹框-------------------------------------->
			<el-dialog v-model="deleteDialogVisible" :showClose="false" width="450" :close-on-click-modal="false"
				destroy-on-close>
				<template #header="{ titleId, titleClass }">
					<div style="text-align: left; margin-bottom: -15px;">
						<div :id="titleId" :class="titleClass" style="font-size: 15px;">
							<el-button link type="warning">
								<el-icon size="20" style="padding-bottom: 3px; box-sizing: border-box;">
									<WarningFilled />
								</el-icon>
							</el-button>
							是否要删除选中的课程目标
						</div>
					</div>
				</template>
				<template #footer>
					<div class="dialog-footer">
						<el-button @click="deleteDialogVisible = false">取消</el-button>
						<el-button type="primary" @click="deleteData()">
							确认
						</el-button>
					</div>
				</template>
			</el-dialog>
			<!-------------------------------------------------------------------------------------->

			<el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="name" label="考核项" width="350">
					<template #default="tableRowData">
						<span v-if="!editNameRef[tableRowData.row.id]"
							@dblclick="editEditRef(tableRowData.row, 'name')">{{ tableRowData.row.name }}</span>
						<el-input ref="inputName" v-else v-model="tableRowData.row.name"
							@blur="saveEditRef(tableRowData.row, 'name')"
							@keyup.enter="saveEditRef(tableRowData.row, 'name')"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注">
					<template #default="tableRowData">
						<span v-if="!editRemarkRef[tableRowData.row.id]"
							@dblclick="editEditRef(tableRowData.row, 'remark')">{{ tableRowData.row.remark }}</span>
						<el-input ref="inputRemark" v-else v-model="tableRowData.row.remark"
							@blur="saveEditRef(tableRowData.row, 'remark')"
							@keyup.enter="saveEditRef(tableRowData.row, 'remark')"></el-input>
					</template>
				</el-table-column>
				<!--        prop="selection"-->
				<el-table-column prop="task" label="考核任务" width="150">
					<template #default="tableDataRow">
						<el-switch v-model="tableDataRow.row.switch" />
					</template>
				</el-table-column>
			</el-table>
			<!--          <p>{{ filteredTableData }}</p>-->
		</el-main>
	</el-container>
</template>

<script setup>
import { Search, WarningFilled } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import request from "../../utils/request";

//---------------------------------------------数据存储区
const courseId = '2c918af681fa6ea7018209a505c30672';
const tableData = ref(null);
const editNameRef = ref([]);
const editRemarkRef = ref([]);
const inputName = ref(null);
const inputRemark = ref(null);
const deleteDialogVisible = ref(false);
var multipleSelection = [];

//---------------------------------------------处理方法区
//选择知识目标
const handleSelectionChange = (val) => {
	multipleSelection = val;
}

//初始化分数合计
onMounted(() => {
	loadData();
});

const loadData = () => {
	request.evaluation.get('/evaluation/checkitem?courseid=' + courseId).then((res) => {
		if (res.code === 200) {
			tableData.value = res.data;
			console.log(res.data);
			initialize();
		} else {
			ElMessage.error(res.msg);
		}
	}).catch((error) => {
		ElMessage.error('获取失败' + error);
	})
}

const initialize = () => {
	for (let i = tableData.value.length - 1; i >= 0; i--) {
		// ElMessage.success(tableData.value[i].pid);
		// ElMessage.success(tableData.value[i].checkitemdeep);
		// if(tableData.value)

	}
}

//双击修改
const editEditRef = (row, field) => {
	if (field === 'name') {
		editNameRef.value[row.id] = true;
		setTimeout(() => {
			inputName.value.focus();
		}, 0);
	} else if (field === 'remark') {
		editRemarkRef.value[row.id] = true;
		setTimeout(() => {
			inputRemark.value.focus();
		}, 0);
	}
};

//保存
const saveEditRef = (row, field) => {
	if (field === 'name') {
		editNameRef.value[row.id] = false;
	} else if (field === 'remark') {
		editRemarkRef.value[row.id] = false;
	}
	request.evaluation.post('/evaluation/coursetarget', row).then((res) => {
		if (res.code === 200) {
			loadData();
		} else {
			ElMessage.error(res.msg);
		}
	}).catch((error) => {
		ElMessage.error('修改失败' + error);
	});
};

const addCourseTarget = () => {
	request.evaluation.post('/evaluation/coursetarget/create', ids).then((res) => {
		if (res.code === 200) {
			loadData();
			ElMessage.error('删除成功' + error);
		} else {
			ElMessage.error(res.msg);
		}
	}).catch((error) => {
		ElMessage.error('删除失败' + error);
	});
}

//删除
const openDeleteDialog = () => {
	if (multipleSelection.length === 0) {
		ElMessage.success("未选择课程目标");
		return;
	}
	deleteDialogVisible.value = true;
}

const deleteData = () => {
	var ids = [];
	for (const sel of multipleSelection) {
		ids.push(sel.id);
	}
	request.evaluation.post('/evaluation/coursetarget/delete', ids).then((res) => {
		if (res.code === 200) {
			loadData();
			ElMessage.error('删除成功' + error);
		} else {
			ElMessage.error(res.msg);
		}
	}).catch((error) => {
		ElMessage.error('删除失败' + error);
	});
}

</script>

<style scoped></style>