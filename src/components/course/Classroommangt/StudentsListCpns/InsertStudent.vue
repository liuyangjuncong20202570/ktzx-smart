<template>
  <div class="inner">
    <h2 style="margin-top: 0">请选择所需选课学生</h2>
    <div class="dropdown">
      <el-dropdown>
        <el-tree-select
          :props="defaultProps"
          node-key="id"
          v-model="valueStrictly"
          :data="listData"
          :expand-on-click-node="true"
          :check-on-click-node="false"
          multiple
          :render-after-expand="false"
          show-checkbox
          style="width: 300px"
          :render-content="renderContent"
          :placeholder="placeholderText"
          @node-click="nodeClick"
          @check-change="handleCheckChange"
        />
      </el-dropdown>
    </div>
    <el-button style="margin-right: 10px" @click="closeInserStudent">关闭</el-button>
    <!-- 添加内联样式 -->
    <el-button type="success" @click="submitUpload">上传</el-button>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { findNodebyId } from '@/utils/findNodebyId.js';
import { storeToRefs } from 'pinia';
import useTeacherInClass from '@/stores/useTeacherInClass.js';
import { testData, nameData } from '@/assets/js/testData.js';
import { ref, reactive, computed, onMounted, h } from 'vue';

const props = defineProps({
  classroomId: {
    type: String,
    required: true
  }
});

const listData = ref([]);

const TeacherInClassStore = useTeacherInClass();

const { organizationList, stuList } = storeToRefs(TeacherInClassStore);

const placeholderText = ref('请选择');

const currentobsId = ref('');

// TODO:在异步处理时，应将currentobsID获取以便找到对应班级的学生
const nodeClick = (data, node, event) => {
  // console.log(data.id);

  node.checked = !node.checked;

  currentobsId.value = data.id;
};

const nodeIds = ref([]);
const nodes = ref([]);
const handleCheckChange = async (node, nodeData) => {
  if (
    (!node.children || node.children.length === 0) &&
    (!node.studentDtos || node.studentDtos.length === 0)
  ) {
    // 选择相应的组织机构，其人员很多，所以使用数组进行存储
    if (nodeData) {
      // console.log(findNodebyId(listData.value, node.id));
      // // console.log(findNodebyId(listData.value, node.id));
      // // console.log(node.id);
      // // console.log(node.id);
      nodeIds.value.push(node.id);
      // nodes为存放节点数据的数组
      nodeIds.value.forEach(item => {
        const ret = findNodebyId(listData.value, item);
        nodes.value.push({
          classRoomId: props.classroomId,
          usersid: ret.usersid,
          obsid: ret.obsid,
          username: ret.username,
          obsname: ret.obsname,
          proname: ret.proname,
          loginname: ret.loginname
        });
      });
      console.log(nodes.value);
      // const res = await TeacherInClassStore.fetchInsertStudent(node.id);
      // if (res) {
      //   // console.log(res);
      //   findNodebyId(listData.value[0].children, node.id, res);
      //   // console.log(listData.value[0].children);
      // }
      // console.log(node);
    } else {
      nodeIds.value.pop(node.id);
    }
  }
};

// 批量导入学生
const submitUpload = async () => {
  const res = await TeacherInClassStore.importStudent(nodes.value);
  if (res.code === 200) {
    ElMessage.success('学生选课成功');
  } else {
    ElMessage.error('学生选课失败');
  }
  console.log(res);
};

const emits = defineEmits(['closeTab']);
const closeInserStudent = () => {
  emits('closeTab', false);
};

const defaultProps = {
  children: node => node.children || node.studentDtos, // 子节点字段
  label: node => (node.username ? node.username + ' ' + node.loginname : node.obsname) // 显示文本字段
};

const valueStrictly = ref();

onMounted(async () => {
  const res = await TeacherInClassStore.getSystemOrg();
  if (res.code === 200) {
    // console.log(ArrayVerify(stuList.value, organizationList.value));
    // console.log(organizationList.value);
    listData.value = organizationList.value;
  }
  // console.log(organizationList.value);
  // listData.value = organizationList.value;
  // console.log(ArrayVerify(stuList.value, organizationList.value));
});

// ***********数组处理*******************
const ArrayVerify = (arr1, arr2) => {
  return arr1.filter(item1 => !arr2.some(item2 => JSON.stringify(item1) === JSON.stringify(item2)));
};

// checked是否被选中
const renderContent = (h, { node, data }) => {
  // 判断是否为最后一个节点
  // const isLastChild = !node.childNodes.length;
  // if (isLastChild) {
  //   const renderDiv = useRender('div', { class: 'mydiv' }, ['This is a div created by h function']);
  // }
  // if (isAllChildrenChecked(node)) {
  //   // 如果所有子节点都被选中，只显示父节点的名称
  //   return h('span', null, data.name);
  // } else {
  //   // 否则，显示正常的节点名称
  //   return h('span', null, data.name);
  // }
  // console.log(node.childNodes);
};
</script>

<style lang="less" scoped>
.dropdown {
  margin-bottom: 15px;
  .table-container {
    height: 150px;
  }
  // :deep(.el-tree-node__expand-icon) {
  //   display: none !important;
  // }
}
</style>
