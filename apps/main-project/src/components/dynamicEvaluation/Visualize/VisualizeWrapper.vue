<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="图谱" name="first">
      <Flat />
    </el-tab-pane>
    <el-tab-pane label="成长核心" name="second">
      <div style="" class="w-[100%] overflow-auto flex items-center justify-center">
        <Universe />
      </div>
    </el-tab-pane>
    <el-tab-pane label="学习金字塔" name="third">
      <div style="" class="w-[100%] overflow-auto flex items-center justify-center">
        <PyramidComp />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import '../../../assets/css/taildwind.css';
import Flat from './Flat.vue';
import Universe from './Universe.vue';
import PyramidComp from './PyramidComp.vue';
import { ref } from 'vue';
import { TabsPaneContext } from 'element-plus';

const activeName = ref('first');
const handleClick = (tab: TabsPaneContext) => {
  activeName.value = tab.paneName as string;
};
</script>

<style lang="less"></style>
