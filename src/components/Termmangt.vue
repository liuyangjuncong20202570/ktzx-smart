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
            <div style="max-height: 100%; height: 100%; overflow:auto ; flex: auto">
                <el-table :data="tableData" style="table-layout:auto; width: 100%; height: 100%;" @select="handleSelect"
                    @select-all="handleSelectAll" stripe>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column width="55">
                        <template v-slot="row">{{ row.$index + 1 }}</template>
                    </el-table-column>
                    <el-table-column prop="termName" label="学期">
                        <template #default="{ row }">
                            <el-input v-if="row.editingTermName" style="width:100%; height: 25px;" v-model="row.termName"
                                @blur="handleBlur(row, 'editingTermName')"></el-input>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingTermName')">
                                {{row.termName }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="beginData" label="起始日期">
                        <template #default="{ row }">
                            <el-input v-if="row.editingBeginData" style="width:100%; height: 25px;" v-model="row.beginData"
                                @blur="handleBlur(row, 'editingBeginData')"></el-input>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingBeginData')">
                                {{row.beginData }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="endData" label="结束日期">
                        <template #default="{ row }">
                            <el-input v-if="row.editingEndData" style="width: 100%; height: 25px;" v-model="row.endData"
                                @blur="handleBlur(row, 'editingEndData')"></el-input>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingEndData')">
                                {{row.endData }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" width="400">
                        <template #default="{ row }">
                            <el-input v-if="row.editingRemark" style="width: 100%; min-width: 370px; height: 25px;" v-model="row.remark"
                                @blur="handleBlur(row, 'editingRemark')"></el-input>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingRemark')">
                                {{row.remark }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前学期">
                        <template #default="{ row }">
                            <el-checkbox v-model="row.isCurrentTerm" @click="changeStatus(row)" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const tableData: any = ref([
    {
        id: '1',
        termName: '2022年春季学期',
        beginData: '2022-02-21',
        endData: '2022-07-22',
        remark: '无',
        isCurrentTerm: false,
    },
    {
        id: '2',
        termName: '2022年秋季学期',
        beginData: '2022-08-22',
        endData: '2023-01-31',
        remark: '无',
        isCurrentTerm: false,
    },
    {
        id: '3',
        termName: '2023年春季学期',
        beginData: '2023-02-20',
        endData: '2023-07-14',
        remark: '无',
        isCurrentTerm: false,
    },
    {
        id: '4',
        termName: '2023年秋季学期',
        beginData: '2023-08-21',
        endData: '2024-01-25',
        remark: '无',
        isCurrentTerm: false,
    },
    {
        id: '5',
        termName: '2024年春季学期',
        beginData: '',
        endData: '',
        remark: '无',
        isCurrentTerm: true,
    },
]);

onMounted(() => {
    tableData.value.forEach(item => {   // 添加每个表格单元的编辑判定，并记录当前学期
        item.editingTermName = false;
        item.editingBeginData = false;
        item.editingEndData = false;
        item.editingRemark = false;
        if(item.isCurrentTerm) oldCurrentTerm.value = item;
    });
});

const addTerm = () => {
    tableData.value.push({
        id: tableData.value.length + '',
        termName: '',
        beginData: '',
        endData: '',
        remark: '',
        isCurrentTerm: false,
        editingTermName: false,
        editingBeginData: false,
        editingEndData: false,
        editingRemark: false
    })
};

const selected = ref([]);

/*判定哪些行被选中*/
const handleSelect = (selection) => {
    // console.log(selection);
    selected.value = selection;
};

const handleSelectAll = (selection) => {
    // console.log(selection);
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

const oldCurrentTerm = ref({});

const changeStatus = (row) => {     // 一次只允许勾选一个当前学期
    if (oldCurrentTerm.value.isCurrentTerm) oldCurrentTerm.value.isCurrentTerm = false;
    oldCurrentTerm.value = row;
    // console.log(tableData.value);
}
</script>

<style scoped></style>