<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="true"
    :close-on-click-modal="true"
    style="width: 50vw; padding-top: 0; height: 78vh"
    v-model="props.store.chartVisible"
  >
    <h2 style="margin-top: 0">
      <slot name="title">默认学生画像</slot>
    </h2>
    <!-- 图表 -->
    <div class="chart-container">
      <el-scrollbar>
        <slot name="GraphItem">
          <GraphItem />
        </slot>
      </el-scrollbar>
    </div>

    <!-- 图表结束 -->=
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import GraphItem from '../PublicCpns/GraphItem.vue';
/* ********************变量定义******************** */
// props定义
const props = defineProps({
  store: {
    type: Object,
    default: () => ({ chartVisible: false })
  }
});
// 普通变量
const chartVisible = ref(props.store.chartVisible);
// pinia状态管理]

/* ********************方法定义******************** */
</script>

<style lang="less" scoped>
.chart-container {
  overflow: auto;
  height: 67vh;
}
</style>
