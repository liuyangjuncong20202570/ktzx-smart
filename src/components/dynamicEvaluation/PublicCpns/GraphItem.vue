<template>
  <div class="container">
    <div class="title">
      <el-icon><Rank /></el-icon>
      {{ props.title }}
    </div>
    <div class="split"></div>
    <div class="chart">
      <v-chart
        autoresize
        :theme="'shine'"
        :option="props.chartOption"
        :style="{ height: props.chartHeight + 'vh', width: props.chartWidth + '%' }"
      ></v-chart>
    </div>
    <div class="timeLine">
      <el-slider
        v-model="slideValue"
        :max="max"
        :format-tooltip="formatTooltip"
        @input="inputSlider"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { defaultPreset } from '../../../assets/js/dynamicEvaluationPresets/defaultChart';
/* ********************变量定义******************** */
// props定义
const props = defineProps({
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
  }
});
// 普通变量
const slideValue = ref();
const max = ref();

// pinia状态管理

/* ********************方法定义******************** */
const inputSlider = () => {};
</script>

<style lang="less" scoped>
.container {
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
  .split {
    // padding-top: 10px;
    width: 100%;
    border-bottom: 1px solid #e4e7ee;
  }
  .chart {
    padding-top: 20px;
  }
}
</style>
