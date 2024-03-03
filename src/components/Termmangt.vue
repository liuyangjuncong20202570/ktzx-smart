<template>
    <div style="height: 92vh; display: flex; flex-direction: column;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
            <el-button type="primary" style="margin-left: 0.8vw;">导出学期</el-button>
            <el-button type="primary" style="margin-left: 0.8vw;" @click="addTerm">新建学期</el-button>
            <el-button type="danger" style="margin-left: 0.8vw;" @click="deleteTerm">删除学期</el-button>
            <el-button type="success" style="margin-left: 0.8vw;">保存</el-button>
        </el-header>
        <el-main style="padding: 0;">
            <div style="max-height: 100%; overflow:auto ; flex: auto">
                <el-table :data="tableData" style="table-layout:auto; width: 100%;" @select="handleSelect"
                    @select-all="handleSelectAll" stripe>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column width="55">
                        <template v-slot="row">{{ row.$index + 1 }}</template>
                    </el-table-column>
                    <el-table-column prop="term" label="学期">
                        <template #default="{ row }">
                            <div v-if="row.editingTerm">
                                <el-input style="width: auto; height: 25px;" v-model="row.term"
                                    @blur="handleBlur(row, 'editingTerm')"></el-input>
                            </div>
                            <div v-else style="width: 200px; height: 25px;" @click="handleClick(row, 'editingTerm')">{{
                                row.term }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="startTime" label="起始日期">
                        <template #default="{ row }">
                            <div v-if="row.editingStartTime">
                                <el-input style="width: auto; height: 25px;" v-model="row.startTime"
                                    @blur="handleBlur(row, 'editingStartTime')"></el-input>
                            </div>
                            <div v-else style="width: 200px; height: 25px;" @click="handleClick(row, 'editingStartTime')">{{
                                row.startTime }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="endTime" label="结束日期">
                        <template #default="{ row }">
                            <div v-if="row.editingEndTime">
                                <el-input style="width: auto; height: 25px;" v-model="row.endTime"
                                    @blur="handleBlur(row, 'editingEndTime')"></el-input>
                            </div>
                            <div v-else style="width: 200px; height: 25px;" @click="handleClick(row, 'editingEndTime')">{{
                                row.endTime }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前学期">
                        <template #default="{ row }">
                            <el-checkbox v-model="row.checked" @click="changeStatus(row)" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
    </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const tableData = ref([
    {
        id: '1',
        term: '2022年春季学期',
        startTime: '2022-02-21',
        endTime: '2022-07-22',
    },
    {
        id: '2',
        term: '2022年秋季学期',
        startTime: '2022-08-22',
        endTime: '2023-01-31',
    },
    {
        id: '3',
        term: '2023年春季学期',
        startTime: '2023-02-20',
        endTime: '2023-07-14',
    },
    {
        id: '4',
        term: '2023年秋季学期',
        startTime: '2023-08-21',
        endTime: '2024-01-25',
    },
    {
        id: '5',
        term: '2024年春季学期',
        startTime: '',
        endTime: '',
    },
]);

tableData.value.forEach(item => {
    item.editingTerm = false;
    item.editingStartTime = false;
    item.editingEndTime = false;
    item.checked = false;
});

const addTerm = () => {
    tableData.value.push({
        id: tableData.value.length + '',
        term: '',
        startTime: '',
        endTime: '',
        editingTerm: false,
        editingStartTime: false,
        editingEndTime: false,
        checked: false,
    })
};

const selected = ref([]);

/*判定哪些行被选中*/
const handleSelect = (selection) => {
    selected.value = selection;
};

const handleSelectAll = (selection) => {
    selected.value = selection;
};
/*****************/

const deleteTerm = () => {
    if (selected) {
        ElMessageBox.confirm(
            '选中的学期将被删除，是否确定',
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            tableData.value = tableData.value.filter((row) => !selected.value.includes(row));
            // console.log(tableData.value);
            ElMessage({
                type: 'success',
                message: '删除成功'
            });
        }).catch(() => { });
    }
};

const handleClick = (row, field) => {
    row[field] = true
    // console.log(row);
};

const handleBlur = (row, field) => {
    row[field] = false;
    // console.log(tableData.value);
};

const oldCheckedTerm = ref({});

const changeStatus = (row) => {
    if (oldCheckedTerm.value.checked) oldCheckedTerm.value.checked = false;
    oldCheckedTerm.value = row;
    // console.log(tableData.value);
}
</script>

<style scoped></style>