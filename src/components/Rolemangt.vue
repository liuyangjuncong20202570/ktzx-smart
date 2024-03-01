<template>
  <el-container style="height: 92vh;">
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
      <el-button type="success" @click="">保存</el-button>
    </el-header>
    <el-main style="padding: 0;">
      <!--生成-->
      <el-table :data="tableData" style="table-layout:auto; width: 100%;" v-model="selected"
        @select="handleSelect" @select-all="handleSelectAll" stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="55">
          <template v-slot="row">
            <span>{{ row.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rolename" label="角色名称" width="220">
          <template #default="{ row }">
            <el-input v-if="row.editingRolename" style="width: 190px; height: 25px;" v-model="row.rolename" @blur="handleBlur(row, 'editingRolename')"></el-input>
            <div v-else style="width: 200px; height: 25px;" @click="handleClick(row, 'editingRolename')">{{ row.rolename }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="roletype" label="角色类型" width="220">
          <template #default="{ row }">
            <el-input v-if="row.editingRoletype" style="width: 190px; height: 25px;" v-model="row.roletype" @blur="handleBlur(row, 'editingRoletype')"></el-input>
            <div v-else style="width: 200px; height: 25px;" @click="handleClick(row, 'editingRoletype')">{{ row.roletype }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="homepage" label="首页" width="220">
          <template #default="{ row }">
            <el-input v-if="row.editingHomepage" style="width: 190px; height: 25px;" v-model="row.homepage" @blur="handleBlur(row, 'editingHomepage')"></el-input>
            <div v-else style="width: 200px; height: 25px;" @click="handleClick(row, 'editingHomepage')">{{ row.homepage }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="roletype" label="首页地址" width="220">
          <template #default="{ row }">
            <el-input v-if="row.editingHomeUrl" style="width: 190px; height: 25px;" v-model="row.homeUrl" @blur="handleBlur(row, 'editingHomeUrl')"></el-input>
            <div v-else style="width: 200px; height: 25px;" @click="handleClick(row, 'editingHomeUrl')">{{ row.homeUrl }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="homepage" label="角色描述">
          <template #default="{ row }">
            <el-input v-if="row.editingRoleDescri" style="height: 25px;" v-model="row.roleDescri" @blur="handleBlur(row, 'editingRoleDescri')"></el-input>
            <div v-else style="width: 200px; height: 25px;" @click="handleClick(row, 'editingRoleDescri')">{{ row.roleDescri }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

  </el-container>
</template>
<script setup>
import { reactive, ref } from "vue";
import { Edit, Right } from '@element-plus/icons-vue'
import request from "../utils/request.js";
import router from "../router/index.js";
import { ElMessage, ElMessageBox } from 'element-plus';

const dialogVisible = ref(false);
const Addform = ref({
  name: '',
  type: '',
  homepagename: '',
  homepageurl: '',
});
// 添加角色
const handleRoleAdd = () => {
  // console.log(dialogVisible.value)
  // dialogVisible.value = true; // 使用 .value 来设置 dialogVisible
  // console.log(dialogVisible.value)
  tableData.value.push({
    id: '',
    rolename: '',
    roletype: '',
    homepage: '',
    editingRolename: false,
    editingRoletype: false,
    editingHomepage: false,
    editingHomeUrl: false,
    editingRoleDescri: false,
  });
};
// 确定新增角色
const confirmAdd = () => {
  // 处理添加逻辑
  dialogVisible.value = false; // 使用 .value 来设置 dialogVisible
  console.log(Addform.value); // 使用 .value 来访问 Addform
};

const selected = ref([]);

/*判定哪些行被选中*/
const handleSelect = (selection) => {
  selected.value = selection;
};

const handleSelectAll = (selection) => {
  selected.value = selection;
};
/*****************/

const handleClick = (row, field) => {
  row[field] = true
  console.log(row);
};

const handleBlur = (row, field) => {
  row[field] = false;
  console.log(row);
};

const handleRoleDel = () => {
  if(selected){
    ElMessageBox.confirm(
      '选中的角色将被删除，是否确定',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        tableData.value = tableData.value.filter((row) => !selected.value.includes(row));
        ElMessage({
          type: 'success',
          message: '删除成功',
          duration: 800
        })
      }).catch(() => {});
  }
};

// const Addrules = reactive({
//   name: [
//     { required: true, message: '请输入角色名称', trigger: 'blur' },
//     { min: 2, max: 30, message: '角色名称长度在 2 到 30 个字符', trigger: 'blur' }
//   ],
//   type: [
//     { required: true, message: '请输入角色类型', trigger: 'blur' },
//     // 更多验证规则
//   ],
//   homepagename: [
//     { required: true, message: '请输入首页名称', trigger: 'blur' },
//     // 更多验证规则
//   ],
//   homepageurl: [
//     { required: true, message: '请输入首页地址', trigger: 'blur' },
//     // 更多验证规则
//   ],
//   description: [
//     { required: true, message: '请输入角色描述', trigger: 'blur' },
//     // 更多验证规则
//   ],
//   permissions: [
//     { type: 'array', required: true, message: '请至少选择一个权限', trigger: 'change' }
//   ],
//   // 更多验证规则
// })


const tableData = ref([
// {
//   id: '1',
//   rolename: '超级管理员',
//   roletype: '系统管理员',
//   homepage: '首页',
//   homeUrl: '',
//   roleDescri: ''
// },
// {
//   id: '2',
//   rolename: '管理员',
//   roletype: '系统管理员',
//   homepage: '首页',
//   homeUrl: '',
//   roleDescri: ''
// },
// {
//   id: '3',
//   rolename: '普通用户',
//   roletype: '普通用户',
//   homepage: '首页',
//   homeUrl: '',
//   roleDescri: ''
// }
]);

tableData.value.forEach(item => {   // 为每一个表格数据添加是否显示输入框的判定
  item.editingRolename = false;
  item.editingRoletype = false;
  item.editingHomepage = false;
  item.editingHomeUrl = false;
  item.editingRoleDescri = false;
});

request.get('/sysmangt/rolemangt')
  .then(res => {
    // 登录成功
    if (res.code === 200) {
      tableData.value = res.data;
    }
  }).catch(error => {
    // 获取失败
    ElMessage({
      type: 'error',
      message: '获取角色失败'
    });
  });
</script>

<style scoped>
.custom-icon:hover {
  color: rgb(0, 115, 255) !important;
  cursor: pointer;
}
</style>