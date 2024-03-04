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
        <el-row style="line-height: 40px; background-color: #f5f7fa; border-bottom: 1px solid #ebeef5;">
          <el-col :span="24">学校院系</el-col>
        </el-row>
        <el-tree
            :data="mangtlist"
            node-key="id"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            :check-on-click-node="false"
            class="tree-with-header"
        > </el-tree>
      </el-aside>
      <!--右侧-->
      <el-main v-show="showmenu" style="height: 100%; width:40vw; border: 1px solid #ccc;">
        ccc
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

//初始化一个响应式的角色对象
const mangtlist = ref([]);

request.get('/sysmangt/personnelmangt')
    .then(res => {
      // 登录成功
      if (res.code === 200) {
        mangtlist.value = res.data;
      }
    }).catch(error => {
  // 获取失败
  ElMessage({
    type: 'error',
    message: '获取组织机构列表失败'
  });
});

const defaultProps = {
  children: 'children',
  label: 'obsname'
};

const getmenu = (row) => {
  console.log(row.rolecode);
  showmenu.value = true;
  // request.get('/sysmangt/rolepurview/menus?rolecode=' + row.rolecode)
  //     .then(res => {
  //       if (res.code === 200) {
  //         showmenu.value = true;
  //         rolepurviewData.value = res.data;
  //         // 初始化 checkedEdit 和 checkedView
  //         initializeCheckStatus(rolepurviewData.value);
  //         // console.log(res.data);
  //         console.log(rolepurviewData.value);
  //       }
  //     }).catch(error => {
  //   ElMessage({
  //     type: 'error',
  //     message: '获取角色权限列表失败'
  //   });
  // });
};

</script>

<style scoped>
</style>