<template>
  <el-drawer
    destroy-on-close
    v-model="drawer"
    :title="title"
    direction="rtl"
    :before-close="handleClose"
    size="60%"
  >
    <div
      :style="Reinin.length === 1 ? '' : 'padding-top: 600px'"
      class="h-full flex items-center justify-center flex-col"
    >
      <template v-for="r in Reinin">
        <Pyramid :Reinin="r" :polLength="r.length" :labelColor="labelColor" />
      </template>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { Pyramid } from '@ui';
import { useValueEffect } from './sideEffect';
import { onUnmounted, toRefs, watch } from 'vue';
import { DetailProps, PyramidDetail } from './type';

const { drawer } = toRefs(useValueEffect());
const props = withDefaults(defineProps<DetailProps & PyramidDetail>(), {
  title: '默认标题'
});

const emit = defineEmits<{
  (e: 'close', open: boolean): void;
}>();

const { title, Reinin, labelColor } = toRefs(props);

const handleClose = () => {
  emit('close', false);
};
</script>

<style scoped lang="less"></style>
