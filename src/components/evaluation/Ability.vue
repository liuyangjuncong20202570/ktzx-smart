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
                <el-table-column prop="name" label="名称" width="300">
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

    <el-dialog v-model="abilityDictionaryVisible" width="1000" style="height: 390px; background-color: #eef3f6;
            max-width: 1000px; overflow: auto;" :close-on-click-modal="false" :show-close="false"
            destroy-on-close align-center>
        <template #header="{ titleId }">
            <el-header style="height: auto; padding: 5px 0px; width:100%;" :id="titleId">
                <div style=" display: flex; justify-content: space-between;">
                    <div>
                        <el-button type="success" @click="changeDictionarySelect">保存</el-button>
                    </div>
                    <el-button link type="danger" @click="cancelDictionary">
                        <el-icon size="20" class="el-icon--left"><CloseBold /></el-icon>
                    </el-button>
                </div>
            </el-header>
            <el-cascader-panel style="width: fit-content; margin-top: 30px;" :options="dictionaryData" :props="props"
                v-model="dictionarySelected" @change="aaa" />
        </template>
    </el-dialog>
</template>

<script setup>
import { CloseBold, Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, nextTick, onMounted, ref } from 'vue';
import _ from 'lodash';

const data = ref();

const aaa = () => {
    console.log(dictionarySelected.value);
}

const tableSearchData = ref('');    // 主界面搜索框数据

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
    {
        id: '',
        name: '未命名能力(1001)',
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

const dictionarySelected = ref([
    ['1', '2', '3'],
]);     // 记录能力字典中选择的数据

const nullAbilityNum = ref(0);  // 未命名能力数

const filterTableData = computed(() =>  // 实际显示的表格数据源
    tableData.value.filter((data) =>   // 过滤掉不包含搜索框中字符的数据
        !tableSearchData.value || data.name.toLowerCase().includes(tableSearchData.value.toLowerCase())
    )
)

const abilityDictionaryVisible = ref(false);    // 关键字字典弹窗是否显示

const props = {
    multiple: true,
    label: 'name',
    value: 'id'
}

const dictionaryData = [    //能力字典数据
    {
        id: '1',
        name: '认知类型',
        remark: '',
        children: [
            {
                id: '2',
                name: '记忆层次',
                remark: '',
                children: [
                    {
                        id: '3',
                        name: '回忆再认能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',
                    },
                    {
                        id: '4',
                        name: '再现复述能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',
                    }
                ]
            },
            {
                id: '5',
                name: '理解层次',
                remark: '',
                children: [
                    {
                        id: '6',
                        name: '概念识辨能力',
                        remark: '',
                        children: [
                            {
                                id: '7',
                                name: '概念识别能力',
                                datavalue: '',
                                importantlevelid: '',
                                remark: '',
                            },
                            {
                                id: '8',
                                name: '概念辨析能力',
                                datavalue: '',
                                importantlevelid: '',
                                remark: '',
                            }
                        ]
                    },
                    {
                        id: '9',
                        name: '识图绘图能力',
                        remark: '',
                        children: [
                            { 
                                id: '10',
                                name: '图表解析能力',
                                datavalue: '',
                                importantlevelid: '',
                                remark: '',
                            },
                            { 
                                id: '11',
                                name: '图表绘制能力',
                                datavalue: '',
                                importantlevelid: '',
                                remark: '',
                            }
                        ]
                    },
                    {
                        id: '12',
                        name: '诠释理解能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',
                    },
                    {
                        id: '13',
                        name: '代码解析能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',
                    }
                ]
            },
            {
                id: '14',
                name: '应用层次',
                reamrk: '',
                children: [
                    {
                        id: '15',
                        name: '直接应用能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',   
                    },
                    {
                        id: '16',
                        name: '数学计算能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',
                    },
                    {
                        id: '17',
                        name: '数模转化能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',
                    },
                    {
                        id: '18',
                        name: '综合运用能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',
                    },
                ]
            },
            {
                id: '19',
                name: '分析层次',
                remark: '',
                children: [
                    {
                        id: '20',
                        name: '比较分析能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',
                    },
                    {
                        id: '21',
                        name: '解构归因能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',
                    },
                    {
                        id: '22',
                        name: '数学建模能力',
                        datavalue: '',
                        importantlevelid: '',
                        remark: '',
                    }
                ]
            },
        ]
    },
    {
        id: '23',
        name: '技术类型',
        remark: '',
        children: [
            {
                id: '24',
                name: '文献检索能力',
                datavalue: '',
                importantlevelid: '',
                remark: '',
            },
            {
                id: '25',
                name: '工具使用能力',
                datavalue: '',
                importantlevelid: '',
                remark: '',
            }
        ]
    },
    {
        id: '26',
        name: '社会类型',
        remark: '',
        children: [
            {
                id: '27',
                name: '沟通交流能力',
                datavalue: '',
                importantlevelid: '',
                remark: '',
            },
            {
                id: '28',
                name: '团队合作能力',
                datavalue: '',
                importantlevelid: '',
                remark: '',
            }
        ]
    },
    {
        id: '29',
        name: '思维类型',
        remark: '',
        children: [
            {
                id: '30',
                name: '空间思维能力',
                datavalue: '',
                importantlevelid: '',
                remark: '',
            },
            {
                id: '31',
                name: '时间思维能力',
                datavalue: '',
                importantlevelid: '',
                remark: '',
            }
        ]
    }
];

const inputRefs = ref({});


/*********************************************/
const initialize = () => {
    tableData.value.forEach((item) => {
        item.editingName = false;
        item.editingDatavalue = false;
        item.editingImportantlevelid = false;
        item.editingRemark = false;
        item.tempName = '';
        item.datavalue = Number(item.datavalue).toFixed(2);

        if (item.name.includes('未命名能力')) {
            if (item.name.length > 5) {
                let num = '';
                for(let i = 6; item.name[i] !== ')'; i++){
                    num += item.name[i];
                }
                if(nullAbilityNum.value < Number(num)) nullAbilityNum.value = Number(num);
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
        id: '',
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
    ElMessageBox.confirm(
        '选择的能力将被删除，是否确定',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        // 删除逻辑
    }).catch(() => {});
};


const dictionarySelected_backup = ref([]);
const openDictionary = () =>{
    abilityDictionaryVisible.value = true;
    dictionarySelected_backup.value = dictionarySelected.value;
};

const cancelDictionary = (close) => {
    abilityDictionaryVisible.value = false;
    dictionarySelected.value = dictionarySelected_backup.value;
    dictionarySelected_backup.value = [];
};

const changeDictionarySelect = () => {
    abilityDictionaryVisible.value = false;
};
</script>

<style scoped>
</style>