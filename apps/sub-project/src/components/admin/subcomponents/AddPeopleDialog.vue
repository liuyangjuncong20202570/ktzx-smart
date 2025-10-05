<template>
  <div style="padding:0;margin:0;">
    <el-dialog
        :destroy-on-close="true" :show-close="false" :close-on-click-modal="false"
        style="width:40vw;" v-model="dialogVisible" @close="closeDialog">
      <el-container style="margin-left:0">
        <!-- 对话框头部区域 -->
        <el-header style="height: auto; padding: 2px 0px; width:100%; display: flex; align-items: center;">

        </el-header>
        <el-main style="padding-left:0">
          <el-form ref="formRef" :model="newform"  :rules="rules" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="newform.username"></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="loginname">
              <el-input v-model="newform.loginname" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
              <el-input type="password" v-model="newform.pwd" show-password></el-input>
            </el-form-item>
            <el-form-item :label="newform.catelog === '1' ? '学号' : '工号'" prop="personnelno">
              <el-input v-model="newform.personnelno"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="newform.phone"></el-input>
            </el-form-item>
            <el-form-item label="人员类别" prop="catelog">
              <el-radio-group v-model="newform.catelog">
                <el-radio label="1">学生</el-radio>
                <el-radio label="2">老师</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="状态" >
              <el-switch v-model="newform.status" :active-value="'1'" :inactive-value="'0'"></el-switch>
              <span style="margin-left: 10px; color: blue;">{{ newform.status === '1' ? '正常' : '停用' }}</span>
            </el-form-item>
            <el-form-item label="机构">
              <el-cascader
                  ref="mycascaderRef"
                  v-model="newform.obsid"
                  :options="obsmenulist"
                  :props="{ value: 'id', label: 'obsname', children: 'children',checkStrictly: true }"
                  filterable
                  clearable
                  :show-all-levels="true"
                  :checkStrictly="true"
                  :rules="rules.obsid"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="newform.remark" maxlength="3000"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" large style="width: 40%" @click="closeDialog">取消</el-button>
              <el-button type="success"  large style="width: 40%"  @click="submitForm">新增</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, defineExpose, watch, nextTick, onMounted, getCurrentInstance} from 'vue';
import request from "../../../utils/request.js";
import {ElMessage} from "element-plus";
import {Document, Folder} from "@element-plus/icons-vue";
import Peoplemangt from "../Peoplemangt.vue"

//显示弹窗组件
const dialogVisible = ref(false);

const newform = reactive({
  username: '',
  loginname: '',
  pwd: '123456',
  personnelno: '',
  phone: '',
  catelog: '', // default value
  status: '1', // default to '有效'
  obsid: '',
  obsname:'',
  remark: ''
});

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  loginname: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  personnelno: [{ required: true, message: '请输入学号/工号', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  catelog: [{ required: true, message: '请选择人员类别', trigger: 'change' }],
  obsid: [{ required: true, message: '请选择机构', trigger: 'change' }]
});

const formRef = ref(null);
const obsmenulist = ref([]);

//初始化，用于接受父组件传来的值，并发送请求获取菜单
function init(form,oriobsmenulist) {
  dialogVisible.value = true;
  obsmenulist.value = oriobsmenulist.value;
  // console.log(123)
  // console.log(oriobsmenulist.value)
  //将父组件中的form传入子组件中的form
  for (const key in form) {
    if (newform.hasOwnProperty(key)) {
      newform[key] = form[key];
    }
  }
  // fetchData();
  console.log(newform)
}

const emit = defineEmits(['formSubmitted']);


//将init函数暴露给父组件
defineExpose({ init });

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const { obsid, ...dataToSend } = newform;
      console.log(dataToSend);
      // 表单验证通过，处理表单提交逻辑
      request.admin.post('/sysmangt/personnelmangt/create', dataToSend)
          .then(res => {
            if (res.code === 200) {
              ElMessage({
                type: 'success',
                message: '新增人员成功'
              });
              emit('formSubmitted');
              closeDialog();
            }
            else {
              ElMessage.error(res.msg);
            }
          }).catch(error => {
        ElMessage({
          type: 'error',
          message: '新增人员成功'
        });
      });
    } else {
      // 表单验证未通过
      ElMessage({
        type: 'error',
        message: '请输入正确的信息'
      });
    }
  });
};


//关闭对话框方法
const closeDialog = () => {
  dialogVisible.value = false;
};


</script>
<style scoped>
/*覆盖el-dialog__header的样式*/
::v-deep(.el-dialog__header) {
  padding-top: 0;
  padding-bottom: 0;
}

/*覆盖el-dialog__body 的样式*/
::v-deep(.el-dialog__body) {
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