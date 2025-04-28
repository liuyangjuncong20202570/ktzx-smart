<template>
    <!-- 题类型弹窗组件 -->
    <el-dialog class="search" v-model="dialogVisible" title="搜索" width="80%">
        <el-form ref="ruleFormRef" :model="ruleForm" label-width="auto" class="demo-ruleForm"
            :size="formSize" status-icon>

            <el-form-item label="题型选择" prop="queTypeIds">
                <el-select clearable v-model="ruleForm.queTypeIds" placeholder="请选择">
                    <el-option v-for="(item, i) in typeList" :key="i" :label="item.name" :value="item.queTypeId" />
                </el-select>
            </el-form-item>

            <el-form-item label="题库" prop="libType">
                <el-radio-group @change="(() => {
                    ruleForm.queTypeIds = ''
                    selectedTableData = []
                    tableData = []
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
        <el-tabs type="border-card">
            <el-tab-pane label="搜索结果">
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
                    <el-table-column label="课堂" property="classroomName" />
                </el-table>

                <div class="pagination flex-end">
                    <el-pagination :currentPage="ruleForm.pageIndex" :page-size="ruleForm.pageSize"
                        :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    已选
                    <span style="color: red;">({{ selectedTableData.length }})</span>
                </template>
                <el-table :data="selectedTableData" style="width: 100%">
                    <!-- <el-table-column type="selection" /> -->
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
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button
                                size="small"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
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
import { ElMessage, ElMessageBox } from 'element-plus'
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
const selectedTableData = ref([])
const multipleTableRef = ref(null)

const init = () => {
    handleOpen()
    getCourseLibTypeList()
    nextTick(() => {
        resetForm()
        multipleTableRef.value?.clearSelection()
        selectedTableData.value = []
        tableData.value = []
    })
}

const handleDelete = (index, row) => {
    ElMessageBox.confirm(
        '确定删除吗?',
        '提示',
    {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }
    ).then(() => {
        selectedTableData.value.splice(index, 1)
        const idx = multipleSelection.value.findIndex((item) => item.id === row.id)
        if (idx != -1) {
            const selectItem = multipleSelection.value[idx]
            multipleSelection.value.splice(idx, 1)
            nextTick(() => {
                multipleTableRef.value.toggleRowSelection(selectItem, undefined)
            })
        }
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
    }).catch(() => { })
}

const handleSelectionChange = (val) => {
  console.log('val', val)
  multipleSelection.value = val
  // 已选
  const selectIds = selectedTableData.value.map((item) => item.id)
  multipleSelection.value.forEach((item) => {
    if (selectIds.indexOf(item.id) === -1) {
        selectedTableData.value.push({ ...item })
    }
  })
}

const kwaEvent = (val) => {
    console.log('val', val)
    const { abilityIds = [], keyIds = [] } = val || {}
    console.log('???', abilityIds, abilityIds)
    ruleForm.value.abilityIds = abilityIds
    ruleForm.value.keyIds = keyIds
    // selectedTableData.value = []
    // tableData.value = []
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
    teskSearch({...ruleForm.value, pagerId: route.query.id, queTypeIds: ruleForm.value.queTypeIds ? [ruleForm.value.queTypeIds] : []}).then(res => {
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
        libIds: selectedTableData?.value.map((item) => item.id),
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