<template>
  <!-- 问卷item组件 -->
  <div class="stu-ques-item">
    <div class="item-title">
      89S51的内部程序存储器与数据存储器容量各为多少？
    </div>
    <div class="task-select flex-between" v-if="['单选题', '判断题'].includes(TOPICTYPE[row.typeId])">
      <el-radio-group v-model="row.selectId" v-if="['0201', '0203'].includes(row.typeId)" :disabled="disabled">
        <el-radio v-for="item in row.items" :key="item.id" :label="item.itemOption">{{ item.itemContent }}</el-radio>
      </el-radio-group>
    </div>

    <div class="task-select flex-between" v-if="['多选题'].includes(TOPICTYPE[row.typeId])">
      <el-checkbox-group v-model="row.selectId" v-if="row.typeId == '0202'" :disabled="disabled">
        <el-checkbox v-for="item in row.items" :key="item.id" :label="item.itemOption">
          {{ item.itemContent }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div class="task-select flex-between" v-if="['简答题'].includes(TOPICTYPE[row.typeId])">
      <el-input v-model="row.selectId" :disabled="disabled" maxlength="30" style="width: 500px" placeholder="请填写答案"
        show-word-limit type="textarea" />
    </div>

    <div class="task-select flex-between" v-if="['填空题'].includes(TOPICTYPE[row.typeId])">
      <span v-html="row.content"></span>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, defineProps } from 'vue'
import { useRouter } from 'vue-router'
// import { ElTable, ElMessage, ElMessageBox } from 'element-plus'
// import { myQueFormPager } from '@/api/stuQues.js'
import { TOPICTYPE } from '@/utils/consts.js'
const router = useRouter()
const { currentRoute } = router
const route = currentRoute.value
const props = defineProps({
  disabled: {
    type: Boolean,
    default: "false"
  },
  row: {
    type: Object,
    default: {}
  }
})
const { row = {}, disabled = false } = props
console.log('props', props)

onMounted(() => {
  if (['填空题'].includes(TOPICTYPE[row.typeId])) {
    const contentItems = row.content.split(/___/)
    let newContent = ''
    row.selectId = []
    contentItems.forEach((content, idx) => {
      newContent += content
      if (idx < contentItems.length - 1) {
        row.selectId.push(row.id + idx)
        // value="${value ? value[idx] : ''
        newContent += `<input id="${row.id + idx}" ${disabled ? 'disabled' : ''} }" />`
      }
    })
    row.content = newContent
  }
})
</script>

<style scoped>
.stu-ques-item {
  font-size: 13px;
  border-bottom: 1px solid #efefef;
  text-align: left;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
</style>