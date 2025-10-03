<template>
	<el-container style="height: 92vh;">
		<!--两个按钮，靠最左-->
		<el-header
			style="height: 7vh; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
			<template v-if="isCourseManager">
				<el-button type="primary" style="margin-left: 0.8vw;" @click="createParentData">新增章节</el-button>
				<el-button type="danger" @click="deleteSel">删除</el-button>
				<el-button type="success" @click="">保存</el-button>
				<el-button v-if="selParent" type="primary" @click="createChildrenData">新增小节</el-button>
			</template>
			<div class="flex-container" style="width: 100%;font-weight: bold; font-size: 25px;">课程名称</div>
		</el-header>
		<el-main style="padding: 0; background-color: white;">
			<el-table class="uniqueTable" ref="sortableInstance" :data="tableData" v-loading="tableLoading"
				element-loading-background="rgba(0, 0, 0, 0.2)" style="height: 100%; width: 100%;" row-key="id"
				highlight-current-row size="large" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				:row-class-name="tableRowClassName" @selection-change="handleSelectionChange"
				@current-change="changeSelRow">
				<el-table-column v-if="isCourseManager" type="selection" width="55"></el-table-column>
				<el-table-column prop="type" label="类型" sortable width="180">
					<!--          <template #default="tableRowData">-->
					<!--            <span v-if="!editRef.get(tableRowData.row.id)['editType']"-->
					<!--                  @dblclick="editEditRef(tableRowData.row,'editType')">{{ tableRowData.row.type }}</span>-->
					<!--            <el-input ref="inputTypeRef" v-else v-model="tableRowData.row.type" @blur="saveEditRef(tableRowData.row,'editType')"-->
					<!--                      @keyup.enter="saveEditRef(tableRowData.row,'editType')" style="width: 110px"></el-input>-->
					<!--          </template>-->
				</el-table-column>
				<el-table-column prop="name" label="名称" width="180">
					<template #default="tableRowData">
						<span v-if="!editRef.get(tableRowData.row.id)['editName']"
							@dblclick="editEditRef(tableRowData.row, 'editName')">{{ tableRowData.row.name }}</span>
						<el-input ref="inputNameRef" v-else-if="isCourseManager" v-model="tableRowData.row.name"
							@blur="saveEditRef(tableRowData.row, 'editName')"
							@keyup.enter="saveEditRef(tableRowData.row, 'editName')"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="datavalue" label="数值" sortable width="100">
					<template #default="tableRowData">
						<span v-if="!editRef.get(tableRowData.row.id)['editDataValue']"
							@dblclick="editEditRef(tableRowData.row, 'editDataValue')">
							{{ tableRowData.row.datavalue }}
						</span>
						<el-input ref="inputDataValueRef" v-else-if="isCourseManager"
							v-model="tableRowData.row.datavalue" @blur="saveEditRef(tableRowData.row, 'editDataValue')"
							@keyup.enter="saveEditRef(tableRowData.row, 'editDataValue')"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="kwas" label="基本教学目标">
					<template #default="tableRowData">
						<el-popover v-if="isCourseManager" placement="right-end" width="500"
							:visible="kwaPopoverVisible[tableRowData.row.id]">
							<div style="text-align: right;">
								<el-button style="font-size: 23px;" :type="'danger'" link
									@click="kwaPopoverVisible[tableRowData.row.id] = isKwaPopoverShow = false;">×</el-button>
							</div>
							<el-table ref="kwaTableRef" :data="kwaData" height="400" @selection-change="handleKwaChange"
								stripe>
								<el-table-column align="center" type="selection"
									:selectable="row => kwaTableSelectable(row, tableRowData.row)"
									width="40"></el-table-column>
								<el-table-column width="60">
									<template v-slot="row">
										{{ row.$index + 1 }}
									</template>
								</el-table-column>
								<el-table-column prop="name" label="名称"></el-table-column>
							</el-table>
							<div style="margin-top: 10px; display: flex; justify-content: center;">
								<el-button type="success" @click="saveEditKwa(tableRowData.row)">确定</el-button>
							</div>
							<template #reference>
								<el-icon class='icon' color="dodgerblue">
									<Edit @click="openKwaDict(tableRowData.row)" />
								</el-icon>
							</template>
						</el-popover>
						<span>
							{{ ' ' + tableRowData.row.sumKwas.map(item => item.name).join(", ") }}
						</span>
					</template>
				</el-table-column>
			</el-table>

		</el-main>
	</el-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, nextTick } from 'vue';
