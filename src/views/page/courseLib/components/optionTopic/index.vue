<template>
  <!-- 题类型弹窗组件 -->
  <el-dialog v-model="dialogVisible" title="添加题目" width="800px">
    <div class="flex-between">
      <el-button 
        @click="handleConfirm(item)"
        v-for="(item, i) in libTypeList" 
        :key="i" 
        type="primary">
        {{ item.name }}
      </el-button>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { courseLibTypeList } from '@/api/courseLib.js' 

export default defineComponent({
  setup(props, { emit }) {
    const dialogVisible = ref(false);
    const libTypeList = ref([])
    const init = () => {
      handleOpen()
      getCourseLibTypeList()
    }

    const handleOpen = () => {
      dialogVisible.value = true
    }

    const handleClose = () => {
      dialogVisible.value = false
    }

    const handleConfirm = (item) => {
      const { queTypeId, name } = item
      dialogVisible.value = false;
      emit('childData', queTypeId, name);
    }

    const getCourseLibTypeList = () => {
      courseLibTypeList().then(res => {
        if (res.code === '200') {
          libTypeList.value = res?.data.filter((item) => item.status)
        }
        console.log('res', res)
      })
    }

    return {
      init,
      handleOpen,
      handleClose,
      handleConfirm,
      libTypeList,
      dialogVisible,
    };
  }
});
</script>