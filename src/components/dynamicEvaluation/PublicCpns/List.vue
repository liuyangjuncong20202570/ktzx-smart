<template>
  <div class="list">
    <el-table
      :data="props.listData"
      :border="true"
      style="width: 100%"
      highlight-current-row
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="props.addCellStyle"
      @cell-click="props.handleCellClick"
    >
      <el-table-column label="序号" width="100%">
        <template #default="scope">{{
          props.listData.findIndex(
            item =>
              item.userId === scope.row.userId &&
              item.classroomId === scope.row.classroomId &&
              item.testId === scope.row.testId
          ) + 1
        }}</template>
      </el-table-column>
      <template v-for="(item, index) in props.titleList" :key="index">
        <el-table-column show-overflow-tooltip :prop="item.prop" :label="item.label" />
      </template>
    </el-table>
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
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

/* ********************变量定义******************** */
const props = defineProps({
  titleList: {
    type: Array,
    default: () => [
      { prop: 'title1', label: '标题1' },
      { prop: 'title2', label: '标题2' },
      { prop: 'title3', label: '标题3' }
    ]
  },
  // 在复用时，需要注意传入的listData的key要与titleList的prop一致
  listData: {
    type: Array,
    default: () => [
      { id: 0, title1: '内容1', title2: '内容2', title3: '内容3' },
      { id: 1, title1: '内容1', title2: '内容2', title3: '内容3' },
      { id: 2, title1: '内容1', title2: '内容2', title3: '内容3' }
    ]
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
</script>

<style lang="less" scoped></style>
