<template>
    <div style="height: 92vh; display: flex; flex-direction: column;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
            <el-button type="primary" style="margin-left: 0.8vw;">{{ exportType }}</el-button>
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
                    <el-table-column prop="termname" label="学期" min-width="130">
                        <template #default="{ row }">
                            <el-input v-if="row.editingTermName" style="width:100%; height: 25px;" v-model="row.tempTermName"
                                @blur="handleBlur(row, 'editingTermName')"></el-input>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingTermName')">
                                {{ row.termname }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="startdate" label="起始日期" min-width="120">
                        <template #default="{ row }">
                            <el-date-picker v-if="row.editingStartDate" style="width: 100%; height: 25px;" v-model="row.startdate"
                                @blur="handleBlur(row, 'editingStartDate')" placeholder="请选择日期" value-format="YYYY-MM-DD"></el-date-picker>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingStartDate')">
                                {{ row.startdate }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="enddate" label="结束日期" min-width="120">
                        <template #default="{ row }">
                            <el-date-picker v-if="row.editingEndDate" style="width: 100%; height: 25px;" v-model="row.enddate"
                                @blur="handleBlur(row, 'editingEndDate')" placeholder="请选择日期" value-format="YYYY-MM-DD"></el-date-picker>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingEndDate')">
                                {{ row.enddate }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="400">
                        <template #default="{ row }">
                            <el-input v-if="row.editingRemark" style="width: 100%; height: 25px;" v-model="row.remark"
                                @blur="handleBlur(row, 'editingRemark')"></el-input>
                            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingRemark')">
                                {{row.remark }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前学期">
                        <template #default="{ row }">
                            <el-checkbox v-model="row.iscurrentterm" @click="changeStatus(row)" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, rowProps } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import request from "../utils/request";

const tableData: any = ref([
    // {
    //     id: '1',
    //     termname: '2022年春季学期',
    //     startdate: '2022-02-21',
    //     enddate: '2022-07-22',
    //     remark: '无',
    //     iscurrentterm: false,
    // },
    // {
    //     id: '2',
    //     termname: '2022年秋季学期',
    //     startdate: '2022-08-22',
    //     enddate: '2023-01-31',
    //     remark: '无',
    //     iscurrentterm: false,
    // },
    // {
    //     id: '3',
    //     termname: '2023年春季学期',
    //     startdate: '2023-02-20',
    //     enddate: '2023-07-14',
    //     remark: '无',
    //     iscurrentterm: false,
    // },
    // {
    //     id: '4',
    //     termname: '2023年秋季学期',
    //     startdate: '2023-08-21',
    //     enddate: '2024-01-25',
    //     remark: '无',
    //     iscurrentterm: false,
    // },
    // {
    //     id: '5',
    //     termname: '2024年春季学期',
    //     startdate: '',
    //     enddate: '',
    //     remark: '无',
    //     iscurrentterm: true,
    // },
]);

const getTableData = () => {
    request.get('/sysmangt/terms').then((res) => {
        if(res.code === 200){
            tableData.value = res.data
            // console.log(res);
            initialize();
        }
    }).catch(() => {
        ElMessage({
            type: 'error',
            message: '获取学期失败'
        });
    });
};

const nullTermNum = ref(0);

const initialize = () => {
    tableData.value.forEach(item => {   // 添加每个表格单元的编辑判定，并记录当前学期
        item.editingTermName = false;
        item.editingStartDate = false;
        item.editingEndDate = false;
        item.editingRemark = false;
        item.tempTermName = '';
        if(item.iscurrentterm) oldCurrentTerm.value = item;
        if(item.termname.includes('未命名角色')){
            if(item.termname.length > 5 && nullTermNum.value < Number(item.termname[6])){
                nullTermNum.value = Number(item.termname[6]);
            }
            else if(item.termname.length === 5 && nullTermNum.value === 0) nullTermNum.value ++;
        }
    });
};

onMounted(() => {
    getTableData();
});

const addTerm = () => {
    nullTermNum.value ++;
    tableData.value.push({
        id: tableData.value.length + '',
        termname: nullTermNum.value > 1 ? '未命名学期(' + nullTermNum.value + ')' : '未命名学期',
        startdate: '',
        enddate: '',
        remark: '',
        iscurrentterm: false,
        editingTermName: false,
        editingStartDate: false,
        editingEndDate: false,
        editingRemark: false,
        tempTermName: '',
    })
};

const selected = ref([]);

const exportType = ref('导出全部学期')

/*判定哪些行被选中*/
const handleSelect = (selection) => {
    // console.log(selection);
    selected.value = selection;
    if(selected.value.length < tableData.value.length && selected.value.length !== 0){
        exportType.value = '导出所选学期';
    }
    else exportType.value = '导出全部学期';
};

const handleSelectAll = (selection) => {
    // console.log(selection);
    selected.value = selection;
    if(selected.value.length < tableData.value.length && selected.value.length !== 0){
        exportType.value = '导出所选学期';
    }
    else exportType.value = '导出全部学期';
};
/*****************/

const deleteTerm = () => {
    if(selected.value.length === 0){
        ElMessage({
            type: 'warning',
            message: '未选择学期',
            duration: 800
        });
        return ;
    }
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
            selected.value = [];
        }).catch(() => { });
    }
};

const handleClick = (row, field) => {
    row[field] = true
    // console.log(row);
    if(field === 'editingTermName') row.tempTermName = row.termname;
};

const handleBlur = (row, field) => {
    if(row.termname !== row.tempTermName){
        if(field === 'editingTermName' && row.tempTermName.includes('未命名学期') && row.termname !== row.tempTermName){
            ElMessage.error('命名不可包含“未命名学期”');
        }
        else if(row.tempTermName !== '' && row.termname !== row.tempTermName) row.termname = row.tempTermName;
    }
    row.tempTermName = '';
    row[field] = false;
    // console.log(tableData.value);
};

const oldCurrentTerm = ref({});

const changeStatus = (row) => {     // 一次只允许勾选一个当前学期
    if (oldCurrentTerm.value.iscurrentterm) oldCurrentTerm.value.iscurrentterm = false;
    oldCurrentTerm.value = row;
    // console.log(tableData.value);
}
</script>

<style scoped></style>