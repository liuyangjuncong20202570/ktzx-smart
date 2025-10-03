<template>
  <div class="container">
    <div class="title">
      <el-icon><Rank /></el-icon>
      {{ props.title }}
    </div>
    <div class="split"></div>
    <div class="chart" style="z-index: 1">
      <div v-if="props.isShow" class="ban">
        当前展示第{{ props.currentTimes }}次评价，已评价{{ props.totalTimes }}次
      </div>
      <div v-if="$slots.default">
        <slot></slot>
      </div>
      <v-chart
        v-else
        @timeline-changed="props.onTimelineChanged"
        ref="chartRef"
        autoresize
        :option="props.chartOption"
        :style="{ height: props.chartHeight + 'vh', width: props.chartWidth + '%' }"
      ></v-chart>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, onBeforeUnmount } from 'vue';
import { defaultPreset } from '../../../assets/js/dynamicEvaluationPresets/defaultChart';
/* ********************变量定义******************** */
// props定义
const props = defineProps({
  isShow: {
    type: Boolean,
    defaul: false
  },
  title: {
    type: String,
    default: '默认标题'
  },
  // 请注意：此处chartWidth单位为百分比，chartHeight为视高vh
  chartWidth: {
    type: Number,
    default: 100
  },
  chartHeight: {
    type: Number,
    default: 45
  },
  chartOption: {
    type: Object,
    default: () => defaultPreset
  },
  onTimelineChanged: {
    type: Function,
    defaul: event => ({})
  },
  currentTimes: {
    type: Number,
    defaul: 0
  },
  totalTimes: {
    type: Number,
    default: 0
  }
});
// 普通变量
const chartRef = ref(null);
const slideValue = ref();
const max = ref();
const isDataView = ref(false);

defineExpose({
  getChartInstance: () => {
    return chartRef.value; // 返回 echarts 实例
  },
  // 你还可以暴露其他方法，例如：
  refreshChart: () => {
    chartRef.value?.echartsInstance().resize(); // 重新调整图表大小
  }
});

// pinia状态管理

/* ********************方法定义******************** */

// const inputSlider = () => {};

onMounted(() => {});
onBeforeUnmount(() => {
  chartRef.value?.dispose();
  chartRef.value = null;
});
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-wrap: nowrap;
  margin-bottom: 20px;
  .title {
    display: flex;
    align-items: center;
    color: #6ca5de;
    height: 50px;
    font-size: 20px;
  }
  .operation {
    z-index: 999;
    width: 100px;
    height: auto;
    position: absolute;
    top: 8vh;
    right: 0;
    display: flex;
    flex-wrap: nowrap;
    flex-shrink: 0;
    justify-content: space-around;
  }
  .split {
    // padding-top: 10px;
    width: 100%;
    border-bottom: 1px solid #e4e7ee;
  }
  .chart {
    padding-top: 20px;
    position: relative;
    .ban {
      position: absolute;
      z-index: 10;
      top: 50px;
      font-size: 12px;
      color: #111111;
    }
  }
}
</style>
