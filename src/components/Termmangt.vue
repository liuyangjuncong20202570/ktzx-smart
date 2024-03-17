<template>
    <div style="height: 92vh; display: flex; flex-direction: column;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
            <el-button type="success" v-blur-on-click style="margin-left: 0.8vw;" @click="exportData">导出</el-button>
            <el-button type="primary" v-blur-on-click style="margin-left: 0.8vw;" @click="addTerm">新建学期</el-button>
            <el-button type="danger" v-blur-on-click style="margin-left: 0.8vw;" @click="deleteTerm">删除学期</el-button>
<!--            <el-button type="success" style="margin-left: 0.8vw;">保存</el-button>-->
        </el-header>
        <el-main style="padding: 0;">
            <div style="max-height: 100%; height: 100%; overflow:auto ; flex: auto">
                <el-table :data="tableData" style="table-layout:auto; width: 100%; height: 100%;" @select="handleSelect" @selection-change="handleSelectionChange"
                          :default-sort="{ prop: 'enddate', order: 'descending' }" class="my-custom-table"
                          stripe>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column width="55">
                        <template v-slot="row">{{ row.$index + 1 }}</template>
                    </el-table-column>
                    <el-table-column prop="termname" label="学期" min-width="130">
                        <template #default="{ row }">
                            <el-input v-if="row.editingTermName" :ref="el => setInputRef(el, row)" style="width:100%; height: 25px;" v-model="row.termname"
                                @blur="handleBlur(row, 'editingTermName')"></el-input>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingTermName')">
                                {{ row.termname }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="begindate" label="起始日期" min-width="120">
                        <template #default="{ row }">
                            <el-date-picker v-if="row.editingbegindate"  :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.begindate"
                                @blur="handleBlur(row, 'editingbegindate')" placeholder="请选择日期" value-format="YYYY-MM-DD"></el-date-picker>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingbegindate')">
                                {{ row.begindate }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="enddate" label="结束日期" min-width="120">
                        <template #default="{ row }">
                            <el-date-picker v-if="row.editingEndDate" :ref="el=>setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.enddate"
                                @blur="handleBlur(row, 'editingEndDate')" placeholder="请选择日期" value-format="YYYY-MM-DD"></el-date-picker>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingEndDate')">
                                {{ row.enddate }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200">
                        <template #default="{ row }">
                            <el-input v-if="row.editingRemark" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.remark"
                                @blur="handleBlur(row, 'editingRemark')"></el-input>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingRemark')">
                                {{row.remark }}
                            </div>
                        </template>
                    </el-table-column>
                  <el-table-column label="当前学期" min-width="200">
                    <template #default="{ row }">
                      <!-- 使用Boolean值进行绑定，并监听变化 -->
                      <el-checkbox  :key="row.iscurrenttermBoolean" v-model:checked="row.iscurrenttermBoolean" @change="() => changeStatus(row)" />
                    </template>
                  </el-table-column>
                </el-table>
            </div>
        </el-main>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, rowProps } from "element-plus";
import {nextTick, onMounted, reactive, ref, toRaw} from "vue";
import request from "../utils/request";
import{ exportTableToCSV } from "../utils/exportTableToCSV.js";
import isEqual from "lodash/isEqual";

//数据列表
const tableData = ref([]);
//未命名学期计数
const nullTermNum = ref(0);
//当前学期ID
const currentTermID = ref('');
//选中学期集合
const selectedRows = ref([]);
//选中想删除学期集合
const deleteTermList = ref([]);

/**************获取学期列表，并初始化********************/
const getTableData = () => {
    request.get('/sysmangt/terms')
        .then((res) => {
        if(res.code === 200){
          console.log(111);
            tableData.value = res.data;
            initialize();
            console.log(tableData.value)
        }
    }).catch(() => {
      console.log(222);
        ElMessage({
            type: 'error',
            message: '获取学期失败'
        });
    });
};

//获取学期数据后初始化
const initialize = () => {
    tableData.value.forEach(item => {   // 添加每个表格单元的编辑判定，并记录当前学期
        item.editingTermName = false;
        item.editingbegindate = false;
        item.editingEndDate = false;
        item.editingRemark = false;
        if(item.iscurrentterm === "1"){
          currentTermID.value = item.id;
          item.iscurrenttermBoolean = true;
        }
        else{
          item.iscurrenttermBoolean = false;
        }
        
        // 处理名字的逻辑
        if (item.termname.includes('未命名学期')) {
          if (item.termname.length > 5) {
            let num = '';
            for(let i = 6; item.termname[i] !== ')'; i++){
              num += item.termname[i];
            }
            if(nullTermNum.value < Number(num)) nullTermNum.value = Number(num);
          }
          else if (item.termname.length === 5 && nullTermNum.value === 0) nullTermNum.value++;
        }
    });
};

/*****************************************/

/******************新增学期***********************/
const addTerm = () => {
   nullTermNum.value ++;
  const tempTerminfo = ref({
    termname:nullTermNum.value > 1 ? '未命名学期(' + nullTermNum.value + ')' : '未命名学期',
    begindate:ref(`${new Date().toISOString().split('T')[0]}`),
    enddate:"",
    remark:"",
  });

  request.post('/sysmangt/terms/create',tempTerminfo.value)
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '新增学期成功'
          });
          //这里刷新dom
          // nullRoleNum.value = 0;
          getTableData();
        }
      })
      .catch(() => {
            ElMessage({
              type: 'error',
              message: '新增学期失败'
            });
          }
      );
};
/*****************************************/


