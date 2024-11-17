<template>
  <div style="height: 92vh; display: flex; flex-direction: column">
    <el-header
      style="height: auto; padding: 5px 0px; width: 100%; background-color: #deebf7; display: flex"
    >
      <el-button type="success" v-blur-on-click style="margin-left: 0.8vw" @click="exportCourseList"
        >导出课程列表
      </el-button>
      <el-button type="primary" v-blur-on-click style="margin-left: 0.8vw" @click="addCourse"
        >新增课程</el-button
      >
      <el-button type="danger" v-blur-on-click style="margin-left: 0.8vw" @click="deleteCourse"
        >删除课程
      </el-button>
      <el-button type="primary" v-blur-on-click style="margin-left: 0.8vw" @click="CopyCourse"
        >复制历史课程
      </el-button>
    </el-header>
    <div style="max-height: 100%; height: 100%; overflow: auto">
      <AddCourseDialog
        v-show="AdddialogVisible"
        ref="AddDialogShow"
        @formSubmitted="getcourseList"
      />
      <EditCourseDialog
        v-show="EditdialogVisible"
        ref="EditDialogShow"
        @formSubmitted="getcourseList"
      />
      <CopyCourseDialog
        v-show="CopydialogVisible"
        ref="CopyDialogShow"
        @formSubmitted="getcourseList"
      />

      <el-table
        :data="courseList"
        style="table-layout: auto; width: 100%; height: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column width="49">
          <template v-slot="row">{{ row.$index + 1 }}</template>
        </el-table-column>
        <!--            <el-table-column label="学期" min-width="130">-->
        <!--              {{ currentterm }}-->
        <!--            </el-table-column>-->
        <el-table-column prop="courseChineseName" label="课程名称(中文)" min-width="120">
          <template #default="{ row }">
            <div class="dynamic-font-size" style="width: 100%; height: 25px">
              {{ row.courseChineseName }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="courseEnglishName" label="课程名称(英文)" min-width="120">
          <template #default="{ row }">
            <div style="width: 100%; height: 25px" class="dynamic-font-size">
              {{ row.courseEnglishName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="courseCode" label="课程代码" min-width="70">
          <template #default="{ row }">
            <div style="width: 100%; height: 25px" class="dynamic-font-size">
              {{ row.courseCode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="professionName" label="所属专业" min-width="90">
          <template #default="{ row }">
            <div style="width: 100%; height: 25px" class="dynamic-font-size">
              {{ row.professionName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程负责人" min-width="100">
          <template #default="{ row }">
            <div style="display: flex; align-items: center">
              <div style="flex-grow: 1; display: flex; flex-wrap: wrap">
                <!-- 只在这个div上使用v-for，移除内层的v-for -->
                <div
                  v-for="(user, index) in row.responsiblePersonList"
                  :key="user.id"
                  class="user-bubbles"
                >
                  <!-- 使用v-if来确保只显示前四个负责人 -->
                  <template v-if="index < 4">
                    <span class="user-bubble">
                      {{ user.username }}
                    </span>
                  </template>
                  <!-- 当负责人数量超过4时，显示额外的数量 -->
                  <span
                    v-if="index === 3 && row.responsiblePersonList.length > 4"
                    class="more-users"
                  >
                    +{{ row.responsiblePersonList.length - 4 }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="编辑" min-width="50">
          <template #default="{ row }">
            <el-icon class="edit-icon" @click="editTerm(row)">
              <Edit />
            </el-icon>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { Edit } from '@element-plus/icons-vue';
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import request from '../../utils/request.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import { exportTableToCSV } from '../../utils/exportTableToCSV.js';
import AddCourseDialog from '../course/subcomponents/AddCourseDialog.vue';
import EditCourseDialog from '../course/subcomponents/EditCourseDialog.vue';
import CopyCourseDialog from '../course/subcomponents/CopyCourseDialog.vue';
import blurOnClick from '../../directives/blur-on-click.js';

const courseList = ref([]);
const selectedCourseId = ref([]);
const selectedRows = ref([]);
const currentterm = ref('');

const AdddialogVisible = ref(false);
const AddDialogShow = ref(null);
const EditdialogVisible = ref(false);
const EditDialogShow = ref(null);

const CopydialogVisible = ref(false);
const CopyDialogShow = ref(null);

const professioninfo = ref({
  professionName: null,
  professionId: null
});

const columns = ref([
  { prop: '', label: '学期' },
  { prop: 'courseChineseName', label: '课程名称(中文)' },
  { prop: 'courseEnglishName', label: '课程名称(英文)' },
  { prop: 'courseCode', label: '课程代码' },
  { prop: 'professionName', label: '所属专业' },
  { prop: 'responsiblePersonList', label: '课程负责人', isArray: true, arrayProp: 'username' }
]);

const handleSelectionChange = selection => {
  selectedRows.value = selection;
};

const contentRef = ref(null);

const getcourseList = async () => {
  await request.course
    .get('/coursemangt/course')
    .then(res => {
      // 登录成功
      if (res.code === 200) {
        courseList.value = res.data;
        console.log('hhh', courseList.value);
        initialize();
      } else {
        ElMessage({
          type: 'error',
          message: '获取课程列表失败'
        });
      }
    })
    .catch(() => {});

  const storedUserInfo = sessionStorage.getItem('users');
  const userInfo = JSON.parse(storedUserInfo);
  currentterm.value = userInfo.currentterm;
  console.log(currentterm.value);
};
const initialize = () => {
  professioninfo.value.professionId = courseList.value[0].professionId;
  professioninfo.value.professionName = courseList.value[0].professionName;
  console.log(professioninfo.value);
};

const exportCourseList = () => {
  const dataToExport = selectedRows.value.length > 0 ? selectedRows.value : courseList.value;
  // 检查是否有数据可导出
  if (dataToExport.length === 0) {
    ElMessage({
      type: 'info',
      message: '没有需要导出的内容'
    });
    return; // 退出函数，不再继续执行
  }

  ElMessageBox.confirm(
    selectedRows.value.length > 0
      ? `是否要导出所勾选的 ${selectedRows.value.length} 行记录？`
      : '是否要导出当前的全部记录？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info'
    }
  )
    .then(() => {
      exportTableToCSV(dataToExport, columns.value);
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消导出'
      });
    });
};

onMounted(() => {
  getcourseList();
});

const addCourse = () => {
  AdddialogVisible.value = true; // 打开弹窗
  AddDialogShow.value.init(professioninfo);
  console.log(123);
};

const editTerm = row => {
  EditdialogVisible.value = true; // 打开弹窗
  EditDialogShow.value.init(row);
  // console.log(row)
};

const CopyCourse = () => {
  CopydialogVisible.value = true; // 打开弹窗
  CopyDialogShow.value.init('x');
};

const deleteCourse = () => {
  if (selectedRows.value.length === 0) {
    ElMessage({
      type: 'info',
      message: '未选中课程，无法删除'
    });
  } else {
    selectedCourseId.value = selectedRows.value.map(row => row.id);

    ElMessageBox.confirm(`是否要删除勾选的 ${selectedRows.value.length} 条记录？`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info'
    })
      .then(() => {
        const deleteCourseList = ref([]);
        deleteCourseList.value = Object.values(selectedCourseId.value);
        console.log(deleteCourseList.value);
        request.course
          .post('/coursemangt/course/delete', deleteCourseList.value)
          .then(res => {
            if (res.code === 200) {
              // 假设这里你需要的是过滤后的数据作为级联选择器的选项
              ElMessage({
                type: 'success',
                message: '删除课程成功'
              });
              getcourseList();
            }
          })
          .catch(error => {
            ElMessage({
              type: 'error',
              message: '删除课程失败，请稍后尝试'
            });
          });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除'
        });
      });
  }
};
const handleClick = (row, field) => {
  row[field] = true;
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
  background-color: #e6f7ff; /* 气泡的背景颜色 */
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
  color: #409eff; /* 悬浮时的颜色 */
}

.dynamic-font-size {
  font-size: calc(3px + 0.8vw); /* 根据视口宽度动态计算字体大小 */
  overflow: hidden; /* 隐藏溢出的文本 */
  text-overflow: ellipsis; /* 用省略号表示被裁剪的文本 */
  white-space: nowrap; /* 不允许文本换行 */
}
</style>
