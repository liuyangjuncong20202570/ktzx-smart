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
                            <el-input v-if="row.editingTermName" :ref=setInputRef  style="width:100%; height: 25px;" v-model="row.tempTermName"
                                @blur="handleBlur(row, 'editingTermName')"></el-input>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingTermName')">
                                {{ row.termname }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="begindate" label="起始日期" min-width="120">
                        <template #default="{ row }">
                            <el-date-picker v-if="row.editingbegindate"  :ref=setInputRef style="width: 100%; height: 25px;" v-model="row.begindate"
                                @blur="handleBlur(row, 'editingbegindate')" placeholder="请选择日期" value-format="YYYY-MM-DD"></el-date-picker>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingbegindate')">
                                {{ row.begindate }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="enddate" label="结束日期" min-width="120">
                        <template #default="{ row }">
                            <el-date-picker v-if="row.editingEndDate" :ref=setInputRef style="width: 100%; height: 25px;" v-model="row.enddate"
                                @blur="handleBlur(row, 'editingEndDate')" placeholder="请选择日期" value-format="YYYY-MM-DD"></el-date-picker>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingEndDate')">
                                {{ row.enddate }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200">
                        <template #default="{ row }">
                            <el-input v-if="row.editingRemark" :ref=setInputRef style="width: 100%; height: 25px;" v-model="row.remark"
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
import {nextTick, onMounted, reactive, ref} from "vue";
import request from "../utils/request";
import{ exportTableToCSV } from "../utils/exportTableToCSV.js";

const tableData = ref([]);

const getTableData = () => {
    request.get('/sysmangt/terms').then((res) => {
        if(res.code === 200){
            tableData.value = res.data;
            initialize();
        }
    }).catch(() => {
        ElMessage({
            type: 'error',
            message: '获取学期失败'
        });
    });
};

const nullTermNum = ref(0);

//获取学期数据后初始化
const initialize = () => {
    tableData.value.forEach(item => {   // 添加每个表格单元的编辑判定，并记录当前学期
        item.editingTermName = false;
        item.editingbegindate = false;
        item.editingEndDate = false;
        item.editingRemark = false;
        item.tempTermName = '';
        item.iscurrenttermBoolean = (item.iscurrentterm === "1");
        if(item.termname.includes('未命名角色')){
            if(item.termname.length > 5 && nullTermNum.value < Number(item.termname[6])){
                nullTermNum.value = Number(item.termname[6]);
            }
            else if(item.termname.length === 5 && nullTermNum.value === 0) nullTermNum.value ++;
        }
    });
    console.log(tableData.value)
};

onMounted(() => {
    getTableData();
});

const addTerm = () => {
    // nullTermNum.value ++;
    // tableData.value.push({
    //     id: tableData.value.length + '',
    //     termname: nullTermNum.value > 1 ? '未命名学期(' + nullTermNum.value + ')' : '未命名学期',
    //     begindate: '',
    //     enddate: '',
    //     remark: '',
    //     iscurrentterm: 0,
    //     editingTermName: false,
    //     editingbegindate: false,
    //     editingEndDate: false,
    //     editingRemark: false,
    //     tempTermName: '',
    // })
};

const selected = ref([]);

// const exportType = ref('导出全部学期')

/*判定哪些行被选中*/
const handleSelect = (selection) => {
    console.log(selection);
    selected.value = selection;

};
/*****************/


const selectedRows = ref([]);

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

//导出数据
const exportData = () => {
  // 获取选中的行
  const dataToExport = selectedRows.value.length > 0 ? selectedRows.value : tableData.value;

  console.log(dataToExport)

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


const deleteTerm = () => {
    if(selected.value.length === 0){
        ElMessage({
            type: 'warning',
            message: '未选择学期',
            duration: 800
        });
        return ;
    }
    if (selected) {
        ElMessageBox.confirm(
            '选中的学期将被删除，是否确定',
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            // tableData.value = tableData.value.filter((row) => !selected.value.includes(row));
            console.log(selected.value)


            // console.log(tableData.value);
            ElMessage({
                type: 'success',
                message: '删除成功'
            });
            selected.value = [];
        }).catch(() => { });
    }
};

/*********处理点击获取焦点和失焦后数据保存********/
const inputsRefs = ref({});
const handleClick = (row, field) => {
    row[field] = true
    // console.log(row);
    if(field === 'editingTermName') row.tempTermName = row.termname;

    nextTick(() => {
    const inputRef = `input-${row.id}`;
    const inputElement = inputsRefs.value[inputRef];
    if (inputElement) {
      inputElement.focus();
    }
  });

};

const setInputRef = (el, row) => {
  if (el) {
    inputsRefs.value[`input-${row.id}`] = el;
  }
};

const handleBlur = (row, field) => {
    if(row.termname !== row.tempTermName){
        if(field === 'editingTermName' && row.tempTermName.includes('未命名学期') && row.termname !== row.tempTermName){
            ElMessage.error('命名不可包含“未命名学期”');
        }
        else if(row.tempTermName !== '' && row.termname !== row.tempTermName) row.termname = row.tempTermName;
    }
    row.tempTermName = '';
    row[field] = false;
    // console.log(tableData.value);
};



const changeStatus = (selectedRow) => {
  tableData.value.forEach(row => {
    // 将所有行的iscurrentterm设置为0
    row.iscurrentterm = "0";
    row.iscurrenttermBoolean = false;
  });
  // 将选中行的iscurrentterm设置为1
  selectedRow.iscurrentterm = "1";
  selectedRow.iscurrenttermBoolean = true;

  nextTick(() => {
    //发后端更新
  })
};


</script>

<style scoped>

.el-table .cell{
  text-align: center
}
</style>