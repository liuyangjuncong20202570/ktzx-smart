<template>
  <el-dialog :visible.sync="dialogVisible" title="添加数据">
    <div style="height:500px;text-align:center">
    <el-form :model="formData">
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="登录名">
        <el-input v-model="formData.loginname"></el-input>
      </el-form-item>
      <!-- 添加其他表单项... -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </el-form-item>
    </el-form>
      </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  dialogVisible: Boolean
});

const emit = defineEmits(['update:dialogVisible']);

const formData = ref({
  username: '',
  loginname: '',
  pwd: '',
  personnelno: '',
  phone: '',
  catelog: '',
  status: '',
  obsname: '',
  remark: ''
});

function submitForm() {
  // 在这里处理表单提交，例如发送请求到后端
  console.log(formData.value);
  emit('update:dialogVisible', false); // 关闭弹窗
  // 清空表单
  Object.keys(formData.value).forEach(key => {
    formData.value[key] = '';
  });
}

function updateVisibility(value) {
  emit('update:dialogVisible', value);
}
</script>
