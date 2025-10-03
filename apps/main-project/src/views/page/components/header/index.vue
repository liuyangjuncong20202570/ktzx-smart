<template>
    <div class="title">
        <div class="flex-between">
            <div class="flex-start path-name cursor-pointer" style="color: #409eff;margin-bottom: 10px;">
                <el-icon><Fold /></el-icon>
                <div 
                    class="path-name" 
                    v-for="(item, i) in pathData" 
                    :key="i" 
                    @click="goToPath(item)"
                >
                    &nbsp;/&nbsp;<span :style="`color:${i === pathData.length - 1 ? '#000000' : '#409eff'}!important;`">{{ item.name }}</span>
                </div>
            </div>
            <div>
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
        </div>
        <span class="title-header">{{ title }}</span>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {RefreshLeft, Refresh, Fold} from "@element-plus/icons-vue";
const route = useRoute();
const router = useRouter()
const props = defineProps({
    title: {
        type: String,
        default: "title"
    },
    pathData: {
        type: Array,
        default: []
    }
})
const back = () => {
    router.back(-1)
}
const refresh = () => {
    window.location.href = window.location.href
}
const goToPath = (item) => {
    console.log(item.path)
    if (item.path) {
        router.push({
            path: item.path,
            query: item.query ? item.query : {}
        })
    }
    
}
</script>
<style scoped>
.title {
    font-family: MicrosoftYaHei;
    font-size: 18px;
    color: #1B1B1B;
    line-height: 24px;
    padding: 10px 0;
    text-align: center;
    border-bottom: 2px solid #93D2FF;
}
.title-header {
    font-weight: bold;
    font-size: 16px;
}
.title-icon {
    color: #409eff;
    font-size: 14px;
}
.path-name {
    font-size: 13px;
}
</style>