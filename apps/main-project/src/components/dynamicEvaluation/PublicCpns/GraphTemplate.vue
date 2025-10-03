<template>
  <div v-loading="mainStore.dynamicSearchloading" class="container">
    <el-header
      style="height: auto; padding: 5px 0px; width: 100%; background-color: #deebf7; display: flex"
    >
      <div class="searchInput">
        <el-input
          v-model.lazy="search"
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
import { getCourseId } from '@/utils/searchCourseId.js';
import parseJWT from '../../../utils/parseJWT.js';
import List from './List.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive, computed, onMounted } from 'vue';
import _ from 'lodash';
import useMain from '../../../stores/useMain.js';

/* ********************变量定义******************** */
// props定义
const props = defineProps({
  store: {
    type: Object,
    default: () => ({ listVisible: false })
  },
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

const courseId = ref(0);
const search = ref('');
const pageSize = ref();
const currentPage = ref();
const filteredData = ref();
const emits = defineEmits('flushList');
const mainStore = useMain();

/* ********************方法定义******************** */
// 搜索框
// TODO:待封装
// 搜索框逻辑
const debouncedQuerySearch = _.debounce(() => {
  querySearch();
}, 500);

const querySearch = async () => {
  if (search.value.length >= 1 || search.value.length === 0) {
    mainStore.setDynamicSearchloading(true);
    const { code, msg } = await props.store.fetchSearchList(courseId.value, search.value);
    emits('flushList');
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

onMounted(async () => {
  const role = JSON.parse(sessionStorage.getItem('users'));
  if (role.rolename === '任课教师') {
    const { code, msg, data } = await getCourseId(parseJWT(sessionStorage.getItem('token')).obsid);
    if (code === 200 && msg === 'success') {
      courseId.value = data;
    }
  } else if (role.rolename === '课程负责人') {
    courseId.value = parseJWT(sessionStorage.getItem('token')).obsid;
  }
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
