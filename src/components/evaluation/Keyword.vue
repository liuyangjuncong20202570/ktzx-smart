<template>
    <el-container style="height: 92vh;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; text-align: left; background-color:#deebf7;">
            <el-button type="success" style="margin-left: 0.8vw;" @click="addKeyword">新增</el-button>
            <!-- <el-button type="primary" @click="openDictionary">从关键字字典选择</el-button> -->
            <el-button type="danger" @click="deleteKeyword">删除</el-button>
            <el-button type="primary">保存</el-button>
            <el-input v-model="tableSearchData" style="margin-left: 0.8vw; width: 250px" placeholder="查找关键字">
                <template #append><el-button :icon="Search" /></template>
            </el-input>
        </el-header>
        <el-main style="padding: 0;">
            <el-table :data="filteredTableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="showId" label="序号" width="60"></el-table-column>
                <el-table-column prop="name" label="名称" width="240">
                    <template #default="tableRowData">
                        <span v-if="!editRef.get(tableRowData.row.id)['editName']"
                              @dblclick="editEditRef(tableRowData.row,'editName')">{{ tableRowData.row.name }}</span>
                        <el-input ref="inputNameRef" v-else v-model="tableRowData.row.name" @blur="saveEditRef(tableRowData.row,'editName')"
                                  @keyup.enter="saveEditRef(tableRowData.row,'editName')"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="datavalue" label="数值" width="100">
                    <template #default="tableRowData">
                        <span v-if="!editRef.get(tableRowData.row.id)['editDataValue']"
                                  @dblclick="editEditRef(tableRowData.row,'editDataValue')">{{ tableRowData.row.datavalue }}</span>
                        <el-input ref="inputTableRowDataRef" v-else v-model="tableRowData.row.datavalue" @blur="saveEditRef(tableRowData.row,'editDataValue')"
                                @keyup.enter="saveEditRef(tableRowData.row,'editDataValue')"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="importantlevelid" label="重要程度" width="150">
                    <template #default="tableRowData">
                        <span v-if="!editRef.get(tableRowData.row.id)['editImportantlevelid']"
                                  @dblclick="editEditRef(tableRowData.row,'editImportantlevelid')">{{ tableRowData.row.importantlevelid }}</span>
                        <el-input ref="inputImportantlevelidRef" v-else v-model="tableRowData.row.importantlevelid" @blur="saveEditRef(tableRowData.row,'editImportantlevelid')"
                                @keyup.enter="saveEditRef(tableRowData.row,'editImportantlevelid')"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                    <template #default="tableRowData">
                        <span v-if="!editRef.get(tableRowData.row.id)['editRemark']"
                                  @dblclick="editEditRef(tableRowData.row,'editRemark')">{{ tableRowData.row.remark }}</span>
                        <el-input ref="inputRemarkRef" v-else v-model="tableRowData.row.remark" @blur="saveEditRef(tableRowData.row,'editRemark')"
                                @keyup.enter="saveEditRef(tableRowData.row,'editRemark')"></el-input>
                    </template>
                </el-table-column>
            </el-table>
<!--          <p>{{ filteredTableData }}</p>-->
        </el-main>
    </el-container>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import request from "../../utils/request";

const tableSearchData = ref('');    // 主界面搜索框数据

const loadData = () => {
  request.evaluation.get('/evaluation/keywords').then((res) => {
    if(res.code === 200){
      tableData.value = res.data;
      initialize(tableData.value);
    }
    else{
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('获取关键字失败' + error);
  })
}

const initialize = () => {
  var id = 1;
  tableData.value.forEach((item) => {
    item.showId = id++;
    item.datavalue = Number(item.datavalue).toFixed(2);
    editRef.value.set(item.id, { "editName": false, "editDataValue": false,"editImportantlevelid": false,"editRemark": false });
  });
}

onMounted(() => {
  loadData();
  initialize();
});

const tableData = ref([]);

const filteredTableData = computed(() => {
  if (!tableSearchData.value) {
    return tableData.value; // 如果没有搜索查询，返回原始数据
  }
  return tableData.value.filter(item => {
    // 根据需要调整过滤逻辑，这里假设你想根据 'name' 属性进行过滤
    return item.name.includes(tableSearchData.value);
  });
});

var multipleSelection = [];

const handleSelectionChange = (val) =>{
  multipleSelection = val;
}

const addKeyword = () =>{
  var flag = true;
  // tableData.value.forEach(item => {
  //   if(item.id === '空'){
  //     flag = false;
  //     ElMessage({
  //       type: 'warning',
  //       message: '有未设置完善的关键字',
  //       duration: 800
  //     });
  //   }
  // });
  if(flag){
    var newData = {
      id: '',
      name: '未设置名称',
      datavalue: 0.00,
      importantlevelid: '0.0',
      remark: '无',
    }
    request.evaluation.post('/evaluation/keywords/create', newData).then((res) => {
      if(res.code === 200){
        loadData();
        ElMessage.success('新增成功');
      }
      else{
        ElMessage.error(res.msg);
      }
    }).catch((error) => {
      ElMessage.error('新增关键字失败' + error);
    });
  }
}

const deleteKeyword = () =>{
  if(multipleSelection.length === 0){
    ElMessage({
      type: 'warning',
      message: '未选择关键字',
      duration: 800
    });
  }
  ElMessageBox.confirm(
      '选中的关键字将被删除，是否确定',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    var ids = [];
    for(const sel of multipleSelection){
      ids.push(sel.id);
    }
    request.evaluation.post('/evaluation/keywords/delete', ids).then((res) => {
      if(res.code === 200){
        loadData();
        ElMessage.success('删除成功');
      }
      else{
        ElMessage.error(res.msg);
      }
    }).catch((error) => {
      ElMessage.error('删除关键字失败' + error);
    })
  }).catch(() => {})
}

const editRef = ref(new Map());

const inputNameRef = ref(null);
const inputTableRowDataRef = ref(null);
const inputImportantlevelidRef = ref(null);
const inputRemarkRef = ref(null);

const editEditRef = (row,field) => {
  editRef.value.get(row.id)[field] = true;
  setTimeout(() => {
    if(field === 'editName'){
      inputNameRef.value.focus();
    }else if(field === 'editDataValue'){
      inputTableRowDataRef.value.focus();
    }else if(field === 'editImportantlevelid'){
      inputImportantlevelidRef.value.focus();
    }else if(field === 'editRemark'){
      inputRemarkRef.value.focus();
    }
  }, 0);
};

const saveEditRef = (row,field) => {
  editRef.value.get(row.id)[field] = false;
  request.evaluation.post('/evaluation/keywords', row).then((res) => {
    if(res.code === 200){
      loadData();
      ElMessage.success('修改成功');
    }
  }).catch((error) => {
    ElMessage.error('修改能力失败' + error);
  })
};

</script>

<style scoped>
</style>