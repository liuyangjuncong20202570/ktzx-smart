<template>
  <div class="container">
    <el-header
      style="height: auto; padding: 5px 0px; width: 100%; background-color: #deebf7; display: flex"
    >
      <div class="searchInput">
        <el-input
          v-model.lazy="searchKeyword"
          @input="debouncedQuerySearch"
          :placeholder="props.keyword"
          class="input-with-select"
          style="width: 200px; margin-right: 0.8vw"
        ></el-input>
        <el-button type="primary" @click="querySearch">搜索</el-button>
      </div>
    </el-header>
    <!-- 列表开始 -->
    <div class="list">
      <List
        :titleList="titles"
        :listData="lists"
        :handleCellClick="handleCellClick"
        :addCellStyle="addCellStyle"
      />
      <!-- 分页器 -->
      <el-footer
        style="display: flex; justify-content: center; align-items: center; padding-bottom: 15px"
      >
        <el-pagination
          style="margin-top: 20px; text-align: center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-footer>
      <!-- 分页器结束 -->
    </div>
    <!-- 列表结束 -->
  </div>
</template>

<script setup>
import List from './List.vue';
import { searchInTable } from '@/utils/searchInTable.js';
import { storeToRefs } from 'pinia';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive, computed, onMounted } from 'vue';
import _ from 'lodash';

/* ********************变量定义******************** */
const props = defineProps({
  keyword: {
    type: String,
    default: '默认搜索内容'
  }
});

const titles = [
  { prop: 'courseName', label: '课堂名称' },
  { prop: 'term', label: '学期' },
  { prop: 'curriculum', label: '课程' },
  { prop: 'profession', label: '专业' },
  { prop: 'mainTeacher', label: '主讲教师' },
  { prop: 'experimentTeacher', label: '实验教师' },
  { prop: 'practiceTeacher', label: '实践教师' },
  { prop: 'creator', label: '创建人' }
];
const lists = [
  {
    id: 0,
    courseName: '单片机原理及应用-2023春-自实验21',
    term: '2023春季学期',
    curriculum: '单片机原理及应用I',
    profession: '自动化专业',
    mainTeacher: '赵仁涛',
    experimentTeacher: '',
    practiceTeacher: '',
    creator: '自动化专业负责人'
  },
  {
    id: 1,
    courseName: '单片机原理及应用-2024春-自实验22',
    term: '2024春季学期',
    curriculum: '单片机原理及应用I',
    profession: '自动化专业',
    mainTeacher: '赵仁涛',
    experimentTeacher: '',
    practiceTeacher: '',
    creator: '李志军'
  }
];

const searchKeyword = ref('');
const pageSize = ref();
const currentPage = ref();
const filteredData = ref();

/* ********************方法定义******************** */
// 单元格样式定义
const addCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 2) {
    return {
      color: '#86BFA8',
      textAlign: 'center',
      textDecoration: 'underline',
      cursor: 'pointer'
    };
  }
  return {
    textAlign: 'center'
  };
};

// 搜索框
const querySearch = () => {
  // 处理搜索逻辑
  if (searchKeyword.value.length >= 1 || searchKeyword.value.length === 0) {
    filteredData.value = searchInTable(filteredData.value, searchKeyword.value, 'username'); // 假设我们按 'username' 列搜索
    // console.log('搜索内容:', searchKeyword.value)
  }
};
const debouncedQuerySearch = _.debounce(() => {
  querySearch();
}, 500);

// 单元格点击事件
const handleCellClick = (row, column, cell) => {
  // 限定只有courseName单元格才能点击
  if (column.property === 'courseName') {
    console.log(row.id);
    //TODO 此处将打开学生列表，发送请求将id传过去
  }
};
/* ********************分页器******************** */
// 处理每页显示条目数改变
const handleSizeChange = newSize => {
  pageSize.value = newSize;
  // 重置当前页到第一页
  currentPage.value = 1;
};

// 处理当前页改变
const handleCurrentChange = newPage => {
  currentPage.value = newPage;
};

// 计算分页数据
const pagedData = computed(() => {
  return filteredData.value?.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});

/* ********************分页器******************** */
</script>

<style lang="less" scoped>
.container {
  height: 92vh;
  display: flex;
  flex-direction: column;
  .searchInput {
    padding-left: 15px;
  }
  .list {
    text-align: center;
  }
  .firstCell {
    color: #86bfa8;
  }
}
</style>
