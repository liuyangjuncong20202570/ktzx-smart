<template>
    <el-container style="height: 92vh;">
        <el-header style="height: auto; padding: 5px 0px; width:100%; text-align: left; background-color:#deebf7;">
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
                <!-- <el-table-column prop="id" label="序码" width="100"></el-table-column> -->
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
                                    <el-input v-model="keywordSearchData" style="margin-left: 0.8vw; width: 250px"
                                        placeholder="查找关键字">
                                        <template #append><el-button :icon="Search" /></template>
                                    </el-input>
                                    <el-button style="margin-right: 10px;" :type="'danger'" link
                                        @click="row.row.keywordPopVisible = false;">取消</el-button>
                                </div>
                            </el-header>
                            <el-table :data="filterKeywordData" height="300" @row-click="chooseKeyword"
                                highlight-current-row ref="keywordHighLightRow" stripe>
                                <!-- <el-table-column prop="id" label="序码"></el-table-column> -->
                                <el-table-column>
                                    <template v-slot="row">
                                        {{ row.$index + 1 }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" label="名称" min-width="200"></el-table-column>
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
                                    <el-icon color="dodgerblue" class="edit-icon" @click="openKeywordDictionary(row)"
                                        size="16">
                                        <Edit />
                                    </el-icon>
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
                                    <el-input v-model="abilitySearchData" style="margin-left: 0.8vw; width: 250px"
                                        placeholder="查找能力">
                                        <template #append><el-button :icon="Search" /></template>
                                    </el-input>
                                    <el-button style="margin-right: 10px;" :type="'danger'" link
                                        @click="row.row.abilityPopVisible = false;">取消</el-button>
                                </div>
                            </el-header>
                            <el-table :data="filterAbilityData" height="300" highlight-current-row
                                @row-click="chooseAbility" ref="abilityHighLightRow" stripe>
                                <!-- <el-table-column prop="id" label="序码"></el-table-column> -->
                                <el-table-column>
                                    <template v-slot="row">
                                        {{ row.$index + 1 }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" label="名称" min-width="200"></el-table-column>
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
                                    <el-icon color="dodgerblue" class="edit-icon" @click="openAbilityDictionary(row)"
                                        size="16">
                                        <Edit />
                                    </el-icon>
                                </span>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="datavalue" label="权值">
                    <template v-slot="row">
                        <el-input v-if="row.row.editingDatavalue" style="width:100%; height: 25px;"
                            v-model="row.row.datavalue" :ref="el => setInputRef(el, row)"
                            @blur="handleBlur(row, 'editingDatavalue')"></el-input>
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
import _ from 'lodash';
import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
import request from '../../utils/request';

const courseid = ref('2c918af681fa6ea7018209a505c30672');

const tableData: any = ref([]);     // KWA表数据

const tableSearchData = ref('');    // KWA表的搜索数据

const tempRowData = ref({});

const nullKWANum = ref(0);

const tableSelected = ref([]);

const filterTableData = computed(() =>  // 实际显示的表格数据源
    tableData.value.filter((data) =>   // 过滤掉不包含搜索框中字符的数据
        !tableSearchData.value || data.name.toLowerCase().includes(tableSearchData.value.toLowerCase())
    )
);

const keywordData = ref([]);    //关键字表数据

const keywordSearchData = ref('');  // 关键字表的搜索数据

const filterKeywordData = computed(() =>    // 实际显示的关键字表源数据
    keywordData.value.filter((data) =>   // 过滤掉不包含搜索框中字符的数据
        !keywordSearchData.value || data.name.toLowerCase().includes(keywordSearchData.value.toLowerCase())
    )
)

const abilityData = ref([])   // 能力表数据

const abilitySearchData = ref('');  // 能力表的搜索数据

const filterAbilityData = computed(() =>    // 实际显示的能力表源数据
    abilityData.value.filter((data) =>   // 过滤掉不包含搜索框中字符的数据
        !abilitySearchData.value || data.name.toLowerCase().includes(abilitySearchData.value.toLowerCase())
    )
)

const selectedKeyword = ref({});    // 记录某行哪一个关键字被选择了，防止每次打开表后不进行操作会导致原数据丢失

const selectedAbility = ref({});    // 记录某行哪一个能力被选择了，防止每次打开表后不进行操作会导致原数据丢失

const openedKeywordPop = ref(null);     // 记录哪行的关键字表被打开了

const openedAbilityPop = ref(null);     // 记录哪行的能力表被打开了

/*************数据初始化**************/

onMounted(() => {
    getKWAData();
});

const getKWAData = () => {
    request.evaluation.get('/evaluation/kwadict').then((res) => {
        if (res.code === 200) {
            tableData.value = res.data;
            initialize();
            // console.log(tableData.value);
        }
        else {
            ElMessage.error(res.msg);
        }
    }).catch((error) => {
        ElMessage.error('获取KWA失败' + error);
    });
};

const initialize = () => {
    inputRefs.value = {};
    tableSelected.value = [];

    tableData.value.forEach((item) => {
        item.keywordPopVisible = false;
        item.abilityPopVisible = false;
        item.editingDatavalue = false;
        item.datavalue = Number(item.datavalue).toFixed(2);

        // if (!courseid.value) {
        //     courseid.value = item.courseid;
        // }

        if (item.name.includes('新建KWA')) {
            if (item.name.length > 5) {
                let num = '';
                for (let i = 6; item.name[i] !== ')'; i++) {
                    num += item.name[i];
                }
                if (nullKWANum.value < Number(num)) nullKWANum.value = Number(num);
            }
            else if (item.name.length === 5 && nullKWANum.value === 0) nullKWANum.value++;
        }
    });
};

/*****************KWA表函数*****************/
const handleClick = (row, field) => {
    nextTick(() => {
        tempRowData.value = Object.assign({}, row.row);     // 存一份修改之前的数据用作比对
        row.row[field] = true
        setTimeout(() => {
            if (inputRefs.value[row.row.id] && inputRefs.value[row.row.id].$refs.input) {
                inputRefs.value[row.row.id].$refs.input.focus();
            }
        }, 0);
    });
};

const handleBlur = (row, field) => {
    row.row[field] = false;
    row.row.datavalue = Number(row.row.datavalue).toFixed(2);
    if ((row.row.abilityid && row.row.keywordid) && !_.isEqual(tempRowData.value, row.row)) {
        // 当数据发生改变了再传数据给后端
        request.evaluation.post('/evaluation/kwadict', row.row).then((res) => {
            if (res.code === 200) {
                getKWAData();
                ElMessage.success('修改成功');
            }
            else {
                ElMessage.error('res.msg');
            }
        }).catch((error) => {
            ElMessage.error('修改失败' + error);
        })
    }
};

const inputRefs = ref({});

const setInputRef = (el, row) => {
    if (el) {
        inputRefs.value[row.row.id] = el;
    }
};

const addKWA = () => {      // 新增KWA
    nullKWANum.value++;

    tableData.value.push({
        id: '',
        name: nullKWANum.value > 1 ? '新建KWA(' + nullKWANum.value + ')' : '新建KWA',
        keywordid: '',
        abilityid: '',
        keywordname: '',
        abilityname: '',
        courseid: courseid.value,
        datavalue: Number(0.00).toFixed(2),
        keywordPopVisible: false,
        abilityPopVisible: false,
        editingDatavalue: false,
    });
    ElMessage.warning({
        message: '新建的行仅当关键字和能力都不为空时才能被保存！',
        duration: 5000
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
    if (!tableSelected.value.length) {
        ElMessage({
            type: 'warning',
            message: '未选择KWA',
            duration: 800
        });
        return;
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
        // console.log(tableSelected.value);
        let deletedIds = [];
        tableSelected.value.forEach((item) => {
            deletedIds.push(item.id);
        })
        // console.log(deletedIds);

        request.evaluation.post('/evaluation/kwadict/delete', deletedIds).then((res) => {
            if (res.code === 200) {
                getKWAData();
                ElMessage.success('删除成功');
            }
            else {
                ElMessage.error(res.msg);
            }
        }).catch((error) => {
            ElMessage.error('删除失败' + error);
        })

    }).catch(() => {
        // 取消删除
    });
};

const createNewKWA = (data) => {
    request.evaluation.post('/evaluation/kwadict/create', data).then((res) => {
        if (res.code === 200){
            getKWAData();
            ElMessage.success('新增成功');
        }
        else {
            ElMessage.error(res.msg);
        }
    }).catch((error) => {
        ElMessage.error('新增失败' + error);
    })
}

/*******************************************/


/**************关键字表格的函数***************/
const openKeywordDictionary = (row) => {
    // console.log(row.row);
    if (openedKeywordPop.value) openedKeywordPop.value.keywordPopVisible = false;    // 关掉其他打开的popover
    if (openedAbilityPop.value) openedAbilityPop.value.abilityPopVisible = false;
    keywordSearchData.value = '';
    row.row.keywordPopVisible = true;
    openedKeywordPop.value = row.row;
    openedAbilityPop.value = null;

    request.evaluation.get(`/evaluation/kwadict/getKeyworddict?courseid=${courseid.value}`).then((res) => {
        if (res.code === 200) {
            keywordData.value = res.data;

            let selectedKeywordIndex = -1;  // 记录当前显示的关键字在关键字表中的下标
            for (let i = 0; i < keywordData.value.length; i++) {
                if (keywordData.value[i].id === row.row.keywordid) {
                    selectedKeyword.value = keywordData.value[i];    // 保存当前用户选择的关键字，防止用户不进行操作导致表格单元置空
                    selectedKeywordIndex = i;
                }
            }
            // 每次打开关键字表格高亮已经被选择的关键字
            keywordHighLightRow.value!.setCurrentRow(keywordData.value[selectedKeywordIndex]);
        }
        else {
            ElMessage.error(res.msg);
        }
    }).catch((error) => {
        ElMessage.error('获取课程关键字失败' + error);
    })

}

const chooseKeyword = (row, column, cell, event) => {
    selectedKeyword.value = row;
    // console.log(row);
};

const setKeyword = (row) => {
    let created = false;    // 判断该行数据是否在数据库里
    if(row.row.abilityid && row.row.keywordid) created = true;  // 如果当前行的关键字和能力在选择前不为空则说明这条数据存在于数据库中

    const oldKeyword = row.row.keywordname;
    row.row.keywordname = selectedKeyword.value.name;
    row.row.keywordid = selectedKeyword.value.id;
    if (row.row.keywordname || row.row.abilityname) row.row.name = row.row.keywordname + '-' + row.row.abilityname;
    if (row.row.abilityid && row.row.keywordid) {
        if(!created){
            createNewKWA(row.row);
        }
        else if (created && oldKeyword !== row.row.keywordname) {
            // 数据变化了再传给后端
            // console.log(row.row);
            request.evaluation.post('/evaluation/kwadict', row.row).then((res) => {
                if (res.code === 200) {
                    getKWAData();
                    ElMessage.success('修改成功');
                }
                else {
                    ElMessage.error(res.msg);
                }
            }).catch((error) => {
                ElMessage.error('保存失败' + error);
            })
        }
    }
    selectedKeyword.value = {};
    row.row.keywordPopVisible = false;
};

const keywordHighLightRow = ref<InstanceType<typeof ElTable>>()

/*******************************************/


/**************能力表格的函数***************/
const abilityHighLightRow = ref<InstanceType<typeof ElTable>>();

const openAbilityDictionary = (row) => {    // 打开能力弹框
    // console.log(row.row)
    if (openedKeywordPop.value) openedKeywordPop.value.keywordPopVisible = false;    // 关掉其他打开的popover
    if (openedAbilityPop.value) openedAbilityPop.value.abilityPopVisible = false;
    abilitySearchData.value = '';
    row.row.abilityPopVisible = true;
    openedKeywordPop.value = null;
    openedAbilityPop.value = row.row;

    request.evaluation.get(`/evaluation/kwadict/getabilitydict?courseid=${courseid.value}`).then((res) => {
        if (res.code === 200) {
            abilityData.value = res.data;
            // console.log(abilityData.value);
            let selectedAbilityIndex = -1;  // 记录当前显示的能力在能力表中的下标
            for (let i = 0; i < abilityData.value.length; i++) {
                if (abilityData.value[i].id === row.row.abilityid) {
                    selectedAbility.value = abilityData.value[i]; // 保存当前选择的能力，以防止用户不进行任何操作关闭弹框导致表格单元置空
                    selectedAbilityIndex = i;
                }
            }
            // 每次打开能力表格高亮已经被选择的能力
            abilityHighLightRow.value!.setCurrentRow(abilityData.value[selectedAbilityIndex]);
        }
        else {
            ElMessage.error(res.msg);
        }
    }).catch((error) => {
        ElMessage.error('获取课程能力失败' + error);
    })


}

const chooseAbility = (row) => {   // 记录哪个能力被选择
    selectedAbility.value = row;
    // console.log(row.name);
};

const setAbility = (row) => {   // 点击确定后将选择的能力赋值给KWA表数据
    let created = false;    // 判断该行数据是否在数据库里
    if(row.row.abilityid && row.row.keywordid) created = true;  // 如果当前行的关键字和能力在选择前不为空则说明这条数据存在于数据库中

    const oldAbilityName = row.row.abilityname;
    row.row.abilityname = selectedAbility.value.name;
    row.row.abilityid = selectedAbility.value.id;
    if (row.row.keywordname || row.row.abilityname) row.row.name = row.row.keywordname + '-' + row.row.abilityname;
    // console.log(row.row);
    if (row.row.abilityid && row.row.keywordid) {
        if(!created) {
            createNewKWA(row.row);
        }
        else if (created && oldAbilityName !== row.row.abilityname) {
            // 数据变化了再传给后端
            request.evaluation.post('/evaluation/kwadict', row.row).then((res) => {
                if (res.code === 200) {
                    getKWAData();
                    ElMessage.success('修改成功');
                }
                else {
                    ElMessage.error(res.msg);
                }
            }).catch((error) => {
                ElMessage.error('保存失败' + error);
            })
        }
    }
    selectedAbility.value = {};
    row.row.abilityPopVisible = false;
};

/*******************************************/

</script>

<style scoped>
.edit-icon {
    cursor: pointer;
}
</style>