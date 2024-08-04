<template>
  <!-- 题类型弹窗组件 -->
  <el-dialog v-model="dialogVisible" title="选择组卷方式" width="900px">
    <div class="task-header">
      <div class="flex-between tasl-card-wrap">
        <div class="task-card">
          <p>选题组卷</p>
          <p>采用手工从题库中选取试题的方式添加题目组成试卷</p>
        </div>
        <div class="task-card">
          <p>抽题组卷</p>
          <p>从题库中根据规则抽取题目处理，组成试卷</p>
        </div>
        <div class="task-card">
          <p>随机组卷</p>
          <p>设置组卷规则，题目不固定，考试时候随机生成，实现千人千卷的效果</p>
        </div>
      </div>
      <div class="flex-between task-name">
        <span>作业名称</span>
        <el-input v-model="taskName" style="width: 200px;"></el-input>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button @click="save" type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { addPaper } from '@/api/taskMgmt.js'

const router = useRouter()
const emit = defineEmits(['child-event'])
const dialogVisible = ref(false)
const taskName = ref('')
const init = () => {
  handleOpen()
}

const save = () => {
  const data = { makeModeId: 1, name: taskName.value }
  addPaper(data).then(res => {
    if (res.code === '200') {
      handleClose()
      ElMessage.success('添加成功')
      router.push({
        path: '/page/taskMgmt/tpAssembly',
        query: {
          id: res.data
        }
      });
      emit('save')
    }
  })
}

const handleOpen = () => {
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
}

// 导出函数
defineExpose({
  init,
})
</script>

<style scoped>
.tasl-card-wrap {
  margin: 0 auto;
}
.task-card {
  width: 300px;
  background: #d7d7d7;
  padding: 10px;
  margin: 0 10px;
  border-radius: 5px;
}

.task-card:first-child {
  color: #fff;
  background: #2b93ff;
}
.task-name {
  width: 300px;
  margin-top: 20px;
  margin: 40px auto 0 auto;
}
</style>