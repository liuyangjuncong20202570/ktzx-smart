<template>
    <div class="container" style="height: 75vh;">
        <div>专业主页</div>
        <div class="div-line"></div>
        <div style="border: 1.5px solid rgb(147, 210, 255); border-radius: 10px; margin-top: 20px;">
            <table>
                <tr>
                    <th colspan="3">
                        <div style="height: 100%; background-color: rgb(233, 246, 255); display: flex; align-items: center; justify-content: space-between;
                            padding: 0 15px;">
                            <div style="display: flex;">
                                <div>单片机</div>
                                <div style="margin-left: 30px;">712544</div>
                            </div>
                            <div style="display: flex;">
                                <el-button :icon="View" color="#4b7fff">预览</el-button>
                                <el-button :icon="Download" color="#32b16c">下载</el-button>
                                <el-button :icon="Upload" type="primary">上传</el-button>
                            </div>
                        </div>
                    </th>
                </tr>
                <tr>
                    <td>
                        <span class="title">学分：</span>
                        <span class="content">4.0</span>
                    </td>
                    <td>
                        <span class="title">授课年度：</span>
                        <span class="content">2023年春</span>
                    </td>
                    <td>
                        <span class="title">教学副院长：</span>
                        <span class="content">谢亮</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="title">教学秘书：</span>
                        <span class="content">刘鹏</span>
                    </td>
                    <td>
                        <span class="title">课程负责人：</span>
                        <span class="content">李志军</span>
                    </td>
                    <td>
                        <span class="title">系主任：</span>
                        <span class="content">李志军</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="title">教学大纲：</span>
                        <span class="content">已上传</span>
                    </td>
                    <td>
                        <span class="title">上传人：</span>
                        <span class="content">吴力普</span>
                    </td>
                </tr>
            </table>
        </div>

        <div style="height: 28px; display: flex; align-items: center; justify-content: space-between; margin-top: 30px;">
            <div>课堂开设情况</div>
            <el-button type="primary" :icon="DocumentCopy">复制历史课堂</el-button>
        </div>
        <div class="div-line"></div>

        <div v-for="(classroom, index) in groupClassroom" :key="index"
            style="display: flex; align-items: center; justify-content: space-between;">
            <div v-for="(info, index) in classroom" :key="index" class="cards"
                style="height: 180px; width: 49.5%; margin-top: 20px; border: 1.5px solid rgb(166, 222, 192); border-radius: 10px; overflow: hidden;">
                <div class="card-title" style="height: 20%; background-color: rgb(234, 247, 240); display: flex; align-items: center; justify-content: space-between;
                        padding: 0 20px; color: rgb(1, 154, 72); font-size: 18px;">
                    <div>电子线路CAD-2022春-自动化</div>
                    <div>吴力普</div>
                </div>
                <div class="card-content"
                    style="display: flex; align-items: center; justify-content: center; height: 80%;">
                    <div style="width: 100%;">
                        <table style="padding-left: 20px；">
                            <tr>
                                <td style="width: 50%; border: none; padding-left: 20px;">
                                    <span class="title">对应课程：</span>
                                    <span class="content">电子线路CAD</span>
                                </td>
                                <td style="border: none;">
                                    <span class="title">助教：</span>
                                    <span class="content">黄黄黄</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 50%; border: none; padding-left: 20px;">
                                    <span class="title">服务专业：</span>
                                    <span class="content">自动化专业</span>
                                </td>
                                <td style="border: none;">
                                    <span class="title">状态：</span>
                                    <span class="content"></span>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 50%; border: none; padding-left: 20px;">
                                    <span class="title">时间：</span>
                                    <span class="content"></span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { View, Download, Upload, DocumentCopy } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';

const data = ref([1, 2, 3, 4, 5])

const groupClassroom = ref(computed(() => {
    const res = [];
    for (let i = 0; i < data.value.length; i += 2) {
        res.push(data.value.slice(i, i + 2));
    }
    return res;
}));

</script>

<style scoped>
.container::-webkit-scrollbar {
    width: 0;
    height: 0;
}
.container {
    overflow: auto;
    scrollbar-width: none;
}

.div-line {
    border: 1px solid rgb(147, 210, 255);
    margin-top: 15px;
}

table {
    width: 100%;
    border-collapse: collapse;
    /* 合并边框 */
    border-radius: 10px;
    /* 设置四个角的圆角 */
    overflow: hidden;
    /* 隐藏超出圆角的部分 */
    /* border: 1px solid #000; */
    /* 设置表格边框 */
}

td {
    padding: 0;
    text-align: left;
    border: 1px solid rgb(147, 210, 255);
    height: 40px;
    padding-left: 30px;
}

th {
    font-weight: normal;
    padding: 0;
    text-align: left;
    /* border: 1px solid rgb(147, 210, 255); */
    height: 45px;
    font-size: 16px;
    color: rgb(23, 132, 210)
}

.title {
    font-size: 16px;
    color: rgb(124, 124, 124);
}

.content {
    font-size: 16px;
}

.el-button {
    border-radius: 7px;
    height: 25px;
    color: white;
}
</style>