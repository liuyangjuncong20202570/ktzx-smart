<template>
  <div style="padding:0;margin:0;">
    <el-dialog
        :destroy-on-close="true" :show-close="false" :close-on-click-modal="false"
        style="width:70vw;" v-model="EditdialogVisible" @close="closeDialog">
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

            <el-table :data="userlist" empty-text="没有负责人">
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="obsname" label="所属部门" min-width="200"></el-table-column>
              <!-- 从这里移除id的显示 -->
              <el-table-column prop="username" label="教师用户名" min-width="100"></el-table-column>
              <el-table-column label="操作" width="120">
                <template v-slot="{ row }"> <!-- 使用 v-slot 访问当前行的数据 -->
                  <el-icon class="CloseBold-icon" @click="Deleteteacher(row)">
                    <CloseBold/>
                  </el-icon>
                </template>
              </el-table-column>
            </el-table>
            <el-cascader
                ref="myteacherref"
                v-model="teacherid"
                :options="obslist"
                placeholder="请选择负责人"
                :props="{ value: 'id', label: 'label', children: 'children', emitPath: false,multiple: true}"
                filterable
                clearable
                :show-all-levels="false"
                @focus="fetchData"
                change-on-select
                @change="handleCascaderChange"
                style="width: 60%;"
            >
            </el-cascader>
            <el-button
                type="primary"
                :disabled="!teacherid.length>0"
                @click="addTeacher"
                style="margin-left: 15px;">
              {{ teacherid.length > 0 ? '点击新增教师' : '请选择负责人' }}
            </el-button>
          </el-form>
        </el-main>
        <el-footer
            style="background-color: #f5f5f5; padding: 6px 0; display: flex; align-items: center; justify-content: space-around;">

          <el-button type="info" large style="width: 40%;" @click="closeDialog">取消</el-button>
          <el-button type="success" large style="width: 40%;" @click="submitForm">提交修改</el-button>

        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>
<script setup>
import {ref, reactive, defineExpose, nextTick, onMounted, getCurrentInstance, computed} from 'vue';

import {ElMessage, ElMessageBox} from "element-plus";
import request from "../../../utils/request.js";
import Coursemangt from "../Coursemangt.vue"
import {exportTableToCSV} from "../../../utils/exportTableToCSV.js";
import {CloseBold} from "@element-plus/icons-vue";

const EditdialogVisible = ref(false);
const userlist = ref([]);
const teacherlist = reactive([]);

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
const courseID = ref('')
const obslist = ref([]);
const alreadyteacheridlist = ref([])
// 使用函数创建两个独立的响应式对象
const newform = createForm();
const oldform = createForm();


function init(row) {
  console.log("数据", row)
  courseID.value = row.id;
  userlist.value = row.responsiblePersonList;
  row.responsiblePersonList.forEach(item => {
    alreadyteacheridlist.value.push(item.id);
  })
  fetchData()
  EditdialogVisible.value = true;
  const storedUserInfo = sessionStorage.getItem('users');
  const userInfo = JSON.parse(storedUserInfo);
  newform.term = userInfo.currentterm;
  oldform.term = userInfo.currentterm;

  Object.keys(row).forEach(key => {
    if (newform.hasOwnProperty(key) && oldform.hasOwnProperty(key)) {
      newform[key] = row[key];  // 使用 row[key] 而不是 row.value[key]
      oldform[key] = row[key];
    }
  });
}


const fetchData = () => {
  request.course.post('/coursemangt/course/courseRP')
      .then(res => {
        if (res.code === 200) {
          // 假设这里你需要的是过滤后的数据作为级联选择器的选项
          //不过滤指定学院
          obslist.value = formatDataForCascader(res.data, alreadyteacheridlist.value);
          extractTeachers(res.data)
          console.log(obslist.value)
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '获取列表失败'
    });
  });
};

function extractTeachers(nodes) {
  nodes.forEach(node => {
    if (node.responsiblePerson && node.responsiblePerson.length > 0) {
      node.responsiblePerson.forEach(teacher => {
        teacherlist.push(teacher);
      });
    }
    if (node.children && node.children.length > 0) {
      extractTeachers(node.children);  // 递归处理子节点
    }
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

const Deleteteacher = (row) => {
  const teacherform = ref({
    userid: row.id,
    obsid: courseID.value,
  })
  console.log("row.id", row.id)
  console.log("userlist.value", userlist.value)
  console.log("teacherlist.value", teacherlist)
  // const filteredTeachers = teachers.filter(teacher => ids.value.includes(teacher.id));

  const filteredTeachers = teacherlist.filter(teacher => row.id.includes(teacher.id));
  console.log(filteredTeachers)
  request.course.post('/coursemangt/course/courseRP/delete', teacherform.value)
      .then(res => {
        if (res.code === 200) {
          // 假设这里你需要的是过滤后的数据作为级联选择器的选项
          ElMessage({
            type: 'success',
            message: '删除负责人成功'
          });
          userlist.value = userlist.value.filter(user => !filteredTeachers.some(teacher => teacher.id === user.id));
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '删除负责人失败，请重新尝试'
    });
  });
}


const addTeacher = () => {
  console.log(teacherid.value)
  const teacherform = Object.values(teacherid.value).map(id => ({
    userid: id,  // 提取userid部分
    obsid: courseID.value           // 使用固定的courseID作为obsid
  }));

  const filteredTeachers = teacherlist.filter(teacher => Object.values(teacherid.value).includes(teacher.id));

  request.course.post('/coursemangt/course/courseRP/create', teacherform)
      .then(res => {
        if (res.code === 200) {
          // 假设这里你需要的是过滤后的数据作为级联选择器的选项
          ElMessage({
            type: 'success',
            message: '新增负责人成功'
          });
          filteredTeachers.forEach(teacher => {
            if (!userlist.value.find(t => t.id === teacher.id)) {
              userlist.value.push(teacher);
            }
          })
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '新增负责人失败，请重新尝试'
    });

  }).finally(() => {
        teacherid.value = [];
      }
  )
}

const closeDialog = () => {
  emit('formSubmitted');
  EditdialogVisible.value = false;
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
        const subCourseForm = ref({
          id: newform.id,
          courseChineseName: newform.courseChineseName,
          courseEnglishName: newform.courseEnglishName,
          courseCode: newform.courseCode
        })

        request.course.post('/coursemangt/course/update', subCourseForm.value)
            .then(res => {
              if (res.code === 200) {
                // 假设这里你需要的是过滤后的数据作为级联选择器的选项
                ElMessage({
                  type: 'success',
                  message: '修改课程信息成功'
                });
              }
            }).catch(error => {
          ElMessage({
            type: 'error',
            message: '修改课程信息失败'
          });
        }).finally(() => {
          closeDialog();
        })
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