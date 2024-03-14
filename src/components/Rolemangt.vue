<template>
	<el-container style="height: 92vh;">
		<!--两个按钮，靠最左-->
		<el-header
			style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
			<el-button type="primary" style="margin-left: 0.8vw;" @click="handleRoleAdd">新增角色</el-button>
			<el-button type="danger" @click="handleRoleDel">删除</el-button>
			<el-button type="success" @click="">保存</el-button>
		</el-header>
		<el-main style="padding: 0;overflow: auto;">
			<!--生成-->
			<el-table :data="tableData" style="height: 100%; table-layout:auto; width: 100%;" v-model="selected"
				@select="handleSelect" @select-all="handleSelectAll"
				:default-sort="{ prop: 'rolecode', order: 'ascending' }"  stripe>
				<el-table-column type="selection" width="55"></el-table-column>
        
				<el-table-column prop="rolecode"  label="角色代码" width="110">
          <template #default="{ row }">
            <el-input v-if="row.editingRolecode" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.rolecode"
                      @blur="handleBlur(row, 'editingRolecode')"></el-input>
            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingRolecode')">{{
                row.rolecode }}
            </div>
          </template>

				</el-table-column>
				<el-table-column prop="rolename" label="角色名称" min-width="150">
					<template #default="{ row }">
						<el-input v-if="row.editingRolename" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.rolename"
							@blur="handleBlur(row, 'editingRolename')"></el-input>
						<div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingRolename')">{{
							row.rolename }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="homename" label="首页" min-width="150">
					<template #default="{ row }">
						<el-input v-if="row.editingHomeName" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.homename"
							@blur="handleBlur(row, 'editingHomeName')"></el-input>
						<div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingHomeName')">{{
							row.homename }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="homeurl" label="首页地址" min-width="220">
					<template #default="{ row }">
						<el-input v-if="row.editingHomeUrl" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.homeurl"
							@blur="handleBlur(row, 'editingHomeUrl')"></el-input>
						<div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingHomeUrl')">{{
							row.homeurl }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="200">
					<template #default="{ row }">
						<el-input v-if="row.editingRemark" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.remark"
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
import {reactive, ref, computed, onMounted, nextTick,toRaw} from "vue";
import request from "../utils/request.js";
import { ElMessage, ElMessageBox } from 'element-plus';


/**************获取表单数据，并预处理*******************/

const tableData = ref([]);

//未命名的角色数
const nullRoleNum = ref(0);

const getTableData = () => {
  request.get('/sysmangt/rolemangt')
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          tableData.value = res.data;
          initialize();
        }
      })
      .catch(() => {
            ElMessage({
              type: 'error',
              message: '获取角色列表失败'
            });
          }
      );
};

//初始化数据
const initialize = () => {
  tableData.value.forEach(item => {   // 为每一个表格数据添加是否显示输入框的判定
    item.rolecode = Number(item.rolecode);
    item.editingRolecode = false;
    item.editingRolename = false;
    item.editingRoletype = false;
    item.editingHomeName = false;
    item.editingHomeUrl = false;
    item.editingRemark = false;
    // item.tempRolename = '';
    if (item.rolename.includes('未命名角色')) {
      if (item.rolename.length > 5 && nullRoleNum.value < Number(item.rolename[6])) {
        nullRoleNum.value = Number(item.rolename[6]);
      }
      else if (item.rolename.length === 5 && nullRoleNum.value === 0) nullRoleNum.value++;
    }
  });
};

/*******************************************************/

/*********************添加角色***************************/
const handleRoleAdd = () => {
  nullRoleNum.value++;
  const tempRoleinfo = ref({
    rolecode:"99",
    rolename:nullRoleNum.value > 1 ? '未命名角色(' + nullRoleNum.value + ')' : '未命名角色',
    remark:"",
    homename:"",
    homeurl:""
  });
  console.log(tempRoleinfo.value);
  //
  request.post('/sysmangt/rolemangt',tempRoleinfo.value)
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '新增角色成功'
          });
          //这里刷新dom
          // nullRoleNum.value = 0;
          getTableData();
        }
      })
      .catch(() => {
            ElMessage({
              type: 'error',
              message: '新增角色失败'
            });
          }
      );
};

/******************选中逻辑处理***************/
const selected = ref([]);

/*判定哪些行被选中*/
const handleSelect = (selection) => {
  selected.value = selection;
};

const handleSelectAll = (selection) => {
  selected.value = selection;
};

/*********处理点击获取焦点和失焦后数据保存********/
const inputsRefs = ref({});

const setInputRef = (el, row) => {
  if (el) {
    inputsRefs.value[`input-${row.id}`] = el;
  }
};

const handleClick = (row, field) => {
  row[field] = true;

  nextTick(() => {
    setTimeout(() => {
      const inputRef = `input-${row.id}`;
      // 假设 inputsRefs.value[inputRef] 是对 el-input 组件的引用
      const inputComponent = inputsRefs.value[inputRef];

      // 检查 inputComponent 并尝试获取其内部的 input 元素
      if (inputComponent && inputComponent.$refs.input) {
        const nativeInputElement = inputComponent.$refs.input;
        nativeInputElement.focus();
        const len = nativeInputElement.value.length;
        nativeInputElement.setSelectionRange(len, len);
      }
    }, 0);
  });
};


const handleBlur = (row, field) => {
  nextTick(() => {
	row[field] = false;
  });
  // console.log(toRaw (row));
  const rowdata = ref(toRaw (row))

  const updateItem = ref({
    id:rowdata.value.id,
    rolecode:rowdata.value.rolecode,
    rolename:rowdata.value.rolename,
    remark:rowdata.value.remark,
    homename:rowdata.value.homename,
    homeurl:rowdata.value.homeurl
  })

  console.log(updateItem.value)
  request.post('/sysmangt/rolemangt/update',updateItem.value)
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '修改角色信息成功'
          });
          //这里刷新dom
          getTableData();
        }
      })
      .catch(() => {
            ElMessage({
              type: 'error',
              message: '修改角色信息失败'
            });
        getTableData();
          }
      );
};

/**************************************/



/**************************************/

const deleteIdList = ref([]);

const handleRoleDel = () => {
	if (selected.value.length === 0) {
		ElMessage({
			type: 'warning',
			message: '未选择角色',
			duration: 800
		});
		return;
	}
  else{
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
        selected.value.forEach(item=>{
          deleteIdList.value.push(item.id)
            }
        )
        request.post('/sysmangt/rolemangt/delete',deleteIdList.value)
            .then(res => {
              // 登录成功
              if (res.code === 200) {
                ElMessage({
                  type: 'success',
                  message: '删除成功'
                });
                //这里刷新dom
                getTableData();
              }
            })
            .catch(() => {
                  ElMessage({
                    type: 'error',
                    message: '删除角色失败'
                  });
                }
            );
				selected.value = [];
        deleteIdList.value=[];
			}).catch(() => { });
	}
};



onMounted(() => {
	getTableData();
});
</script>

<style scoped>
/deep/.el-table .cell {
  text-align: center;
}
.custom-icon:hover {
	color: rgb(0, 115, 255) !important;
	cursor: pointer;
}

</style>