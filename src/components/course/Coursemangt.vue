<template>
    <div style="height: 92vh; display: flex; flex-direction: column;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex;">
          <el-button type="primary" style="margin-left: 0.8vw;" @click="exportCourseList">导出课程列表</el-button>
            <el-button type="primary" style="margin-left: 0.8vw;" @click="addTerm">新增课程</el-button>
            <el-button type="danger" style="margin-left: 0.8vw;" @click="deleteTerm">删除课程</el-button>
            <el-button type="primary" style="margin-left: 0.8vw;" @click="addTerm">复制历史课程</el-button>
        </el-header>
        <div style="max-height: 100%; height: 100%; overflow:auto;">
          <el-table :data="courseList" style="table-layout:auto; width: 100%; height: 100%;"
                    @selection-change="handleSelectionChange" stripe>
                <el-table-column type="selection" width="30"></el-table-column>
                <el-table-column width="49">
                    <template v-slot="row">{{ row.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="termname" label="学期" min-width="130">
                    <!-- <template #default="{ row }">
                        <el-input v-if="row.editingTermName" style="width:100%; height: 25px;" v-model="row.termname"
                            @blur="handleBlur(row, 'editingTermName')"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingTermName')">
                            {{row.termname }}
                        </div>
                    </template> -->
                </el-table-column>
            <el-table-column prop="courseChineseName" label="课程名称(中文)" min-width="180">
                    <template #default="{ row }">
                      <el-input v-if="row.editingcourseChineseName" style="width:100%; height: 25px;"
                                v-model="row.courseChineseName"
                                @blur="handleBlur(row, 'editingcourseChineseName')"></el-input>
                      <div v-else style="width: 100%; height: 25px;"
                           @click="handleClick(row, 'editingcourseChineseName')">
                        {{ row.courseChineseName }}
                        </div>
                    </template>
                </el-table-column>
            <el-table-column prop="courseEnglishName" label="课程名称(英文)" min-width="260">
                    <template #default="{ row }">
                      <el-input v-if="row.editingcourseEnglishName" style="width: 100%; height: 25px;"
                                v-model="row.courseEnglishName"
                                @blur="handleBlur(row, 'editingcourseEnglishName')"></el-input>
                      <div v-else style="width: 100%; height: 25px;"
                           @click="handleClick(row, 'editingcourseEnglishName')">
                        {{ row.courseEnglishName }}
                        </div>
                    </template>
                </el-table-column>
            <el-table-column prop="courseCode" label="课程代码" min-width="90">
                    <template #default="{ row }">
                      <el-input v-if="row.editingcourseCode" style="width: 100%; height: 25px;" v-model="row.courseCode"
                                @blur="handleBlur(row, 'editingcourseCode')"></el-input>
                      <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingcourseCode')">
                        {{ row.courseCode }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="major" label="所属专业" min-width="113">
                    <template #default="{ row }">
                        <div style="width: 100%; height: 25px;" @click="handleClick(row, 'editingMajor')">
                            {{row.major }}
                          <el-icon color="dodgerblue" @click="">
                            <Edit/>
                          </el-icon>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="courseManager" label="课程负责人" min-width="150">
                  <el-icon color="dodgerblue" @click="">
                    <Edit/>
                  </el-icon>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { Edit } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import request from "../../utils/request.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {exportTableToCSV} from "../../utils/exportTableToCSV.js";

const courseList = ref([])
const selectedRows = ref([]);

const columns = ref([
  {prop: '', label: '学期'},
  {prop: 'courseChineseName', label: '课程名称(中文)'},
  {prop: 'courseEnglishName', label: '课程名称(英文)'},
  {prop: 'courseCode', label: '课程代码'},
  {prop: '', label: '所属专业'},
  {prop: '', label: '课程负责人'}
]);


const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};


const getcourseList = () => {
  request.course.get('/coursemangt/course')
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          courseList.value = res.data;
          initialize();
        }
      })
      .catch(() => {
            ElMessage({
              type: 'error',
              message: '获取课程列表失败'
            });
          }
      );
};
const initialize = () => {
  courseList.value.forEach((item) => {
    item.editingcourseChineseName = false;
    item.editingcourseEnglishName = false;
    item.editingcourseCode = false;
  });
}


const exportCourseList = () => {
  const dataToExport = selectedRows.value.length > 0 ? selectedRows.value : courseList.value;
  // 检查是否有数据可导出
  if (dataToExport.length === 0) {
    ElMessage({
      type: 'info',
      message: '没有需要导出的内容',
    });
    return; // 退出函数，不再继续执行
  }

  ElMessageBox.confirm(
      selectedRows.value.length > 0 ? `是否要导出所勾选的 ${selectedRows.value.length} 行记录？` : '是否要导出当前的全部记录？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }
  )
      .then(() => {
        exportTableToCSV(dataToExport, columns.value);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消导出',
        })
      })
}


onMounted(() => {
  getcourseList()
})


const addTerm = () => {
  const storedUserInfo = sessionStorage.getItem('users');
  const userInfo = JSON.parse(storedUserInfo);
  console.log(userInfo.currentterm)
}

const handleClick = (row, field) => {
    row[field] = true
};

const handleBlur = (row, field) => {
    row[field] = false;
};
</script>

<style scoped>
::v-deep(.el-table .cell) {
  text-align: center;
}

.custom-icon:hover {
  color: rgb(0, 115, 255) !important;
  cursor: pointer;
}

.user-bubbles {
  display: flex;
  flex-wrap: wrap;
  gap: 5px; /* 气泡之间的间距 */
  justify-content: center; /* 居中对齐所有的气泡 */
  align-items: center; /* 垂直居中（如果你的行高较高的话） */
}

.user-bubble {
  background-color: #E6F7FF; /* 气泡的背景颜色 */
  border-radius: 15px; /* 边框圆角，使其看起来像气泡 */
  padding: 5px 10px; /* 内边距 */
  font-size: 14px; /* 文本大小 */
  cursor: pointer; /* 鼠标悬停时的手形指针 */
  white-space: nowrap; /* 防止文本换行 */
}

.more-users {
  background-color: #e4e6eb;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}

.edit-icon {
  cursor: pointer; /* 鼠标悬停时变成手形指针 */
  white-space: nowrap; /* 防止文本换行 */
  margin-left: 8px; /* 与名字标签的间距 */
}

.edit-icon:hover {
  color: #409EFF; /* 悬浮时的颜色 */
}

</style>