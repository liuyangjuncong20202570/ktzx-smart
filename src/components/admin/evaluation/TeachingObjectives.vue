<template>
    <el-container style="height: 92vh;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; text-align: left; background-color:#deebf7;">
            <el-button type="success" style="margin-left: 0.8vw;" @click="addKWA()">新增</el-button>
            <el-button type="danger" @click="deleteKWA">删除</el-button>
            <el-button type="primary">保存</el-button>
            <el-button type="warning">导出Excel</el-button>
            <el-input v-model="tableSearchData" style="margin-left: 0.8vw; width: 250px" placeholder="查找KWA">
                <template #append><el-button :icon="Search" /></template>
            </el-input>
        </el-header>
        <el-main style="padding: 0;">
            <el-table :data="filterTableData" style="height: 100%; width: 100%;" v-model="tableSelected"
                    @select="tableSelect" @select-all="tableSelectAll" stripe>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="序码" width="100"></el-table-column>
                <el-table-column prop="name" label="名称" width="300">
                    <template v-slot="row">
                        {{ row.row.name }}
                    </template>
                </el-table-column>
                <el-table-column prop="keywordname" label="关键字" min-width="140">
                    <template v-slot="row">
                        <el-popover :visible="row.row.keywordPopVisible" placement="right-end" width="600">
                            <el-header style="height: auto; padding: 5px 0px; width:100%; background-color:#eef3f6;">
                                <div style="display: flex; justify-content: space-between;">
                                    <el-input v-model="keywordSearchData" style="margin-left: 0.8vw; width: 250px" placeholder="查找关键字">
                                        <template #append><el-button :icon="Search" /></template>
                                    </el-input>
                                    <el-button style="margin-right: 10px;" :type="'danger'" link 
                                    @click="row.row.keywordPopVisible = false;">取消</el-button>
                                </div>
                            </el-header>
                            <el-table :data="filterKeywordData" height="300" @current-change="chooseKeyword"
                                highlight-current-row ref="keywordHighLightRow" stripe>
                                <el-table-column prop="id" label="序码"></el-table-column>
                                <el-table-column prop="keywordname" label="名称" min-width="200"></el-table-column>
                                <el-table-column prop="datavalue" label="权值">
                                    <template v-slot="row">
                                        {{ Number(row.row.datavalue).toFixed(2) }}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div style="text-align: center;">
                                <el-button style="margin-top: 10px;" type="success"
                                    @click="setKeyword(row)">确定</el-button>
                            </div>
                            <template #reference>
                                <span>
                                    {{ row.row.keywordname }}
                                    <el-icon color="dodgerblue" class="edit-icon" @click="openKeywordDictionary(row)" size="16">
                                        <Edit /></el-icon>
                                </span>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>

                <el-table-column prop="abilityname" label="能力" min-width="140">
                    <template v-slot="row">
                        <el-popover :visible="row.row.abilityPopVisible" placement="right-end" width="600">
                            <el-header style="height: auto; padding: 5px 0px; width:100%; background-color:#eef3f6;">
                                <div style="display: flex; justify-content: space-between;">
                                    <el-input v-model="abilitySearchData" style="margin-left: 0.8vw; width: 250px" placeholder="查找能力">
                                        <template #append><el-button :icon="Search" /></template>
                                    </el-input>
                                    <el-button style="margin-right: 10px;" :type="'danger'" link 
                                    @click="row.row.abilityPopVisible = false;">取消</el-button>
                                </div>
                            </el-header>
                            <el-table :data="filterAbilityData" height="300" highlight-current-row @current-change="chooseAbility"
                                ref="abilityHighLightRow" stripe>
                                <el-table-column prop="id" label="序码"></el-table-column>
                                <el-table-column prop="abilityname" label="名称" min-width="200"></el-table-column>
                                <el-table-column prop="datavalue" label="权值">
                                    <template v-slot="row">
                                        {{ Number(row.row.datavalue).toFixed(2) }}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div style="text-align: center;">
                                <el-button style="margin-top: 10px;" type="success"
                                    @click="setAbility(row)">确定</el-button>
                            </div>
                            <template #reference>
                                <span>
                                    {{ row.row.abilityname }}
                                    <el-icon color="dodgerblue" class="edit-icon" @click="openAbilityDictionary(row)" size="16">
                                        <Edit /></el-icon>
                                </span>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="datavalue" label="权值">
                    <template v-slot="row">
                        <el-input v-if="row.row.editingDatavalue" style="width:100%; height: 25px;" v-model="row.row.datavalue"
                            :ref="el => setInputRef(el, row)" @blur="handleBlur(row, 'editingDatavalue')"></el-input>
                        <div v-else style="width: 100%; height: 25px;" @dblclick="handleClick(row, 'editingDatavalue')">
                            {{ row.row.datavalue }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { Edit, Search } from '@element-plus/icons-vue';
import  _  from 'lodash';
import { ElMessage, ElMessageBox, ElTable } from 'element-plus';

const tableSearchData = ref('');    // KWA表的搜索数据

const keywordSearchData = ref('');  // 关键字表的搜索数据

const abilitySearchData = ref('');  // 能力表的搜索数据

const tableData: any = ref([     // KWA表数据
    {
        id: 'A1-B1',
        name: '中断系统-代码编程能力',
        keywordname: '中断系统',
        abilityname: '代码编程能力',
        datavalue: 0.00,
    },
    {
        id: 'A2-B5',
        name: '串口并口通讯-实验能力',
        keywordname: '串口并口通讯',
        abilityname: '实验能力',
        datavalue: 0.00,
    },
    {
        id: 'A3-B2',
        name: '伪指令集-程序实现能力',
        keywordname: '伪指令集',
        abilityname: '程序实现能力',
        datavalue: 0.00,
    },
    {
        id: '',
        name: '新建KWA(100)',
        keywordname: '',
        abilityname: '',
        datavalue: 0.00,
    }
])

const tempRowData = ref({});

const nullKWANum = ref(0);

const tableSelected = ref([]);

const filterTableData = computed(() =>  // 实际显示的表格数据源
    tableData.value.filter((data) =>   // 过滤掉不包含搜索框中字符的数据
        !tableSearchData.value || data.name.toLowerCase().includes(tableSearchData.value.toLowerCase())
    )
);

const keywordData = ref([   //关键字表数据
    {
        id: 'A1',
        keywordname: '中断系统',
        datavalue: 0.00,
    },
    {
        id: 'A2',
        keywordname: '串口并口通讯',
        datavalue: 0.00,
    },
    {
        id: 'A3',
        keywordname: '伪指令集',
        datavalue: 0.00,
    },
    {
        id: 'A4',
        keywordname: '单片机IO口',
        datavalue: 0.00,
    },
    {
        id: 'A5',
        keywordname: '单片机内部结构',
        datavalue: 0.00,
    },
    {
        id: 'A6',
        keywordname: '单片机外设模块扩展',
        datavalue: 0.00,
    },
    {
        id: 'A7',
        keywordname: '单片机外部存储结构',
        datavalue: 0.00,
    },
    {
        id: 'A8',
        keywordname: '单片机外部硬件扩展',
        datavalue: 0.00,
        importantlevelid: '',
    },
    {
        id: 'A9',
        keywordname: '操作系统',
        datavalue: 0.00,
    },
    {
        id: 'A10',
        keywordname: '串口并口传输',
        datavalue: 0.00,
    },
    {
        id: 'A11',
        keywordname: '伪代码',
        datavalue: 0.00,
    },
    {
        id: 'A12',
        keywordname: '硬件参数',
        datavalue: 0.00,
    },
    {
        id: 'A13',
        keywordname: '控制芯片指令',
        datavalue: 0.00,
    },
    {
        id: 'A14',
        keywordname: '单片机模块复用',
        datavalue: 0.00,
    },
    {
        id: 'A15',
        keywordname: '单片机内部存储结构',
        datavalue: 0.00,
    },
    {
        id: 'A16',
        keywordname: 'test',
        datavalue: 0.00,
    },
]);

const filterKeywordData = computed(() =>    // 实际显示的关键字表源数据
    keywordData.value.filter((data) =>   // 过滤掉不包含搜索框中字符的数据
        !keywordSearchData.value || data.keywordname.toLowerCase().includes(keywordSearchData.value.toLowerCase())
    )
)

const abilityData = ref([   // 能力表数据
    {
        id: 'B1',
        abilityname: '代码编程能力',
        datavalue: 0.00,
    },
    {
        id: 'B2',
        abilityname: '实验能力',
        datavalue: 0.00,
    },
    {
        id: 'B3',
        abilityname: '概念识辨能力',
        datavalue: 0.00,
    },
    {
        id: 'B4',
        abilityname: '直接应用能力',
        datavalue: 0.00,
    },
    {
        id: 'B5',
        abilityname: '程序实现能力',
        datavalue: 0.00,
    },
])

const filterAbilityData = computed(() =>    // 实际显示的能力表源数据
    abilityData.value.filter((data) =>   // 过滤掉不包含搜索框中字符的数据
        !abilitySearchData.value || data.abilityname.toLowerCase().includes(abilitySearchData.value.toLowerCase())
    )
)

const selectedKeyword = ref('');    // 记录某行哪一个关键字被选择了，防止每次打开表后不进行操作会导致原数据丢失

const selectedAbility = ref('');    // 记录某行哪一个能力被选择了，防止每次打开表后不进行操作会导致原数据丢失

const openedKeywordPop = ref(null);     // 记录哪行的关键字表被打开了

const openedAbilityPop = ref(null);     // 记录哪行的能力表被打开了

/*************数据初始化**************/

onMounted(() =>{
    initialize();
});

const initialize = () => {
    tableData.value.forEach((item) => {
        item.keywordPopVisible = false;
        item.abilityPopVisible = false;
        item.editingDatavalue = false;
        item.datavalue = Number(item.datavalue).toFixed(2);
        
        if (item.name.includes('新建KWA')) {
        if (item.name.length > 5) {
            let num = '';
            for(let i = 6; item.name[i] !== ')'; i++){
                num += item.name[i];
            }
            if(nullKWANum.value < Number(num)) nullKWANum.value = Number(num);
        }
        else if (item.name.length === 5 && nullKWANum.value === 0) nullKWANum.value++;
        }
    });
    inputRefs.value = {};
};

/*****************KWA表函数*****************/
const handleClick = (row, field) => {
    nextTick(() => {
        tempRowData.value = Object.assign({}, row.row);     // 存一份修改之前的数据用作比对
        row.row[field] = true
        setTimeout(() => {
            if(inputRefs.value[row.row.id] && inputRefs.value[row.row.id].$refs.input){
                inputRefs.value[row.row.id].$refs.input.focus();
            }
        }, 0);
    });
};

const handleBlur = (row, field) => {
    row.row[field] = false;
    if(!_.isEqual(tempRowData.value, row.row)){
        // 当数据发生改变了再传数据给后端
    }
};

const inputRefs = ref({});

const setInputRef = (el, row) => {
  if (el) {
    inputRefs.value[row.row.id] = el;
  }
};

const addKWA = () => {      // 新增KWA
    nullKWANum.value ++;
    tableData.value.push({
        id: '',
        name: nullKWANum.value > 1 ? '新建KWA(' + nullKWANum.value + ')' : '新建KWA',
        keywordname: '',
        abilityname: '',
        datavalue: Number(0.00).toFixed(2),
        keywordPopVisible: false,
        abilityPopVisible: false,
        editingDatavalue: false,
    })
};

/*判定哪些行被选中*/
const tableSelect = (selection) => {
  tableSelected.value = selection;
};

const tableSelectAll = (selection) => {
  tableSelected.value = selection;
};

// 删除KWA
const deleteKWA = () => {
    if(!tableSelected.value.length){
        ElMessage({
            type: 'warning',
            message: '未选择KWA',
            duration: 800
        });
        return ;
    }
    ElMessageBox.confirm(
        '选中的KWA将被删除，是否确定',
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


/*******************************************/


/**************关键字表格的函数***************/
const openKeywordDictionary = (row) => {
    if(openedKeywordPop.value) openedKeywordPop.value.keywordPopVisible = false;    // 关掉其他打开的popover
    if(openedAbilityPop.value) openedAbilityPop.value.abilityPopVisible = false;
    keywordSearchData.value = '';
    row.row.keywordPopVisible = true;
    openedKeywordPop.value = row.row;
    openedAbilityPop.value = null;

    let selectedKeywordIndex = -1;  // 记录当前显示的关键字在关键字表中的下标
    for(let i = 0; i < keywordData.value.length; i ++){
        if(keywordData.value[i].keywordname === row.row.keywordname){
            selectedKeyword.value = row.row.keywordname;
            selectedKeywordIndex = i;
        }
    }
    nextTick(() => {
        keywordHighLightRow.value!.setCurrentRow(keywordData.value[selectedKeywordIndex]);  // 每次打开关键字表格高亮已经被选择的关键字
    })
}

const chooseKeyword = (row, column, cell, event) => {
    selectedKeyword.value = row.keywordname;
    // console.log(row);
};

const setKeyword = (row) => {
    const oldKeyword = row.row.keywordname;
    row.row.keywordname = selectedKeyword.value;
    if(oldKeyword !== row.row.keywordname){
        // 数据变化了再传给后端
    }
    selectedKeyword.value = '';
    row.row.keywordPopVisible = false;
    if(row.row.keywordname && row.row.abilityname)
        row.row.name = row.row.keywordname + '-' + row.row.abilityname;
};

const keywordHighLightRow = ref<InstanceType<typeof ElTable>>()

/*******************************************/


/**************能力表格的函数***************/
const abilityHighLightRow = ref<InstanceType<typeof ElTable>>();
const openAbilityDictionary = (row) => {    // 打开能力弹框
    if(openedKeywordPop.value) openedKeywordPop.value.keywordPopVisible = false;    // 关掉其他打开的popover
    if(openedAbilityPop.value) openedAbilityPop.value.abilityPopVisible = false;
    abilitySearchData.value = '';
    row.row.abilityPopVisible = true;
    openedKeywordPop.value = null;
    openedAbilityPop.value = row.row;

    let selectedAbilityIndex = -1;  // 记录当前显示的能力在能力表中的下标
    for(let i = 0; i < abilityData.value.length; i ++){
        if(abilityData.value[i].abilityname === row.row.abilityname){
            selectedAbility.value = row.row.abilityname;
            selectedAbilityIndex = i;
        }
    }
    nextTick(() => {
        abilityHighLightRow.value!.setCurrentRow(abilityData.value[selectedAbilityIndex]);  // 每次打开能力表格高亮已经被选择的能力
    })
}

const chooseAbility = (row, column, cell, event) => {   // 记录哪个能力被选择
    selectedAbility.value = row.abilityname;
    // console.log(row);
};

const setAbility = (row) => {   // 点击确定后将选择的能力赋值给KWA表数据
    const oldAbility = row.row.abilityname;
    row.row.abilityname = selectedAbility.value;
    if(oldAbility !== row.row.abilityname){
        // 数据变化了再传给后端
    }
    selectedAbility.value = '';
    row.row.abilityPopVisible = false;
    if(row.row.keywordname && row.row.abilityname)
        row.row.name = row.row.keywordname + '-' + row.row.abilityname;
};

/*******************************************/

</script>

<style scoped>
.edit-icon{
    cursor: pointer;
}

.el-table .success-row {
    background-color: red !important;
}
</style>