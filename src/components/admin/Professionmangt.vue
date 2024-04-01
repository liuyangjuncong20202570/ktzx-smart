<template>
  <el-container style="height: 92vh;">
    <!--两个按钮，靠最左-->
    <el-header
        style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="success" style="margin-left: 0.8vw;" @click="exportData">导出专业</el-button>
      <el-button type="primary" style="margin-left: 0.8vw;" @click="handleRoleAdd">新增专业</el-button>
      <el-button type="danger" @click="handleRoleDel">删除专业</el-button>
      <!--      <el-button type="success" @click="">保存</el-button>-->
    </el-header>
    <el-main style="padding: 0;overflow: auto;">
      <!--生成-->
      <el-table :data="tableData" style="height: 100%; table-layout:auto; width: 100%;"
                @select-all="handleSelectAll" @selection-change="handleSelectionChange"
                :default-sort="{ prop:'procode', order: 'ascending' }"  stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="55" label="序号">
          <template v-slot="row">{{ row.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="proname" label="专业名称" min-width="100">
          <template #default="{ row }">
            <el-input v-if="row.editingProname" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.proname"
                      @blur="handleBlur(row, 'editingProname')"></el-input>
            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingProname')">{{row.proname }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="procode" label="专业代码" min-width="80">
          <template #default="{ row }">
            <el-input v-if="row.editingProcode" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.procode"
                      @blur="handleBlur(row, 'editingProcode')"></el-input>
            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingProcode')">{{row.procode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="reachpercent" label="课程目标达成阈值" min-width="80">
          <template #default="{ row }">
            <el-input v-if="row.editingReachpercent" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.reachpercent"
                      @blur="handleBlur(row, 'editingReachpercent')"></el-input>
            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingReachpercent')">{{row.procode }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="专业负责人">
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="80">
          <template #default="{ row }">
            <el-input v-if="row.editingRemark" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.remark"
                      @blur="handleBlur(row, 'editingRemark')"></el-input>
            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingRemark')">{{row.remark }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script setup>
import {reactive, ref, computed, onMounted, nextTick, toRaw, isRef} from "vue";
import request from "../../utils/request.js";
import { ElMessage, ElMessageBox } from 'element-plus';
import isEqual from 'lodash/isEqual.js'
import {exportTableToCSV} from "../../utils/exportTableToCSV.js";
import {useProfileStore} from "../../stores/profileStore.js";


//获取Stroe
const profileStore = useProfileStore();


/**************获取表单数据，并预处理*******************/

const tableData = ref([]);

//未命名的角色数
const nullRoleNum = ref(0);


const getTableData = () => {
  request.admin.get('/sysmangt/professionmangt')
    .then(res => {
      // 登录成功
      if (res.code === 200) {
        tableData.value = res.data;
        console.log(res.data)
        initialize();
      }
    })
    .catch(() => {
          ElMessage({
            type: 'error',
            message: '获取专业列表失败'
          });
        }
    );
};

//初始化数据
const initialize = () => {
  tableData.value.forEach(item => {   // 为每一个表格数据添加是否显示输入框的判定
    item.editingProname = false;
    item.editingProcode = false;
    item.editingReachpercent = false;
    // item.editingstUsersList = false;
    item.editingRemark = false;
    if (item.proname.includes('未命名节点')) {
      if (item.proname.length > 5) {
        let num = '';
        for(let i = 6; item.proname[i] !== ')'; i++){
          num += item.proname[i];
        }
        if(nullRoleNum.value < Number(num)) nullRoleNum.value = Number(num);
      }
      else if (item.proname.length === 5 && nullRoleNum.value === 0) nullRoleNum.value++;
    }
  });
};

/*******************************************************/


const selectedRows = ref([]);

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
  // console.log(selectedRows.value)
};


const handleSelectAll = (selection) => {
  selectedRows.value = selection;
  // console.log(selectedRows.value)
};

const columns = ref([
  { prop: 'proname', label: '专业名称' },
  { prop: 'procode', label: '专业代码' },
  { prop: 'reachpercent', label: '课程目标达成阈值' },
  { prop: '', label: '专业负责人' },
  { prop: 'remark', label: '备注' }
]);

const exportData = () => {
  // 获取选中的行
  const dataToExport = selectedRows.value.length > 0 ? selectedRows.value : tableData.value;
  // 检查是否有数据可导出
  if (dataToExport.length === 0) {
    ElMessage({
      type: 'info',
      message: '没有需要导出的内容',
    });
    return; // 退出函数，不再继续执行
  }

  ElMessageBox.confirm(
      selectedRows.value.length > 0 ? `是否要导出所勾选的 ${selectedRows.value.length} 行记录？` : '是否要导出当前的全部记录？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }
  )
      .then(() => {
        exportTableToCSV(dataToExport, columns.value);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消导出',
        })
      })
}

const handleRoleAdd = ()=>{
  nullRoleNum.value++;
  const newCollege = ref({
    proname : nullRoleNum.value > 1 ? '未命名节点(' + nullRoleNum.value + ')' : '未命名节点',
    procode :"",
    reachpercent:"",
    remark : ""}
  )

  request.admin.post('/sysmangt/professionmangt/create',newCollege.value)
      .then(res => {
        console.log(newCollege.value)
        // 登录成功
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '新增专业成功'
          });
          getTableData()
        }
      })
      .catch(() => {
        console.log(newCollege.value)
            ElMessage({
              type: 'error',
              message: '新增专业失败'
            });
          }
      );
}


/*********处理点击获取焦点和失焦后数据保存********/
const inputsRefs = ref({});

const setInputRef = (el, row) => {
  if (el) {
    inputsRefs.value[`input-${row.id}`] = el;
  }
};

let orirow = null;
let rowdata =null;
let hasChanged = null;

const handleClick = (row, field) => {
  orirow = JSON.parse(JSON.stringify(row));
  // console.log(orirow)
  nextTick(() => {
    row[field] = true;
    setTimeout(() => {
      const inputRef = `input-${row.id}`;
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
    rowdata= JSON.parse(JSON.stringify(row));
    // console.log(rowdata)
    // console.log(orirow)
    //isEqual(a,b) a,b是否相同
    hasChanged = isEqual(rowdata, orirow);
    // console.log(hasChanged)

    if(hasChanged){
      ElMessage({
        type: 'info',
        message: '无修改字段'
      });
    }else{
      const updateItem = ref({
        id:toRaw(row).id,
        obsname:toRaw(row).obsname,
        remark:toRaw(row).remark
      })
      request.admin.post('/sysmangt/professionmangt/update',updateItem.value)
          .then(res => {
            // 登录成功
            if (res.code === 200) {
              ElMessage({
                type: 'success',
                message: '修改专业信息成功'
              });
              //这里刷新dom
              getTableData();
            }
          })
          .catch(() => {
                ElMessage({
                  type: 'error',
                  message: '修改专业信息失败'
                });
                getTableData();
              }
          )
    }
  });
};

/**************************************/



/**************************************/

const deleteIdList = ref([]);

const handleRoleDel = () => {
  if (selectedRows.value.length === 0) {
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
          selectedRows.value.forEach(item=>{
                deleteIdList.value.push(item.id)
              }
          )
          request.admin.post('/sysmangt/professionmangt/delete',deleteIdList.value)
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
          selectedRows.value = [];
          deleteIdList.value=[];
        }).catch(() => { });
  }
};



onMounted(() => {
  getTableData();
});
</script>

<style scoped>
::v-deep(.el-table .cell) {
  text-align: center;
}
.custom-icon:hover {
  color: rgb(0, 115, 255) !important;
  cursor: pointer;
}

</style>