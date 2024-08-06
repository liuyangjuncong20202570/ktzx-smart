<template>
    <div class="task-item">
        <div class="task-kea flex-start">
            <span v-for="(item, i) in lib.kwas" :key="i">（{{ item.kwaName }}）</span>
        </div>
        <div class="task-title">{{ index }}、{{ lib.title }}({{ TOPICTYPE[lib.questionTypeId] }})</div>
        <!-- 多选 -->
        <div v-if="lib.questionTypeId == '0202'">
            <span v-html="lib.content"></span>
            <el-checkbox-group v-model="lib.selectId" :disabled="disabled">
                <el-checkbox v-for="item in lib.answers" :key="item.id" :label="item.itemOption">
                    {{ item.itemContent }}
                    <span v-if="item.isAnswer">正确答案</span>
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <!-- 单选、判断 -->
         <div v-if="['0201', '0203'].includes(lib.questionTypeId)">
            <span v-html="lib.content"></span>
            <el-radio-group v-model="lib.selectId" :disabled="disabled">
                <el-radio v-for="item in lib.answers" :key="item.id" :label="item.itemOption">
                    {{ item.itemContent }}
                    <span v-if="item.isAnswer">正确答案</span>
                </el-radio>
            </el-radio-group>
         </div>
        <!-- 填空题 -->
        <div v-if="lib.questionTypeId == '0204'">
            <span v-html="lib.content"></span>
        </div>
        <!-- 简单题 -->
        <template v-if="lib.questionTypeId == '0205'">
            <span v-html="lib.content"></span>
            <el-input
                v-model="lib.selectId"
                :disabled="disabled"
                maxlength="30"
                style="width: 100%"
                placeholder="请填写答案"    
                show-word-limit
                type="textarea"
            />
        </template>
        <div class="task-score flex-center" v-if="disabled">
            得分：{{ lib.currentScore ?? 0 }}
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
            if  (['0201', '0203'].includes(lib.value.questionTypeId)) {
                if (item.isAnswer) {
                    lib.value.selectId = item.id
                }
            }

            if (['0202'].includes(lib.value.questionTypeId)) {
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
<style scoped>
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
    top: 0;
    right: 0;
    bottom: 0
}
</style>