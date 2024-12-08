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
    <List
      :titleList="props.titleList"
      :listData="props.graphList"
      :handleCellClick="props.handleCellClick"
      :addCellStyle="props.addCellStyle"
    />
  </div>
  <!-- 列表结束 -->
</template>

<script setup>
import DynamicStudentList from './DynamicStudentList.vue';
import List from './List.vue';
import { searchInTable } from '@/utils/searchInTable.js';
import { storeToRefs } from 'pinia';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive, computed, onMounted } from 'vue';
import _ from 'lodash';

/* ********************变量定义******************** */
// props定义
const props = defineProps({
  keyword: {
    type: String,
    default: '默认搜索内容'
  },
  graphList: {
    type: Array,
    default: () => []
  },
  titleList: {
    type: Array,
    default: () => []
  },
  addCellStyle: {
    type: Function,
    default: ({ row, column, rowIndex, columnIndex }) => ({ textAlign: 'center' })
  },
  handleCellClick: {
    type: Function,
    default: () => ({})
  }
});

const searchKeyword = ref('');
const pageSize = ref();
const currentPage = ref();
const filteredData = ref();

/* ********************方法定义******************** */
// 搜索框
// TODO:待封装
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
