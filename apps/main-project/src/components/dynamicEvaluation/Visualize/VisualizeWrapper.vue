<template>
  <div style="height: 900px" class="w-[100%] overflow-auto">
    <!-- <Universe /> -->
    <!-- <Flat /> -->
    <PyramidComp />
  </div>
</template>

<script setup lang="ts">
import '../../../assets/css/taildwind.css';
import Flat from './Flat.vue';
import Universe from './Universe.vue';
import PyramidComp from './PyramidComp.vue';
import { ref } from 'vue';

const modol = ref('Links');
</script>

<style lang="less"></style>
