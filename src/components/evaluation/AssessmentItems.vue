<template>
  <el-container style="height: 92vh;">
    <el-header style="height: auto; padding: 5px 0px; width:100%; text-align: left; background-color:#deebf7;">
      <el-button type="success" style="margin-left: 0.8vw;" @click="addChild(1)">同级新增</el-button>
      <el-button type="success" style="margin-left: 0.8vw;" @click="addChild(0)">下级新增</el-button>
      <el-button type="primary" @click="upgradeLevel">提升等级</el-button>
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

      <el-table
          :data="tableData"
          style="width: 100%"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
          @selection-change="handleSelectionChange"
          :header-cell-style="{borderColor:'#bdbdbd'}"
          :cell-style="{borderColor:'#bdbdbd'}"
      >
        <!-- 选择列，复选框前置 -->
        <el-table-column type="selection" width="55" align="center" />

        <!-- 任务名称列 -->
        <el-table-column prop="itemName" label="任务名称">
          <template #default="tableRowData">
            <span v-if="editNameRef !== tableRowData.row.id"
                  @dblclick="editEditNameRef(tableRowData.row)">{{ tableRowData.row.itemName }}</span>
            <el-input ref="inputNameRef" v-else v-model="tableRowData.row.itemName"
                      @blur="saveEditNameRef(tableRowData.row)"
                      @keyup.enter="saveEditNameRef(tableRowData.row)"></el-input>
          </template>
        </el-table-column>

        <!-- 复选框列 -->
        <el-table-column label="考核任务" width="81px" align="center">
          <template #default="scope">
<!--            v-if="!scope.row.children || scope.row.children.length === 0"-->
            <el-checkbox
                v-model="scope.row.task" @change="changeTask(scope.row)"></el-checkbox>
          </template>
        </el-table-column>

        <!-- 备注列 -->
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import request from "../../utils/request";

//---------------------------------------------数据存储区
const editNameRef = ref(-1);
const inputNameRef = ref('');
const inputRemarkRef = ref('');
const tableSearchData = ref('');
const tableData = ref([])

const deleteDialogVisible = ref(false);
const selectedRows = ref([])
const selectRow = ref(null);
//测试用header，需要删除
const headers = {
  headers: {
  'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvYnNpZCI6IjJjOTE4YWY2ODFmYTZlYTcwMTgyMDlhNTA1YzMwNjcyIiwicm9sZWlkIjoiNTE2NzYxMDQ5LTIzNDUxMmYzLTdjMTktNDU4MC1hYmUyLWViZmIxZGQ4ZGIyMSIsImlkIjoiMSIsImV4cCI6MTcyODQ0MjI2OCwib2JzZGVlcCI6LTF9.h7aPj5QPd5Hia6ilmmzuh8_n-4nbY2qVZnhEeF6MALA'
}}
//---------------------------------------------处理方法区
const editEditNameRef = (row) => {
  inputNameRef.value = row.itemName;
  editNameRef.value = row.id,true;
  setTimeout(() => {
    inputNameRef.value.focus();
  }, 0);
}
const saveEditNameRef = (row) => {
  editNameRef.value = -1;
}
//复选框
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}
//当前选择行
const handleCurrentChange = (currentRow, oldCurrentRow) => {
  selectRow.value = currentRow;
}

//初始化分数合计
onMounted(() => {
  loadData();
});

const loadData = () => {
  request.evaluation.get('/evaluation/checkitem',headers).then((res) => {
    if(res.code === 200){
      tableData.value = res.data;
    }else{
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('获取失败' + error);
  })
}
const addChild = (type) => {
  if(selectRow.value === null){
    ElMessage.warning("未选择考核项");
    return;
  }
  var data = {
    id: selectRow.value.id,
    pid: selectRow.value.pid,
    type: type,
    checkitemdeep: selectRow.value.checkitemdeep,
    cmCheckitem: {
      itemName: '新增的考核项',
      task: 'false',
      remark: null
    },
  }
  request.evaluation.post('/evaluation/checkitem/create',data, headers).then((res) => {
    if(res.code === 200){
      loadData();
      ElMessage.success('新增成功');
    }else{
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('新增失败' + error);
  });
}
const upgradeLevel = () => {
  if(selectRow.value === null){
    ElMessage.warning("未选择考核项");
    return;
  }
  request.evaluation.post('/evaluation/checkitem/upgrade?id='+selectRow.value.id, headers).then((res) => {
    if(res.code === 200){
      loadData();
      ElMessage.success('升级成功');
    }else{
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('升级失败' + error);
  });
}
//删除
const openDeleteDialog = () => {
  if(selectedRows.value.length === 0){
    ElMessage.warning("未选择课程目标");
    return;
  }
  deleteDialogVisible.value = true;
}

const deleteData = () => {
  deleteDialogVisible.value = false;
  var ids = [];
  for (const sel of selectedRows.value) {
    ids.push(sel.id);
  }
  request.evaluation.post('/evaluation/checkitem/delete?ids='+ids.toString(), headers).then((res) => {
    if(res.code === 200){
      loadData();
      ElMessage.success('删除成功');
    }else{
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('删除失败' + error);
  });
}

const changeTask = (rowData) => {
  request.evaluation.post('/evaluation/checkitem/changeTask?id=' + rowData.id + '&status=' + rowData.task, headers).then((res) => {
    if(res.code === 200){
      loadData();
      ElMessage.success('修改成功');
    }else{
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('修改失败' + error);
  });
}
</script>
<style scoped>
.black-border {
  border: 1px solid black !important;
}
</style>