import { ElMessage, ElMessageBox, rowContextKey } from "element-plus";
import { Edit } from '@element-plus/icons-vue';
import request from "../../utils/request";
import Sortable from 'sortablejs';
import _ from 'lodash';
import { TableInstance } from 'element-plus';

//-------------------------缓存数据变量
//应该存储真正的课程ID
const courseid = "2c918af681fa6ea7018209a505c30672";
const isCourseManager = ref(false);
var multipleSelection = [];
var selParent = ref(null);
const editRef = ref(new Map());
const inputTypeRef = ref(null);
const inputNameRef = ref(null);
const inputDataValueRef = ref(null);
const sortableInstance = ref(null);

//-------------------------数据
const tableData = ref([]);
const tableLoading = ref(true);
const kwaData = ref([]);
const kwaPopoverVisible = ref({});

//-------------------------处理方法
//children行class显示
const tableRowClassName = ({ row, rowIndex }) => {
	// console.log(row);
	if (row.isChildren) {
		return 'child-row'
	}
	return ''
}

const checkRole = async () => {     // 查询是否是课程负责人，课程负责人要先选择课堂
	try {
		const res = await request.evaluation.get('/evaluation/attainment');
		if (res.code === 200) {
			if (res.data.isCourseManager) {
				isCourseManager.value = true;
			}
			else {
				isCourseManager.value = false;
			}
		} else {
			ElMessage.error(res.msg);
		}
	} catch (error) {
		ElMessage.error('查询角色类型失败' + error);
	}
	return isCourseManager.value;
}

//初始化
onMounted(async () => {
	await checkRole();
	await loadKwaData();
	await loadData();
	const table = document.querySelector('.uniqueTable .el-table__body-wrapper tbody');
	// const tbody = myTable.value.$el.querySelector('.el-table__body-wrapper tbody');

	if (isCourseManager.value) {
		// 创建 Sortable 实例
		sortableInstance.value = Sortable.create(table, {
			animation: 150,
			onEnd: (evt) => {
				const list = tableData;
				const oldIndex = evt.oldIndex;
				const newIndex = evt.newIndex;
				// 使用 Vue 的响应式方法来更新数组
				if (oldIndex !== newIndex) {
					var selData = getDataForPosition(oldIndex);
					var toData = getDataForPosition(newIndex);
					if (selData.pOrderNum === toData.pOrderNum) {
						var data = {
							id: selData.id,
							pid: selData.pid,
							courseid: courseid,
							ordernum: selData.ordernum,
						}
						request.evaluation.post(`/evaluation/knowledgeUnit/updateKnowledgeUnitOrdernum?preOrdernum=${toData.ordernum - 1}`, data)
							.then((res) => {
								if (res.code === 200) {
									ElMessage.success('移动成功');
									loadData();
								} else {
									loadData();
									ElMessage.error(res.msg);
								}
							}).catch((error) => {
								ElMessage.error('移动失败' + error);
								setTimeout(() => {
									ElMessage.success("重新加载数据");
									loadData();
								}, 1);
							});
					}
				}
				const tagName = evt.item.tagName;
				const items = evt.from.getElementsByTagName(tagName);
				if (evt.oldIndex > evt.newIndex) {
					evt.from.insertBefore(evt.item, items[evt.oldIndex + 1]);
				} else {
					evt.from.insertBefore(evt.item, items[evt.oldIndex]);
				}
			},
		});
	}
});

const getDataForPosition = (p) => {
	for (const item of tableData.value) {
		if (item.position === p) {
			return item;
		}
		if (item.children) {
			for (const i of item.children) {
				if (i.position === p) {
					return i;
				}
			}
		}
	}
	return null;
}

const loadKwaData = async () => {
	try {
		const res = await request.evaluation.get('/evaluation/kwadict');
		if (res.code === 200) {
			kwaData.value = res.data;
		} else {
			ElMessage.error(res.msg);
		}
	} catch (error) {
		ElMessage.error('获取失败' + error);
	}
}

