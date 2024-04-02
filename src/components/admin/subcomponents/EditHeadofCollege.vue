<template>
  <div style="padding:0;margin:0;">
    <el-dialog
        :destroy-on-close="true" :show-close="false" :close-on-click-modal="false"
        style="min-width:60vw;" v-model="dialogVisible" @close="closeDialog">
      <el-container style="margin-left:0">
        <!-- 对话框头部区域 -->
        <el-header style="height: auto; padding: 2px 0px; width:100%; display: flex; align-items: center;">
        </el-header>
        <el-main style="padding-left:0">
          <el-table :data="userlist">
            <el-table-column type="index" label="序号" min-width="50"></el-table-column>
            <el-table-column label="所属院系" min-width="200">{{ obsname }}</el-table-column>
            <el-table-column prop="username" label="教师用户名" min-width="100"></el-table-column>
            <el-table-column label="操作" width="120">
              <el-icon class="CloseBold-icon" @click="showHeadofDialog(row)">
                <CloseBold/>
              </el-icon>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, defineExpose, watch, nextTick, onMounted, getCurrentInstance} from 'vue';

import {ElMessage} from "element-plus";
import {Document, Edit, Folder} from "@element-plus/icons-vue";
import Collegemangt from "../Collegemangt.vue"
import request from "../../../utils/request.js";
import {CloseBold} from '@element-plus/icons-vue';

//显示弹窗组件
const dialogVisible = ref(false);

const obsname = ref('');
const obsid = ref('')
const formRef = ref(null);
const userlist = ref([]);
const options = ref([]);

//初始化，用于接受父组件传来的值，并发送请求获取菜单
function init(Parentrow) {
  dialogVisible.value = true;
  userlist.value = Parentrow.stUsersList;
  obsname.value = Parentrow.obsname;
  obsid.value = Parentrow.obsid;
}

const emit = defineEmits(['formSubmitted']);


//将init函数暴露给父组件
defineExpose({init});

const submitForm = () => {


  formRef.value.validate((valid) => {
    if (valid) {
      console.log(newform);
      // // 表单验证通过，处理表单提交逻辑
      request.admin.post('/sysmangt/classmangt/create', newform)
          .then(res => {
            if (res.code === 200) {
              ElMessage({
                type: 'success',
                message: '新增班级成功'
              });
              emit('formSubmitted');
              closeDialog();

            }
          }).catch(error => {
        ElMessage({
          type: 'error',
          message: '新增班级失败'
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
::v-deep(.el-table .cell) {
  text-align: center;
}

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

.CloseBold-icon {
  cursor: pointer; /* 鼠标悬停时变成手形指针 */
  white-space: nowrap; /* 防止文本换行 */
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out; /* 添加颜色变化和旋转动画 */

}

.CloseBold-icon:hover {
  color: #FF4949; /* 悬浮时的颜色 */
  transform: rotate(-90deg); /* 悬浮时旋转180度 */

}
</style>