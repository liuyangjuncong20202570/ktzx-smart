<template>
  <PdfPreview
    @handleLoading="handleLoad"
    v-show="!isLoading"
    ref="pdfPreviewRef"
    :fileUrl="props.fileUrl"
  />
  <LoadingSpinner v-show="isLoading" />
</template>

<script setup>
import PdfPreview from './PdfPreview.vue';
import { ref, onMounted, computed } from 'vue';
import LoadingSpinner from '../Classroommangt/LoadingSpinner.vue';

const pdfPreviewRef = ref(null);
const isLoading = ref(true);

const props = defineProps({
  fileUrl: {
    type: String,
    required: true
  }
});

const handleLoad = () => {
  isLoading.value = false;
};
</script>

<style lang="scss" scoped></style>
