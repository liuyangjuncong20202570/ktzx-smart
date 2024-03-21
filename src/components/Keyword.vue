<template>
    <el-container style="height: 92vh;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; text-align: left; background-color:#deebf7;">
            <el-button type="success" style="margin-left: 0.8vw;" @click="addKeyword">新增</el-button>
            <!-- <el-button type="primary" @click="openDictionary">从关键字字典选择</el-button> -->
            <el-button type="danger" @click="deleteKeyword">删除</el-button>
            <el-button type="primary">保存</el-button>
            <el-input v-model="tableSearchData" style="margin-left: 0.8vw; width: 250px" placeholder="查找关键字">
                <template #append><el-button :icon="Search" /></template>
            </el-input>
        </el-header>
        <el-main style="padding: 0;">
            <el-table :data="filterTableData" style="height: 100%; width: 100%;" v-model="tableSelected"
                    @select="filterTableSelect" @select-all="filterTableSelectAll" stripe>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="序码" width="60"></el-table-column>
                <el-table-column prop="name" label="名称" width="240">
                    <template v-slot="row">
                        <el-input v-if="row.row.editingName" style="width:100%; height: 25px;" v-model="row.row.tempName"
                            @blur="handleBlur(row, 'editingName')" :ref="el => setInputRef(el, row)"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @dblclick="handleClick(row, 'editingName')">
                            {{ row.row.name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="datavalue" label="数值" width="100">
                    <template v-slot="row">
                        <el-input v-if="row.row.editingDatavalue" style="width:100%; height: 25px;" v-model="row.row.datavalue"
                            @blur="handleBlur(row, 'editingDatavalue')" :ref="el => setInputRef(el, row)"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @dblclick="handleClick(row, 'editingDatavalue')">
                            {{ row.row.datavalue }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="courseid" label="重要程度" width="150">
                    <template v-slot="row">
                        <!-- <el-input v-if="row.row.editingImportantlevelid" style="width:100%; height: 25px;"
                            v-model="row.row.importantlevelid" @blur="handleBlur(row, 'editingImportantlevelid')"></el-input> -->
                        <el-select v-if="row.row.editingImportantlevelid" v-model="row.row.importantlevelid"
                            clearable style="width: 100%;" @blur="handleBlur(row, 'editingImportantlevelid')" size="small">
                            <el-option v-for="item in importanceData" :key="item.label" :label="item.label" :value="item.value" />
                        </el-select>
                        <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingImportantlevelid')">
                            {{ row.row.importantlevelid }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="113">
                    <template v-slot="row">
                        <el-input v-if="row.row.editingRemark" style="width:100%; height: 25px;" v-model="row.row.remark"
                            @blur="handleBlur(row, 'editingRemark')" :ref="el => setInputRef(el, row)"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @dblclick="handleClick(row, 'editingRemark')">
                            {{ row.row.remark }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script setup>
import { CloseBold, Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, nextTick, onMounted, ref } from 'vue';
import _ from 'lodash';

const tableSearchData = ref('');    // 主界面搜索框数据

const tableData = ref([     // 主界面表格数据
    {
        id: 'A1',
        name: '中断系统',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'A2',
        name: '串口并口通讯',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'A3',
        name: '伪指令集',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'A4',
        name: '单片机IO口',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'A5',
        name: '单片机内部结构',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'A6',
        name: '单片机外设模块扩展',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'A7',
        name: '单片机外部存储结构',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'A8',
        name: '单片机外部硬件扩展',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: '',
        name: '未命名关键字(1145)',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
]);

const tempRowData = ref({});

const importanceData = [
    {label: '低', value: 1},{label: '中', value: 2},{label: '高', value: 3},
];

const tableSelected = ref([]);    // 记录主界面的表格选择

const nullKeywordNum = ref(0);  // 未命名关键字数

const filterTableData = computed(() =>  // 实际显示的表格数据源
    tableData.value.filter((data) =>   // 过滤掉不包含搜索框中字符的数据
        !tableSearchData.value || data.name.toLowerCase().includes(tableSearchData.value.toLowerCase())
    )
)

const inputRefs = ref({});
/******************************************** */
const initialize = () => {
    tableData.value.forEach((item) => {
        item.editingName = false;
        item.editingDatavalue = false;
        item.editingImportantlevelid = false;
        item.editingRemark = false;
        item.tempName = '';
        item.datavalue = Number(item.datavalue).toFixed(2);

        if (item.name.includes('未命名关键字')) {
            if (item.name.length > 6) {
                let num = '';
                for(let i = 7; item.name[i] !== ')'; i++){
                    num += item.name[i];
                }
                if(nullKeywordNum.value < Number(num)) nullKeywordNum.value = Number(num);
            }
            else if (item.name.length === 6 && nullKeywordNum.value === 0) nullKeywordNum.value++;
        }
    });
};

onMounted(() => {
    initialize();
});

const handleClick = (row, field) => {
    nextTick(() => {
        tempRowData.value = Object.assign({}, row.row);     // 存一份修改之前的数据用作比对
        row.row[field] = true
        if(field === 'editingName') row.row.tempName = row.row.name;
        setTimeout(() => {
            if(inputRefs.value[row.row.id] && inputRefs.value[row.row.id].$refs.input){
                inputRefs.value[row.row.id].$refs.input.focus();
            }
        }, 0);
    })
};

const handleBlur = (row, field) => {
    if (row.row.name !== row.row.tempName) {
		if (field === 'editingName' && row.row.tempName.includes('未命名关键字')) {
			ElMessage.error('命名不可包含“未命名关键字”');
		}
		else if (row.row.tempName !== '') row.row.name = row.row.tempName;
	}
	row.row.tempName = '';
    row.row[field] = false;
    if(!_.isEqual(tempRowData.value, row.row)){
        // 当数据发生改变了再传数据给后端
    }
};

const setInputRef = (el, row) => {
  if (el) {
    inputRefs.value[row.row.id] = el;
  }
};

const addKeyword = () => {
    nullKeywordNum.value ++;
    tableData.value.push({
        id: '',
        name: nullKeywordNum.value > 1 ? '未命名关键字(' + nullKeywordNum.value + ')' : '未命名关键字',
        datavalue: Number(0).toFixed(2),
        importantlevelid: '',
        remark: '',
        editingName: false,
        editingDatavalue: false,
        editingImportantlevelid: false,
        editingRemark: false,
        tempName: '',
    });
};

/*判定主页面哪些行被选中*/
const filterTableSelect = (selection) => {
	tableSelected.value = selection;
};

const filterTableSelectAll = (selection) => {
	tableSelected.value = selection;
};
/*****************/

const deleteKeyword = () => {
    if(tableSelected.value.length === 0){
        ElMessage({
            type: 'warning',
            message: '未选择关键字',
            duration: 800
        });
        return ;
    }
    ElMessageBox.confirm(
        '选中的关键字将被删除，是否确定',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        // 删除逻辑
    }).catch(() => {})
};
/*****************************/
</script>

<style scoped>
</style>