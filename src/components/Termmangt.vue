<template>
    <div style="height: 92vh; display: flex; flex-direction: column;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
            <el-button type="primary" style="margin-left: 0.8vw;">导出学期</el-button>
            <el-button type="primary" style="margin-left: 0.8vw;">新建学期</el-button>
            <el-button type="danger" style="margin-left: 0.8vw;">删除学期</el-button>
            <el-button type="success" style="margin-left: 0.8vw;">保存</el-button>
        </el-header>
        <el-main>
            <div style="max-height: 100%; overflow:auto ; flex: auto">
                <el-table :data="tableData" style="table-layout:auto; width: 100%;" stripe>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="" width="55"></el-table-column>
                    <el-table-column prop="term" label="学期"></el-table-column>
                    <el-table-column prop="startTime" label="起始日期"></el-table-column>
                    <el-table-column prop="endTime" label="结束日期"></el-table-column>
                    <el-table-column label="当前学期">
                        <el-checkbox v-model="checked" />
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
        
    </div>
</template>

<script setup>
import { reactive } from "vue";

const tableData = reactive([
    {
        id: '1',
        term: '2022年春季学期',
        startTime: '2022-02-21',
        endTime: '2022-07-22',
    },
    {
        id: '2',
        term: '2022年秋季学期',
        startTime: '2022-08-22',
        endTime: '2023-01-31',
    },
    {
        id: '3',
        term: '2023年春季学期',
        startTime: '2023-02-20',
        endTime: '2023-07-14',
    },
    {
        id: '4',
        term: '2023年秋季学期',
        startTime: '2023-08-21',
        endTime: '2024-01-25',
    },
    {
        id: '5',
        term: '2024年春季学期',
        startTime: '',
        endTime: '',
    },
])
</script>

<style scoped>
</style>