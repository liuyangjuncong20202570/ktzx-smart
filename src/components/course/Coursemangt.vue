<template>
    <div style="height: 92vh; display: flex; flex-direction: column;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex;">
            <el-button type="primary" style="margin-left: 0.8vw;">导出课程列表</el-button>
            <el-button type="primary" style="margin-left: 0.8vw;" @click="addTerm">新增课程</el-button>
            <el-button type="danger" style="margin-left: 0.8vw;" @click="deleteTerm">删除课程</el-button>
            <el-button type="primary" style="margin-left: 0.8vw;" @click="addTerm">复制历史课程</el-button>
            <el-button type="success" style="margin-left: 0.8vw;">保存</el-button>
        </el-header>
        <div style="max-height: 100%; height: 100%; overflow:auto;">
            <el-table :data="tableData" style="table-layout:auto; width: 100%; height: 100%;" @select="handleSelect"
                @select-all="handleSelectAll" stripe>
                <el-table-column type="selection" width="30"></el-table-column>
                <el-table-column width="49">
                    <template v-slot="row">{{ row.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="termname" label="学期" min-width="130">
                    <!-- <template #default="{ row }">
                        <el-input v-if="row.editingTermName" style="width:100%; height: 25px;" v-model="row.termname"
                            @blur="handleBlur(row, 'editingTermName')"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingTermName')">
                            {{row.termname }}
                        </div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="CN_CourseName" label="课程名称(中文)" min-width="180">
                    <template #default="{ row }">
                        <el-input v-if="row.editingCN_CourseName" style="width:100%; height: 25px;" v-model="row.CN_CourseName"
                            @blur="handleBlur(row, 'editingCN_CourseName')"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingCN_CourseName')">
                            {{row.CN_CourseName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="ENG_CourseName" label="课程名称(英文)" min-width="260">
                    <template #default="{ row }">
                        <el-input v-if="row.editingENG_CourseName" style="width: 100%; height: 25px;" v-model="row.ENG_CourseName"
                            @blur="handleBlur(row, 'editingENG_CourseName')"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingENG_CourseName')">
                            {{row.ENG_CourseName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="courseID" label="课程代码" min-width="90">
                    <template #default="{ row }">
                        <el-input v-if="row.editingCourseID" style="width: 100%; height: 25px;" v-model="row.courseID"
                            @blur="handleBlur(row, 'editingCourseID')"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingCourseID')">
                            {{row.courseID }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="major" label="所属专业" min-width="113">
                    <template #default="{ row }">
                        <div style="width: 100%; height: 25px;" @click="handleClick(row, 'editingMajor')">
                            {{row.major }}
                            <el-icon color="dodgerblue" @click=""><Edit /></el-icon>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="courseManager" label="课程负责人" min-width="150">
                    <!-- <template #default="{ row }">
                        <el-checkbox v-model="row.iscurrentterm" @click="changeStatus(row)" />
                    </template> -->
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { Edit } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';

const tableData = ref([
    {
        id: 1,
        termname: '2023年秋季学期',
        CN_CourseName: '单片机原理及应用Ⅰ(STM32)',
        ENG_CourseName: 'Principle & Appications of SCM',
        courseID: '7018101',
        major: '自动化专业',
        courseManager: ['赵仁涛'],
    },
    {
        id: 2,
        termname: '2023年秋季学期',
        CN_CourseName: '自动控制原理Ⅰ',
        ENG_CourseName: 'Automatic Control Principle',
        courseID: '7120401',
        major: '自动化专业',
        courseManager: ['刘蕾', '徐继宁', '胡敦利'],
    },
    {
        id: 3,
        termname: '2023年秋季学期',
        CN_CourseName: '计算机编程基础',
        ENG_CourseName: 'Computer Programing Foundation',
        courseID: '7283401',
        major: '自动化专业',
        courseManager: ['闫佳庆'],
    },
])

onMounted(() => {
    tableData.value.forEach((item) => {
        item.editingCN_CourseName = false;
        item.editingENG_CourseName = false;
        item.editingCourseID = false;
    });
})

const handleClick = (row, field) => {
    row[field] = true
};

const handleBlur = (row, field) => {
    row[field] = false;
};
</script>