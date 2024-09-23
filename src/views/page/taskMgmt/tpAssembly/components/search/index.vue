<template>
    <!-- 题类型弹窗组件 -->
    <el-dialog class="search" v-model="dialogVisible" title="搜索" width="80%">
        <el-form ref="ruleFormRef" :model="ruleForm" label-width="auto" class="demo-ruleForm"
            :size="formSize" status-icon>

            <el-form-item label="题型选择" prop="queTypeId">
                <el-select clearable v-model="ruleForm.queTypeId" placeholder="请选择">
                    <el-option v-for="(item, i) in typeList" :key="i" :label="item.name" :value="item.queTypeId" />
                </el-select>
            </el-form-item>

            <el-form-item label="题库" prop="libType">
                <el-radio-group @change="(() => {
                    ruleForm.queTypeId = ''
                    getCourseLibTypeList()
                })" v-model="ruleForm.libType">
                    <el-radio :label="1">课程题库</el-radio>
                    <el-radio :label="2">课堂题库</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="kwa">
                <Kwa ref="kwaRef" type="taskKwa" @kwa-event="kwaEvent" />
            </el-form-item>

            <el-form-item label="题号索引" prop="libNo">
                <el-input v-model="ruleForm.libNo" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="题目标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="请输入" />
            </el-form-item>

            <el-form-item>
                <div class="flex-end" style="width: 100%;">
                    <el-button type="primary" @click="submitForm">搜索</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </div>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTableRef" :data="tableData" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column property="libNo" label="题号" width="120" />
            <el-table-column property="title" label="题目概要" />
            <el-table-column property="questionTypeId" label="题型">
                <template #default="scope">
                    {{ TOPICTYPE[scope.row.questionTypeId] }}
                </template>
            </el-table-column>
            <!-- <el-table-column label="难度" property="Address" /> -->
            <el-table-column label="课程" property="courseName" />
            <el-table-column label="课堂" property="className" />
        </el-table>

        <div class="pagination flex-end">
            <el-pagination :currentPage="ruleForm.pageIndex" :page-size="ruleForm.pageSize"
                :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <template #footer>
            <div class="flex-end">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { teskSearch, searchToPaper, queType } from '@/api/taskMgmt.js'
import Kwa from '@/components/kwa/index.vue'
import { TOPICTYPE } from '@/utils/consts.js'
const route = useRoute();

const emit = defineEmits(['child-event'])
const ruleForm = ref({
    pageIndex: 1,
    pageSize: 20,
    libType: 1
})
const dialogVisible = ref(false)
const ruleFormRef = ref(null)
const typeList = ref([])
const kwaRef = ref(null)
const tableData = ref([])
const total = ref(0)
const multipleSelection = ref([])

const init = () => {
    handleOpen()
    getCourseLibTypeList()
    nextTick(() => {
        resetForm()
    })
}

const handleSelectionChange = (val) => {
  console.log('val', val)
  multipleSelection.value = val
}

const kwaEvent = (val) => {
    const { abilityIds = [], keyIds = [] } = val || {}
    console.log('???', abilityIds, abilityIds)
    ruleForm.value.abilityIds = abilityIds
    ruleForm.value.keyIds = keyIds
    console.log(val)
}

const submitForm = () => {
    console.log('ruleForm', ruleForm.value)
    getTeskSearch()
}

const handleSizeChange = (val) => {
    ruleForm.value.pageSize = val
    getTeskSearch()
    console.log(`${val} items per page`)
}

const handleCurrentChange = (val) => {
    ruleForm.value.pageIndex = val
    getTeskSearch()
    console.log(`current page: ${val}`)
}

const getTeskSearch = () => {
    teskSearch({...ruleForm.value, pagerId: route.query.id}).then(res => {
        console.log('res', res)
        if (res.code === '200') {
            const { recordSize, data } = res.data || {}
            total.value = recordSize
            tableData.value = data
        }
    })
}

const resetForm = () => {
    if (!ruleFormRef.value) return
    ruleFormRef.value.resetFields()
    kwaRef.value.init()
}

const getCourseLibTypeList = () => {
    const type = ruleForm.value.libType === 1 ? 'course' : 'classroom'
    queType(type).then(res => {
        if (res.code === '200') {
            typeList.value = res?.data
        }
    })
}

const save = () => {
    const data = {
        libIds: multipleSelection?.value.map((item) => item.id),
        pagerId: route.query.id
    }
    searchToPaper(data).then(res => {
        if (res.code === '200') {
            ElMessage.success('添加成功')
            emit('save')
            handleClose()
        }
    })
}

const handleOpen = () => {
    dialogVisible.value = true
}

const handleClose = () => {
    dialogVisible.value = false
}

// 导出函数
defineExpose({
    init,
})
</script>

<style scoped>
/* .search .el-form-item {
    width: 45%;
} */
.pagination {
    margin-top: 20px;
}
</style>