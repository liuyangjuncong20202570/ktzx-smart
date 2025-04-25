<template>
    <div style="height: 92vh; padding: 0 10px 10px 10px;" v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.2)" element-loading-text="数据较多，请耐心等待...">
        <div style="text-align: center; font-weight: bold; font-size: 16px; padding: 10px;
    border-bottom: 2px solid #93D2FF;">
            复制往届课程
        </div>
        <div style="text-align: left; margin: 10px 0;">
            <span style="font-size: 14px; margin-right: 5px;">学期</span>
            <el-select v-model="termId" @change="chooseTerm" style="width: 240px;" placeholder="请选择历史学期">
                <el-option v-for="item in termList" :key="item.id" :label="item.termname" :value="item.id" />
            </el-select>
        </div>

        <el-table class="custom-table" :data="courseData" @selection-change="handleSelectionChange" style="width: 100%">
            <template #empty>当前学期无对应历史课程</template>
            <el-table-column type="index" label="" width="55" />
            <el-table-column property="courseChineseName" label="课程名称(中文)" width="200" />
            <el-table-column property="courseEnglishName" label="课程名称(英文)" width="200" />
            <el-table-column property="courseCode" label="课程代码" />
            <el-table-column property="professionName" label="所属专业" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button class="custom-nav-button custom-nav-button-success" @click="copy(row)">复制课程信息</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import request from '../../utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';

const termId = ref('');         // 存储选择的学期id
const termList = ref(null);     // 学期列表
const courseData = ref(null);   // 课程数据
const loading = ref(false);

onMounted(async () => {
    await getTermData();
})

const getTermData = async () => {
    try {
        const res = await request.course.get(`/coursemangt/course/allterm`);
        if (res.code === 200) {
            termList.value = res.data;
            termId.value = termList.value[0].id;
            await chooseTerm(termId.value);
        } else ElMessage.error(res.msg);
    } catch (error) {
        ElMessage.error('获取历史学期失败' + error);
    }
}

// 选择学期
const chooseTerm = async (termId) => {
    try {
        const res = await request.course.get(`/coursemangt/course/getPreCourseByCode?termId=${termId}`);
        if (res.code === 200) {
            courseData.value = res.data;
            console.log(courseData.value)
        } else ElMessage.error(res.msg);
    } catch (error) {
        ElMessage.error("获取历史课程失败" + error);
    }
}

// 复制课程信息
const copy = (course) => {
    ElMessageBox.confirm("复制课程会把当前课程已有的数据覆盖，请确保当前课程无数据或数据无用！", "警告", {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            loading.value = true;
            const res = await request.course.post(`/coursemangt/course/copyCourseInfo?pastId=${course.id}`);
            if (res.code === 200) {
                ElMessage.success("复制成功");
            } else ElMessage.error(res.msg);
        } catch (error) {
            ElMessage.error("复制失败" + error);
        }
        loading.value = false;
    })
}
</script>

<script scoped>
</script>