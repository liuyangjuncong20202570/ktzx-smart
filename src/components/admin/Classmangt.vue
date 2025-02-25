<template>
  <Header title="专业班级管理" style="text-align: center; border-bottom: 2px solid #27a5ff" />
  <el-container style="height: 92vh">
    <!--两个按钮，靠最左-->

    <el-header
      style="height: auto; padding: 30px 0px; width: 100%; display: flex; justify-content: flex-end"
    >
      <el-button
        type="primary"
        class="custom-nav-button custom-nav-button-success"
        style="margin-left: 0.8vw"
        @click="handleClassAdd"
      >
        <el-icon><Plus /></el-icon>
        新增班级</el-button
      >
      <!--LQ提出删除前端所有有关删除按键-->
      <!--      <el-button type="danger" @click="deleteClass">删除班级</el-button>-->
      <el-button
        class="custom-nav-button custom-nav-button-info"
        v-if="selectedClassesId.length === 1"
        type="success"
        @click="editClass"
        >编辑班级</el-button
      >
      <AddClassDialog v-show="ADDdialogVisible" ref="ADDDialogShow" @formSubmitted="getTableData" />
      <EditClassDialog
        v-show="EditdialogVisible"
        ref="EditDialogShow"
        @formSubmitted="getTableData"
      />
      <!--      <el-button type="success" @click="">保存</el-button>-->
    </el-header>
    <el-main style="padding: 0px 5px">
      <el-collapse v-model="activecollapseNames" @change="handleChange">
        <el-collapse-item v-for="item in tableData" :key="item.id" :name="item.obsname">
          <template #title>
            <span style="font-size: 20px">{{ item.obsname }}</span>
          </template>
          <div
            v-if="activecollapseNames.includes(item.obsname)"
            style="display: flex; flex-direction: column"
          >
            <div
              v-for="grade in uniqueGrades(item.cmClassList)"
              :key="grade"
              class="grade-group"
              style="display: flex; align-items: center"
            >
              <div style="margin-right: 20px">
                <span style="font-size: 15px" class="grade-label">{{ grade }}级 :</span>
              </div>
              <el-checkbox-group v-model="selectedClassesId">
                <el-checkbox
                  v-for="classItem in getClassesByGrade(item.cmClassList, grade)"
                  :key="classItem.id"
                  :label="classItem.id"
                  @change="handleCheckboxChange(classItem, item.obsname)"
                >
                  {{ classItem.classname }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div
              v-if="
                activecollapseNames.includes(item.obsname) &&
                currentStudentsData[item.obsname].length > 0
              "
            >
              <el-table
                v-if="selectedClassesId.length > 0"
                :data="currentStudentsData[item.obsname]"
                style="width: 100%; height: auto"
                stripe
              >
                <!--          <el-table-column type="index" width="50"></el-table-column>-->
                <el-table-column type="index" style="min-width: 150px"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="personnelno" label="学号"></el-table-column>
                <el-table-column prop="classname" label="班级"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script setup>
import Header from '@/views/page/components/header/index.vue';
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useProfileStore } from '../../stores/profileStore.js';
import { Close } from '@element-plus/icons-vue';
import request from '../../utils/request.js';
import AddClassDialog from './subcomponents/AddClassDialog.vue';
import AddPeopleDialog from './subcomponents/AddPeopleDialog.vue';
import EditClassDialog from './subcomponents/EditClassDialog.vue';

const selectedClassesId = ref([]);
const selectedClassesInfo = ref({});

const currentStudentsData = ref({});

const profileStore = useProfileStore();
const loginInfo = ref({
  userid: profileStore.profileid,
  roleid: profileStore.profileroleid,
  catelog: profileStore.profilecatelog
});
const currentClassId = ref([]);

const tableData = ref([]);
const activecollapseNames = ref([]);
const getTableData = () => {
  // 假设 request.post 是您项目中的请求方法
  // 这里需要替换为您实际的请求逻辑
  request.admin
    .get('/sysmangt/classmangt')
    .then(res => {
      if (res.code === 200) {
        console.log(res.data);
        tableData.value = res.data;
        initialize();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '获取专业列表失败'
      });
    });
  selectedClassesId.value = [];
};

const professionList = ref([]);
const studentsData = ref([]);

