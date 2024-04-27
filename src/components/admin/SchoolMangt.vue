<template>
    <el-container style="height: 92vh; width: 100%; text-align: left;
            background-color: white; color: #000000">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
            <el-button type="success" v-blur-on-click style="margin-left: 0.8vw;">保存</el-button>
        </el-header>

        <el-main style="padding: 0; display: flex; align-items: center; flex-direction: column;">
            <el-form :model="form" label-width="auto" style="width: 50vw; margin-top: 6vh;">
                <el-form-item label="请输入学校名称">
                    <el-input v-model="form.obsname" placeholder="请输入学校名称" @blur="modifyObsName" />
                </el-form-item>

                <el-form-item label="学校备注">
                    <el-input v-model="form.remark" placeholder="请输入学校备注" @blur="modifyRemark" />
                </el-form-item>

                <el-form-item>
                    <el-text style="color: #000000;" size="large">
                        <b>学校级别构成配置</b>
                    </el-text>
                </el-form-item>

                <el-form-item>
                    <el-table :data="form.stLevelList" style="width: 100%; height: 334px;" border stripe>
                        <el-table-column label="序号" align="center">
                            <template v-slot="row">
                                {{ row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="级别" align="center">
                            <template v-slot="row">
                                <el-input v-if="row.row.editingLevelName" :ref="el => setInputRef(el, row.row)"
                                    v-model="row.row.levelname" style="width: 100%; height: 30px;"
                                    @blur="handleBlur(row.row, 'editingLevelName')" />
                                <div v-else style="width: 100%; height: 25px;"
                                    @dblclick="handleClick(row.row, 'editingLevelName')">
                                    {{ row.row.levelname }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否启用" align="center">
                            <template v-slot="row">
                                <el-switch v-model="row.row.obsdeep" class="ml-2" @change="changeObsdeep(row.row)"
                                    :disabled="row.row.teacher || row.row.student"
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                            </template>
                        </el-table-column>
                        <el-table-column label="教师所在级别" align="center">
                            <template v-slot="row">
                                <el-checkbox v-model="row.row.teacher" @change="changeTeacherLevel(row.row)"
                                    :disabled="!row.row.obsdeep"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="学生所在级别" align="center">
                            <template v-slot="row">
                                <el-checkbox v-model="row.row.student" @change="changeStudentLevel(row.row)"
                                    :disabled="!row.row.obsdeep"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </el-main>

    </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import _ from 'lodash';
import { nextTick, onMounted, ref } from 'vue';
import request from '../../utils/request';

const form = ref({
    id: '',
    obsname: '北方工业大学',
    remark: '大专',
    stLevelList: [
        {
            id: '',
            levelname: '学校',
            obsdeep: 0,
            teacher: '0',
            student: '0'
        },
        {
            id: '',
            levelname: '学院',
            obsdeep: 0,
            teacher: '0',
            student: '0'
        },
        {
            id: '',
            levelname: '系',
            obsdeep: 0,
            teacher: '0',
            student: '0'
        },
        {
            id: '',
            levelname: '专业',
            obsdeep: 0,
            teacher: '0',
            student: '0'
        },
        {
            id: '',
            levelname: '班级',
            obsdeep: 0,
            teacher: '0',
            student: '0'
        },
        {
            id: '',
            levelname: '小组',
            obsdeep: 0,
            teacher: '0',
            student: '0'
        },
    ]
});

const form_backup = ref({});

const selectedTeacherLevel = ref(null);     // 记录哪个级别为教师所在

const selectedStudentLevel = ref(null);     // 记录哪个级别为学生所在

const tempRowData = ref({});

const inputRefs = ref({});

let map = new Map([
    ['0', false],
    ['1', true],
    [false, '0'],
    [true, '1']
]);

onMounted(() => {
    // initialize();
    getData();
})

/*********************初始化数据*******************/

const getData = () => {
    request.admin.get('/sysmangt/schoolmangt').then((res) => {
        if (res.code === 200) {
            form.value = res.data;
            initialize();
        }
        else {
            ElMessage.error(res.msg);
        }
    }).catch((error) => {
        ElMessage.error('获取学校信息失败' + error);
    })
}

const initialize = () => {
    // console.log('init')
    inputRefs.value = {};

    form.value.stLevelList.forEach((item) => {
        item.editingLevelName = false;
        item.teacher = map.get(item.teacher);
        item.student = map.get(item.student);
        item.obsdeep = item.obsdeep ? true : false;
        if(item.teacher) selectedTeacherLevel.value = item;
        if(item.student) selectedStudentLevel.value = item;
    })

    form_backup.value = _.cloneDeep(form.value);
}

/*************************************************/

const changeSchoolConfig = (postData) => {
    request.admin.post('/sysmangt/schoolmangt/update', postData).then((res) => {
        if (res.code === 200) {
            getData();
        }
        else {
            ElMessage.error(res.msg);
        }
    }).catch((error) => {
        ElMessage.error('修改失败' + error);
    });
}

const changeObsnameOrRemark = (postData) => {
    request.admin.post('/sysmangt/schoolmangt', postData).then((res) => {
        if (res.code === 200) {
            getData();
            ElMessage.success('修改成功');
        }
        else {
            ElMessage.error(res.msg);
        }
    }).catch((error) => {
        ElMessage.error('修改失败' + error);
    })
}

/*************************控制显示输入框********************/

const setInputRef = (el, row) => {
    if (el) {
        inputRefs.value[row.id] = el;
    }
};

const handleClick = (row, field) => {
    nextTick(() => {
        tempRowData.value = Object.assign({}, row);     // 存一份修改之前的数据用作比对
        row[field] = true;
        setTimeout(() => {
            if (inputRefs.value[row.id] && inputRefs.value[row.id].$refs.input) {
                inputRefs.value[row.id].$refs.input.focus();
            }
        }, 0);
    });
};

const handleBlur = (row, field) => {
    row[field] = false;
    if (field === 'editingLevelName') {
        if (row.levelname === '') {
            row.levelname = tempRowData.value.levelname;
            return;
        }

        const postData = {
            id: row.id,
            levelname: row.levelname
        };
        console.log(postData);

        changeSchoolConfig(postData);
    }
};

/***********************************************************/


const modifyObsName = () => {       // 修改学校名称
    if (form.value.obsname === '') {
        form.value.obsname = form_backup.value.obsname;
        return;
    }
    else if(form.value.obsname === form_backup.value.obsname) return ;      // 数据未更改

    const postData = {
        id: form.value.id,
        obsname: form.value.obsname
    };
    console.log(postData);
    changeObsnameOrRemark(postData);
}

const modifyRemark = () => {       // 修改学校备注
    if(form.value.remark === form_backup.value.remark) return ;     // 数据未更改
    const postData = {
        id: form.value.id,
        remark: form.value.remark
    };
    console.log(postData);
    changeObsnameOrRemark(postData);
}

const changeObsdeep = (row) => {        // 修改某个级别是否启用
    let obsdeep = 1;
    if (!row.obsdeep) {
        obsdeep = -1;
    }

    const postData = {
        id: row.id,
        obsdeep
    }
    console.log(postData);
    changeSchoolConfig(postData);
}


/**********************改变勾选框时触发*********************/

const changeTeacherLevel = (row) => {
    // console.log(form.value.stLevelList)
    if (selectedTeacherLevel.value) {   // 只能单选一个所在级别
        if (selectedTeacherLevel.value === row) {       // 不允许取消勾选
            row.teacher = true;
            return;
        }
        selectedTeacherLevel.value.teacher = false;
    }
    selectedTeacherLevel.value = row;

    const postData = {
        id: row.id,
        teacher: map.get(row.teacher)
    };
    console.log(postData);

    changeSchoolConfig(postData);
}

const changeStudentLevel = (row) => {
    // console.log(form.value.stLevelList)
    if (selectedStudentLevel.value) {   // 只能单选一个所在级别
        if (selectedStudentLevel.value === row) {       // 不允许取消勾选
            row.student = true;
            return;
        }
        selectedStudentLevel.value.student = false;
    }
    selectedStudentLevel.value = row;

    const postData = {
        id: row.id,
        student: map.get(row.student)
    };
    console.log(postData);

    changeSchoolConfig(postData);
}

/**********************************************************/

</script>

<style scoped></style>