/**************判定哪些行被选中***************/
const handleSelect = (selection) => {
    selectedRows.value = selection;

};
//选中改变时
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

const columns = ref([
  { prop: 'termname', label: '学期' },
  { prop: 'begindate', label: '起始日期' },
  { prop: 'enddate', label: '结束日期' },
  { prop: 'remark', label: '备注' },
  { prop: 'iscurrentterm', label: '当前学期' },
]);

/***************导出学期****************/
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
     ).then(() => {
        exportTableToCSV(dataToExport, columns.value);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消导出',
        })
      })
}
/*************************************/

/***************删除学期****************/
const deleteTerm = () => {
    if(selectedRows.value.length === 0){
        ElMessage({
            type: 'warning',
            message: '未选择学期',
            duration: 800
        });
        return ;
    }
    if (selectedRows) {
        ElMessageBox.confirm(
            '选中的学期将被删除，是否确定',
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
          selectedRows.value.forEach(item=>{
          deleteTermList.value.push(item.id)
          });
          console.log("curr"+currentTermID.value)
          console.log("delete"+deleteTermList.value)
          if(deleteTermList.value.includes(currentTermID.value)){
            ElMessage({
              type: 'error',
              message: '无法删除当前学期'
            });
          }else {
            request.post('/sysmangt/terms/delete', deleteTermList.value)
                .then(res => {
                  // 登录成功
                  if (res.code === 200) {
                    ElMessage({
                      type: 'success',
                      message: '删除学期成功'
                    });
                    //这里刷新dom
                    getTableData();
                  }
                })
                .catch(() => {
                      ElMessage({
                        type: 'error',
                        message: '删除学期失败'
                      });
                    }
                );
          }

          selectedRows.value = [];
          deleteTermList.value=[];
        })
            .catch(() => { });
    }
};
/**********************************************/

/*********************修改当前学期****************/
const changeStatus = (selectedRow) => {
  currentTermID.value = selectedRow.id;
  console.log(currentTermID.value)
  request.get ('/sysmangt/terms/currentterm?id='+currentTermID.value)
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '修改当前学期成功'
          });
          //这里刷新dom
          // nullRoleNum.value = 0;
          nextTick(() => {

            getTableData();

          })
        }
      })
      .catch(() => {
            ElMessage({
              type: 'error',
              message: '修改当前学期失败'
            });
          }
      );
};

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
  console.log(orirow)
  nextTick(() => {
    row[field] = true;
    setTimeout(() => {
      const inputRef = `input-${row.id}`;
      // 假设 inputsRefs.value[inputRef] 是对 el-input 组件的引用
      const inputComponent = inputsRefs.value[inputRef];
      const datePickerComponent = inputsRefs.value[inputRef];
      // 检查 inputComponent 并尝试获取其内部的 input 元素
      if (inputComponent && inputComponent.$refs.input) {
        const nativeInputElement = inputComponent.$refs.input;
        nativeInputElement.focus();
        const len = nativeInputElement.value.length;
        nativeInputElement.setSelectionRange(len, len);
      }
      if (datePickerComponent) {
        datePickerComponent.focus(); // 尝试让 date-picker 聚焦，这可能会使其弹出日期选择面板
      }
    }, 0);
  });
};
const handleBlur = (row, field) => {

  nextTick(() => {

    row[field] = false;
    rowdata= JSON.parse(JSON.stringify(row));
    console.log(rowdata)
    console.log(orirow)
    //isEqual(a,b) a,b是否相同
    hasChanged = isEqual(rowdata, orirow);

    if(hasChanged){
      ElMessage({
        type: 'info',
        message: '无修改字段'
      });
    }else{
      const updateItem = ref({
        id:toRaw(row).id,
        termname:toRaw(row).termname,
        begindate:toRaw(row).begindate,
        enddate:toRaw(row).enddate,
        remark:toRaw(row).remark
      })
      request.post('/sysmangt/terms',updateItem.value)
          .then(res => {
            // 登录成功
            if (res.code === 200) {
              ElMessage({
                type: 'success',
                message: '修改x学期信息成功'
              });
              //这里刷新dom
              getTableData();
            }
          })
          .catch(() => {
                ElMessage({
                  type: 'error',
                  message: '修改学期信息失败'
                });
                getTableData();
              }
          )
    }
  });
};





onMounted(() => {
  getTableData();
});
</script>

<style scoped>

.el-table .cell{
  text-align: center
}
</style>