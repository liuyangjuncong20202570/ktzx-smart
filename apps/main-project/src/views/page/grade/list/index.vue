<!--
 * @Date: 2024-07-16 11:07:52
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-19 17:38:51
 * @FilePath: \smarttt_ktzx\src\views\page\practice\student\index.vue
-->
<template>
  <div class="experimental-student-wrap">
    <Header title="成绩名单" :pathData="pathData" />
    <div class="practice-tool">
      <!-- <el-button class="custom-nav-button custom-nav-button-info"  @click="loadScore"><el-icon><Download /></el-icon> 成绩下载</el-button> -->
      <!-- <el-button type="primary" :icon="Download" @click="loadData">数据下载</el-button> -->
       实验：
      <el-select v-model="practiceId" placeholder="请选择实验" @change="loadStudentData" clearable style="width: 200px">
        <el-option v-for="item in validPracticeListData" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <el-table class="custom-table" ref="multipleTableRef" :data="tableData" style="width: 100%">
      <el-table-column lebel="序号" type="index" width="50" />
      <el-table-column label="学号" prop="stuNo" width="150" />
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="图片" prop="image" v-if="isShowImage">
        <template #default="scope">
          <span v-if="scope.row.itemMap?.image?.itemScore || scope.row.itemMap?.image?.itemScore == 0">
            {{ scope.row.itemMap?.image?.itemScore }}
          </span>
          <span v-else> -- </span>
        </template>
      </el-table-column>
      <el-table-column label="视频" prop="video" v-if="isShowVideo">
        <template #default="scope">
          <span v-if="scope.row.itemMap?.video?.itemScore || scope.row.itemMap?.video?.itemScore == 0">
            {{ scope.row.itemMap?.video?.itemScore }}
          </span>
          <span v-else> -- </span>
        </template>
      </el-table-column>
      <el-table-column label="实验报告" prop="report" width="100" v-if="isShowReport">
        <template #default="scope">
          <span v-if="scope.row.itemMap?.report?.itemScore || scope.row.itemMap?.report?.itemScore == 0">
            {{ scope.row.itemMap?.report?.itemScore }}
          </span>
          <span v-else> -- </span>
        </template>
      </el-table-column>
      <el-table-column label="实验预习报告" prop="previewReport" width="150" v-if="isShowpReviewReports">
        <template #default="scope">
          <span v-if="scope.row.itemMap?.previewReport?.itemScore || scope.row.itemMap?.previewReport?.itemScore == 0">
            {{ scope.row.itemMap?.previewReport?.itemScore }}
          </span>
          <span v-else> -- </span>
        </template>
      </el-table-column>
      <el-table-column label="答辩验收" prop="defence" width="100" v-if="isShowDefence">
        <template #default="scope">
          <span v-if="scope.row.itemMap?.defence?.itemScore || scope.row.itemMap?.defence?.itemScore == 0">
            {{ scope.row.itemMap?.defence?.itemScore }}
          </span>
          <span v-else> -- </span>
        </template>
      </el-table-column>
      <el-table-column label="总评成绩" prop="resultScore" fixed="right" width="100">
        <template #default="scope">
          <span v-if="scope.row.resultScore || scope.row.resultScore == 0">{{ scope.row.resultScore }}</span>
          <span v-else> -- </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" fixed="right" width="100">
        <template #default="scope">
          <span>{{ statusMap.get(scope.row.status) }}</span>
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
import { scoreList, practiceDownload, fallBackApi, validPracticeList } from "@/api/practice/index.ts";
import { ResVO, StudentPracticePageVO } from "@/api/practice/type.ts";
import { downloadFile } from "@/utils/index";
import Header from "@/views/page/components/header/index.vue";
import Pagination from "@/views/page/components/pagination/index.vue";

const routes = useRouter();
const { currentRoute } = routes;
const route = currentRoute.value;
const privilege = route.query.privilege;
const practiceId = ref<string>("");
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
    name: "成绩管理",
    path: "",
  },
  {
    name: "成绩名单",
    path: "",
  },
];

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
  const resData: ResVO = await scoreList({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, practiceId: practiceId.value });
  if (resData.code == 200) {
    tableData.length = 0;
    tableData.push(...resData.data.data);
    pagination.total = resData.data.recordSize;
    tableData.forEach((item) => {
      if (item?.itemMap) {
        if (item.itemMap?.video) {
          isShowVideo.value = true;
        }else{
          isShowVideo.value = false;
        }
        if (item.itemMap?.image) {
          isShowImage.value = true;
        }else{
          isShowImage.value = false;
        }
        if (item.itemMap?.report) {
          isShowReport.value = true;
        }else{
          isShowReport.value = false;
        }
        if (item.itemMap?.previewReport) {
          isShowpReviewReports.value = true;
        }else{
          isShowpReviewReports.value = false;
        }
        if (item.itemMap?.defence) {
          isShowDefence.value = true;
        }else{
          isShowDefence.value = false;
        }
      }
    });
  } else {
    tableData.value = [];
    tableData.length = 0;
    pagination.total = 0;
  }
};

const validPracticeListData = ref<any[]>([]);
const loadValidPracticeList = async () => {
  validPracticeList()
    .then((res) => {
      if (res.code === "200") {
        // 返回的是一个对象，key是实验id，value是实验名称
        Object.keys(res.data).forEach((key) => {
          validPracticeListData.value.push({
            id: key,
            name: res.data[key],
          });
        });
      } else {
        console.log("999");
        validPracticeListData.value = [];
      }
    })
    .catch(() => {
      console.log("123");
      validPracticeListData.value = [];
    });
};
onMounted(() => {
  // loadStudentData();
  loadValidPracticeList();
});
</script>
<style>
.experimental-student-wrap .el-card__body {
  padding: 0 20px 20px 20px !important;
}
</style>
<style scoped>
.practice-tool {
  margin-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  font-size: 14px;
}
.pagination-box {
  padding: 5px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
}
</style>