const initialize = () => {
  tableData.value.forEach(item => {
    // 为每一个表格数据添加是否显示输入框的判定
    const professionItem = {
      id: item.id,
      obsname: item.obsname
    };
    professionList.value.push(professionItem);
    currentStudentsData.value[item.obsname] = []; // 为每个专业设置默认的空数组
  });
};

const handleCheckboxChange = async (classItem, obsName) => {
  const classId = classItem.id;
  const className = classItem.classname;
  // 当选中复选框时
  if (selectedClassesId.value.includes(classId)) {
    selectedClassesInfo.value[classId] = classItem;

    // 如果是添加到选中的班级，则直接使用getStudentsByClassId获取数据
    const students = await getStudentsByClassId(classId, className);
    // 更新currentStudentsData中的数据
    const currentTableData = currentStudentsData.value[obsName] || [];
    currentTableData.push(...students);
    currentStudentsData.value[obsName] = currentTableData;
  } else {
    // 当复选框被取消选中时
    // 从selectedClassesId数组中移除班级ID
    const index = selectedClassesId.value.indexOf(classId);
    if (index !== -1) {
      selectedClassesId.value.splice(index, 1);
    }
    // 从currentStudentsData中移除对应班级的学生数据

    const newStudentsData =
      currentStudentsData.value[obsName]?.filter(student => student.classid !== classId) || [];
    currentStudentsData.value[obsName] = newStudentsData;
    delete selectedClassesInfo.value[classId];
  }
  console.log(selectedClassesInfo.value);
};

const getStudentsByClassId = (classId, className) => {
  return request.admin
    .get('/sysmangt/classmangt/student?id=' + classId)
    .then(res => {
      if (res.code === 200) {
        studentsData.value = res.data;
        studentsData.value.forEach(item => {
          item.classname = className; // 为每一个表格数据添加班级名
          item.classid = classId;
        });
        console.log('getstudentdata');
        console.log(studentsData.value);
        return studentsData.value; // 返回更新后的学生数据
      }
    })
    .catch(error => {
      ElMessage({
        type: 'error',
        message: '获取学生数据失败'
      });
      return []; // 在失败的情况下返回空数组
    });
};

const uniqueGrades = classList => {
  return Array.from(new Set(classList.map(item => item.grade))).sort((a, b) => a - b);
};

const getClassesByGrade = (classList, grade) => {
  return classList.filter(item => item.grade === grade).sort((a, b) => a - b);
};

const handleChange = val => {
  activecollapseNames.value = val;
};

const ADDdialogVisible = ref(false);
const ADDDialogShow = ref(null);
const EditdialogVisible = ref(false);
const EditDialogShow = ref(null);

const handleClassAdd = () => {
  ADDdialogVisible.value = true; // 打开弹窗
  ADDDialogShow.value.init(professionList.value);
};

const deleteClass = () => {
  console.log(selectedClassesId.value);
  request.admin
    .post('/sysmangt/classmangt/delete', selectedClassesId.value)
    .then(res => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: '删除班级成功'
        });
        // emit('formSubmitted');
        getTableData();
      }
    })
    .catch(error => {
      ElMessage({
        type: 'error',
        message: '删除班级失败'
      });
    });
};

const editClass = () => {
  if (!selectedClassesId.value.length === 1) {
    ElMessage({
      type: 'error',
      message: '当前选中班级超过1个，无法编辑'
    });
  }
  const keys = Object.keys(selectedClassesInfo.value);

  if (keys.length === 1) {
    EditdialogVisible.value = true; // 打开弹窗
    EditDialogShow.value.init(selectedClassesInfo.value[keys[0]]);
  } else {
    ElMessage({
      type: 'error',
      message: '当前选中班级超过1个，无法编辑，请刷新重试'
    });
  }
  console.log(selectedClassesInfo.value[keys[0]]);
};

onMounted(() => {
  // 假设这里已经加载了数据到tableData
  getTableData();
});
</script>

<style scoped>
.grade-group {
  margin-bottom: 10px;
}

.grade-label {
  font-weight: bold;
}

.class-tag {
  margin-left: 5px;
}

::v-deep(.el-collapse-item__content) {
  padding-bottom: 0px;
}
</style>
