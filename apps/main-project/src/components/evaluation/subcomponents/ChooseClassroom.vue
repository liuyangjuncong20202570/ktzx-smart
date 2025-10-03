<template>
    <el-container style="height: 92vh;">
        <el-table :data="classRoomData" style="height: 100%;" border>
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="课堂" align="center">
                <template #default="{ row }">
                    <div style="color: #86BFA8; text-decoration: underline; cursor: pointer; height: 23px;"
                        @click="handleClassroomChosen(row.classroomId, row)">{{ row.classroomName }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="termName" label="学期" align="center"></el-table-column>
            <el-table-column prop="courseName" label="课程" align="center"></el-table-column>
            <el-table-column prop="professionName" label="专业" align="center"></el-table-column>
            <el-table-column prop="teacherName" label="教师" align="center"></el-table-column>
            <el-table-column prop="assistantName" label="助教" align="center"></el-table-column>
        </el-table>
    </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import request from '../../../utils/request';

const classRoomData = ref(null);    // 如果是课程负责人时，存储本课程的所有课堂的信息

onMounted(async () => {
    // 获取所有课堂信息
    try {
        const res = await request.evaluation.get("/evaluation/attainment/getClassroomByCourseId");
        if (res.code === 200) {
            console.log(res.data)
            classRoomData.value = res.data;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('获取课堂列表失败' + error);
    }
})

const emit = defineEmits(['classroom-chosen']);

const handleClassroomChosen = async (classroomId, classroomInfo) => {
    emit('classroom-chosen', classroomId, classroomInfo);
}
</script>