<template>
  <el-container style="height: 92vh; color: grey;">
    <!--    顶部按钮-->
    <el-header
        style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="primary" style="margin-left: 0.8vw;margin-right: 0.8vw;">保存</el-button>
    </el-header>
    <el-container>
      <!--左侧-->
      <el-aside style="height: 100%;width:35vw;float: left; border: 1px solid #ccc;">
        <el-table :data="roleData" style="table-layout:auto; width: 100%;" @cell-click="getmenu" stripe>
          <el-table-column label="" width="55">
            <template v-slot="row">{{ row.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="rolename" label="角色类型"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>
      </el-aside>
      <!--右侧-->
      <el-main v-show="showmenu" style="height: 100%; width:40vw; border: 1px solid #ccc;">
        <!-- 表头 -->
        <el-row style="line-height: 40px; background-color: #f5f7fa; border-bottom: 1px solid #ebeef5;">
          <el-col :span="16">功能菜单</el-col>
          <el-col :span="4" style="text-align: center;">查看</el-col>
          <el-col :span="4" style="text-align: center;">编辑</el-col>
        </el-row>
        <!-- 树形菜单 -->
        <el-tree
            :data="rolepurviewData"
            node-key="id"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            :check-on-click-node="false"
            class="tree-with-header"
        >
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <span>
                <el-icon v-if="node.data.children" color="orange"><Folder /></el-icon>
                <el-icon v-else color="dodgerblue"><Document /></el-icon>
                {{ node.label }}
              </span>
              <div class="checkbox-container">
                <el-checkbox v-model="data.checkedView" @change="() => handleCheckChange(data, 'view')"></el-checkbox>
                <el-checkbox v-model="data.checkedEdit" @change="() => handleCheckChange(data, 'edit')"></el-checkbox>
              </div>
            </div>
          </template>
        </el-tree>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import { reactive, ref } from "vue";
import { Document, Folder } from '@element-plus/icons-vue'
import request from "../../utils/request.js";
import { ElMessage } from "element-plus";

const showmenu = ref(false);

//初始化一个响应式的角色对象
const roleData = ref([]);

request.get('/sysmangt/rolepurview')
    .then(res => {
      // 登录成功
      if (res.code === 200) {
        roleData.value = res.data;
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


const getmenu = (row) => {
  console.log(row.rolecode);
  request.get('/sysmangt/rolepurview/menus?rolecode=' + row.rolecode)
      .then(res => {
        if (res.code === 200) {
          showmenu.value = true;
          rolepurviewData.value = res.data;
          // 初始化 checkedEdit 和 checkedView
          initializeCheckStatus(rolepurviewData.value);
          // console.log(res.data);
          console.log(rolepurviewData.value);
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '获取角色权限列表失败'
    });
  });
};

</script>

<style scoped>

.custom-tree-node {
  display: flex;
  justify-content: space-between; /* This will push the checkbox-container to the right */
  align-items: center;
  width: 100%; /* Ensure the tree node takes full width */
}

.checkbox-container {
  display: flex;
  gap: 6vw; /* Adjust the gap between checkboxes */
  margin-right:4vw;
}

/* Adjust the negative margin to align with the header */
.tree-with-header .el-tree {
  margin-top: -30px;
}

/* 可以添加额外的样式来满足你的具体设计需求 */
</style>