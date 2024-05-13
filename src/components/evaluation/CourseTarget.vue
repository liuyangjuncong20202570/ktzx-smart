<template>
    <el-container style="height: 92vh;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
            <el-button type="primary" style="margin-left: 0.8vw;" @click="addTarget">新增</el-button>
            <el-button type="danger" @click="deleteTarget">删除</el-button>
            <el-button type="success" @click="">保存</el-button>
            <el-button type="warning" @click="">导出到Excel</el-button>
        </el-header>
        <el-main style="padding: 0;">
            <el-table :data="courseTargetData" style="width: 100%; height: 100%;" v-model="tableSelected"
                @select="tableSelect" @select-all="tableSelectAll" stripe>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="代码" width="100">
                    <template v-slot="row">
                        {{ row.row.code }}
                    </template>
                </el-table-column>
                <el-table-column label="课程目标" min-width="220">
                    <template v-slot="row">
                        <el-input v-if="row.row.editingName" style="width: 100%; height: 25px;" v-model="row.row.name"
                            :ref="el => setInputRef(el, row.row)" @blur="handleBlur(row.row, 'editingName')"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @dblclick="handleClick(row.row, 'editingName')">
                            {{ row.row.name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="备注" min-width="400">
                    <template v-slot="row">
                        <el-input v-if="row.row.editingRemark" style="width: 100%; height: 25px;"
                            v-model="row.row.remark" :ref="el => setInputRef(el, row.row)"
                            @blur="handleBlur(row.row, 'editingRemark')"></el-input>
                        <div v-else style="width: 100%; height: 25px;"
                            @dblclick="handleClick(row.row, 'editingRemark')">
                            {{ row.row.remark }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="基本教学目标单元" min-width="200"></el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import request from '../../utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';
import _ from 'lodash';

const courseid = ref('2c918af681fa6ea7018209a505c30672');

const courseTargetData = ref([])

const nullTargetNum = ref(0);

const tableSelected = ref([]);

const inputRefs = ref({});

const tempRowData = ref({});

onMounted(() => {
    getData();
    tableSelected.value = [];
})

const initialize = (data) => {
    data.forEach((item) => {
        item.editingName = false;
        item.editingRemark = false;
        item.editingTarget = false;

        if (item.name.includes('未命名目标')) {
            if (item.name.length > 5 && item.name[5] === '(') {
                let num = '';
                for (let i = 6; item.name[i] !== ')'; i++) {
                    num += item.name[i];
                }
                if (nullTargetNum.value < Number(num)) nullTargetNum.value = Number(num);
            }
            else if (item.name.length === 5 && nullTargetNum.value === 0) nullTargetNum.value++;
        }
    });
    // console.log(data);
};

const getData = () => {
    request.evaluation.get('/evaluation/coursetarget').then((res) => {
        if (res.code === 200) {
            courseTargetData.value = res.data;
            initialize(courseTargetData.value);
        }
        else ElMessage.error(res.msg);
    }).catch((error) => {
        ElMessage.error('获取课程目标失败' + error);
    });
};

const addTarget = () => {
    nullTargetNum.value ++;
    const newTarget = {
        id: '',
        code: '',
        name: nullTargetNum.value > 1 ? '未命名目标(' + nullTargetNum.value + ')' : '未命名目标',
        remark: '',
        unitid: '',
        courseid: courseid.value,
    }
    // console.log(newTarget);

    request.evaluation.post('/evaluation/coursetarget/create', newTarget).then((res) => {
        if (res.code === 200) {
            getData();
            ElMessage.success('新增成功');
        }
        else ElMessage.error(res.msg);
    }).catch((error) => {
        ElMessage.error('新增失败' + error);
    });
};

const deleteTarget = () => {
    // console.log(tableSelected.value);
    if (!tableSelected.value.length) {
        ElMessage.warning('未选择课程目标');
        return;
    }

    ElMessageBox.confirm(
        '选中的课程目标将被删除，是否确定',
        '警告',
        {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }
    ).then(() => {
        let deletedIds = [];
        tableSelected.value.forEach((item) => {
            deletedIds.push(item.id);
        })
        // console.log(deletedIds);
        request.evaluation.post('/evaluation/coursetarget/delete', deletedIds).then((res) => {
            if (res.code === 200) {
                getData();
                ElMessage.success('删除成功');
            }
            else ElMessage.error(res.msg);
        }).catch((error) => {
            ElMessage.error('删除失败' + error);
        });
    }).catch(() => {});
};

const tableSelect = (selection) => {
    tableSelected.value = selection;
};

const tableSelectAll = (selection) => {
    tableSelected.value = selection;
};

const setInputRef = (el, row) => {
    if (el) {
        inputRefs.value[row.id] = el;
    }
};

const handleClick = (row, field) => {
    nextTick(() => {
        tempRowData.value = _.cloneDeep(row);     // 存一份修改之前的数据用作比对
        // console.log(courseTargetData.value);
        row[field] = true;
        setTimeout(() => {
            if (inputRefs.value[row.id] && inputRefs.value[row.id].$refs.input) {
                inputRefs.value[row.id].$refs.input.focus();
            }
        }, 0);
    });
};

const handleBlur = (row, field) => {
    if (field === 'editingName' && row.name === '') {
        row.name = tempRowData.value.name;
        row[field] = false;
        return;
    }

    row[field] = false;
    if (!_.isEqual(row, tempRowData.value)) {
        // 当数据发生改变了再传数据给后端
        request.evaluation.post('/evaluation/coursetarget', row).then((res) => {
            if (res.code === 200) {
                getData();
                ElMessage.success('修改成功');
            }
            else ElMessage.error(res.msg);
        }).catch(error => {
            ElMessage.error('修改失败' + error);
        })
    }
};

</script>