<template>
    <div style="height: 92vh;">
        <el-dialog v-model="lessonDialogVisible" destroy-on-close align-center draggable>
            <el-table :data="lessonTableData" style="width: 100%;" stripe>
                <el-table-column width="55">
                    <template v-slot="row">{{ row.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="lessonname" label="课堂名称" min-width="180"></el-table-column>
                <el-table-column prop="major" label="专业" min-width="120"></el-table-column>
                <el-table-column prop="mainteacher" label="主讲教师"></el-table-column>
                <el-table-column prop="experteacher" label="实验教师"></el-table-column>
                <el-table-column prop="practicalteacher" label="实践教师"></el-table-column>
                <el-table-column prop="lessontime" label="讲授学时"></el-table-column>
                <el-table-column prop="expertime" label="实验学时"></el-table-column>
                <el-table-column prop="practicaltime" label="实践学时"></el-table-column>
                <el-table-column prop="creater" label="创建人" min-width="180"></el-table-column>
            </el-table>
        </el-dialog>
        <el-table :data="courseTableData" style="height: 100%; width: 75%;" stripe>
            <el-table-column width="55">
                <template v-slot="row">{{ row.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="termname" label="学期" width="150"></el-table-column>
            <el-table-column prop="CN_CourseName" label="课程名称(中文)" min-width="240">
                <template #default="{row}">
                    <span>
                        {{ row.CN_CourseName }}
                        <el-icon class="detail-icon" color="dodgerblue" @click="openLessonTable" size="16"><Expand /></el-icon>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="ENG_CourseName" label="课程名称(英文)" min-width="290">
                <template #default="{row}">
                    <span>
                        {{ row.ENG_CourseName }}
                        <el-icon class="detail-icon" color="dodgerblue" @click="openLessonTable" size="16"><Expand /></el-icon>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="courseid" label="课程代码" min-width="90"></el-table-column>
            <el-table-column prop="major" label="所属专业" min-width="113"></el-table-column>
            <el-table-column prop="coursemanager" label="课程负责人" min-width="150"></el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { Expand } from '@element-plus/icons-vue';
import { ref } from 'vue';

const courseTableData = ref([
    {
        id: '',
        termname: '2023年秋季学期',
        CN_CourseName: '单片机原理及应用Ⅰ(STM32)',
        ENG_CourseName: 'Principle & Applications of SCM',
        courseid: '7018101',
        major: '自动化专业',
        coursemanager: ['赵仁涛'],
    },
    {
        id: '',
        termname: '2023年秋季学期',
        CN_CourseName: '自动控制原理Ⅰ',
        ENG_CourseName: 'Automatic Control Principle',
        courseid: '7120401',
        major: '自动化专业',
        coursemanager: ['刘蕾','徐继宁','胡敦利'],
    },
    {
        id: '',
        termname: '2023年秋季学期',
        CN_CourseName: '计算机变成基础',
        ENG_CourseName: 'Computer Programing Foundation',
        courseid: '7283401',
        major: '自动化专业',
        coursemanager: ['闫佳庆'],
    }
]);

const lessonTableData = ref([
    {
        id: '',
        lessonname: '单片机原理课堂Ⅰ',
        major: '自动化专业',
        mainteacher: '赵仁涛',
        experteacher: '李明',
        practicalteacher: '王勇',
        lessontime: '48',
        expertime: '32',
        practicaltime: '18',
        creater: '自动化专业负责人',
    },
    {
        id: '',
        lessonname: '单片机原理课堂Ⅰ',
        major: '自动化专业',
        mainteacher: '赵仁涛',
        experteacher: '李明',
        practicalteacher: '王勇',
        lessontime: '48',
        expertime: '32',
        practicaltime: '18',
        creater: '自动化专业负责人',
    },
    {
        id: '',
        lessonname: '单片机原理课堂Ⅰ',
        major: '自动化专业',
        mainteacher: '赵仁涛',
        experteacher: '李明',
        practicalteacher: '王勇',
        lessontime: '48',
        expertime: '32',
        practicaltime: '18',
        creater: '自动化专业负责人',
    },
]);

const lessonDialogVisible = ref(false);

const openLessonTable = () => {
    lessonDialogVisible.value = true;
};
</script>

<style scoped>
.detail-icon{
    cursor: pointer;
}
</style>