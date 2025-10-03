<template>
  <el-header
    style="height: auto; padding: 5px 0px; width: 100%; background-color: #fff; display: flex"
  >
    <div class="searchInput">
      <el-input
        v-model.lazy="search"
        @input="debouncedQuerySearch"
        placeholder="输入属性名进行检索"
        class="input-with-select"
        style="width: 200px; margin-right: 0.8vw"
      ></el-input>
      <el-button type="primary" @click="querySearch">搜索</el-button>
    </div>
    <el-popover
      class="box-item"
      content="Left Top prompts info"
      placement="left-start"
      trigger="click"
      @hide="handelAdd"
    >
      <template #reference>
        <el-button type="success" style="margin-left: 0.8vw">新增</el-button>
      </template>
      <el-input class="mb-2" v-model="addData.typeName" placeholder="类别名称" />
      <el-input class="mb-2" v-model="addData.remark" placeholder="备注" />
      <el-input v-model="addData.score" placeholder="分数" />
    </el-popover>
    <el-button @click="handleDelAll" type="danger" style="margin-left: 0.8vw">删除</el-button>
  </el-header>

  <div v-if="!typeList.length">暂无数据</div>
  <div v-else>
    <el-table
      v-loading="loading"
      :data="typeList"
      @select="handleSelect"
      @selectAll="handleSelectAll"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="考核项类别">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.categoryName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.categoryDescription }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总分">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.score }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-popover
            class="box-item"
            content="Left Top prompts info"
            placement="left-start"
            trigger="click"
            @hide="handleHide(scope)"
            @show="
              () => {
                updateData.remark = scope.row.categoryDescription;
                updateData.typeName = scope.row.categoryName;
                updateData.score = scope.row.score;
              }
            "
          >
            <template #reference>
              <el-button size="small"> 修改 </el-button>
            </template>
            <el-input class="mb-2" v-model="updateData.typeName" placeholder="属性名" />
            <el-input class="mb-2" v-model="updateData.remark" placeholder="备注" />
            <el-input v-model="updateData.score" placeholder="分数" />
          </el-popover>
          <el-button size="small" type="danger" @click="handleDelete(scope)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import useEvaluationNew from '../../../../stores/useEvaluationNew';
import parseJWT from '../../../../utils/parseJWT';
import { ElMessage } from 'element-plus';
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import _, { update } from 'lodash';

/* ********************变量定义******************** */
// props定义
// 普通变量
// pinia状态管理
const loading = ref(false);
const search = ref('');
const delList = ref([]);
const evaluationStore = useEvaluationNew();
const { fetchType, fetchAddType, fetchDelList, fuzzyQuery, fetchUpdateType } = evaluationStore;
const { typeList } = storeToRefs(evaluationStore);
const courseId = parseJWT(sessionStorage.getItem('token')).obsid;
const addData = reactive({
  typeName: '',
  remark: '',
  score: 0
});
const updateData = reactive({
  typeName: '',
  remark: '',
  score: 0
});

const debouncedQuerySearch = _.debounce(() => {
  querySearch();
}, 500);

const querySearch = async () => {
  if (search.value.length >= 1 || search.value.length === 0) {
    loading.value = true;
    await fuzzyQuery({
      fuzzyQuery: true,
      categoryName: search.value,
      courseId: addData.courseId
    });
    loading.value = false;
  }
};

const handleHide = async scope => {
  if (
    updateData.remark === scope.row.categoryDescription &&
    updateData.typeName === scope.row.categoryName &&
    updateData.score === scope.row.score
  ) {
    ElMessage({
      type: 'info',
      message: '暂无修改'
    });
    return;
  }
  updateData.id = scope.row.id;
  if (updateData.typeName === scope.row.categoryName) {
    delete updateData.typeName;
  }
  const score = Number(updateData.score);
  if (!(score > 0 && score <= 100)) {
    ElMessage({
      type: 'warning',
      message: '分数应在0-100之间'
    });
    return;
  }
  const data = await fetchUpdateType({
    id: updateData.id,
    categoryName: updateData.typeName,
    categoryDescription: updateData.remark,
    score: updateData.score
  });
  await fetchType({ courseId, current: 1, size: -1 });
  if (data.code === 200) return ElMessage.success('修改成功');
  ElMessage.error(msg);
};

const handleSelect = selection => {
  delList.value = selection.map(i => i.id);
  console.log(delList.value);
};

const handleSelectAll = selection => {
  delList.value = selection.map(i => i.id);
  console.log(delList.value);
};

const handleDelAll = async () => {
  if (!delList.value.length) {
    ElMessage.info('未选择类型名');
    return;
  }
  const data = await fetchDelList({ idList: delList.value });
  if (data.msg === 'success') {
    await fetchType({ courseId, current: 1, size: -1 });
    ElMessage.success('删除成功');
    return;
  }
  ElMessage.error('删除失败');
};

const handleDelete = async scope => {
  console.log(scope);
  let delList = [scope.row.id];
  const data = await fetchDelList({ idList: delList });
  if (data.msg === 'success') {
    await fetchType({ courseId, current: 1, size: -1 });
    return ElMessage.success('删除成功');
  }
  ElMessage.error('删除失败');
};

const handelAdd = async () => {
  const score = Number(addData.score);
  if (!(addData.typeName && addData.score && score > 0 && score <= 100)) {
    ElMessage({
      type: 'warning',
      message: '考核项类型名称，考核项类型总分不可为空，且数据总分应在0-100之间'
    });
    return;
  }

  const res = await fetchAddType({
    courseId,
    categoryName: addData.typeName,
    categoryDescription: addData.remark,
    score
  });
  if (res.msg === 'success') {
    ElMessage({
      type: 'success',
      message: '添加成功'
    });
  } else {
    ElMessage({
      type: 'error',
      message: res
    });
  }
  await fetchType({ courseId, current: 1, size: -1 });
};

onMounted(async () => {
  await fetchType({ courseId, current: 1, size: -1 });
});

/* ********************方法定义******************** */
</script>

<style lang="less" scoped></style>
