<template>
    <el-container v-if="loading" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.2)"
        style="height: 92vh;"></el-container>
    <choose-classroom v-else-if="isCourseManager && !hasChooseClassroom"
        @classroom-chosen="handleClassroomChosen"></choose-classroom>
    <el-container v-else-if="!isCourseManager || (isCourseManager && hasChooseClassroom)" style="height: 92vh;">
        <el-header style="height: auto; padding: 5px 0px; width: 100%; text-align: left; background-color: #deebf7;">
            <!-- <el-button type="success" style="margin-left: 0.8vw; cursor: not-allowed;">新增</el-button> -->
            <el-button type="primary" style="margin-left: 0.8vw" @click="getData">刷新报告数据</el-button>
            <el-button type="success" style="margin-left: 0.8vw;" @click="printReport">打印报告</el-button>
            <el-button type="success" style="margin-left: 0.8vw;" @click="generatePDF">下载报告</el-button>
            <el-button type="primary" v-if="isCourseManager" style="margin-left: 0.8vw;"
                @click="hasChooseClassroom = false">切换课堂</el-button>
        </el-header>
        <div class="main-block" style="text-align: left; padding: 10mm 0; overflow: auto;">
            <div id="report-container"
                style="width: 190mm; color: #0f0f0f; margin: 0 auto; font-size: 16px; font-weight: bolder; font-family: 'SimSun';">
                <div style="margin-bottom: 30px; text-align: center;">{{ headerData.classroomName }}<br>课堂评价报告</div>
                <div class="class-block">
                    <div>一、课堂基本信息</div>
                    <table>
                        <tr>
                            <td>课程名称</td>
                            <td colspan="3">{{ headerData.courseName }}</td>
                            <td>开课学期</td>
                            <td>{{ headerData.termName }}</td>
                        </tr>
                        <tr>
                            <td>任课教师</td>
                            <td colspan="3">{{ headerData.teacherName }}</td>
                            <td>学时/学分</td>
                            <td>{{ headerData.time }} / {{ headerData.score ? headerData.score : 0 }}</td>
                        </tr>
                        <tr>
                            <td>课堂名称/周次</td>
                            <td colspan="3">{{ headerData.classroomName }}</td>
                            <td>课堂人数</td>
                            <td>{{ studentList.length }}</td>
                        </tr>
                        <tr>
                            <td colspan="6">学生成绩总评结果</td>
                        </tr>
                        <tr>
                            <td>最高分</td>
                            <td>96</td>
                            <td>平均分</td>
                            <td>81.26</td>
                            <td>不及格人数</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td colspan="6">
                                <div id="grade-div" style="height: 280px; margin-top: 10px; display: flex; flex-direction: column; justify-content: center;
                                align-items: center"></div>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="class-block">二、课程目标达成情况总体评价</div>
                <div id="target-achievement-degree-bar" style="height: 260px;"></div>
                <div id="target-achievement-degree-category" style="height: 260px; margin-top: -60px;"></div>
                <table style="margin-top: 10px;">
                    <tr>
                        <td v-for="t in courseTargetData" :key="t.id">{{ t.name }}</td>
                    </tr>
                    <tr>
                        <td v-for="t in courseTargetData" :key="t.id">{{ targetSumAchievementDegree[t.id] }}</td>
                    </tr>
                </table>

                <div class="class-block">三、课程目标达成情况的个体评价</div>
                <div style="padding-left: 32px;">
                    <div style="text-align: left; margin-top: 10px;">
                        1、课程目标个体评价</div>
                    <div v-for="(ctd, i) in courseTargetData" :key="ctd.id">
                        <div :id="ctd.id" style="height: 63.25mm;"></div>
                        <div v-if="targetAchievementPersonalDegreeScatterList[i]"
                            style="padding-left: 32px; margin: -25px 0 20px 0;">
                            <span style="color: dodgerblue;">{{ ctd.name }}</span>:
                            <span v-if="targetAchievementPersonalDegreeScatterList[i].data[1].length">其中
                                {{ targetAchievementPersonalDegreeScatterList[i].data[1].join(',') }}
                                号同学本课程目标达成度低于0.6，目标没有达成</span>
                            <span v-else>本目标全员达成</span>
                        </div>
                    </div>
                </div>
                <div style="padding-left: 32px;">
                    <div style="text-align: left; margin-top: 10px;">2、课程目标未达成的学生个体清单</div>
                    <div style="margin-top: 10px;">根据每位同学课程达成情况，可以汇总出本学期每个课程目标没有达成的学生个体清单，从中可以快速查阅每位学生的短板。</div>
                    <table>
                        <tr>
                            <td style="width: 50px;">序号</td>
                            <td style="width: 120px;">学号</td>
                            <td style="width: 80px;">姓名</td>
                            <td>课程目标1</td>
                            <td>课程目标2</td>
                            <td>课程目标3</td>
                            <td>课程目标4</td>
                            <td>课程目标5</td>
                            <td>课程目标6</td>
                        </tr>
                        <tr v-for="e in targetAchievementData" :key="e.stuno">
                            <td>{{ e.rowNo }}</td>
                            <td style="width: 120px;">{{ e.stuno }}</td>
                            <td style="width: 80px;">{{ e.userName }}</td>
                            <td v-for="t in courseTargetData" :key="t.id">{{ Number(e[t.id]) >= 0.6 ? '√' : '' }}</td>
                        </tr>
                    </table>
                </div>

                <div class="class-block">四、课程目标达成情况明细表</div>
                <table>
                    <tr>
                        <td style="width: 50px;">序号</td>
                        <td style="width: 120px;">学号</td>
                        <td style="width: 80px;">姓名</td>
                        <td style="width: 120px;">班级</td>
                        <td>课程目标1</td>
                        <td>课程目标2</td>
                        <td>课程目标3</td>
                        <td>课程目标4</td>
                        <td>课程目标5</td>
                        <td>课程目标6</td>
                    </tr>
                    <tr v-for="e in targetAchievementData" :key="e.stuno">
                        <td style="width: 50px;">{{ e.rowNo }}</td>
                        <td style="width: 120px;">{{ e.stuno }}</td>
                        <td style="width: 80px;">{{ e.userName }}</td>
                        <td style="width: 120px;">{{ e.obsName }}</td>
                        <td v-for="t in courseTargetData" :key="t.id">{{ e[t.id].toFixed(2) }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </el-container>
</template>

<script setup>
import * as echarts from 'echarts';
import { nextTick, onMounted, ref } from 'vue';
import html2pdf from 'html2pdf.js';
import request from '../../utils/request';
import { ElMessage } from 'element-plus';
import ChooseClassroom from './subcomponents/ChooseClassroom.vue';
import { he } from 'element-plus/es/locale/index.mjs';

const isCourseManager = ref(null);
const hasChooseClassroom = ref(false);
const loading = ref(true);
const headerData = ref({});
const studentList = ref([])

const courseTargetData = ref([      // 课程目标数据
    {
        id: '1',
        name: '课程目标1'
    },
    {
        id: '2',
        name: '课程目标2'
    },
    {
        id: '3',
        name: '课程目标3'
    },
    {
        id: '4',
        name: '课程目标4'
    },
    {
        id: '5',
        name: '课程目标5'
    },
    {
        id: '6',
        name: '课程目标6'
    },
])

const targetAchievementData = ref([     // 计算好的各个学生的课程目标达成度
    {
        rowNo: 1,
        stuno: '22101130110',
        userName: '张心玮',
        obsName: '计实验22',
        1: 0.76,
        2: 0.58,
        3: 0.81,
        4: 0.92,
        5: 0.71,
        6: 0.86
    },
    {
        rowNo: 2,
        stuno: '22101130105',
        userName: '张顺心',
        obsName: '计实验22',
        1: 0.92,
        2: 0.88,
        3: 0.89,
        4: 0.96,
        5: 0.90,
        6: 0.92
    },
    {
        rowNo: 3,
        stuno: '22101130111',
        userName: '张心瑞',
        obsName: '计22-3',
        1: 0.76,
        2: 0.56,
        3: 0.59,
        4: 0.83,
        5: 0.84,
        6: 0.92
    },
    {
        rowNo: 4,
        stuno: '22101130120',
        userName: '马子晨',
        obsName: '计实验22',
        1: 0.96,
        2: 0.88,
        3: 0.89,
        4: 0.92,
        5: 0.81,
        6: 0.86
    },
    {
        rowNo: 5,
        stuno: '22101130115',
        userName: '任腾旭',
        obsName: '计22-2',
        1: 0.57,
        2: 0.81,
        3: 0.88,
        4: 0.90,
        5: 0.56,
        6: 0.71
    },
    {
        rowNo: 6,
        stuno: '66666666666',
        userName: '金桂乌龙',
        obsName: '计实验66',
        1: 1.00,
        2: 1.00,
        3: 1.00,
        4: 1.00,
        5: 1.00,
        6: 1.00
    },
]);      // 存放计算好的所有学生的课程目标达成度数据

const targetSumAchievementDegree = ref({});     // 存储每个课程目标达成度的平均达成度

const gradeDivBar = ref(null);    // 总评分布图-柱状图
const targetSumAchievementDegreeBar = ref(null);   // 课程目标总体达成度-柱状图
const targetSumAchievementDegreeCategory = ref(null);      // 课程目标总体达成度-折线图

const targetAchievementPersonalDegreeScatterList = ref([]);   // 课程目标个体达成度-散点图

const options = ref({       // 报告生成pdf的配置项
    margin: 10,
    filename: '达成性评价报告.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 4, useCORS: true },
    jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // 强制避免内容切割
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
                isCourseManager.value = false;
                getClassroomInfoByClassroomId();
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

const getObsidFromToken = (token) => {
    if (!token) return null;

    // 获取 token 中的 payload 部分（token 是 base64 编码的）
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload)); // 解码并解析 payload

    // 假设 obsid 在 payload 中
    return decodedPayload.obsid;
}

onMounted(async () => {
    loading.value = true;
    await checkRole();
    if (!isCourseManager.value) {
        const token = sessionStorage.getItem('token');
        const obsid = getObsidFromToken(token);
        await getData(obsid);
    }
})

const initialize = () => {
    gradeDivBar.value = echarts.init(document.getElementById('grade-div'), null, { renderer: 'svg' });
    gradeDivBar.value.setOption({
        title: {
            show: true,
            text: '总评成绩分段图',
            left: 'center',
            textStyle: {
                color: '#0f0f0f',
                fontSize: 13,
                fontFamily: 'SimSun'
            },
        },
        tooltip: {},
        legend: {},
        xAxis: {
            data: ["不合格（<60）", "合格（60-74）", "良好（75-84）", "优秀（85-100）"]
        },
        yAxis: {},
        series: [{
            type: "bar",
            data: [
                {
                    value: 1,
                    itemStyle: {
                        color: '#d00'
                    }
                },
                {
                    value: 12,
                    itemStyle: {
                        color: 'dodgerblue'
                    }
                },
                {
                    value: 19,
                    itemStyle: {
                        color: 'dodgerblue'
                    }
                },
                {
                    value: 3,
                    itemStyle: {
                        color: 'dodgerblue'
                    }
                }
            ],
            label: {
                show: true,
                position: 'top',
                color: 'grey',
            },
            barWidth: "40%",
        }]
    });

    calcTargetSumAchievementDegree();
    const sumGraphData = generateSumGraphData();
    targetSumAchievementDegreeBar.value = echarts.init(document.getElementById('target-achievement-degree-bar'), null, { renderer: 'svg' });
    targetSumAchievementDegreeBar.value.setOption({
        tooltip: {},
        legend: {},
        xAxis: {
            data: courseTargetData.value.map(ctd => ctd.name)
        },
        yAxis: {},
        series: [{
            type: "bar",
            data: sumGraphData,
            label: {
                show: true,
                position: 'top',
                color: 'grey',
            },
            markLine: {
                symbol: 'none',
                data: [
                    {
                        yAxis: 0.6, // 设置红线的位置
                        lineStyle: {
                            color: 'red', // 设置红线的颜色
                            type: 'solid', // 设置红线的样式（可以是'solid', 'dashed', 'dotted'等）
                            width: 1,
                        },
                        label: {
                            show: true,
                            position: 'end',
                            formatter: '合格线',
                            color: 'red'
                        }
                    }
                ],
                silent: true,
            }
        }]

    })

    targetSumAchievementDegreeCategory.value = echarts.init(document.getElementById('target-achievement-degree-category'), null, { renderer: 'svg' });
    targetSumAchievementDegreeCategory.value.setOption({
        tooltip: {},
        xAxis: {
            type: 'category',
            data: courseTargetData.value.map(ctd => ctd.name)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: sumGraphData,
                markLine: {
                    symbol: 'none',
                    data: [
                        {
                            yAxis: 0.6, // 设置红线的位置
                            lineStyle: {
                                color: 'red', // 设置红线的颜色
                                type: 'solid', // 设置红线的样式（可以是'solid', 'dashed', 'dotted'等）
                                width: 1,
                            },
                            label: {
                                show: true,
                                position: 'end',
                                formatter: '合格线',
                                color: 'red'
                            }
                        }
                    ],
                    silent: true,
                },
                type: 'line',
                lineStyle: {
                    color: 'dodgerblue' // 设置线的颜色
                },
                label: {
                    show: true,
                    position: 'top',
                    color: 'grey',
                },
            }
        ]
    });

    for (let i = 0; i < courseTargetData.value.length; i++) {
        targetAchievementPersonalDegreeScatterList.value[i] = {};
        targetAchievementPersonalDegreeScatterList.value[i].data = generatePersonalGraphData(courseTargetData.value[i].id);
        targetAchievementPersonalDegreeScatterList.value[i].element = echarts.init(document.getElementById(courseTargetData.value[i].id), null, { renderer: 'svg' });
        targetAchievementPersonalDegreeScatterList.value[i].element.setOption({
            title: {
                show: true,
                text: courseTargetData.value[i].name,
                left: 'center',
                textStyle: {
                    color: '#0f0f0f',
                    fontSize: 13,
                    fontFamily: 'SimSun'
                },
            },
            xAxis: {
                type: "category",
                // 这里type为'category'，echarts会自动把data的数据转换为String类型的
                data: targetAchievementData.value.map(t => t.rowNo)
            },
            yAxis: {
                type: "value",
                scale: false,
            },
            tooltip: {
                trigger: 'item',  // 触发项为每一个数据项
                formatter: function (params) {
                    // params 是每个数据项的参数，包含了当前点的数据
                    // formatter 可以是字符串，也可以是函数
                    // console.log(params);
                    const info = params.data.extraInfo;
                    return '序号：' + info.rowNo + '<br>' +
                        '姓名：' + info.userName + '<br>' +
                        '学号：' + info.stuno + '<br>' +
                        '班级：' + info.obsName + '<br>' +
                        '达成度: ' + params.value[1].toFixed(2) + '<br>' +
                        '课程目标: ' + courseTargetData.value[i].name;
                }
            },
            series: [{
                name: "Male",
                type: "scatter",
                data: targetAchievementPersonalDegreeScatterList.value[i].data[0],
                label: {
                    show: true,
                    position: 'top',
                    color: 'grey'
                },
                markLine: {
                    symbol: 'none',
                    data: [{
                        yAxis: 0.6, // 设置红线的位置
                        lineStyle: {
                            color: 'red', // 设置红线的颜色
                            type: 'solid', // 设置红线的样式（可以是'solid', 'dashed', 'dotted'等）
                            width: 1,
                        },
                        label: {
                            show: true,
                            position: 'end',
                            formatter: '合格线',
                            color: 'red'
                        }
                    }],
                    silent: true
                }
            }]
        });
    }
}

