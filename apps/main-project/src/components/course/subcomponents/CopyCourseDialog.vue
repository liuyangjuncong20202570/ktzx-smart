<template>
  <div style="padding:0;margin:0;">

    <el-dialog
        :destroy-on-close="true"
        :show-close="false"
        :close-on-click-modal="false"
        style="width:80vw;"
        v-model="HistoryCoursedialogVisible"
        @close="closeDialog">

      <!-- 使用 v-if 和 v-else 控制显示的内容 -->
      <!-- 如果 selectedTerm 为空，只显示居中的下拉框 -->
      <template v-if="!selectedTerm">
        <el-container>
          <div style="display: flex; justify-content: center; align-items: center; height: 8vh;">
            <el-select size="large" v-model="selectedTerm" clearable placeholder="请选择学期"
                       style="width: 40vw;"
                       @change="fetchCourses">
              <el-option
                  v-for="term in historytermlist"
                  :key="term.id"
                  :label="term.termname"
                  :value="term.id">
              </el-option>
            </el-select>
          </div>
          <el-footer style="text-align: center;">
            <el-button type="info" disabled>确定选项</el-button>
            <el-button type="primary" @click="closeDialog">取消</el-button>
          </el-footer>
        </el-container>
      </template>

      <!-- 如果 selectedTerm 有值，显示表格和按钮 -->
      <template v-else>
        <el-container>
          <el-header style="display: flex; align-items: center;">
            <el-select v-model="selectedTerm" placeholder="请选择学期" style="width: 200px;"
                       @change="fetchCourses">
              <el-option
                  v-for="term in historytermlist"
                  :key="term.id"
                  :label="term.termname"
                  :value="term.id">
              </el-option>
            </el-select>
          </el-header>
          <el-main>
            <el-table :data="courseList" style="table-layout:auto; width: 100%; height: 100%;"
                      @selection-change="handleSelectionChange" stripe>
              <el-table-column type="selection" width="30"></el-table-column>
              <el-table-column width="49">
                <template v-slot="row">{{ row.$index + 1 }}</template>
              </el-table-column>
              <!--            <el-table-column label="学期" min-width="130">-->
              <!--              {{ currentterm }}-->
              <!--            </el-table-column>-->
              <el-table-column prop="courseChineseName" label="课程名称(中文)" min-width="120">
                <template #default="{ row }">
                  <div class="dynamic-font-size" style="width: 100%; height: 25px;">
                    {{ row.courseChineseName }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="courseEnglishName" label="课程名称(英文)" min-width="120">
                <template #default="{ row }">
                  <div style="width: 100%; height: 25px;" class="dynamic-font-size">
                    {{ row.courseEnglishName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="courseCode" label="课程代码" min-width="70">
                <template #default="{ row }">
                  <div style="width: 100%; height: 25px;" class="dynamic-font-size">
                    {{ row.courseCode }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="professionName" label="所属专业" min-width="90">
                <template #default="{ row }">
                  <div style="width: 100%; height: 25px;" class="dynamic-font-size">
                    {{ row.professionName }}

                  </div>
                </template>
              </el-table-column>
              <el-table-column label="专业负责人" min-width="100">
                <template #default="{ row }">
                  <div style="display: flex; align-items: center;">
                    <div style="flex-grow: 1; display: flex; flex-wrap: wrap;">
                      <!-- 只在这个div上使用v-for，移除内层的v-for -->
                      <div v-for="(user, index) in row.responsiblePersonList" :key="user.id" class="user-bubbles">
                        <!-- 使用v-if来确保只显示前四个负责人 -->
                        <template v-if="index < 4">
            <span class="user-bubble">
              {{ user.username }}
            </span>
                        </template>
                        <!-- 当负责人数量超过4时，显示额外的数量 -->
                        <span v-if="index === 3 && row.responsiblePersonList.length > 4" class="more-users">
            +{{ row.responsiblePersonList.length - 4 }}
          </span>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer style="text-align: center;">
            <el-button type="primary" @click="closeDialog">取消</el-button>
            <el-button type="success" @click="submitForm">复制所选课程</el-button>
          </el-footer>
        </el-container>
      </template>

    </el-dialog>


  </div>
</template>
<script setup>
import {ref, reactive, defineExpose, nextTick, onMounted, getCurrentInstance} from 'vue';
import {ElMessage, ElMessageBox} from "element-plus";
import request from "../../../utils/request.js";
import Coursemangt from "../Coursemangt.vue"
import {Edit} from "@element-plus/icons-vue";
import {exportTableToCSV} from "../../../utils/exportTableToCSV.js";

const HistoryCoursedialogVisible = ref(false);
const selectedTerm = ref('')
const historytermlist = ref([])
const courseList = ref([])
const selectedRows = ref([]);
const getTermlist = () => {
  request.course.get('/coursemangt/course/allterm')
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          historytermlist.value = res.data;
          console.log(historytermlist.value)
        }
      })
      .catch(() => {
            ElMessage({
              type: 'error',
              message: '获取学期失败'
            });
          }
      );
}

function init(x) {
  HistoryCoursedialogVisible.value = true;
  getTermlist();
  const storedUserInfo = sessionStorage.getItem('users');
  const userInfo = JSON.parse(storedUserInfo);
  // newform.term = userInfo.currentterm;
}

const fetchCourses = () => {
  console.log(selectedTerm.value)
  request.course.get('/coursemangt/course/history?id=' + selectedTerm.value)
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          courseList.value = res.data;
          console.log(historytermlist.value)
        }
      })
      .catch(() => {
            ElMessage({
              type: 'error',
              message: '获取学期失败'
            });
          }
      );
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};


const emit = defineEmits(['formSubmitted']);
defineExpose({init});

const closeDialog = () => {
  HistoryCoursedialogVisible.value = false;
  selectedTerm.value = ''
};

const submitForm = () => {
  const selectedCount = selectedRows.value.length;

  if (selectedCount > 1) {
    // 如果选中多于一项
    ElMessage({
      type: 'error',
      message: '只能一次新增一门课程'
    });
  } else if (selectedCount === 0) {
    // 如果一项也没选中
    ElMessage({
      type: 'error',
      message: '请选择需要复制的历史课程'
    });
  } else {
    const courseNames = selectedRows.value.map(row => row.courseChineseName).join('、');
    const courseId = selectedRows.value.map(row => row.id)
    ElMessageBox.confirm(
        `是否要将所选 ${courseNames} 复制到当前学期？`,
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info',
        }
    )
        .then(() => {
          console.log(courseId)
          request.course.get('/coursemangt/course/copy?id=' + courseId)
              .then(res => {
                // 登录成功
                if (res.code === 200) {
                  ElMessage({
                    type: 'success',
                    message: '复制历史课程成功'
                  });
                  emit('formSubmitted');
                  closeDialog();
                }
              })
              .catch(() => {
                    ElMessage({
                      type: 'error',
                      message: '复制历史学期失败'
                    });
                  }
              );


          closeDialog();
        })
        .catch(() => {
              ElMessage({
                type: 'error',
                message: '复制课程失败'
              });
              closeDialog(); // 根据需要决定是否在错误后关闭对话框
            }
        )
  }



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

::v-deep .custom-select .el-select {
  min-height: 50px; /* 设置最小高度 */
}
</style>