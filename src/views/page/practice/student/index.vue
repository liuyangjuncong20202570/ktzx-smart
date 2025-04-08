<!--
 * @Date: 2024-07-16 11:07:52
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-19 17:38:51
 * @FilePath: \smarttt_ktzx\src\views\page\practice\student\index.vue
-->
<template>
  <div class="experimental-student-wrap">
    <Header title="实验学生列表" :pathData="pathData" />
    <div class="practice-tool">
      <el-checkbox 
        v-model="canReadCorrect" 
        @change="handleCanReadCorrectChange"
        class="correct-checkbox"
      >
        允许学生查看批改详情
      </el-checkbox>
      <el-button class="custom-nav-button custom-nav-button-info" @click="loadScore"><el-icon><Download /></el-icon> 成绩下载</el-button>
      <!-- <el-button type="primary" :icon="Download" @click="loadData">数据下载</el-button> -->
    </div>
    <el-table class="custom-table" ref="multipleTableRef" :data="tableData" style="width: 100%">
      <el-table-column lebel="序号" type="index" width="50" />
      <el-table-column label="学号" prop="stuNo" width="150"/>
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="图片" prop="image" v-if="isShowImage">
        <template #default="scope">
          <span v-if="scope.row.itemMap?.image?.state == 2" class="info-radio radio-class"></span>
          <span v-if="scope.row.itemMap?.image?.state == 0" class="default-radio radio-class"></span>
          <span v-if="scope.row.itemMap?.image?.state == 1" class="error-radio radio-class"></span>
        </template>
      </el-table-column>
      <el-table-column label="视频" prop="video" v-if="isShowVideo">
        <template #default="scope">
          <span v-if="scope.row.itemMap?.video?.state == 2" class="info-radio radio-class"></span>
          <span v-if="scope.row.itemMap?.video?.state == 0" class="default-radio radio-class"></span>
          <span v-if="scope.row.itemMap?.video?.state == 1" class="error-radio radio-class"></span>
        </template>
      </el-table-column>
      <el-table-column label="实验报告" prop="report" width="100" v-if="isShowReport">
        <template #default="scope">
          <span v-if="scope.row.itemMap?.report?.state == 2" class="info-radio radio-class"></span>
          <span v-if="scope.row.itemMap?.report?.state == 0" class="default-radio radio-class"></span>
          <span v-if="scope.row.itemMap?.report?.state == 1" class="error-radio radio-class"></span>
        </template>
      </el-table-column>
      <el-table-column label="实验预习报告" prop="previewReports" width="130" v-if="isShowpReviewReports">
        <template #default="scope">
          <span v-if="scope.row.itemMap?.previewReport?.state == 2" class="info-radio radio-class"></span>
          <span v-if="scope.row.itemMap?.previewReport?.state == 0" class="default-radio radio-class"></span>
          <span v-if="scope.row.itemMap?.previewReport?.state == 1" class="error-radio radio-class"></span>
        </template>
      </el-table-column>
      <el-table-column label="答辩验收" prop="defence" width="100" v-if="isShowDefence">
        <template #default="scope">
          <span v-if="scope.row.itemMap?.defence?.state == 2" class="info-radio radio-class"></span>
          <span v-if="scope.row.itemMap?.defence?.state == 0" class="default-radio radio-class"></span>
          <span v-if="scope.row.itemMap?.defence?.state == 1" class="error-radio radio-class"></span>
        </template>
      </el-table-column>
      <el-table-column label="总评成绩" prop="resultScore" width="100"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <span>{{ statusMap.get(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="operate" width="200" fixed="right">
        <template #default="scope">
          <el-button
            class="custom-link-button custom-link-active-button" type="primary"
            :text="true"
            @click="
              () => {
                routes.push({
                  path: '/homes/studenthome/exam/experimental/correct',
                  query: {
                    pid: scope.row.practiceId,
                    sid: scope.row.stuId,
                    type: 'homeworkCorrecting',
                    disable: true,
                    ...route.query,
                  },
                });
              }
            "
            >查看</el-button
          >
          <template v-if="scope.row.status == 1 && !(privilege === 'read')">
            <el-button class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="correct(scope.row,'pg')">批改</el-button>
          </template>
          <template v-if="scope.row.status == 2 && !(privilege === 'read')">
            <el-button class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="correct(scope.row,'xg')">修改</el-button>
          </template>
          <template v-if="scope.row.status == 1 || scope.row.status == 2">
            <el-button class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="fallBack(scope.row)">退回</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="pagination-box">
      <el-pagination
        v-model:current-page="pagination.pageIndex"
        v-model:page-size ="pagination.pageSize"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->
    <div class="pagination-box">
      <Pagination :pageIndex="pagination.pageIndex" :pageSize="pagination.pageSize" :total="pagination.total" @update:pageIndex="updatePageIndex" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { host } from "@/utils/request.js";
import { studentList, practiceDownload, fallBackApi, setStuCanReadCorrect } from "@/api/practice/index.ts";
import { ResVO, StudentPracticePageVO } from "@/api/practice/type.ts";
import { downloadFile } from "@/utils/index";
import Header from "@/views/page/components/header/index.vue";
import Pagination from "@/views/page/components/pagination/index.vue";

const routes = useRouter();
const { currentRoute } = routes;
const route = currentRoute.value;
const privilege = route.query.privilege;
const id = route.query.id;
const statusMap = reactive(
  new Map([
    [0, "已发布"],
    [1, "已作答"],
    [2, "已批改"],
    [4, "已退回"],
  ])
);
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  total: 0,
});
const tableData = reactive<StudentPracticePageVO>([]);

const pathData = [
  {
    name: "实验管理",
    path: "/homes/courseteacherhome/exam/experimental/labmangt",
  },
  {
    name: "实验学生列表",
    path: "",
  },
];

const canReadCorrect = ref(true);

const handleCanReadCorrectChange = async (val: boolean) => {
  try {
    const res = await setStuCanReadCorrect({
      practiceId: id,
      can: val ? 1 : 0
    });
    
    if (res.code === '200') {
      ElMessage.success(val ? '已允许学生查看批改详情' : '已禁止学生查看批改详情');
    } else {
      canReadCorrect.value = !val;
      ElMessage.error('设置失败');
    }
  } catch (error) {
    canReadCorrect.value = !val;
    ElMessage.error('设置失败');
  }
};

const correct = (data: any,type:string) => {
  routes.push({ path: "/homes/courseteacherhome/exam/experimental/correct", query: { sid: data.stuId, pid: data.practiceId, type: type, ...route.query } });
};
const loadScore = () => {
  practiceDownload(id).then((res) => {
    if (res.code === "200") {
      downloadFile(host + "/static/" + res.data, res.data);
      ElMessage.success("下载成功");
    }
  });
};
const updatePageIndex = (pageIndex: number) => {
  pagination.pageIndex = pageIndex;
  loadStudentData();
};
const handleSizeChange = () => {
  loadStudentData();
};
const handleCurrentChange = () => {
  loadStudentData();
};
const isShowImage = ref(false);
const isShowVideo = ref(false);
const isShowReport = ref(false);
const isShowpReviewReports = ref(false);
const isShowDefence = ref(false);


const loadStudentData = async () => {
  const id = route.query.id;
  const resData: ResVO = await studentList({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, practiceId: id });
  if (resData.code == 200) {
    tableData.length = 0;
    tableData.push(...resData.data.data);
    pagination.total = resData.data.recordSize;

    tableData.forEach((item) => {
      if (item?.itemMap) {
        if (item.itemMap?.video) {
          isShowVideo.value = true;
        }
        if (item.itemMap?.image) {
          isShowImage.value = true;
        }
        if (item.itemMap?.report) {
          isShowReport.value = true;
        }
        if (item.itemMap?.previewReport) {
          isShowpReviewReports.value = true;
        }
        if (item.itemMap?.defence) {
          isShowDefence.value = true;
        }
      }
    });
  }
};
const fallBack = (data: any) => {
  console.info(data);
  // 添加确认提示
  ElMessageBox.confirm("确定要退回吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    fallBackApi({ practiceId: data.practiceId, stuId: data.stuId }).then((res) => {
      if (res.code === "200") {
        ElMessage.success("退回成功");
        loadStudentData();
      }
    });
  });
};
onMounted(() => {
  loadStudentData();
});
</script>
<style>
.experimental-student-wrap .el-card__body {
  padding: 0 20px 20px 20px !important;
}

</style>
<style scoped lang="scss">
.practice-tool {
  margin-top: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
  padding: 0 20px;
}
.pagination-box {
  padding: 5px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
}
.correct-checkbox {
  margin-right: 10px;
  :deep(.el-checkbox__input) {
    background: rgba(39,165,255,0.1);
    border-radius: 3px;
    border: 1px solid #27A5FF;
  }
  
  :deep(.el-checkbox__label) {
    color: #333;
  }
}
</style>