const getData = async (obsid) => {
    try {
        const res = await request.course.get(`/coursemangt/classroommangt/student/list?obsid=${obsid}`);
        if (res.code === 200) {
            studentList.value = res.data;
            initialize();
        } else ElMessage.error(res.msg);
    } catch (error) {
        ElMessage.error('获取学生列表失败' + error);
    }
}

const getClassroomInfoByClassroomId = async () => {
    try {
        const res = await request.evaluation.get('/evaluation/attainment/getClassroomByClassroomId');
        if (res.code === 200) {
            headerData.value = res.data;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('获取课堂信息失败' + error);
    }
}

const handleClassroomChosen = async (classroomId, classroomInfo) => {
    headerData.value = classroomInfo;
    hasChooseClassroom.value = true;
    await getData(classroomId);
}

const calcTargetSumAchievementDegree = () => {      // 计算课程目标的整体达成度（均值）
    courseTargetData.value.forEach((ct) => {
        targetSumAchievementDegree.value[ct.id] = 0;
        targetAchievementData.value.forEach((t) => {
            targetSumAchievementDegree.value[ct.id] += t[ct.id];
        })
        targetSumAchievementDegree.value[ct.id] = (targetSumAchievementDegree.value[ct.id] / targetAchievementData.value.length).toFixed(2);
    })
}

const generateSumGraphData = () => {        // 生成有关显示整体课程目标达成度的图表数据
    let res = [];
    courseTargetData.value.forEach((ct => {
        res.push({
            value: targetSumAchievementDegree.value[ct.id],
            itemStyle: {
                color: targetSumAchievementDegree.value[ct.id] >= 0.6 ? 'dodgerblue' : '#d00'
            }
        })
    }))
    return res;
}

const generatePersonalGraphData = (courseTargetId) => {     // 生成有关显示个体课程目标达成度的图表数据
    let res = [];
    let unAchieved = [];
    targetAchievementData.value.forEach((t => {
        res.push({
            value: [String(t.rowNo), t[courseTargetId]],
            itemStyle: {
                color: t[courseTargetId] >= 0.6 ? 'dodgerblue' : '#d00'
            },
            extraInfo: {
                rowNo: t.rowNo,
                userName: t.userName,
                stuno: t.stuno,
                obsName: t.obsName,
            }
        });
        if (t[courseTargetId] < 0.6) unAchieved.push(t.rowNo);
    }))
    return [res, unAchieved];
}

const generatePDF = () => {     // 将报告转为pdf
    const report = document.getElementById('report-container');
    html2pdf(report, options.value);
}

const printReport = () => {     // 触发浏览器的打印窗口
    const report = document.getElementById('report-container');
    html2pdf().from(report).set(options.value).toPdf().get('pdf').then(function (pdf) {
        // 生成完PDF后自动打开打印对话框
        pdf.autoPrint();
        // 创建一个隐藏的 iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdf.output('bloburl');
        document.body.appendChild(iframe);
        // 等待 iframe 加载完成
        iframe.onload = function () {
            // 触发打印
            iframe.contentWindow.print();
        };
    });
}
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    color: #0f0f0f;
}

th,
td {
    border: 1px solid #2f2f2f;
    text-align: center;
    word-wrap: break-word;
    /* 处理单元格中的换行 */
}

.class-block {
    margin-top: 30px;
}
</style>