<!-- 评价名单 使用vxe-table组件 -->
<template>
    <el-container v-if="renderLoading" v-loading="renderLoading" element-loading-background="rgba(0, 0, 0, 0.2)"
        style="height: 92vh;"></el-container>
    <choose-classroom v-else-if="isCourseManager && !hasChooseClassroom"
        @classroom-chosen="handleClassroomChosen"></choose-classroom>
    <el-container v-else-if="!isCourseManager || (isCourseManager && hasChooseClassroom)"
        style="height: 92vh; overflow: hidden;">
        <el-header style="height: 6vh; padding: 5px 0px; width: 100%; text-align: left; background-color: #deebf7;">
            <el-button type="primary" v-if="!isCourseManager" style="margin-left: 0.8vw"
                @click="calc()">重新生成成绩单</el-button>
            <el-button type="success" style="margin-left: 0.8vw;" @click="exportData">导出excel</el-button>
            <el-button type="primary" v-if="isCourseManager" style="margin-left: 0.8vw;"
                @click="hasChooseClassroom = false">切换课堂</el-button>
        </el-header>

        <div v-loading="pageLoading" element-loading-background="rgba(0, 0, 0, 0.2)" id="container"
            style="height: 86vh;">
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
const renderLoading = ref(true);
const pageLoading = ref(false);
const classroomId = ref(null);

const gridRef = ref();
// 用于渲染表格的数据
const gridOptions = ref({
    size: 'mini',
    border: true,
    height: 200, // 表格默认高度，在钩子函数中会修改
    align: 'center',
    showOverflow: true,
    showHeaderOverflow: true,
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
                            field: 'username',
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

const stuList = ref(null);
const totalScore = ref(null);
const assessmentData = ref(null);

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
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('查询角色类型失败' + error);
    }
    renderLoading.value = false;
    return isCourseManager.value;
}

const handleClassroomChosen = async (classroomId_, classroomInfo) => {
    hasChooseClassroom.value = true;
    gridOptions.value.columns[0].title = '课堂名称：' + classroomInfo.classroomName;
    classroomId.value = classroomId_;
    await getData(classroomId.value);
    nextTick(() => {
        const container = document.getElementById('container');
        gridOptions.value.height = container.clientHeight;
    })
}

const calc = async () => {
    pageLoading.value = true;
    try {
        const res = await request.evaluation.get(`/evaluation/attainment/calc`);
        if (res.code === 200) {
            await getData(classroomId.value);
            await nextTick();
            // 强制刷新表头
            gridRef.value.reloadColumn(_.cloneDeep(gridOptions.value.columns));
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('计算失败' + error);
    };
    pageLoading.value = false;
}

onMounted(async () => {
    renderLoading.value = true;
    await checkRole();
    if (!isCourseManager.value) {
        const token = sessionStorage.getItem('token');
        classroomId.value = getObsdataFromToken(token);
        await getData(classroomId.value);
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
    pageLoading.value = true;
    try {
        const res = await request.evaluation.get(`/evaluation/attainment/getClassroomStuList?classroomId=${classroomId}`);
        if (res.code === 200) {
            stuList.value = res.data;
        } else ElMessage.error(res.msg);
    } catch (error) {
        ElMessage.error('获取学生列表失败' + error);
    }
    
    try {
        const res = await request.evaluation.get(`/evaluation/assessmentPlan/getAssessmentTable`);
        if (res.code === 200) {
            assessmentData.value = res.data;
            gridOptions.value.columns[0].children[1].children = res.data.head;
        } else {
            ElMessage.error(res.msg)
        }
    } catch (error) {
        ElMessage.error('获取考核方案数据失败' + error);
    }

    try {
        const res = await request.evaluation.get(`/evaluation/attainment/getTotalScore?classroomId=${classroomId}`);
        if (res.code === 200) {
            totalScore.value = res.data;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('获取成绩失败' + error);
    }
    initialize();

    // 强制刷新表头
    gridRef.value.reloadColumn(_.cloneDeep(gridOptions.value.columns));
    pageLoading.value = false;
};

const checkitemScoreRatioMap = ref(null);   // 考核项对总评的占比

const initialize = () => {
    const stuScoreMap = new Map();
    checkitemScoreRatioMap.value = new Map();
    totalScore.value.forEach(score => {
        const { stuId, checkitemId, checkitemScore, ratio } = score;
        if (!stuScoreMap.has(stuId)) stuScoreMap.set(stuId, {});
        stuScoreMap.get(stuId)[checkitemId] = Number(checkitemScore.toFixed(0));

        if (!checkitemScoreRatioMap.value.has(checkitemId)) {
            checkitemScoreRatioMap.value.set(checkitemId, ratio);
        }
    })

    // 存放叶考核项和其根节点id的映射
    const leafAndRootMap = new Map();
    getLeafAndRoot(leafAndRootMap, assessmentData.value.head);
    // 使用叶节点占比的加和计算根节点的总评占比，保证表头数据的一致性
    leafAndRootMap.forEach((rootId, leafId) => {
        if (!checkitemScoreRatioMap.value.get(rootId)) checkitemScoreRatioMap.value.set(rootId, 0);
        let ratio = checkitemScoreRatioMap.value.get(rootId);
        ratio += checkitemScoreRatioMap.value.get(leafId);
        checkitemScoreRatioMap.value.set(rootId, ratio)
    })

    stuList.value.forEach(stu => {
        const checkitemScore = stuScoreMap.get(stu.id);
        if (checkitemScore) Object.assign(stu, checkitemScore);
        let totalScore = 0;
        for (let key in checkitemScore) {
            totalScore += checkitemScoreRatioMap.value.get(key) * checkitemScore[key];
        }
        stu.totalScore = Number(totalScore.toFixed(0));
    })
    gridOptions.value.data = stuList.value;
    // console.log(leafAndRootMap);
    createHeader(assessmentData.value.head);
}

const getLeafAndRoot = (leafAndRootMap, checkitemData, rootId = null, floor = 0) => {
    checkitemData.forEach(c => {
        if (floor === 0) rootId = c.id;
        if (c.children && c.children.length > 0) {
            getLeafAndRoot(leafAndRootMap, c.children, rootId, floor + 1);
        } else if (floor !== 0) {
            leafAndRootMap.set(c.id, rootId);
        }
    })
}

const createHeader = (head) => {
    head.forEach(h => {
        let ratio = checkitemScoreRatioMap.value.get(h.id);
        h.title = h.itemName + (ratio ? '(' + Number((ratio * 100).toFixed(2)) + '%)' : '');
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