<template>
  <el-container>
    <!--两个按钮，靠最左-->
    <el-header
      style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="primary" style="margin-left: 0.8vw;margin-right: 0.8vw;" @click="handleRoleAdd">添加</el-button>

      <el-dialog :modelValue="dialogVisible" :show-close="false" :close-on-click-modal="false" title="新增角色">
        <!-- 弹窗内容 -->
        <el-form ref="form" :model="Addform" :rules="Addrules" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="Addform.name" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色类型" prop="type">
            <el-input v-model="Addform.type" placeholder="请输入角色类型"></el-input>
          </el-form-item>
          <el-form-item label="首页名称" prop="homepagename">
            <el-input v-model="Addform.homepagename" placeholder="请输入首页名称"></el-input>
          </el-form-item>
          <el-form-item label="首页地址" prop="homepageurl">
            <el-input v-model="Addform.homepageurl" placeholder="请输入首页地址"></el-input>
          </el-form-item>
          <!-- 添加更多表单项 -->
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="Addform.description" type="textarea" placeholder="请输入角色描述"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </span>
      </el-dialog>

      <el-button type="danger" @click="handleRoleDel">删除</el-button>
    </el-header>
    <el-main>
      <!--生成-->
      <el-table :data="tableData" style="table-layout:auto;width: 100%;" stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="" width="55"></el-table-column>
        <el-table-column prop="rolename" label="角色名称"></el-table-column>
        <el-table-column prop="roletype" label="角色类型"></el-table-column>
        <el-table-column prop="homepage" label="首页"></el-table-column>
        <el-table-column label="操作">
          <!-- 添加一个el-icon-->
          <!--鼠标悬浮颜色改成蓝色-->
          <el-icon class="custom-icon" style="float:left;margin-top:2px;margin-left:3px" @click="handleRoleEdit">
            <Edit />
          </el-icon>

        </el-table-column>
      </el-table>
    </el-main>

  </el-container>
</template>
<script setup>
import { reactive, ref } from "vue";
import { Edit, Right } from '@element-plus/icons-vue'

const dialogVisible = ref(false);
const Addform = ref({
  name: '',
  type: '',
  homepagename: '',
  homepageurl: '',
});
// 添加角色
const handleRoleAdd = () => {
  console.log(dialogVisible.value)
  dialogVisible.value = true; // 使用 .value 来设置 dialogVisible
  console.log(dialogVisible.value)

};
// 确定新增角色
const confirmAdd = () => {
  // 处理添加逻辑
  dialogVisible.value = false; // 使用 .value 来设置 dialogVisible
  console.log(Addform.value); // 使用 .value 来访问 Addform
};

const Addrules = reactive({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 30, message: '角色名称长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请输入角色类型', trigger: 'blur' },
    // 更多验证规则
  ],
  homepagename: [
    { required: true, message: '请输入首页名称', trigger: 'blur' },
    // 更多验证规则
  ],
  homepageurl: [
    { required: true, message: '请输入首页地址', trigger: 'blur' },
    // 更多验证规则
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' },
    // 更多验证规则
  ],
  permissions: [
    { type: 'array', required: true, message: '请至少选择一个权限', trigger: 'change' }
  ],
  // 更多验证规则
})


const tableData = ref([
  {
    id: '1',
    rolename: '超级管理员',
    roletype: '系统管理员',
    homepage: '首页'
  },
  {
    id: '2',
    rolename: '管理员',
    roletype: '系统管理员',
    homepage: '首页'
  },
  {
    id: '3',
    rolename: '普通用户',
    roletype: '普通用户',
    homepage: '首页'
  }
])
const handleRoleEdit = (row) => {
  dialogVisible.value = true;
  console.log(row)
}


</script>

<style scoped>
.custom-icon:hover {
  color: rgb(0, 115, 255) !important;
  cursor: pointer;
}
</style>