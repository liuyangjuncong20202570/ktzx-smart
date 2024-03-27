<template>
  <div style="padding:0;margin:0;">
    <el-dialog style="width:65vw;min-height:30vh" v-model="dialogVisible" @close="closeDialog">
      <el-container>
        <!-- 对话框头部区域 -->
        <el-header
          style="height: auto; padding: 2px 0px; width:100%; display: flex; align-items: center;">

        </el-header>
        <!-- 对话框内容区域 -->
        <el-main>
          <el-row style=" padding: 0; line-height:30px; background-color: #f5f7fa; border-bottom: 1px solid #ebeef5;font-size: 1.1em;">
            <el-col :span="16">功能菜单</el-col>
            <el-col :span="4" style="text-align: center;">查看</el-col>
            <el-col :span="4" style="text-align: center;">编辑</el-col>
          </el-row>
          <el-tree :data="rolepurviewData"
                   node-key="id"
                   highlight-current
                   :props="defaultProps"
                   :expand-on-click-node="true"
                   :check-on-click-node="false"
                   class="tree-with-header">
            <template #default="{ node, data }">
              <el-row class="custom-tree-node" justify="space-between">
                <!-- 第一个 el-col 靠左 -->
                <el-col :span="14" style="display: flex; align-items: center;width:200px">
                  <el-icon v-if="node.data.children" color="orange" style="margin-right: 8px;"><Folder /></el-icon>
                  <el-icon v-else color="dodgerblue" style="margin-right: 8px;"><Document /></el-icon>
                  <span>{{ node.label }}</span>
                </el-col>
                <div class="checkbox-container" style="position: absolute; right: 0; top: 0; display: flex;">
                      <el-checkbox v-model="data.checkedView" @change="() => handleCheckChange(node, data, 'view')"></el-checkbox>
                      <el-checkbox v-model="data.checkedEdit" @change="() => handleCheckChange(node, data, 'edit')"></el-checkbox>
                </div>
              </el-row>
            </template>
          </el-tree>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive,defineExpose } from 'vue';
import request from "../../../utils/request.js";
import {ElMessage} from "element-plus";
import {Document, Folder} from "@element-plus/icons-vue";

//显示弹窗组件
const dialogVisible = ref(false);

//存放父组件传过来的角色数据
const roledata =ref('')
//存放角色菜单数据
const rolepurviewData = ref([]);
//树型展开默认显示
const defaultProps = {
  children: 'children',
  label: 'name'
};

//初始化，用于接受父组件传来的值，并发送请求获取菜单
function init(row) {
  dialogVisible.value = true;
  roledata.value=row;
  console.log(row)
  console.log(dialogVisible.value)

  getmenu(row);
}

//将init函数暴露给父组件
defineExpose({ init });

//关闭对话框方法
const closeDialog = () => {
  dialogVisible.value = false;
};

//从后端请求菜单数据
const getmenu = (row) => {
  // console.log(row.rolecode);
  // console.log(row.id);
  request.admin.get('/sysmangt/rolepurview/menus?id=' + row.id)
      .then(res => {
        if (res.code === 200) {
          // showmenu.value = true;
          rolepurviewData.value = res.data;
          // 初始化 checkedEdit 和 checkedView
          initializeCheckStatus(rolepurviewData.value);
          // console.log(res.data);
          console.log(rolepurviewData.value);
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '获取角色对应菜单列表失败'
    });
  });
};

//初始化两个状态选择框
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
//处理更改状态权限的逻辑
const handleCheckChange = (node, data, key) => {
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

  const menuname = node.label;
  // console.log(menuname);
  const updateItem = ref({
    "id":String(data.id),
    "roleid":String(roledata.value.id),
    "status":String(data.status),
  })
//调取更新接口
  updateRole(menuname ,updateItem)

};

//更新对应的状态权限
const updateRole=(menuname , Item)=>{
  console.log("menuname",menuname);
  console.log("ID",Item.value.id);
  console.log("rolecode",Item.value.rolecode);
   console.log("Item",Item.value.status);

  request.admin.post('/sysmangt/rolepurview',Item.value)
      .then(res => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: `成功修改  ${menuname}  权限为  ${getStatusMessage(Item.value.status)} `
          })
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '获取角色权限列表失败'
    });
  });
}

// 修改status的值
function getStatusMessage(status) {
  switch (status) {
    case '1':
      return `编辑`;
    case '2':
      return `只读`;
    case '3':
      return `不可见`;
    default:
      return `未知权限`; // 如果 status 不是 1、2 或 3
  }
}


</script>
<style scoped>
/*覆盖el-dialog__header的样式*/
/deep/ .el-dialog__header {
  padding-top: 0;
  padding-bottom: 0;
}

/*覆盖el-dialog__body 的样式*/
/deep/.el-dialog__body{
  padding-top: 5px;
  padding-bottom: 5px;
}

/*修改树状节点样式*/
.custom-tree-node {
  display: flex;
  justify-content: space-between; /* This will push the checkbox-container to the right */
  align-items: center;
  width: 100%; /* Ensure the tree node takes full width */
}
/*修改点击框样式*/
.checkbox-container {
  display: flex;
  gap: 8vw;
  margin-right:5vw;
}

/* Adjust the negative margin to align with the header */
.tree-with-header .el-tree {
  margin-top: -30px;
}

</style>