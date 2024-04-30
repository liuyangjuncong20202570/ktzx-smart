<template>
  <div style="padding:0;margin:0;">
    <el-dialog
        :destroy-on-close="true" :show-close="false" :close-on-click-modal="false"
        style="width:50vw;" v-model="AdddialogVisible" @close="closeDialog">
      <el-container style="margin-left:0">
        <!-- 对话框头部区域 -->
        <el-header style="height: auto; padding: 2px 0px; width:100%; display: flex; align-items: center;">
        </el-header>
        <el-main>
          <el-form ref="formRef" :model="newform" :rules="rules" label-width="150px">
            <el-form-item label="学期" prop="">
              <el-input disabled v-model="newform.term"></el-input>
            </el-form-item>
            <el-form-item label="课程名称(中文)" prop="courseChineseName">
              <el-input v-model="newform.courseChineseName" placeholder="请输入中文课程名称"></el-input>
            </el-form-item>
            <el-form-item label="课程名称(英文)" prop="courseEnglishName">
              <el-input v-model="newform.courseEnglishName" placeholder="请输入英文课程名称"></el-input>
            </el-form-item>
            <el-form-item label="课程代码" prop="courseCode">
              <el-input v-model="newform.courseCode" placeholder="请输入课程代码"></el-input>
            </el-form-item>
            <el-form-item label="所属专业" prop="">
              <el-input disabled v-model="newform.professionName"></el-input>
            </el-form-item>

            <el-form-item label="课程负责人" prop="">
              <el-cascader
                  ref="myteacherref"
                  v-model="teacherid"
                  :options="teacherlist"
                  placeholder="请选择负责人"
                  :props="{ value: 'id', label: 'label', children: 'children', emitPath: false, multiple: true}"
                  filterable
                  clearable
                  :show-all-levels="false"
                  @focus="fetchData"
                  change-on-select
                  @change="handleCascaderChange"
                  style="width: 100%;"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item style="display: flex; justify-content: center; gap: 20px;">
              <el-button type="info" large style="width: 40%;" @click="closeDialog">取消</el-button>
              <el-button type="success" large style="width: 40%;" @click="submitForm">提交修改</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>
<script setup>
import {ref, reactive, defineExpose, nextTick, onMounted, getCurrentInstance} from 'vue';

import {ElMessage, ElMessageBox} from "element-plus";
import request from "../../../utils/request.js";
import Coursemangt from "../Coursemangt.vue"
import {exportTableToCSV} from "../../../utils/exportTableToCSV.js";

const AdddialogVisible = ref(false);


function createForm() {
  return reactive({
    id: '',
    term: '',
    courseChineseName: '',
    courseEnglishName: '',
    courseCode: '',
    professionName: '',
    professionId: '',
    responsiblePersonList: [],
  });
}


const emit = defineEmits(['formSubmitted']);
defineExpose({init});
const rules = reactive({
  courseChineseName: [{required: true, message: '请输入课程中文名称', trigger: 'blur'}],
  courseEnglishName: [{required: true, message: '请输入课程英文名称', trigger: 'blur'}],
  courseCode: [{required: true, message: '请输入课程代码', trigger: 'blur'}],
});

const teacherid = ref([]);
const teacherlist = ref([]);
const alreadyteacheridlist = ref([])
// 使用函数创建两个独立的响应式对象
const newform = createForm();
const oldform = createForm();

function init(row) {
  fetchData()
  AdddialogVisible.value = true;
  const storedUserInfo = sessionStorage.getItem('users');
  const userInfo = JSON.parse(storedUserInfo);
  newform.term = userInfo.currentterm;
  oldform.term = userInfo.currentterm;
  // newform.professionName = row.value.professionName;
  // newform.professionId = row.value.professionId;

  Object.keys(row).forEach(key => {
    if (newform.hasOwnProperty(key) && oldform.hasOwnProperty(key)) {
      newform[key] = row[key];  // 使用 row[key] 而不是 row.value[key]
      oldform[key] = row[key];
    }
  });
  teacherid.value = newform.responsiblePersonList.map(item => item.id);
  console.log(teacherid.value)
}


const fetchData = () => {
  request.course.post('/coursemangt/course/courseRP')
      .then(res => {
        if (res.code === 200) {
          // 假设这里你需要的是过滤后的数据作为级联选择器的选项
          console.log(res.data)
          //不过滤指定学院
          teacherlist.value = formatDataForCascader(res.data, alreadyteacheridlist.value);
          console.log(teacherlist.value)
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
    // 递归处理子机构
    if (node.children && node.children.length > 0) {
      formattedNode.children = node.children.map(child => formatNode(child)).filter(child => child !== null);
    }

    // 处理机构下的老师，排除已被选中的老师
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
    // 如果节点没有子机构也没有未选中的老师，则过滤掉该节点
    return formattedNode.children && formattedNode.children.length > 0 ? formattedNode : null;
  };
  // 使用递归函数处理每个节点
  return nodes.map(node => formatNode(node)).filter(node => node !== null);
};


const handleCascaderChange = (value, selectedData) => {
  console.log("selectedData" + selectedData)

  // 检查当前选中的IDs与之前的IDs进行比较
  const currentSelectedIds = value; // 当前事件的选中的IDs
  const newlySelectedIds = currentSelectedIds.filter(id => !alreadyteacheridlist.value.includes(id));
  const unselectedIds = alreadyteacheridlist.value.filter(id => !currentSelectedIds.includes(id));

  console.log("Newly Selected IDs:", newlySelectedIds); // 新增的IDs
  console.log("Unselected IDs:", unselectedIds); // 取消的IDs


  if (selectedData && selectedData.length > 0) {
    const lastSelectedNode = selectedData[selectedData.length - 1];
    if (!lastSelectedNode.children || lastSelectedNode.children.length === 0) {
      // 如果当前选中的节点是最后的子节点，则更新 teacherid
      teacherid.value = lastSelectedNode.id;
      alreadyteacheridlist.value.push(teacherid.value)
    } else {
      // 如果不是最后的子节点，可以根据需求清空 teacherid 或设置为默认值
      teacherid.value = null; // 或者设置为默认值
    }
  }
};


const closeDialog = () => {
  AdddialogVisible.value = false;
};

const submitForm = () => {
  ElMessageBox.confirm(
      '是否确认修改',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }
  )
      .then(() => {
        console.log('确认修改')
        emit('formSubmitted');
        closeDialog();
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消',
        })
      })
}


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