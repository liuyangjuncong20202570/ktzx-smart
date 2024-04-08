<template>
    <el-container style="height: 92vh;">
        <el-header style="height: auto; padding: 5px 0px; width:100%; text-align: left; background-color:#deebf7;">
            <el-button type="info" style="margin-left: 0.8vw; cursor: not-allowed;">新增</el-button>
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
                        {{ row.row.name }}
                    </template>
                </el-table-column>
                <el-table-column prop="datavalue" label="数值" width="100">
                    <template v-slot="row">
                        {{ Number(row.row.datavalue).toFixed(2) }}
                    </template>
                </el-table-column>
                <el-table-column prop="courseid" label="重要程度" width="150">
                    <template v-slot="row">
                        {{ row.row.importantlevelid }}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="113">
                    <template v-slot="row">
                        {{ row.row.remark }}
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>

    <el-dialog v-model="abilityDictionaryVisible" width="1000" style="height: 390px; background-color: #eef3f6;
            max-width: 1000px; overflow: auto;" :close-on-click-modal="false" :show-close="false" destroy-on-close
        align-center>
        <template #header="{ titleId }">
            <el-header style="height: auto; padding: 5px 0px; width:100%;" :id="titleId">
                <div style=" display: flex; justify-content: space-between;">
                    <div>
                        <el-button type="success" @click="changeAbilities">保存</el-button>
                    </div>
                    <el-button link type="danger" @click="closeDictionary">
                        <el-icon size="20" class="el-icon--left">
                            <CloseBold />
                        </el-icon>
                    </el-button>
                </div>
            </el-header>
            <el-cascader-panel style="width: fit-content; margin-top: 30px;" :options="dictionaryData" :props="props"
                v-model="dictionarySelected_backup" />
        </template>
    </el-dialog>
</template>

<script setup>
import { CloseBold, Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import _ from 'lodash';

const tableSearchData = ref('');    // 主界面搜索框数据

const data = ref([  //模拟后端返回的数据
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
                ]
            },
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
]);

const tableData = ref([]);      // 主界面表格数据

const tableSelected = ref([]);    // 记录主界面的表格选择

const dictionarySelected = ref([]);     // 记录能力字典中选择的数据
const dictionarySelected_backup = ref([]);  // 记录能力字典中选择的数据备份用于不保存情况下关闭弹窗后数据恢复

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

// const inputRefs = ref({});

/******************预处理数据******************/
const splicedId = (node, namePath = [], idPath = []) => {     // 将树形结构数据的id拼接起来,DFS
    let result = [];
    const currentNamePath = [...namePath, node.name];   // 存储叶子节点全路径的name，用于在el-table中展示数据
    const currentIdPath = [...idPath, node.id];     // 存储叶子节点全路径的id，用于能力字典弹窗中记录哪些是存在于该课程的能力表中的

    if (!node.children || node.children === 0) {
        tableData.value.push({      // 在这里初始化每个表格行的数据，将叶子节点全路径的name用'/'拼接起来作为每行的能力名称
            id: node.id,
            name: currentNamePath.join('/'),
            datavalue: node.datavalue,
            importantlevelid: node.importantlevelid,
            remark: node.remark
        })
        return [currentIdPath];
    }

    node.children.forEach((item) => {
        result = result.concat(splicedId(item, currentNamePath, currentIdPath));
    });

    return result;
}

const initialize = () => {
    data.value.forEach((item) => {
        dictionarySelected.value = dictionarySelected.value.concat(splicedId(item))   // 初始化能力字典弹框中哪些能力被勾选了
    });
    // console.log(dictionarySelected.value);

    tableData.value.forEach((item) => {
        item.datavalue = Number(item.datavalue).toFixed(2);
    });
};
/*********************************************/


onMounted(() => {
    initialize();
});

/*************判定主页面哪些行被选中************/
const filterTableSelect = (selection) => {
    tableSelected.value = selection;
};

const filterTableSelectAll = (selection) => {
    tableSelected.value = selection;
};
/*********************************************/

const deleteAbility = () => {
    if (tableSelected.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '未选择能力',
            duration: 800
        });
        return;
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


/*************能力字典弹窗相关*************/
const openDictionary = () => {
    dictionarySelected_backup.value = dictionarySelected.value;
    // console.log(dictionarySelected.value);
    abilityDictionaryVisible.value = true;
};

const closeDictionary = (close) => {
    abilityDictionaryVisible.value = false;
};

const changeAbilities = () => {
    // console.log(dictionarySelected.value);
    dictionarySelected.value = dictionarySelected_backup.value;
    abilityDictionaryVisible.value = false;
}
/****************************************/
</script>

<style scoped></style>