<template>
  <el-dialog
    v-model="visible"
    title="查看批改"
    width="80%"
    class="custom-dialog custom-dialog-view-correction"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="correction-image-container">
      <div class="image-wrapper">
        <!-- 原始图片 -->
        <img 
          v-if="originalImgUrl"
          :src="host + originalImgUrl" 
          alt="原始图片"
          class="correction-image original-image"
        />
        <!-- 批改图片 -->
        <img 
          v-if="imgUrl"
          :src="host + '/static/' + imgUrl" 
          alt="批改图片"
          class="correction-image correction-overlay"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { host } from "@/utils/request.js"

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  imgUrl: {
    type: String,
    default: ''
  },
  originalImgUrl: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const visible = ref(false)

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(() => visible.value, (val) => {
  emit('update:modelValue', val)
})
</script>

<style scoped>
.correction-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
  position: relative;
}

.image-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}


.correction-image {
  max-width: 100%;
  object-fit: contain;

}

.original-image {
  position: relative;
  z-index: 1;
}

.correction-overlay {
  position: absolute;
  /* top: 0;
  left: 0; */
  z-index: 2;
  opacity: 0.7; /* 可以调整透明度 */
  mix-blend-mode: multiply; /* 可以调整混合模式 */
}
.custom-dialog-view-correction{
  min-height: 500px;
  overflow-y: auto;
}
:deep(.el-dialog__body) {
  
  overflow-y: auto;
}
</style> 
<style>
.custom-dialog-view-correction .el-dialog__body{
  height: calc(100vh - 200px);
  overflow-y: scroll;
}</style>
