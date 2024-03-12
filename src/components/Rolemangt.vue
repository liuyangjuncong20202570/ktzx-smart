<template>
	<el-container style="height: 92vh;">
		<!--两个按钮，靠最左-->
		<el-header
			style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
			<el-button type="primary" style="margin-left: 0.8vw;" @click="handleRoleAdd">新增角色</el-button>
			<el-button type="danger" @click="handleRoleDel">删除</el-button>
			<el-button type="success" @click="">保存</el-button>
		</el-header>
		<el-main style="padding: 0;">
			<!--生成-->
			<el-table :data="tableData" style="height: 100%; table-layout:auto; width: 100%;" v-model="selected"
				@select="handleSelect" @select-all="handleSelectAll"
				:default-sort="{ prop: 'rolecode', order: 'ascending' }" stripe>
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="rolecode" sortable label="角色代码" width="110">
				</el-table-column>
				<el-table-column prop="rolename" label="角色名称" width="150">
					<template #default="{ row }">
						<el-input v-if="row.editingRolename" style="width: 100%; height: 25px;" v-model="row.tempRolename"
							@blur="handleBlur(row, 'editingRolename')"></el-input>
						<div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingRolename')">{{
							row.rolename }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="roletype" label="角色类型" width="150">
					<template #default="{ row }">
						<el-input v-if="row.editingRoletype" style="width: 100%; height: 25px;" v-model="row.roletype"
							@blur="handleBlur(row, 'editingRoletype')"></el-input>
						<div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingRoletype')">{{
							row.roletype }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="homepage" label="首页" width="200">
					<template #default="{ row }">
						<el-input v-if="row.editingHomepage" style="width: 100%; height: 25px;" v-model="row.homepage"
							@blur="handleBlur(row, 'editingHomepage')"></el-input>
						<div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingHomepage')">{{
							row.homepage }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="homeurl" label="首页地址" width="220">
					<template #default="{ row }">
						<el-input v-if="row.editingHomeUrl" style="width: 100%; height: 25px;" v-model="row.homeUrl"
							@blur="handleBlur(row, 'editingHomeUrl')"></el-input>
						<div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingHomeUrl')">{{
							row.homeurl }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="250">
					<template #default="{ row }">
						<el-input v-if="row.editingRemark" style="width: 100%; height: 25px;" v-model="row.remark"
							@blur="handleBlur(row, 'editingRemark')"></el-input>
						<div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingRemark')">{{
							row.remark }}
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-main>

	</el-container>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import request from "../utils/request.js";
import { ElMessage, ElMessageBox } from 'element-plus';

const dialogVisible = ref(false);
const Addform = ref({
	name: '',
	type: '',
	homepagename: '',
	homepageurl: '',
});

// 添加角色
const handleRoleAdd = () => {
	nullRoleNum.value++;
	tableData.value.push({
		rolecode: tableData.value.length + 1,
		rolename: nullRoleNum.value > 1 ? '未命名角色(' + nullRoleNum.value + ')' : '未命名角色',
		roletype: '',
		homepage: '',
		homeurl: '',
		remark: '',
		editingRolename: false,
		editingRoletype: false,
		editingHomepage: false,
		editingHomeUrl: false,
		editingRemark: false,
		tempRolename: '',
	});
};

const selected = ref([]);

/*判定哪些行被选中*/
const handleSelect = (selection) => {
	selected.value = selection;
};

const handleSelectAll = (selection) => {
	selected.value = selection;
};
/*****************/

const handleClick = (row, field) => {
	row[field] = true
	// console.log(row);
	if (field === 'editingRolename') row.tempRolename = row.rolename;
};

const handleBlur = (row, field) => {
	// console.log(row);
	if (row.rolename !== row.tempRolename) {
		if (field === 'editingRolename' && row.tempRolename.includes('未命名角色')) {
			ElMessage.error('命名不可包含“未命名角色”');
		}
		else if (row.tempRolename !== '') row.rolename = row.tempRolename;
	}
	row.tempRolename = '';
	row[field] = false;
};

const handleRoleDel = () => {
	if (selected.value.length === 0) {
		ElMessage({
			type: 'warning',
			message: '未选择角色',
			duration: 800
		});
		return;
	}
	if (selected.value.length) {
		ElMessageBox.confirm(
			'选中的角色将被删除，是否确定',
			'警告',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(() => {
				tableData.value = tableData.value.filter((row) => !selected.value.includes(row));
				ElMessage({
					type: 'success',
					message: '删除成功'
				});
				selected.value = [];
			}).catch(() => { });
	}
};

const tableData = ref([
	// {
	//   id: '1',
	//   rolename: '超级管理员',
	//   roletype: '系统管理员',
	//   homepage: '首页',
	//   homeUrl: '',
	//   roleDescri: ''
	// },
	// {
	//   id: '2',
	//   rolename: '管理员',
	//   roletype: '系统管理员',
	//   homepage: '首页',
	//   homeUrl: '',
	//   roleDescri: ''
	// },
	// {
	//   id: '3',
	//   rolename: '普通用户',
	//   roletype: '普通用户',
	//   homepage: '首页',
	//   homeUrl: '',
	//   roleDescri: ''
	// }
]);

const nullRoleNum = ref(0);

const getTableData = () => {
	request.get('/sysmangt/rolemangt')
		.then(res => {
			// 登录成功
			if (res.code === 200) {
				tableData.value = res.data;
				// console.log(res.data);
				initialize();
			}
		})
		.catch(() => {
			ElMessage({
				type: 'error',
				message: '获取角色失败'
			});
		}
		);
};

const initialize = () => {
	tableData.value.forEach(item => {   // 为每一个表格数据添加是否显示输入框的判定
		item.editingRolename = false;
		item.editingRoletype = false;
		item.editingHomepage = false;
		item.editingHomeUrl = false;
		item.editingRemark = false;
		item.tempRolename = '';
		if (item.rolename.includes('未命名角色')) {
			if (item.rolename.length > 5 && nullRoleNum.value < Number(item.rolename[6])) {
				nullRoleNum.value = Number(item.rolename[6]);
			}
			else if (item.rolename.length === 5 && nullRoleNum.value === 0) nullRoleNum.value++;
		}
	});
};

onMounted(() => {
	getTableData();
});
</script>

<style scoped>.custom-icon:hover {
	color: rgb(0, 115, 255) !important;
	cursor: pointer;
}</style>