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
      <el-input class="mb-2" v-model="addData.vname" placeholder="属性名" />
      <el-input v-model="addData.remark" placeholder="备注" />
    </el-popover>
    <el-button @click="handleDelAll" type="danger" style="margin-left: 0.8vw">删除</el-button>
  </el-header>
  <div v-if="!IdealogyStore.ideaList">暂无数据</div>
  <div v-else>
    <el-table
      v-loading="loading"
      :data="IdealogyStore.ideaList"
      @select="handleSelect"
      @selectAll="handleSelectAll"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="属性">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.vname }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.remark }}</span>
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
                updateData.remark = scope.row.remark;
                updateData.vname = scope.row.vname;
              }
            "
          >
            <template #reference>
              <el-button size="small"> 修改 </el-button>
            </template>
            <el-input class="mb-2" v-model="updateData.vname" placeholder="属性名" />
            <el-input v-model="updateData.remark" placeholder="备注" />
          </el-popover>
          <el-button size="small" type="danger" @click="handleDelete(scope)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, reactive, computed, onMounted } from 'vue';
import useIdealogy from '../../stores/useIdealogy';
import { ElMessage } from 'element-plus';
import parseJWT from '@/utils/parseJWT.js';
/* ********************变量定义******************** */
const search = ref('');
const loading = ref(false);
const updateData = reactive({
  id: '',
  vname: '',
  remark: '',
  courseId: ''
});

const delList = ref([]);

const addData = reactive({
  vname: '',
  remark: '',
  courseId: ''
});
// props定义
// 普通变量
// pinia状态管理
const IdealogyStore = useIdealogy();

/* ********************方法定义******************** */
const debouncedQuerySearch = _.debounce(() => {
  querySearch();
}, 500);

const querySearch = async () => {
  if (search.value.length >= 1 || search.value.length === 0) {
    loading.value = true;
    await IdealogyStore.fetchFuzzyQuery({
      fuzzyQuery: true,
      vname: search.value,
      courseId: addData.courseId
    });
    loading.value = false;
  }
};

const handleSelect = selection => {
  delList.value = selection.map(i => i.id);
  console.log(delList.value);
};

const handleSelectAll = selection => {
  delList.value = selection.map(i => i.id);
  console.log(delList.value);
};

const handleDelete = async scope => {
  let delList = [scope.row.id];
  const { data } = await IdealogyStore.fetchDelIdea(delList);
  if (data) {
    await IdealogyStore.fetchIdeaList();
    return ElMessage.success('删除成功');
  }
  ElMessage.error('删除失败');
};

const handleDelAll = async () => {
  if (!delList.value.length) {
    ElMessage.info('未选择属性');
    return;
  }
  const { data } = await IdealogyStore.fetchDelIdea(delList.value);
  if (data) {
    await IdealogyStore.fetchIdeaList();
    ElMessage.success('删除成功');
    return;
  }
  ElMessage.error('删除失败');
};

const handelAdd = async () => {
  if (addData.vname === '') {
    ElMessage.info('属性名不能为空');
    return;
  }
  const { code, msg } = await IdealogyStore.fetchAddIdea(addData);
  if (code === 200) {
    await IdealogyStore.fetchIdeaList();
    return ElMessage.success('新增成功');
  }
  ElMessage.error(msg);
};

const handleHide = async scope => {
  if (updateData.remark === scope.row.remark && updateData.vname === scope.row.vname) {
    ElMessage({
      type: 'info',
      message: '暂无修改'
    });
    return;
  }
  updateData.id = scope.row.id;
  if (updateData.vname === scope.row.vname) {
    delete updateData.vname;
  }
  const { code, msg } = await IdealogyStore.fetchUpdIdea(updateData);
  await IdealogyStore.fetchIdeaList();
  if (code === 200) return ElMessage.success('修改成功');
  ElMessage.error(msg);
};

onMounted(async () => {
  const token = parseJWT(sessionStorage.getItem('token'));
  loading.value = true;
  await IdealogyStore.fetchIdeaList(token.obsid);
  loading.value = false;
  addData.courseId = token.obsid;
  updateData.courseId = token.obsid;
});
</script>

<style lang="less" scoped></style>
