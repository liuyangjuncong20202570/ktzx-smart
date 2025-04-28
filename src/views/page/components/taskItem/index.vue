<template>
    <div class="task-item">
        <div class="task-kea flex-start">
            <span class="topic-kwa-item" v-for="(item, i) in lib.kwas" :key="i">{{ item.kwaName }}</span>
            <span class="topic-kwa-item">{{ TOPICTYPE[lib.questionTypeId] }}</span>
        </div>
        <div class="task-title">{{ index }}、{{ lib.title }}（ {{ TOPICTYPE[lib.questionTypeId] }} ）</div>
        <!-- 多选、判断 -->
        <div v-if="['0202', '0203'].includes(lib.questionTypeId)">
            <span class="task-content" v-html="lib.content"></span>
            <el-checkbox-group v-model="lib.selectId" :disabled="disabled">
                <el-checkbox v-for="item in lib.answers" :key="item.id" :label="item.itemOption">
                    {{ item.itemContent }}
                    <span v-if="item.isAnswer" class="sub-answer">正确答案</span>
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <!-- 单选 -->
        <div v-else-if="['0201'].includes(lib.questionTypeId)">
            <span class="task-content" v-html="lib.content"></span>
            <el-radio-group v-model="lib.selectId" :disabled="disabled">
                <el-radio v-for="item in lib.answers" :key="item.id" :label="item.itemOption">
                    {{ item.itemContent }}
                    <span v-if="item.isAnswer" class="sub-answer">正确答案</span>
                </el-radio>
            </el-radio-group>
         </div>
        <!-- 填空题 -->
        <div v-else-if="lib.questionTypeId == '0204'">
            <span class="task-content" v-html="lib.content"></span>
        </div>
        <!-- 简单题 -->
        <template v-else-if="lib.questionTypeId == '0205'">
            <span class="task-content" v-html="lib.content"></span>
            <el-input
                v-model="lib.selectId"
                :disabled="disabled"
                maxlength="3000"
                style="width: 100%"
                placeholder="请填写答案"    
                show-word-limit
                type="textarea"
            />
        </template>
        <!-- 其他题 -->
        <template v-else>
            <span class="task-content" v-html="lib.content"></span>
            <el-input
                v-model="lib.selectId"
                :disabled="disabled"
                maxlength="3000"
                style="width: 100%"
                placeholder="请填写答案"    
                show-word-limit
                type="textarea"
            />
        </template>
        <div class="task-score" v-if="disabled">
            分数：{{ lib.score ?? 0 }}
        </div>
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { TOPICTYPE } from '@/utils/consts.js'
const props = defineProps({
    disabled: {
        type: String,
        default: false
    },
    defaultValue: {
        type: Object,
        default: {}
    },
    type: {
        type: String,
        default: null
    },
    index: {
        type: Number,
        default: null
    }
})
const lib = ref(props.defaultValue)
const type = ref(props.type)
onMounted(() => {
    if (type.value !== 'job') {
        lib.value?.answers?.forEach((item) => {
            if  (['0201'].includes(lib.value.questionTypeId)) {
                if (item.isAnswer) {
                    lib.value.selectId = item.id
                }
            }

            if (['0202', '0203'].includes(lib.value.questionTypeId)) {
                if (item.isAnswer) {
                    if (!lib.value.selectId) {
                        lib.value.selectId = [item.id]
                    } else {
                        lib.value.selectId?.push(item.id)
                    }
                }
            }
        })
    }
})
</script>
<style scoped lang="scss">
.task-item {
    font-size: 13px;
    position: relative;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 10px;
}
.task-kwa {
    margin-right: 20px;
}
.task-score {
    position: absolute;
    top: 30px;
    right: 0;
    bottom: 0;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #1B1B1B;
}
.task-title {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #1B1B1B;
    line-height: 30px;
}
.task-content{
    display: block;
    margin-left: 20px;
    font-size: 16px;
    color: #1B1B1B;
    line-height: 30px;
    margin-bottom: 10px;
}
.task-kea span {
    margin-right: 20px;
}
.topic-kwa-item {
  background: #dff2ff;
  border-radius: 5px;
  padding: 3px 10px;
  margin-right: 10px !important;
  color: #0078cd;
  font-size: 14px;
}

.cpirse-lib-btn {
  padding: 30px 0 10px;
}

.topic-item {
  text-align: left;
  padding: 0 10px;
  position: relative;
  margin-left: 11px;
  border-bottom: 1px solid #EEEEEE !important;
  padding-bottom: 20px;

  .topic-title {
    font-size: 14px;
  }

  .topic-item-icon {
    position: absolute;
    right: 0;
    // width: 60px;
    font-size: 18px;
    color: #103ccc;
    
  }

  .topic-answer-item {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #949494;
    line-height: 30px;

    span {
      font-size: 12px;
      margin-left: 8px;
      color: #019a48;
      background: rgba(50, 177, 108, 0.15);
      border-radius: 5px;
      padding: 3px 10px;
    }
  }
  .topic-course-content {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #1b1b1b;
    line-height: 30px;
  }
}
.flex-start1 {
  align-items: flex-start;
}
.pagination {
  margin-top: 10px;
}
.topic-item-icon-item {
  font-size: 16px;
  color: #fff;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  background: #27a5ff;
  border-radius: 5px;
  display: inline-block;
  margin-left: 10px;
  cursor: pointer;
}
.topic-item-icon-item-delete {
  background: #ff4c48;
}
.sub-answer{
    font-size: 12px;
    margin-left: 8px;
    color: #019a48;
    background: rgba(50, 177, 108, 0.15);
    border-radius: 5px;
    padding: 3px 10px;
}
</style>
<style>
.task-item .el-textarea__inner{
    width: calc(100% - 20px);
    height: 120px;
    margin-left: 20px;
    margin-bottom: 10px;
    background: rgba(238,238,238,0.3);
}
.task-item .el-checkbox{
    display: block;
    margin-left: 20px;
}
.task-item .el-radio{
    width: 100%;
    display: block;
    margin-left: 20px;
}
</style>