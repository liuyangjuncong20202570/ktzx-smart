<template>
  <div style="padding:0;margin:0;">
    <el-dialog
        :destroy-on-close="true" :show-close="false" :close-on-click-modal="false"
        style="width:40vw;" v-model="dialogVisible" @close="closeDialog">
      <el-container style="margin-left:0">
        <!-- 对话框头部区域 -->
        <el-header style="height: auto; padding: 2px 0px; width:100%; display: flex; align-items: center;">
        </el-header>
        <el-main>
          <el-form ref="formRef" :model="newform" :rules="rules" label-width="100px">
            <el-select v-model="newform.term" placeholder="请选择学期">
              <el-option
                  v-for="term in terms"
                  :key="term"
                  :label="term"
                  :value="term">
              </el-option>
            </el-select>

            <el-form-item label="课程名称(中文)" prop="">
              <el-input v-model="newform.courseChineseName" placeholder="请输入中文课程名称"></el-input>
            </el-form-item>
            <el-form-item label="课程名称(英文)" prop="">
              <el-input v-model="newform.courseEnglishName" placeholder="请输入英文课程名称"></el-input>
            </el-form-item>
            <el-form-item label="课程代码" prop="">
              <el-input v-model="newform.courseCode" placeholder="请输入课程代码"></el-input>
            </el-form-item>

            <el-form-item label="选择专业" prop="id">
              <!--              <el-input v-model=""></el-input>-->
              <el-select-v2
                  v-model="newform.id"
                  :options="options"
                  placeholder="选择专业"
              />
            </el-form-item>
            <el-form-item label="选择负责人" prop="">
              <!--              <el-input v-model=""></el-input>-->
              <el-select-v2
                  v-model="newform.id"
                  :options="options"
                  placeholder="选择专业"
              />
            </el-form-item>
           
            <el-form-item>
              <el-button type="info" large style="width: 40%" @click="closeDialog">取消</el-button>
              <el-button type="success" large style="width: 40%" @click="submitForm">新增</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>
<script setup>
import {ref, reactive, defineExpose, computed, watch, nextTick, onMounted, getCurrentInstance} from 'vue';

import {ElMessage} from "element-plus";
import {Document, Folder} from "@element-plus/icons-vue";
import request from "../../../utils/request.js";

import Coursemangt from "../Coursemangt.vue"

const dialogVisible = ref(false);
const newform = reactive({
  term: '',
  id: '',
  classname: '',
  grade: '',
  remark: ''
});

function init() {
  dialogVisible.value = true;

}

const emit = defineEmits(['formSubmitted']);
defineExpose({init});

</script>
<style scoped>

</style>