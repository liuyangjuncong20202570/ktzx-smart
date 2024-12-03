<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="true"
    :close-on-click-modal="true"
    style="width: 50vw; padding-top: 0; height: 78vh"
    v-model="chartVisible"
  >
    <h2 style="margin-top: 0">
      <slot name="title">默认学生画像</slot>
    </h2>
    <!-- 图表 -->
    <div class="chart-container">
      <el-scrollbar>
        <GraphItem title="能力画像" :chartOption="radarOption" />
        <GraphItem title="关键字画像" :chartOption="wordOption" />
        <GraphItem title="KWA画像" />
        <GraphItem title="知识单元画像" :chartOption="treeOption" />
      </el-scrollbar>
    </div>

    <!-- 图表结束 -->=
  </el-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import useStudentGraph from '../../../stores/dynamicEvaluation/studentGraphStore';
import GraphItem from '../PublicCpns/GraphItem.vue';
import { radarOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Radar';
import { treeOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Treemap';
import { wordOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/wordmap';
/* ********************变量定义******************** */
// props定义
// 普通变量
// pinia状态管理
const studentGraphStore = useStudentGraph();
const { chartVisible } = storeToRefs(studentGraphStore);

/* ********************方法定义******************** */
</script>

<style lang="less" scoped>
.chart-container {
  overflow: auto;
  height: 67vh;
}
</style>
