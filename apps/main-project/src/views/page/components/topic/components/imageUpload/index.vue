<template>
  <el-upload
    style="width: 16px; height: 20px;"
    :action="action"
    :data="data"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
  >
    <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
    
    <el-popover v-if="imageUrl" :visible="visible" placement="top" :width="300">
      <p>图片预览</p>
      <img width="100%" :src="imageUrl" class="avatar" />
      <template #reference>
        <el-icon><Picture /></el-icon>
      </template>
    </el-popover>
    <el-icon v-else><Picture /></el-icon>
  </el-upload>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { Picture, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { host } from "@/utils/request.js";
export default defineComponent({
components: {
    Close,
    Picture,
  },
  props: ['item'],
  setup(props) {
    const item = props.item || {}
    const action = ref(host + '/common/upload')
    const data = ref({})
    const imageUrl = ref('')
    imageUrl.value = item.itemPicture ?? ''
    data.value = {
      tag: 'test'
    }

    const handleAvatarSuccess = (
      response,
      uploadFile
    ) => {
      if (response?.code === '200') {
        const imgUrl = host + '/static/' + response.data
        item.itemPicture = imgUrl
        imageUrl.value = imgUrl
        console.log('imageUrl', imageUrl)
      }
    }
    return {
        Picture,
        image: props.image,
        action,
        handleAvatarSuccess,
        data,
        item,
        imageUrl,
        // beforeAvatarUpload
    }
  }
})  


</script>

<style scoped>
.upload-wrap {
  position: relative;
}
</style>