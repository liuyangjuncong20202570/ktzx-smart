<!-- 评价名单 使用vxe-table组件 -->
<template>
    <el-container v-if="loading" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.2)"
        style="height: 92vh;"></el-container>
    <choose-classroom v-else-if="isCourseManager && !hasChooseClassroom"
        @classroom-chosen="handleClassroomChosen"></choose-classroom>
    <el-container v-else-if="!isCourseManager || (isCourseManager && hasChooseClassroom)" style="height: 92vh; overflow: hidden;">
        <el-header style="height: 6vh; padding: 5px 0px; width: 100%; text-align: left; background-color: #deebf7;">
            <el-button type="primary" style="margin-left: 0.8vw" @click="getData">重新生成成绩单</el-button>
            <el-button type="success" style="margin-left: 0.8vw;" @click="exportData">导出excel</el-button>
            <el-button type="primary" v-if="isCourseManager" style="margin-left: 0.8vw;"
                @click="hasChooseClassroom = false">切换课堂</el-button>
        </el-header>

        <div id="container" style="height: 86vh;">
            <vxe-grid ref="gridRef" v-bind="gridOptions" class="scroll-container"></vxe-grid>
        </div>
    </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { nextTick, onBeforeMount, onMounted, ref } from 'vue';
import request from '../../utils/request';
import ChooseClassroom from './subcomponents/ChooseClassroom.vue';
import _ from 'lodash';

const isCourseManager = ref(null);
const hasChooseClassroom = ref(false);
const loading = ref(true);

const gridRef = ref();
// 用于渲染表格的数据
const gridOptions = ref({
    size: 'mini',
    border: true,
    height: 200, // 表格默认高度，在钩子函数中会修改
    align: 'center',
    showOverflow: true,
    showHeaderOverflow: false,
    columnConfig: {
        resizable: true
    },
    columns: [
        {
            title: '',
            children: [
                {
                    field: 'studentScore',
                    title: '学生成绩',
                    children: [
                        {
                            field: 'rowNo',
                            title: '序号',
                            width: 50
                        },
                        {
                            field: 'stuno',
                            title: '学号',
                        },
                        {
                            field: 'userName',
                            title: '姓名',
                            width: 100
                        },
                        {
                            field: 'totalScore',
                            title: '总成绩',
                            width: 70
                        }
                    ]
                },
                {
                    field: 'checkitems',
                    title: '课程各类考核项',
                    width: 950,
                    children: null
                }
            ]
        }
    ],
    data: null
});

const checkRole = async () => {     // 查询是否是课程负责人，课程负责人要先选择课堂
    try {
        const res = await request.evaluation.get('/evaluation/attainment');
        if (res.code === 200) {
            if (res.data.isCourseManager) {
                isCourseManager.value = true;
                hasChooseClassroom.value = false;
            }
            else {
                gridOptions.value.columns[0].title = '课堂名称：' + res.data.classroomName;
                isCourseManager.value = false;
            }
            loading.value = false;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('查询角色类型失败' + error);
    }
    return isCourseManager.value;
}

const handleClassroomChosen = async (classroomId, classroomInfo) => {
    hasChooseClassroom.value = true;
    gridOptions.value.columns[0].title = '课堂名称：' + classroomInfo.classroomName;
    await getData(classroomId);
    nextTick(() => {
        const container = document.getElementById('container');
        gridOptions.value.height = container.clientHeight;
    })
}

onMounted(async () => {
    loading.value = true;
    await checkRole();
    if (!isCourseManager.value) {
        const token = sessionStorage.getItem('token');
        const obsid = getObsdataFromToken(token);
        await getData(obsid);
        nextTick(() => {
            const container = document.getElementById('container');
            gridOptions.value.height = container.clientHeight;
        })
    }
})

const getObsdataFromToken = (token) => {
    if (!token) return null;

    // 获取 token 中的 payload 部分（token 是 base64 编码的）
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload)); // 解码并解析 payload

    const obsid = decodedPayload.obsid;

    // 假设 obsid 在 payload 中
    return obsid;
}

const getData = async (classroomId) => {
    try {
        const res = await request.course.get(`/coursemangt/classroommangt/student/list?obsid=${classroomId}`);
        if (res.code === 200) {
            // console.log(res.data);
            gridOptions.value.data = res.data;
        } else ElMessage.error(res.msg);
    } catch (error) {
        ElMessage.error('获取学生列表失败' + error);
    }

    if (isCourseManager.value) {
        try {
            const res = await request.evaluation.get(`/evaluation/assessmentPlan/getAssessmentTable`);
            if (res.code === 200) {
                createHeader(res.data.head);
                gridOptions.value.columns[0].children[1].children = res.data.head;
            } else {
                ElMessage.error(res.msg)
            }
        } catch (error) {
            ElMessage.error('获取考核方案数据失败' + error);
        }
    } else {
        try {
            const res = await request.evaluation.get(`/evaluation/attainment/teacherGetAssessmentTable`);
            if (res.code === 200) {
                createHeader(res.data.head);
                gridOptions.value.columns[0].children[1].children = res.data.head;
            } else {
                ElMessage.error(res.msg)
            }
        } catch (error) {
            ElMessage.error('获取考核方案数据失败' + error);
        }
    }
    // 强制刷新表头
    gridRef.value.reloadColumn(_.cloneDeep(gridOptions.value.columns));
};

const createHeader = (head) => {
    head.forEach(h => {
        h.title = h.itemName;
        h.field = h.id;
        if (h.children && h.children.length > 0) createHeader(h.children);
    })
}

const exportData = () => {
    const $grid = gridRef.value;
    if ($grid) {
        // 导出数据
        $grid.exportData({ type: 'xlsx' });
    }
}

</script>

<style lang="scss" scoped>
[v-cloak] {
    display: none;
}

.scroll-container {
    ::-webkit-scrollbar {
        display: none;
    }
}
</style>