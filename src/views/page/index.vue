<template>
    <el-container>
        <el-aside width="260px">
                    <el-menu default-active="2" router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon>
                                    <location />
                                </el-icon>
                                <span>课程题库</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="/page/courseLib">课程题库管理</el-menu-item>
                                <el-menu-item index="/page/type">题型设定</el-menu-item>
                                <el-menu-item index="/page/sync">题库同步</el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>

                        <el-sub-menu index="2">
                            <template #title>
                                <el-icon>
                                    <location />
                                </el-icon>
                                <span>课堂题库</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="2-1">课堂题库管理</el-menu-item>
                                <el-menu-item index="2-2">题型设定</el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>

                        <!-- <el-menu-item index="2">
                            <el-icon><icon-menu /></el-icon>
                            <span>Navigator Two</span>
                        </el-menu-item> -->
                    </el-menu>
        </el-aside>
        <el-main style="background: #f0f2f5">
            <router-view />
        </el-main>
    </el-container>


</template>

<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>