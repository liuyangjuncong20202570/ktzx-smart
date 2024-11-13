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
            <el-table :data="courseTargetTargetData" style="width: 100%; height: 100%;" v-model="tableSelected"
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
                <el-table-column label="关联KWA" min-width="200">
                    <template #default="{ row }">
                        <el-popover placement="bottom" width="800" trigger="click" @hide="saveEditKwa(row)">
                            <el-checkbox-group v-model="row.kwaIds">
                                <el-checkbox v-for="kwa in kwaData" :key="kwa.id" :label="kwa.name"
                                    :value="kwa.id"></el-checkbox>
                            </el-checkbox-group>
                            <template #reference>
                                <el-icon class='icon' color="dodgerblue">
                                    <Edit />
                                </el-icon>
                            </template>
                        </el-popover>
                        <span>
                            {{ ' ' + row.kwas.map(item => item.name).join(", ") }}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import request from '../../utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';
import _ from 'lodash';

const courseTargetTargetData = ref([])

const kwaData = ref([]);

const tableSelected = ref([]);

const inputRefs = ref({});

const tempRowData = ref({});

onMounted(() => {
    getTargetData();
    tableSelected.value = [];
})

const initialize = () => {
    courseTargetTargetData.value.forEach((item) => {
        item.editingName = false;
        item.editingRemark = false;
        item.editingTarget = false;
        // oldKwaIds存储kwaid的备份
        item.oldKwaIds = item.kwaIds = item.kwas.map(kwa => kwa.id);
    });
};

const getTargetData = async () => {
    try {
        const res = await request.evaluation.get(`/evaluation/coursetarget`);
        if (res.code === 200) {
            courseTargetTargetData.value = res.data;
            // console.log(res.data);
            getKwaData();
            initialize();
        }
        else ElMessage.error(res.msg);
    } catch (error) {
        ElMessage.error('获取课程目标失败' + error);
    }
};

const getKwaData = async () => {
    try {
        const res = await request.evaluation.get(`/evaluation/kwadict`);
        if (res.code === 200) {
            kwaData.value = res.data;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('获取kwa字典失败' + error);
    }
}

const addTarget = () => {
    const newTarget = {
        id: '',
        code: '',
        name: '未命名目标',
        remark: '',
        unitid: '',
    }
    // console.log(newTarget);

    request.evaluation.post('/evaluation/coursetarget/create', newTarget).then((res) => {
        if (res.code === 200) {
            getTargetData();
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
                getTargetData();
                ElMessage.success('删除成功');
            }
            else ElMessage.error(res.msg);
        }).catch((error) => {
            ElMessage.error('删除失败' + error);
        });
    }).catch(() => { });
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
        // console.log(courseTargetTargetData.value);
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
                getTargetData();
                ElMessage.success('修改成功');
            }
            else ElMessage.error(res.msg);
        }).catch(error => {
            ElMessage.error('修改失败' + error);
        })
    }
};

const saveEditKwa = async (row) => {
    const newKwas = row.kwaIds.filter(id => !row.oldKwaIds.includes(id)).map(id => ({ id }));
    const deleteKwas = row.oldKwaIds.filter(id => !row.kwaIds.includes(id)).map(id => ({ id }));
    if (!newKwas.length && !deleteKwas.length) return;
    // console.log(newKwas, deleteKwas);
    let createFlag = true;
    let deleteFlag = true;
    if (newKwas.length) {
        const postData = {
            id: row.id,
            kwas: newKwas
        };
        try {
            const res = await request.evaluation.post(`/evaluation/coursetarget/createKwas`, postData);
            if (res.code === 200) {
                getTargetData();
            } else {
                createFlag = false;
                ElMessage.error(res.msg);
            }
        } catch (error) {
            ElMessage.error('新增kwa失败' + error);
            createFlag = false;
        }
    }
    if (deleteKwas.length) {
        const postData = {
            id: row.id,
            kwas: deleteKwas
        };
        try {
            const res = await request.evaluation.post(`/evaluation/coursetarget/deleteKwas`, postData);
            if (res.code === 200) {
                getTargetData();
            } else {
                deleteFlag = false;
                ElMessage.error(res.msg);
            }
        } catch (error) {
            ElMessage.error('删除kwa失败' + error); 
            deleteFlag = false;
        }
    }
    if(createFlag && deleteFlag) ElMessage.success('修改成功');
}

</script>

<style scoped>
.icon:hover {
    cursor: pointer;
}
</style>