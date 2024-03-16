<template>
    <el-container style="height: 92vh;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; text-align: left; background-color:#deebf7;">
            <el-button type="success" style="margin-left: 0.8vw;" @click="addAbility">新增</el-button>
            <el-button type="primary" @click="openDictionary">从能力字典选择</el-button>
            <el-button type="danger" @click="deleteAbility">删除</el-button>
            <el-button type="primary">保存</el-button>
            <el-input v-model="tableSearchData" style="margin-left: 0.8vw; width: 250px" placeholder="查找能力">
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
                            :ref="el => setInputRef(el, row)" @blur="handleBlur(row, 'editingName')"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @dblclick="handleClick(row, 'editingName')">
                            {{ row.row.name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="datavalue" label="数值" width="100">
                    <template v-slot="row">
                        <el-input v-if="row.row.editingDatavalue" style="width:100%; height: 25px;" v-model="row.row.datavalue"
                            :ref="el => setInputRef(el, row)" @blur="handleBlur(row, 'editingDatavalue')"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @dblclick="handleClick(row, 'editingDatavalue')">
                            {{ Number(row.row.datavalue).toFixed(2) }}
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
                            :ref="el => setInputRef(el, row)" @blur="handleBlur(row, 'editingRemark')"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @dblclick="handleClick(row, 'editingRemark')">
                            {{ row.row.remark }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>

    <el-dialog v-model="abilityDictionaryVisible" width="1000" style="height: 450px; background-color: #eef3f6;"
        :close-on-click-modal="false" :show-close="false" destroy-on-close align-center>
        <template #header="{ titleId }">
            <el-header style="height: auto; padding: 5px 0px; width:100%;" :id="titleId">
                <div style=" display: flex; justify-content: space-between;">
                    <div>
                        <el-button type="primary">保存</el-button>
                        <el-input v-model="dictionarySearchData" style="margin-left: 0.8vw; width: 250px" placeholder="查找能力">
                            <template #append><el-button :icon="Search" /></template>
                        </el-input>
                    </div>
                    <el-button link type="danger" @click="closeDictionary">
                        <el-icon size="20" class="el-icon--left"><CloseBold /></el-icon>
                    </el-button>
                </div>
            </el-header>
            <el-table :data="filterDictionaryData" height="370" @select="dictionaryTableSelect" v-model="dictionarySelected"
                        @select-all="dictionaryTableSelectAll" stripe>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column width="55">
                    <template v-slot="row">{{ row.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="200"></el-table-column>
                <el-table-column prop="datavalue" label="数值" width="100">
                    <template v-slot="row">
                        {{ row.row.datavalue }}
                    </template>
                </el-table-column>
                <el-table-column prop="importantlevelid" label="重要程度" width="150"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
        </template>
    </el-dialog>
</template>

<script setup>
import { CloseBold, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { computed, nextTick, onMounted, ref } from 'vue';
import _ from 'lodash';

const tableSearchData = ref('');    // 主界面搜索框数据

const dictionarySearchData = ref('');   // 能力字典弹窗的搜索框数据

const tableData = ref([     // 主界面表格数据
    {
        id: 'B1',
        name: '代码编程能力',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'B2',
        name: '实验能力',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'B3',
        name: '概念识辨能力',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'B4',
        name: '直接应用能力',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'B5',
        name: '程序实现能力',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
]);

const tempRowData = ref({});  // 存储被编辑的行的数据


const importanceData = [
    {label: '低', value: 1},{label: '中', value: 2},{label: '高', value: 3},
];

const tableSelected = ref([]);    // 记录主界面的表格选择

const dictionarySelected = ref([]);     // 记录字典弹窗表格选择的数据

const nullAbilityNum = ref(0);  // 未命名关键字数

const filterTableData = computed(() =>  // 实际显示的表格数据源
    tableData.value.filter((data) =>   // 过滤掉不包含搜索框中字符的数据
        !tableSearchData.value || data.name.toLowerCase().includes(tableSearchData.value.toLowerCase())
    )
)

const abilityDictionaryVisible = ref(false);    // 关键字字典弹窗是否显示

const dictionaryData = ref([    //能力字典数据
    {
        id: 'B1',
        name: '代码编程能力',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'B2',
        name: '实验能力',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'B3',
        name: '概念识辨能力',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'B4',
        name: '直接应用能力',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
    {
        id: 'B5',
        name: '程序实现能力',
        datavalue: 0.00,
        importantlevelid: '',
        remark: '',
    },
]);

const filterDictionaryData = computed(() =>     // 实际显示的关键字字典数据源
    dictionaryData.value.filter((data) => 
        !dictionarySearchData.value || data.name.toLowerCase().includes(dictionarySearchData.value.toLowerCase())
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

        if (item.name.includes('未命名能力')) {
        if (item.name.length > 5 && nullAbilityNum.value < Number(item.name[6])) {
            nullAbilityNum.value = Number(item.name[6]);
        }
        else if (item.name.length === 5 && nullAbilityNum.value === 0) nullAbilityNum.value++;
    }
    });
    inputRefs.value = {};
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
    });
};

const handleBlur = (row, field) => {
    if (row.row.name !== row.row.tempName) {
		if (field === 'editingName' && row.row.tempName.includes('未命名能力')) {
			ElMessage.error('命名不可包含“未命名能力”');
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

const addAbility = () => {
    nullAbilityNum.value ++;
    tableData.value.push({
        id: 'A' + (tableData.value.length + 1),
        name: nullAbilityNum.value > 1 ? '未命名能力(' + nullAbilityNum.value + ')' : '未命名能力',
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

const deleteAbility = () => {
    if(tableSelected.value.length === 0){
        ElMessage({
            type: 'warning',
            message: '未选择能力',
            duration: 800
        });
        return ;
    }
};

const openDictionary = () =>{
    abilityDictionaryVisible.value = true;
    dictionaryData.value.forEach((item) => {
        item.datavalue = Number(item.datavalue).toFixed(2);
    })
};

const closeDictionary = (close) => {
    abilityDictionaryVisible.value = false;
    dictionarySearchData.value = '';
};

/*判断数据字典弹窗中哪些行被选中*/
const dictionaryTableSelect = (selection) => {
	dictionarySelected.value = selection;
};

const dictionaryTableSelectAll = (selection) => {
	dictionarySelected.value = selection;
};
/*****************************/
</script>

<style scoped>
</style>