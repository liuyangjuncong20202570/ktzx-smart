<template>
  <div style="padding:0;margin:0;">
    <el-dialog
        :destroy-on-close="true" :show-close="false" :close-on-click-modal="false"
        style="width:50vw;" v-model="EditdialogVisible" @close="closeDialog">
      <el-container style="margin-left:0">
        <!-- 对话框头部区域 -->
        <el-header style="height: auto; padding: 2px 0px; width:100%; display: flex; align-items: center;">
        </el-header>
        <el-main>
          <el-form ref="formRef" :model="newform" :rules="rules" label-width="120px">
            <el-form-item label="课程名称" prop="">
              <el-input disabled v-model="newform.courseChineseName"></el-input>
            </el-form-item>
            <el-form-item label="课堂名称" prop="classroomName">
              <el-input v-model="newform.classroomName" placeholder="请输入课堂名称"></el-input>
            </el-form-item>
            <el-form-item label="讲授学时" prop="teachTime">
              <el-input v-model="newform.teachTime" placeholder="请输入讲授学时"></el-input>
            </el-form-item>
            <el-form-item label="实验学时" prop="labTime">
              <el-input v-model="newform.labTime" placeholder="请输入实验学时"></el-input>
            </el-form-item>
            <el-form-item label="实践学时" prop="practiceTime">
              <el-input v-model="newform.practiceTime" placeholder="请输入实践学时"></el-input>
            </el-form-item>

            <el-form-item label="主讲教师" prop="">
              <el-cascader
                  ref="mainteacherref"
                  v-model="mainteacherid"
                  :options="teacherlist"
                  placeholder="请选择主讲教师"
                  :props="{ value: 'id', label: 'label', children: 'children', emitPath: false }"
                  filterable
                  clearable
                  :show-all-levels="false"
                  @focus="fetchData"
                  change-on-select
                  @change="(value) => handleCascaderChange('mainteacher', value)"
                  style="width: 100%;"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="实验教师" prop="">
              <el-cascader
                  ref="labteacherref"
                  v-model="labteacherid"
                  :options="teacherlist"
                  placeholder="请选择实验教师"
                  :props="{ value: 'id', label: 'label', children: 'children', emitPath: false }"
                  filterable
                  clearable
                  :show-all-levels="false"
                  @focus="fetchData"
                  change-on-select
                  @change="(value) => handleCascaderChange('labteacher', value)"
                  style="width: 100%;"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="实践教师" prop="">
              <el-cascader
                  ref="practiceteacherref"
                  v-model="practiceteacherid"
                  :options="teacherlist"
                  placeholder="请选择实践教师"
                  :props="{ value: 'id', label: 'label', children: 'children', emitPath: false }"
                  filterable
                  clearable
                  :show-all-levels="false"
                  @focus="fetchData"
                  change-on-select
                  @change="(value) => handleCascaderChange('practiceteacher', value)"
                  style="width: 100%;"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item style="display: flex; justify-content: center; gap: 20px;">
              <el-button type="info" large style="width: 40%;" @click="closeDialog">取消</el-button>
              <el-button type="success" large style="width: 40%;" @click="submitForm">新增</el-button>
            </el-form-item>

          </el-form>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>
<script setup>
import {ref, reactive, defineExpose, nextTick, onMounted, getCurrentInstance, computed, onBeforeUnmount} from 'vue';

import {ElMessage, ElMessageBox} from "element-plus";
import request from "../../../utils/request.js";
import Classroommangt from "../Classroommangt.vue"

const EditdialogVisible = ref(false);

const mainteacherid = ref('');
const labteacherid = ref('');
const practiceteacherid = ref('');
const mainteachername = ref('');
const labteachername = ref('');
const practiceteachername = ref('');


const teacherlist = ref([]);
const alreadyteacheridlist = ref([])

const resetform = () => {
  mainteacherid.value = '';
  labteacherid.value = '';
  practiceteacherid.value = '';
  mainteachername.value = null;
  labteachername.value = null;
  practiceteachername.value = null;
}

function createForm() {
  return reactive({
    courseid: '',
    courseChineseName: '',
    classroomName: '',
    teachTime: '',
    labTime: '',
    practiceTime: '',
    // teacherId: '',
    // labTeacherId: '',
    // practiceTeacherId: '',
  });
}

const newform = createForm();
const oldform = createForm();


