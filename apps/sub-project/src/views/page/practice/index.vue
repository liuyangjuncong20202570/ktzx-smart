<template>
  <div class="practice-wrap">
    <Header title="实验管理" :pathData="pathData" />
    <div class="practice-tool">
      <el-button class="custom-nav-button custom-nav-button-success" @click="addPractice"
        ><el-icon><Plus /></el-icon> 新建实验</el-button
      >
      <el-button class="custom-nav-button custom-nav-button-info" @click="batchCopy"
        ><el-icon><CopyDocument /></el-icon> 批量复制</el-button
      >
      <el-button class="custom-nav-button custom-nav-button-primary" @click="downLoadAll"
        ><el-icon><Download /></el-icon> 下载所有成绩</el-button
      >
      <el-button class="custom-nav-button custom-nav-button-delete" @click="delPracticeData"
        ><el-icon><Delete /></el-icon> 批量删除</el-button
      >
      <!-- 刷新 -->
      <el-button class="custom-nav-button custom-nav-button-primary" @click="getPracticePage"
        ><el-icon><Refresh /></el-icon> 刷新</el-button
      >
    </div>
    <el-table ref="multipleTableRef" :data="tableData" class="custom-table" style="width: 100%" :row-key="(row: any)=> row.id" @selection-change="handleSelectionChange">
      <el-table-column lebel="选择" type="selection" width="55" :reserve-selection="true" />
      <!-- 超过两行显示省略号 -->
      <el-table-column label="题目" prop="name" width="200">
        <template #default="scope">
          <p :title="scope.row.name" class="custom-table-ellipsis">{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="updateTime" width="200" />
      <!-- <el-table-column label="创建人" prop="updateMan" width="150">
        <template #default="scope">
          {{ scope.row.updateMan ? scope.row.updateMan : "-" }}
        </template>
      </el-table-column> -->
      <el-table-column label="排序" prop="updateMan" width="150">
        <template #default="scope">
          <span class="custom-sort-icon" @click="sortPracticesUp(scope.row.id)">
            <el-icon><Top style="color: #fff" /> </el-icon>
          </span>
          <span class="custom-sort-icon" @click="sortPracticeDown(scope.row.id)">
            <el-icon><Bottom style="color: #fff" /> </el-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="operate" width="300" fixed="right">
        <template #default="scope">
          <el-button v-if="scope.row.status == 1" class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="stopPractice(scope.row.id)">停止</el-button>
          <el-button v-if="scope.row.status == 3" class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="rePublishPractice(scope.row.id)">重新发布</el-button>
          <template v-if="scope.row.status == 0 && !(privilege === 'read')">
            <el-button class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="publishPracticeData(scope.row.id)">发布</el-button>
          </template>
          <template v-else>
            <el-button class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="lookStudent(scope.row)">查看学生</el-button>
            <el-button class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="toViewPractice(scope.row)">查看</el-button>
            <el-button class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="correct(scope.row)">批改</el-button>
          </template>
          <el-button class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="handleCopy([scope.row])">复制</el-button>
          <el-button
            :class="!scope.row.status ? 'custom-link-button custom-link-active-button' : 'custom-link-button custom-link-default-button'"
            :disabled="scope.row.status"
            v-if="!(privilege === 'read')"
            type="primary"
            :text="true"
            @click="editPractice(scope.row)"
            >编辑</el-button
          >
          <el-button
            :class="!scope.row.status ? 'custom-link-button custom-link-delete-button' : 'custom-link-button custom-link-default-button'"
            :disabled="scope.row.status"
            v-if="!(privilege === 'read')"
            type="danger"
            :text="true"
            @click="delPracticeRow(scope.row.id)"
            >删除</el-button
          >
          <el-button 
            class="custom-link-button custom-link-active-button" 
            type="primary" 
            :text="true" 
            @click="handleDownload(scope.row)"
            v-if="scope.row.status != 0"
          >
            <el-icon v-if="scope.row.downloadState === 'ready'" color="#409efc"><CircleCheck /></el-icon>
            <el-icon class="running-icon" v-if="scope.row.downloadState === 'running'" color="#999" ><Loading /></el-icon>
            <el-icon v-if="scope.row.downloadState === 'complete'" color="#67c23a" ><Download /></el-icon>
            <el-icon v-if="scope.row.downloadState === 'failed'" color="#f56c6c" ><Warning /></el-icon>
            <span style="margin-left: 0px;">一键下载</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <Pagination :pageIndex="pagination.pageIndex" :pageSize="pagination.pageSize" :total="pagination.total" @update:pageIndex="updatePageIndex" />
    </div>
    <!-- 无权限显示 -->
    <NoAccessPermission v-if="privilege === 'none'" />
    <DownloadDialog
      v-model="showDownloadDialog"
      :download-info="currentDownloadInfo"
      @start-download="handleStartDownload"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import router from "@/router/index.js";
import {
  practicePage,
  delPractice,
  publishPractice,
  studentWR,
  sortPractice,
  sortPracticeUp,
  batchCopy as batchCopyApi,
  nextPageApi1,
  downLoadAllApi,
  stopPractice as stopPracticeApi,
  rePublishPractice as rePublishPracticeApi,
  getDownloadInfo,
  startDownload,
} from "@/api/practice/index.ts";
import { PracticePageVO } from "@/api/practice/type.ts";
import { ElMessage, ElMessageBox } from "element-plus";
import NoAccessPermission from "@/views/page/components/noAccessPermission/index.vue";
import Header from "@/views/page/components/header/index.vue";
import Pagination from "@/views/page/components/pagination/index.vue";
import { host } from "@/utils/request.js";
import { downloadFile } from "@/utils/index";
import DownloadDialog from './components/DownloadDialog.vue'

const routes = useRouter();
const { currentRoute } = routes;
const route = currentRoute.value;
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  total: 0,
});
const multipleTableRef = ref(null);
const privilege = ref("");
const selectData = ref([]);
const pathData = [
  {
    name: "实验管理",
    path: "",
  },
];
const getWR = () => {
  studentWR().then((res) => {
    if (res.code === "200") {
      privilege.value = res.data;
    }
  });
};
// 批改
const correct = (data: any) => {
  console.log("data", data.id);
  nextPageApi1(data.id).then((res) => {
    if (res.code === "200" && res.data != null) {
      routes.push({ path: "/homes/courseteacherhome/exam/experimental/correct", query: { id: data.id, sid: res.data.stuId, pid: res.data.practiceId, type: "pg" } });
    } else {
      ElMessage.error("没有可批改数据");
    }
  });
};
const addPractice = () => {
  routes.push("/homes/courseteacherhome/exam/experimental/practiceInfo");
};
const tableData = ref([]);
const publishPracticeData = async (id: string) => {
  ElMessageBox.confirm("确定发布吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const resData = await publishPractice(id);
      if (resData.code == 200) {
        ElMessage({ message: "发布成功", type: "success" });
        getPracticePage();
      }
    })
    .catch(() => {});
};
// 查看学生实验
const lookStudent = (row: any) => {
  router.push({ path: "/homes/courseteacherhome/exam/experimental/student", query: { id: row.id, privilege: privilege.value } });
};
// 分页列表
const getPracticePage = async () => {
  const data = await practicePage({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize });
  if (data.code == 200) {
    tableData.value = data?.data?.data || [];
    pagination.total = data?.data?.recordSize || 0;
  }
};
// 编辑数据
const editPractice = (row: any) => {
  router.push({ path: "/homes/courseteacherhome/exam/experimental/practiceInfo", query: { id: row.id } });
};
// 查看
const toViewPractice = (row: any) => {
  router.push({ path: "/homes/courseteacherhome/exam/experimental/practiceInfo", query: { id: row.id, disabled: true } });
};
// 删除一条实验
const delPracticeRow = async (id: string) => {
  ElMessageBox.confirm("确定删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const resData = await delPractice([id]);
      if (resData.code == 200) {
        ElMessage({ message: "删除成功！", type: "success" });
        getPracticePage();
      }
    })
    .catch(() => {});
};
// 批量删除实验
const delPracticeData = async () => {
  ElMessageBox.confirm("确定删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const selectRow = multipleTableRef.value?.getSelectionRows();
      if (selectRow.length <= 0) {
        ElMessage({ message: "请选择要删除的实验", type: "error" });
        return;
      }
      const ids: string[] = selectRow.map((item) => item.id);
      console.log("ids", ids);
      const resData = await delPractice(ids);
      if (resData.code == 200) {
        ElMessage({ message: "删除成功！", type: "success" });
        multipleTableRef.value?.clearSelection();
        getPracticePage();
      }
    })
    .catch(() => {});
};
const updatePageIndex = (pageIndex: number) => {
  pagination.pageIndex = pageIndex;
  getPracticePage();
};
// 排序
const sortPracticesUp = async (id: string) => {
  let resData = await sortPracticeUp(id);
  if (resData.code == 200) {
    ElMessage({ message: "排序成功！", type: "success" });
    getPracticePage();
  }
};
const sortPracticeDown = async (id: string) => {
  let resData = await sortPractice(id);
  if (resData.code == 200) {
    ElMessage({ message: "排序成功！", type: "success" });
    getPracticePage();
  }
};
// 选择
const handleSelectionChange = (selection: any) => {
  selectData.value = selection;
};
// 批量复制
const handleCopy = (rows: any[]) => {
  selectData.value = rows;
  batchCopy();
};
const batchCopy = async () => {
  if (!selectData.value.length) {
    ElMessage({ message: "请选择要复制的实验", type: "error" });
    return;
  }

  ElMessageBox.confirm("确定复制所选实验?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let ids = selectData.value.map((item) => item?.id);
      let resData = await batchCopyApi(ids);
      if (resData.code == 200) {
        ElMessage({ message: "复制成功！", type: "success" });
        multipleTableRef.value?.clearSelection();
        getPracticePage();
      }
    })
    .catch(() => {});
};
// 下载所有成绩
const downLoadAll = () => {
  ElMessageBox.confirm("确定下载所有成绩?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let resData = await downLoadAllApi();
      if (resData.code == 200) {
        ElMessage({ message: "下载成功！", type: "success" });
        downloadFile(host + "/static/" + resData.data, resData.data);
      }
    })
    .catch(() => {});
};
// 停止实验
const stopPractice = (id: string) => {
  ElMessageBox.confirm("确定停止实验?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("id", id);
      console.log("stopPractice", stopPractice);
      let resData = await stopPracticeApi(id);
      if (resData.code == 200) {
        ElMessage({ message: "停止成功！", type: "success" });
        getPracticePage();
      }
    })
    .catch(() => {});
};
// 重新发布实验
const rePublishPractice = (id: string) => {
  ElMessageBox.confirm("确定重新发布实验?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let resData = await rePublishPracticeApi(id);
      if (resData.code == 200) {
        ElMessage({ message: "重新发布成功！", type: "success" });
        getPracticePage();
      }
    })
    .catch(() => {});
};
const showDownloadDialog = ref(false)
const currentDownloadInfo = ref({})

const handleDownload = async (row) => {
  try {
    const res = await getDownloadInfo(row.id)
    if (res.code === '200') {
      currentDownloadInfo.value = res.data
      showDownloadDialog.value = true
    }
  } catch (error) {
    ElMessage.error('获取下载信息失败')
  }
}

const handleStartDownload = async (params) => {
  try {
    const res = await startDownload(params)
    if (res.code === '200') {
      ElMessage.success('下载任务已启动')
      showDownloadDialog.value = false
      getPracticePage() // 刷新列表
    }
  } catch (error) {
    ElMessage.error('启动下载任务失败')
  }
}

onMounted(() => {
  getPracticePage();
  getWR();
});
</script>
<style>
.practice-wrap .el-card__body {
  padding: 0 20px 20px 20px !important;
}
</style>
<style scoped>
.practice-wrap {
  position: relative;
}
.practice-tool {
  margin-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
}
.pagination-box {
  padding: 5px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
}
.custom-sort-icon {
  display: inline-block;
  width: 26px;
  height: 26px;
  line-height: 30px;
  text-align: center;
  background: #27a5ff;
  border-radius: 3px;
  margin: 0 5px;
  cursor: pointer;
}
.running-icon{
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