const loadData = async () => {
	tableLoading.value = true;
	try {
		const res = await request.evaluation.get('/evaluation/knowledgeUnit/getKnowledgeUnitTree?courseid=' + courseid);
		if (res.code === 200) {
			tableData.value = res.data;
			// console.log(res.data);
			initialize();
		} else {
			ElMessage.error(res.msg);
		}
	} catch (error) {
		ElMessage.error('获取失败' + error);
	}
	tableLoading.value = false;
}

const initialize = () => {
	var p = 0;
	tableData.value.forEach((item) => {
		item.oldKwaIds = item.kwaIds = item.kwas.map(kwa => kwa.kwaid);
		const map = new Map();
		[..._.cloneDeep(item.kwas), ..._.cloneDeep(item.children_kwas)].forEach(kwa => map.set(kwa.kwaid, kwa));
		item.sumKwas = Array.from(map.values());
		item.sumKwaIds = item.sumKwas.map(item => item.kwaid);

		item.datavalue = Number(item.datavalue).toFixed(2);
		item.position = p++;
		item.pOrderNum = 0;
		item.isChildren = false;
		kwaPopoverVisible.value[item.id] = false;
		editRef.value.set(item.id, { "editName": false, "editDataValue": false });
		if (item.children) {
			item.children.forEach((i) => {
				i.oldKwaIds = i.kwaIds = i.kwas.map(kwa => kwa.kwaid);
				const childMap = new Map();
				[..._.cloneDeep(i.kwas), ..._.cloneDeep(i.children_kwas)].forEach(kwa => childMap.set(kwa.kwaid, kwa));
				i.sumKwas = Array.from(childMap.values());
				i.sumKwaIds = i.sumKwas.map(item => item.kwaid);
				i.datavalue = Number(i.datavalue).toFixed(2);
				i.position = p++;
				i.isChildren = true;
				//父节点ordernum
				i.pid = item.id;
				i.pOrderNum = item.ordernum;
				i.parentType = item.type;
				kwaPopoverVisible.value[i.id] = false;
				editRef.value.set(i.id, { "editName": false, "editDataValue": false });
			});
		}
	});
}

//选中
const handleSelectionChange = (val) => {
	multipleSelection = val;
}

//选中行
const changeSelRow = (row) => {
	if (row) {
		if (!row.isChildren) {
			selParent.value = row;
		} else {
			selParent.value = null;
		}
	} else {
		selParent.value = null;
	}
};

//创建章
const createParentData = () => {
	var newData = {
		courseid: courseid,
		type: '未命名的章节',
		name: '未命名的名称',
		datavalue: 0.00,
	}
	request.evaluation.post('/evaluation/knowledgeUnit/insertChapter', newData).then((res) => {
		if (res.code === 200) {
			loadData();
			ElMessage.success('新增成功');
		} else {
			ElMessage.error(res.msg);
		}
	}).catch((error) => {
		ElMessage.error('新增失败' + error);
	});
}

//创建节
const createChildrenData = () => {
	var newData = {
		courseid: courseid,
		pid: selParent.value.id,
		type: '未命名的小节',
		name: '未命名的名称',
		datavalue: 0.00,
	}
	request.evaluation.post('/evaluation/knowledgeUnit/insertSection', newData).then((res) => {
		if (res.code === 200) {
			loadData();
			ElMessage.success('新增成功');
		} else {
			ElMessage.error(res.msg);
		}
	}).catch((error) => {
		ElMessage.error('新增失败' + error);
	});
}

//双击修改章节、名称
const editEditRef = (row, field) => {
	editRef.value.get(row.id)[field] = true;
	setTimeout(() => {
		if (field === 'editType') {
			inputTypeRef.value.focus();
		} else if (field === 'editName') {
			inputNameRef.value.focus();
		} else if (field === 'editDataValue') {
			inputDataValueRef.value.focus();
		}
	}, 0);
};