const emit = defineEmits(['formSubmitted']);
defineExpose({init});
const rules = reactive({
  classroomName: [{required: true, message: '请输入课堂名称', trigger: 'blur'}],
  teachTime: [{required: true, message: '请输入讲授时长', trigger: 'blur'}],
  labTime: [{required: true, message: '请输入实验时长', trigger: 'blur'}],
  practiceTime: [{required: true, message: '请输入实践时长', trigger: 'blur'}],
});


function init(row) {
  fetchData().then(() => {
    EditdialogVisible.value = true;
    Object.keys(row).forEach(key => {
      if (newform.hasOwnProperty(key) && oldform.hasOwnProperty(key)) {
        newform[key] = row[key];  // 使用 row[key] 而不是 row.value[key]
        oldform[key] = row[key];
      }
    });
    console.log(" row.teacherId", row.teacherId)
    // 确保在数据加载后再设置绑定值
    nextTick(() => {
      mainteacherid.value = row.teacherId;
      labteacherid.value = row.labTeacherId;
      practiceteacherid.value = row.practiceTeacherId;
    });
  });
}


const fetchData = () => {
  return request.course.post('/coursemangt/course/courseRP')
      .then(res => {
        if (res.code === 200) {
          console.log('Fetched data:', res.data); // Log fetched data
          //不过滤指定学院
          teacherlist.value = formatDataForCascader(res.data, alreadyteacheridlist.value);
          console.log('Formatted teacher list:', teacherlist.value); // Log formatted teacher list
        }
      }).catch(error => {
        ElMessage({
          type: 'error',
          message: '获取列表失败'
        });
      });
};

const formatDataForCascader = (nodes, selectedTeacherIds) => {
  const formatNode = (node) => {
    const formattedNode = {
      ...node,
      label: node.obsname,
    };
    if (node.children && node.children.length > 0) {
      formattedNode.children = node.children.map(formatNode).filter(child => child !== null);
    }
    if (node.responsiblePerson && node.responsiblePerson.length > 0) {
      const filteredTeachers = node.responsiblePerson.filter(teacher => !selectedTeacherIds.includes(teacher.id));
      if (filteredTeachers.length > 0) {
        formattedNode.children = (formattedNode.children || []).concat(
            filteredTeachers.map(teacher => ({
              id: teacher.id,
              label: teacher.username,
              isLeaf: true,
            }))
        );
      }
    }
    return formattedNode.children && formattedNode.children.length > 0 ? formattedNode : null;
  };
  return nodes.map(formatNode).filter(node => node !== null);
};

const findNodeById = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const handleCascaderChange = (data, value) => {
  if (value && value.length > 0) {
    const lastSelectedNode = findNodeById(teacherlist.value, value);
    if (lastSelectedNode) {
      if (data === 'mainteacher') {
        mainteacherid.value = lastSelectedNode.id;
        mainteachername.value = lastSelectedNode.label;
      } else if (data === 'labteacher') {
        labteacherid.value = lastSelectedNode.id;
        labteachername.value = lastSelectedNode.label;
      } else if (data === 'practiceteacher') {
        practiceteacherid.value = lastSelectedNode.id;
        practiceteachername.value = lastSelectedNode.label;
      }
    }
  } else {
    // 如果没有选中任何节点，可以根据需求清空 teacherid 或设置为默认值
    if (data === 'mainteacher') {
      mainteacherid.value = null;
      mainteachername.value = null;
    } else if (data === 'labteacher') {
      labteacherid.value = null;
      labteachername.value = null;
    } else if (data === 'practiceteacher') {
      practiceteacherid.value = null;
      practiceteachername.value = null;
    }
  }
};

const closeDialog = () => {
  EditdialogVisible.value = false;
};

async function submitForm() {


  const newClassroomform = ref({
    courseId: newform.courseid,
    courseChineseName: newform.courseChineseName,
    classroomName: newform.classroomName,
    teacherId: mainteacherid.value,
    teacherName: mainteachername.value,
    labteacherId: labteacherid.value,
    labTeacher: labteachername.value,
    practiceteacherId: practiceteacherid.value,
    practiceTeacher: practiceteachername.value,
    teachTime: newform.teachTime,
    labTime: newform.labTime,
    practiceTime: newform.practiceTime,
  });
  console.log(newClassroomform.value)
  console.log(teacherlist.value)
}


onMounted(() => {
  resetform();
})

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
  margin-right: 5vw;
}

/* Adjust the negative margin to align with the header */
.tree-with-header .el-tree {
  margin-top: -30px;
}
</style>