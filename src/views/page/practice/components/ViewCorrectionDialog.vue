<template>
  <el-dialog
    v-model="visible"
    title="查看批改"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="custom-dialog"
  >
    <div class="correction-image-container">
      <img 
        :src="host + '/static/' + imgUrl" 
        alt="批改图片"
        class="correction-image"
      />
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
}

.correction-image {
  max-width: 100%;
  object-fit: contain;
}
</style> 