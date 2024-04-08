<template>
    <el-container style="height: 92vh;">
        <!--两个按钮，靠最左-->
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
            <el-button type="primary" style="margin-left: 0.8vw;" @click="addChapter">新增章节</el-button>
            <el-button type="danger" @click="">删除</el-button>
            <el-button type="success" @click="">保存</el-button>
            <el-button v-if="selectedUnit" type="primary" @click="addSection">新增小节</el-button>
        </el-header>
        <el-main style="padding: 0; overflow: auto; background-color: white;">
            <el-table :data="tableData" style="width: 100%;" row-key="id" highlight-current-row
                size="large" :row-class-name="tableRowClassName" @current-change="chooseUnit" ref="highLightRow" border>
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="名称">
                    <template v-slot="row">
                        {{ row.row.name }}
                    </template>
                </el-table-column>
                <el-table-column label="类型">
                    <template v-slot="row">
                        {{ row.row.type }}
                    </template>
                </el-table-column>
                <el-table-column prop="teachingobj" label="基本教学目标">
                    <template v-slot="row">
                        <el-popover
                            placement="bottom"
                            :title="`${row.row.type}/${row.row.name}`"
                            :width="800"
                            :visible="row.row.popVisible">
                            <el-checkbox-group v-model="row.row.teachingobj">
                                <el-checkbox v-for="kwa in KWAData" :label="kwa" size="large">{{ kwa.name }}</el-checkbox>
                            </el-checkbox-group>
                            <div style="text-align: right;">
                                <el-button size="small" text @click="row.row.popVisible = false">cancel</el-button>
                                <el-button size="small" type="primary" @click="confirmChangeKWA(row.row)">confirm</el-button>
                            </div>
                            <template #reference>
                                <div style="cursor: pointer;" @click="showPop(row.row)">
                                    {{ row.row.teachingobj.map(item => item.id).join(", ") }}
                                    <el-icon color="dodgerblue"><Edit /></el-icon>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="数值">
                    <template v-slot="row">
                        {{ row.row.datavalue }}
                    </template>
                </el-table-column>
            </el-table>

        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { Edit } from '@element-plus/icons-vue';
import { ElTable } from 'element-plus';

const tableData = ref([
    {
        id: '1',
        name: '基础知识',
        type: '第一章',
        teachingobj: [
            {
                id: 'A1-B2',
                name: '中断系统-实验能力',
            },
            {
                id: 'A1-B4',
                name: '中断系统-直接应用能力',
            },
        ],
        datavalue: Number(0).toFixed(2),
        children: [
            {
                id: '2',
                name: '晶振时序',
                type: '第一节',
                teachingobj: [
                    {
                        id: 'A1-B2',
                        name: '中断系统-实验能力',
                    },
                    {
                        id: 'A1-B4',
                        name: '中断系统-直接应用能力',
                    },
                ],
                datavalue: Number(0).toFixed(2),
            },
            {
                id: '3',
                name: '时序逻辑',
                type: '第二节',
                teachingobj: [
                    {
                        id: 'A1-B2',
                        name: '中断系统-实验能力',
                    },
                    {
                        id: 'A1-B4',
                        name: '中断系统-直接应用能力',
                    },
                ],
                datavalue: Number(0).toFixed(2),
            },
        ],
    },
    {
        id: '4',
        name: '硬件基础',
        type: '第二章',
        teachingobj: [
            {
                id: 'A1-B2',
                name: '中断系统-实验能力',
            },
            {
                id: 'A1-B4',
                name: '中断系统-直接应用能力',
            },
        ],
        datavalue: Number(0).toFixed(2),
        children: [
            {
                id: '5',
                name: '晶振时序',
                type: '第一节',
                teachingobj: [
                    {
                        id: 'A1-B2',
                        name: '中断系统-实验能力',
                    },
                    {
                        id: 'A1-B4',
                        name: '中断系统-直接应用能力',
                    },
                ],
                datavalue: Number(0).toFixed(2),
    
            },
            {
                id: '6',
                name: '时序逻辑',
                type: '第二节',
                teachingobj: [
                    {
                        id: 'A1-B2',
                        name: '中断系统-实验能力',
                    },
                    {
                        id: 'A1-B4',
                        name: '中断系统-直接应用能力',
                    },
                ],
                datavalue: Number(0).toFixed(2),
    
            },
        ],
    },
    {
        id: '7',
        name: 'XXXX',
        type: '第三章',
        teachingobj: [
            {
                id: 'A1-B2',
                name: '中断系统-实验能力',
            },
            {
                id: 'A1-B4',
                name: '中断系统-直接应用能力',
            },
        ],
        datavalue: Number(0).toFixed(2),
    },
    {
        id: '8',
        name: 'XXXX',
        type: '第四章',
        teachingobj: [
            {
                id: 'A1-B2',
                name: '中断系统-实验能力',
            },
            {
                id: 'A1-B4',
                name: '中断系统-直接应用能力',
            },
        ],
        datavalue: Number(0).toFixed(2),
        children: [
            {
                id: '9',
                name: '晶振时序',
                type: '第一节',
                teachingobj: [
                    {
                        id: 'A1-B2',
                        name: '中断系统-实验能力',
                    },
                    {
                        id: 'A1-B4',
                        name: '中断系统-直接应用能力',
                    },
                ],
                datavalue: Number(0).toFixed(2),
    
            },
            {
                id: '10',
                name: '时序逻辑',
                type: '第二节',
                teachingobj: [
                    {
                        id: 'A1-B2',
                        name: '中断系统-实验能力',
                    },
                    {
                        id: 'A1-B4',
                        name: '中断系统-直接应用能力',
                    },
                ],
                datavalue: Number(0).toFixed(2),
    
            },
        ],
    },
]);