const kwaTableRef = ref<TableInstance>();
const kwaSelection = ref([]);
const isKwaPopoverShow = ref(false);
const kwaTableSelectable = (kwaRow, tableRowData) => {
	tableData.value.forEach(t => {
		if (t.id === tableRowData.id) {
			console.log(t)
			tableRowData = t;
			return;
		}
	});

	return !tableRowData.children_kwas.map(t => t.kwaid).includes(kwaRow.id);
}

const toggleSelection = kwaIds => {
	// 从filterKwaData.value中过滤出id和kwaIds每一个值相同的元素
	const rows = kwaData.value.filter(kwa => kwaIds.includes(kwa.id));
	if (rows.length > 0) {
		nextTick(() => {
			rows.forEach(row => {
				kwaTableRef.value!.toggleRowSelection(row, undefined, true);
			});
		});
	} else {
		kwaTableRef.value!.clearSelection();
	}
};

const handleKwaChange = selection => {
	kwaSelection.value = selection;
};

const openKwaDict = (row) => {
	if (isKwaPopoverShow.value) return;
	kwaPopoverVisible.value[row.id] = true;
	isKwaPopoverShow.value = true;
	kwaTableRef.value!.clearSelection();
	toggleSelection(row.sumKwaIds);
}

//保存章节、名称修改
const saveEditRef = (row, field) => {
	editRef.value.get(row.id)[field] = false;
	request.evaluation.post('/evaluation/knowledgeUnit/updateKnowledgeUnit', row).then((res) => {
		if (res.code === 200) {
			loadData();
			ElMessage.success('更新成功');
		} else {
			ElMessage.error(res.msg);
		}
	}).catch((error) => {
		ElMessage.error('更新失败' + error);
	});
	//信息已被修改，处理
};

//保存kwa修改
const saveEditKwa = async (row) => {
	kwaPopoverVisible.value[row.id] = isKwaPopoverShow.value = false;
	row.kwaIds = _.cloneDeep(kwaSelection.value).map(kwa => kwa.id);
	kwaTableRef.value!.clearSelection();
	var newKwaIds = row.kwaIds.filter(id => !row.oldKwaIds.includes(id));
	var deleteKwaIds = row.oldKwaIds.filter(id => !row.kwaIds.includes(id));
	if (deleteKwaIds.length !== 0) {
		try {
			const res = await request.evaluation.post(`/evaluation/knowledgeUnit/deleteKnowledgeUnitKwa?unitid=${row.id}`, deleteKwaIds);
			if (res.code === 200) {
				// ElMessage.success('删除kwa成功');
			} else {
				ElMessage.error(res.msg);
			}
		} catch (error) {
			ElMessage.error('删除kwa失败' + error);
		}
	}
	newKwaIds.forEach(async newKwaId => {
		const postData = {
			unitid: row.id,
			kwaid: newKwaId,
			status: 0
		};
		try {
			const res = await request.evaluation.post('/evaluation/knowledgeUnit/insertKnowledgeUnitKwa', postData);
			if (res.code === 200) {
				// ElMessage.success('添加kwa成功');
			} else {
				ElMessage.error(res.msg);
			}
		} catch (error) {
			ElMessage.error('添加kwa失败' + error);
		}
	});
	if (deleteKwaIds.length || newKwaIds.length) {
		await loadData();
	}
};

//删除章
const deleteSel = () => {
	if (multipleSelection.length === 0) {
		ElMessage({
			type: 'warning',
			message: '未选择关键字',
			duration: 800
		});
	}
	ElMessageBox.confirm(
		'选中的知识单元将被删除，是否确定',
		'警告',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}
	).then(() => {
		var ids = [];
		for (const sel of multipleSelection) {
			ids.push(sel.id);
		}
		request.evaluation.post('/evaluation/knowledgeUnit/deleteKnowledgeUnit?courseid=' + courseid, ids).then((res) => {
			if (res.code === 200) {
				loadData();
				ElMessage.success('删除成功');
			} else {
				ElMessage.error(res.msg);
			}
		}).catch((error) => {
			ElMessage.error('删除失败' + error);
		});
	}).catch(() => { })
}
</script>

<style scoped>
.el-table>>>.child-row {
	background-color: rgb(250, 250, 250);
	/*color:royalblue*/
}

.icon:hover {
	cursor: pointer;
}
</style>