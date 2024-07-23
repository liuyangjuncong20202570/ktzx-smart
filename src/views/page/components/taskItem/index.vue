<template>
    <div class="task-item">
        <div class="task-kea flex-start">
            <span v-for="(item, i) in lib.kwas" :key="i">（{{ item.kwaName }}）</span>
        </div>
        <div class="task-title">{{ index }}、{{ lib.title }}</div>
        <!-- 多选 -->
        <el-checkbox-group v-model="lib.selectId" v-if="lib.questionTypeId == '0202'" :disabled="disabled">
            <el-checkbox v-for="item in lib.answers" :key="item.id" :label="item.id">
                {{ item.itemContent }}
            </el-checkbox>
        </el-checkbox-group>
        <!-- 单选、判断 -->
        <el-radio-group v-model="lib.selectId" v-if="['0201', '0203'].includes(lib.questionTypeId)" :disabled="disabled">
            <el-radio v-for="item in lib.answers" :key="item.id" :label="item.id">{{ item.itemContent }}</el-radio>
        </el-radio-group>
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
                style="width: 500px"
                placeholder="请填写答案"    
                show-word-limit
                type="textarea"
            />
        </template>
        
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref, nextTick } from 'vue'
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
    console.log('lib', lib)
})
</script>
<style scoped>
.task-item {
    font-size: 13px;
}
.task-kwa {
    margin-right: 20px;
}
</style>