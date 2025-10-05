<template>
    <div style="height: 75vh; overflow: auto;">
        <div>指定助教</div>
        <div class="div-line"></div>
        <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between;">
            <el-input v-model="searchData" style="width: 30%; height: 33px;">
                <template #suffix>
                    <div style="height: 25px; width: 25px; border-radius: 7px; background-color: rgb(39, 165, 255); color: white;
                        font-size: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
                        @click="handleSearch">
                        <el-icon>
                            <Search />
                        </el-icon>
                    </div>
                </template>
            </el-input>
            <div class="buttons">
                <el-button type="primary" :icon="Finished">保存</el-button>
                <el-button type="danger" :icon="Close">取消</el-button>
            </div>
        </div>

        <el-table :data="tableData" style="margin-top: 20px; height: 80%">
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" label="序号" prop="num"></el-table-column>
            <el-table-column align="center" label="姓名" prop="name"></el-table-column>
            <el-table-column align="center" label="角色" prop="role"></el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { Close, Finished, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';

const searchData = ref(null);

const handleSearch = () => {
    if(!searchData.value) return ;
    console.log(searchData.value);
}

const tableData = ref([
    {
        num: 1,
        name: 'zxw',
        role: 'admin'
    },
    {
        num: 2,
        name: 'zsx',
        role: 'superAdmin'
    },
    {
        num: 3,
        name: 'zxr',
        role: 'student'
    },
])
</script>

<style scoped>
.div-line {
    border: 1px solid rgb(147, 210, 255);
    margin-top: 15px;
}

.el-input>>>.el-input__wrapper {
    background-color: rgb(249, 249, 249);
    /* border: 1px solid rgb(210, 210, 210); */
}

.el-button {
    border-radius: 7px;
    height: 25px;
    color: white;
}

.el-table {
    border-radius: 10px;
}

.el-table>>>th {
    background-color: rgb(240, 249, 255);
    border-bottom: 1px solid rgb(140, 207, 255);
}

.el-table>>>.el-table__header {
    border-bottom: 2px solid rgb(140, 207, 255);
}

.el-table>>>.el-table__cell {
    color: black;
    font-weight: normal;
}

/* 表格中勾选框未被选择时的样式 */
.el-table >>> .el-checkbox__inner {
    border: 1px solid rgb(39, 165, 255);
    border-radius: 4px;
    background-color: rgb(233, 246, 255);
}

/* 表格中勾选框被勾选的样式 */
.el-table >>> .el-checkbox.is-checked .el-checkbox__inner {
    border: 1px solid rgb(39, 165, 255);
    border-radius: 4px;
    background-color: dodgerblue;
}

/* 表头的勾选框在表体部分行被勾选时的样式 */
.el-table >>> .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border: 1px solid rgb(39, 165, 255);
    border-radius: 4px;
    background-color: dodgerblue;
}
</style>