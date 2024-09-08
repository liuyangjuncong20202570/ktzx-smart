<template>
    <div class="title flex-between">
        <span class="title-header">{{ title }}</span>
        <div style="width: 100px;" class="flex-end title-icon">
            <div class="flex-start cursor-pointer" @click="back">
                <el-icon><RefreshLeft /></el-icon>
                返回
            </div>
            <!-- <div class="flex-start cursor-pointer" @click="refresh">
                <el-icon><Refresh /></el-icon>
                刷新
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {RefreshLeft, Refresh} from "@element-plus/icons-vue";
const route = useRoute();
const router = useRouter()
const props = defineProps({
    title: {
        type: String,
        default: "title"
    },
})
const back = () => {
    router.back(-1)
}
const refresh = () => {
    window.location.href = window.location.href
}
</script>
<style scoped>
.title {
    padding: 10px 0;
    text-align: left;
    border-bottom: 1px solid #e1e1e1;
}
.title-header {
    font-weight: bold;
    font-size: 16px;
}
.title-icon {
    color: #409eff;
    font-size: 14px;
}
</style>