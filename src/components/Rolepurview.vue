<template>
  <el-container>
    <!--    顶部按钮-->
    <el-header
        style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="primary" style="margin-left: 0.8vw;margin-right: 0.8vw;">保存</el-button>
    </el-header>
    <el-container>
      <!--左侧-->
      <el-aside style="height: calc(100vh - 104px) ;width:35vw;float: left; border: 1px solid #ccc;">
        <el-table :data="roleData" style="table-layout:auto;width: 100%;" @cell-click="getmenu" stripe>
          <el-table-column prop="rolecode" label="" width="55"></el-table-column>
          <el-table-column prop="rolename" label="角色类型"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>
      </el-aside>
      <!--右侧-->
      <el-main style="height:calc(100vh - 104px) ; width:40vw;float: right; border: 1px solid #ccc;">
        <el-tree
            v-show=showmenu
            show-checkbox="true"
            :data="rolepurviewData"
            node-key="id"
            highlight-current
            :props="defaultProps"
        >
        </el-tree>

      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import {reactive, ref} from "vue";
import {Edit, Right} from '@element-plus/icons-vue'
import request from "../utils/request.js";
import {ElMessage} from "element-plus";

const showmenu = ref(false);
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

const rolepurviewData = ref([]);

const defaultProps = {
  children: 'children',
  label: 'name'
};


const getmenu = (row) => {
  console.log(row.rolecode);
  request.get('/sysmangt/rolepurview/menus?rolecode='+ row.rolecode)
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          showmenu.value = true;
          rolepurviewData.value = res.data;
          console.log(res.data);
        }
      }).catch(error => {
    // 获取失败
    ElMessage({
      type: 'error',
      message: '获取角色权限列表失败'
    });
  });
};

</script>

<style scoped>
.custom-icon:hover {
  color: rgb(0, 115, 255) !important;
  cursor: pointer;
}
</style>