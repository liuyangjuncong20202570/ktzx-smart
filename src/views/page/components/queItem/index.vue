<template>
  <!-- 问卷item组件 -->
  <div class="stu-ques-item">
    <div class="item-title">
      {{ index+1 }}、{{ row.title }}({{ TOPICTYPE[row.typeId] }})
    </div>
    <span v-html="row.content"></span>
    <div class="task-select flex-between" v-if="['单选题', '判断题'].includes(TOPICTYPE[row.typeId])">
      <el-radio-group v-model="row.selectId" :disabled="disabled">
        <el-radio v-for="item in row.items" :key="item.id" :label="item.itemOption">
          {{ item.itemContent }}
          <img v-if="item.itemPicture" :src="item.itemPicture" />
        </el-radio>
      </el-radio-group>
    </div>

    <div class="task-select" v-if="['多选题'].includes(TOPICTYPE[row.typeId])">
      <el-checkbox-group v-model="row.selectId" v-if="row.typeId == '0202'" :disabled="disabled" @change="((val) => {
          if (val.length) {
            row.other = ''
          }
        })">
        <el-checkbox v-for="item in row.items" :key="item.id" :label="item.itemOption">
          {{ item.itemContent }}
          <img v-if="item.itemPicture" :src="item.itemPicture" />
        </el-checkbox>
      </el-checkbox-group>
      <el-input 
        v-if="!row?.selectId?.length" 
        v-model="row.other" 
        :disabled="row?.selectId?.length || disabled" 
        style="width: 500px;margin-top: 10px;" 
        placeholder="其他 请输入"
        show-word-limit type="textarea"
        maxlength="3000"
      />
    </div>

    <div class="task-select flex-between" v-if="['简答题'].includes(TOPICTYPE[row.typeId])">
      <el-input v-model="row.selectId" :disabled="disabled" maxlength="3000" style="width: 500px" placeholder="请填写答案"
        show-word-limit type="textarea" />
    </div>

    <!-- <div class="task-select flex-between" v-if="['填空题'].includes(TOPICTYPE[row.typeId])">
      <span v-html="row.content"></span>
    </div> -->

  </div>
</template>

<script setup>
import { onMounted, defineProps } from 'vue'
import { useRouter } from 'vue-router'
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
  },
  index: {
    type: Number,
    default: null
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
<style>
  .stu-ques-item .el-checkbox__label, .stu-ques-item .el-radio__label {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
</style>

<style scoped>
.stu-ques-item {
  font-size: 13px;
  border-bottom: 1px solid #efefef;
  text-align: left;
  padding-bottom: 10px;
  margin-bottom: 10px;
  .el-checkbox, .el-radio {
    height: 100%;
  }
}
.item-title {
  font-size: 14px;
  font-weight: bold;
}
</style>