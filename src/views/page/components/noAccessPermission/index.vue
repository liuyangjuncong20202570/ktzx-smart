<template>
    <div class="no-access-permission flex-center">
        <el-icon><Hide /></el-icon>无访问权限
    </div>
</template>

<script setup>
import { Hide } from '@element-plus/icons-vue'
</script>
<style scoped>
.no-access-permission {
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
}
</style>