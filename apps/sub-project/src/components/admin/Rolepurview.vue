<template>
  <el-container style="height: 92vh;">
    <!--    顶部按钮-->
    <el-header
        style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="primary" style="margin-left: 0.8vw" disabled>保存</el-button>
<!--      或者高度42-->
    </el-header>
<!--    @cell-click="getmenu"-->
    <el-main style="padding: 0;overflow: auto;">
      <!--生成-->
      <el-table :data="tableData" style="height: 100%; table-layout:auto; width: 100%;"
                :default-sort="{ prop: 'rolecode', order: 'ascending' }"
                stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="rolecode" label="角色代码" width="110"></el-table-column>
        <el-table-column prop="rolename" label="角色名称" min-width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="250"></el-table-column>

        <el-table-column prop="" label="操作">
          <template #default="{row}">
<!--            <el-button @click="edit(row)">编辑</el-button>-->
            <el-button v-blur-on-click @click="edit(row)" type="primary" :icon="Edit" circle />
          </template>
        </el-table-column>

      </el-table>
      <EditRoleList v-show="dialogVisible"  ref="testDialog" />

    </el-main>
  </el-container>
</template>
<script setup>
import {nextTick, reactive, ref,toRaw} from "vue";
import { Document, Folder ,Edit } from '@element-plus/icons-vue'
import request from "../../utils/request.js";
import { ElMessage } from "element-plus";
import EditRoleList from "./subcomponents/EditRoleList.vue"

const showmenu = ref(false);

const dialogVisible = ref(false);
const testDialog = ref(null);

const edit=(row)=>{
  dialogVisible.value = true;  // 打开弹窗
  console.log(toRaw(row));
  nextTick(() => {
    testDialog.value.init(toRaw(row));
  });
}

//初始化一个响应式的角色对象
const tableData = ref([]);

request.admin.get('/sysmangt/rolepurview')
    .then(res => {
      // 登录成功
      if (res.code === 200) {
        tableData.value = res.data;
        tableData.value.forEach(item => {   // 为每一个表格数据添加是否显示输入框的判定
          item.rolecode = Number(item.rolecode);
        });
      }
    }).catch(error => {
  // 获取失败
  ElMessage({
    type: 'error',
    message: '获取角色失败'
  });
});

//初始化一个响应式的权限列表
const rolepurviewData = ref([]);

const defaultProps = {
  children: 'children',
  label: 'name'
};

const initializeCheckStatus = (nodes) => {
  nodes.forEach(node => {
    // 根据 status 字段设置 checkedEdit 和 checkedView
    node.checkedEdit = node.status === '1';
    node.checkedView = node.status === '1' || node.status === '2';

    // 如果有子节点，递归初始化
    if (node.children && node.children.length > 0) {
      initializeCheckStatus(node.children);
    }
  });
};

const handleCheckChange = (data, key) => {
  if (key === 'edit') {
    if (data.checkedEdit) {
      data.status = '1'; // 两个都勾选
      data.checkedView = true; // 同步勾选查看
    } else {
      data.status = '3'; // 两个都不勾选
      data.checkedView = false; // 同步勾选查看
    }
  } else if (key === 'view') {
    if (data.checkedView) {
      if (!data.checkedEdit) {
        data.status = '2'; // 只勾选查看
      }
    } else {
      if (data.checkedEdit) {
        data.status = '1'; // 两个都勾选
      } else {
        data.status = '3'; // 两个都不勾选
      }
    }
  }
};



</script>

<style scoped>

</style>