const KWAData = ref([
    {
        id: 'A1-B1',
        name: '中断系统-代码编写能力'
    },
    {
        id: 'A1-B2',
        name: '中断系统-实验能力'
    },
    {
        id: 'A1-B3',
        name: '中断系统-概念辨识能力'
    },
    {
        id: 'A1-B4',
        name: '中断系统-直接应用能力'
    },
    {
        id: 'A1-B5',
        name: '中断系统-程序实验能力'
    },
    {
        id: 'A2-B6',
        name: '串口并口通讯-程序实验能力'
    },
    {
        id: 'A2-B1',
        name: '串口并口通讯-代码编写能力'
    },
    {
        id: 'A2-B2',
        name: '串口并口通讯-实验能力'
    },
]);

const openedPopVisible = ref({});

//未命名单元数
const nullUnitNum = ref(0);

const highLightRow = ref<InstanceType<typeof ElTable>>();

/**************数据预处理*************/
const id = ref(1);
const initialize = (data) => {
    data.forEach((item) => {
        item.popVisible = false;
        item.id = id.value ++;

        if(item.name.includes('未命名单元')){
            if(item.name.length > 5){
                let num = '';
                for(let i = 6; item.name[i] !== ')'; i ++){
                    num += item.name[i];
                }
                if(nullUnitNum.value < Number(num)) nullUnitNum.value = Number(num);
            }
            else if(item.name.length === 5 && nullUnitNum.value === 0) nullUnitNum.value ++;
        }

        if(item.children && item.children.length > 0) initialize(item.children);
    });
}

onMounted(() => {
    initialize(tableData.value);
    document.addEventListener('click', clearHighLight);
})

const tableRowClassName = ({ row, rowIndex }) => {
    // console.log(row);
    if (row.type[2] === '节') {
        return 'child-row'
    }
    return ''
}

/**************************************/

/****************表格的操作*****************/
const showPop = (row) => {
    if(openedPopVisible.value.popVisible) openedPopVisible.value.popVisible = false;
    row.popVisible = true;
    openedPopVisible.value = row;
}

const confirmChangeKWA = (row) => {
    row.popVisible = false;
}

const addChapter = () => {
    nullUnitNum.value ++;
    tableData.value.push({
        id: '',
        name: nullUnitNum.value > 1 ? '未命名单元(' + nullUnitNum.value + ')' : '未命名单元',
        type: '',
        teachingobj: [],
        datavalue: Number(0).toFixed(2),
    });
    initialize(tableData.value);
}

const selectedUnit = ref(null);

const chooseUnit = (row, column, cell, event) => {
    // console.log(row);
    selectedUnit.value = row;
};

const addSection = () => {
    nullUnitNum.value ++;
    if(!selectedUnit.value.children) selectedUnit.value.children = [];
    selectedUnit.value.children.push({
        id: '',
        name: nullUnitNum.value > 1 ? '未命名单元(' + nullUnitNum.value + ')' : '未命名单元',
        type: '',
        teachingobj: [],
        datavalue: Number(0).toFixed(2),
    });
    initialize(tableData.value);
}
/******************************************/

/*****************控制表格高光显示*************/
const clearHighLight = (event) => {
	// 检查点击事件是否在表格内部
	// 如果不是，则去掉高光
	if (selectedUnit.value && !event.target.closest('.el-table')) {
        highLightRow.value!.setCurrentRow(null);
	}
};
/********************************************/
</script>

<style scoped>

.el-table >>> .child-row {
  background-color:rgb(250, 250, 250);
  color:royalblue
}

</style>