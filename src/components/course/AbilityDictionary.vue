<template>
  <el-container style="height: 92vh">
    <el-header
      style="
        height: auto;
        padding: 5px 0px;
        width: 100%;
        background-color: #deebf7;
        display: flex;
        align-items: center;
      "
    >
      <el-button type="primary" style="margin-left: 0.8vw" @click="exportData"
        >导出到Excel</el-button
      >
      <el-button type="danger" @click="changeTreeExpand" style="margin-left: 0.8vw"
        >全部展开/关闭</el-button
      >
      <el-button type="success" style="margin-left: 0.8vw">保存</el-button>
    </el-header>

    <el-main style="padding: 0">
      <div
        style="
          height: 25px;
          display: flex;
          justify-content: space-between;
          flex: auto;
          text-align: center;
          background-color: whitesmoke;
          min-width: 1190px;
          color: gray;
        "
      >
        <div style="min-width: 340px">名称</div>
        <div style="min-width: 850px; width: 59vw">
          <div style="display: flex; flex: auto; justify-content: space-between">
            <div
              style="
                width: 150px;
                border-right: 1px solid #bbbbbb;
                border-left: 1px solid #bbbbbb;
                color: gray;
              "
            >
              系数
            </div>
            <div style="min-width: 750px; width: 100%">备注</div>
          </div>
        </div>
      </div>

      <div
        class="tree-container"
        style="height: calc(100% - 25px); overflow: auto; min-width: 1190px"
      >
        <el-tree
          :data="treeData"
          draggable
          node-key="id"
          :props="defaultProps"
          :expand-on-click-node="false"
          ref="nodeExpand"
          :default-expand-all="expandAll"
          :default-expanded-keys="expandedKeys"
          @node-drag-start=""
          @node-drag-end=""
          @node-contextmenu="clickNode"
          @node-expand="openNode"
          @node-collapse="closeNode"
        >
          <template #default="{ node }">
            <div
              style="display: flex; justify-content: space-between; flex: auto; text-align: left"
            >
              <el-popover
                :visible="node.data.popVisible"
                placement="right"
                popper-style="background-color: rgba(255, 255, 255, 0.5)"
              >
                <el-button
                  style="margin-top: 6px; width: 100%"
                  type="primary"
                  plain
                  round
                  @click="addSiblingNode(node.data)"
                  >同级新增</el-button
                ><br />
                <el-button
                  style="margin-top: 6px; width: 100%"
                  type="primary"
                  plain
                  round
                  @click="addChildNode(node.data)"
                  >下级新增</el-button
                ><br />
                <el-button
                  style="margin-top: 6px; width: 100%"
                  type="danger"
                  plain
                  round
                  @click="confirmDeleteNodes(node.data)"
                  >删除</el-button
                >
                <template #reference>
                  <el-input
                    v-if="node.data.editingName"
                    v-model="node.data.name"
                    @blur="blurInput(node.data, 'editingName')"
                    placeholder="请输入节点名称"
                    @contextmenu.stop
                    draggable="false"
                    style="height: 20px; width: 150px"
                    :ref="el => setInputRef(el, node.data)"
                  ></el-input>
                  <div
                    v-else
                    style="width: 150px; height: 20px"
                    @dblclick="handleClick(node.data, 'editingName')"
                  >
                    <el-icon v-if="node.data.children" color="orange">
                      <Folder />
                    </el-icon>
                    <el-icon v-else color="dodgerblue">
                      <Document />
                    </el-icon>
                    {{ node.data.name }}
                  </div>
                </template>
              </el-popover>

              <div style="min-width: 850px; width: 59vw">
                <div style="display: flex; flex: auto; justify-content: space-between">
                  <div
                    style="width: 150px; text-align: center; height: 100%; overflow: hidden"
                    @dblclick="handleClick(node.data, 'editingDatavalue')"
                  >
                    <el-input
                      v-if="node.data.editingDatavalue"
                      v-model="node.data.datavalue"
                      @blur="blurInput(node.data, 'editingDatavalue')"
                      placeholder="请输入数值"
                      @contextmenu.stop
                      draggable="false"
                      style="height: 20px; width: 100%"
                      :ref="el => setInputRef(el, node.data)"
                    ></el-input>
                    <div style="width: 100%; height: 20px" v-else>{{ node.data.datavalue }}</div>
                  </div>
                  <div
                    style="
                      min-width: 750px;
                      width: 100%;
                      height: 100%;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    "
                    v-bind:title="node.data.remark"
                    @dblclick="handleClick(node.data, 'editingRemark')"
                  >
                    <el-input
                      v-if="node.data.editingRemark"
                      v-model="node.data.remark"
                      @blur="blurInput(node.data, 'editingRemark')"
                      placeholder="请输入备注"
                      @contextmenu.stop
                      draggable="false"
                      style="height: 20px; width: 100%"
                      :ref="el => setInputRef(el, node.data)"
                    ></el-input>
                    <div
                      v-else
                      style="
                        width: 100%;
                        height: 20px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      "
                      v-bind:title="node.data.remark"
                    >
                      {{ node.data.remark }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import parseJWT from '@/utils/parseJWT.js';
import { Folder, Document } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import request from '../../utils/request';

const defaultProps = {
  children: 'children',
  label: 'name'
};

const treeData = ref([]);

const nodeExpand = ref(null);

const expandAll = ref(false);

const expandedKeys = ref([]); // 默认展开的节点的key的数组

const openedPopNode = ref({}); // 记录哪个节点的弹出框被打开了

const nullNodeNum = ref(0); // 未命名节点数

/*************预处理数据************/
const id = ref(1);

const initialize = nodes => {
  nodes.forEach(node => {
    node.popVisible = false;
    node.editingName = false;
    node.editingDatavalue = false;
    node.editingRemark = false;
    // node.id = id.value ++;

    if (node.name.includes('未命名节点')) {
      if (node.name.length > 5 && node.name[5] === '(') {
        let num = '';
        for (let i = 6; node.name[i] !== ')'; i++) {
          num += node.name[i];
        }
        if (nullNodeNum.value < Number(num)) nullNodeNum.value = Number(num);
      } else if (node.name.length === 5 && nullNodeNum.value === 0) nullNodeNum.value++;
    }

    if (node.children && node.children.length > 0) {
      initialize(node.children); // 递归子节点
    }
  });
};

const getData = res => {
  if (res.code === 200) {
    treeData.value = res.data;
    nullNodeNum.value = 0;
    initialize(treeData.value);
    // console.log(treeData.value);
  }
};

const getTreeData = () => {
  // TODO:对路由进行判断
  const route = useRoute();
  if (route?.fullPath === '/homes/professionhome/evaluation/ability') {
    request.evaluation
      .get('/evaluation/getability/allability')
      .then(res => {
        getData(res);
      })
      .catch(error => {
        ElMessage({
          type: 'error',
          message: '获取能力数据失败' + error
        });
      });

  // // TODO:对路由进行判断
  // const route = useRoute();
  // if (route.fullPath === '/homes/professionhome/evaluation/ability') {
  //   request.evaluation
  //     .get('/evaluation/getability/allability')
  //     .then(res => {
  //       getData(res);
  //     })
  //     .catch(error => {
  //       ElMessage({
  //         type: 'error',
  //         message: '获取能力数据失败' + error
  //       });
  //     });
  // } else {
  //   request.evaluation
  //     .get('/evaluation/ability?courseId=' + parseJWT(sessionStorage.getItem('token')).obsid)
  //     .then(res => {
  //       getData(res);
  //       // if (res.code === 200) {
  //       //   treeData.value = res.data;
  //       //   nullNodeNum.value = 0;
  //       //   initialize(treeData.value);
  //       //   // console.log(treeData.value);
  //       // }
  //     })
  //     .catch(error => {
  //       ElMessage({
  //         type: 'error',
  //         message: '获取能力数据失败' + error
  //       });
  //     });
  // }
};

onMounted(() => {
  // initialize(treeData.value);
  const router = useRoute();
  console.log(router);
  console.log('开始开始');
  getTreeData();
  document.addEventListener('click', closePopNode);
});
/**********************************/

/*****************控制树节点展开****************/
const changeTreeExpand = () => {
  expandAll.value = !expandAll.value;
  expandedKeys.value = [];
  let length = nodeExpand.value.store._getAllNodes().length;
  let allNodes = nodeExpand.value.store._getAllNodes();
  for (let i = 0; i < length; i++) {
    allNodes[i].expanded = expandAll.value;
    if (expandAll.value) expandedKeys.value.push(allNodes[i].key);
  }
  // console.log(expandedKeys.value)
};

const openNode = (nodeData, node) => {
  // console.log(node);
  if (!expandedKeys.value.includes(node.key)) {
    expandedKeys.value.push(node.key);
  }
  // console.log(expandedKeys.value)
};

const closeNode = (nodeData, node) => {
  removeExpandedKeys(node);
};

const removeExpandedKeys = node => {
  // 首先递归地移除所有子节点的ID
  if (node.childNodes && node.childNodes.length > 0) {
    node.childNodes.forEach(childNode => {
      removeExpandedKeys(childNode);
    });
  }

  // 然后移除当前节点的ID
  const index = expandedKeys.value.indexOf(node.key);
  if (index > -1) {
    expandedKeys.value.splice(index, 1);
  }
};
/********************************************/

/************ 与弹出框显示有关 **********/

const clickNode = (event, node, dom) => {
  // 右键节点触发
  //event为必须参数鼠标点击对象，node为节点的数据是可选参数，dom是当前节点的DOM元素也是可选参数
  if (openedPopNode.value) {
    openedPopNode.value.popVisible = false; // 防止多个弹出框一块显示，不好看
    openedPopNode.value = {};
  }
  node.popVisible = true;
  openedPopNode.value = node;
};

const closePopNode = event => {
  // 检查点击事件是否在弹窗内部
  // 如果不是，则关闭弹窗
  if (openedPopNode.value) {
    openedPopNode.value.popVisible = false;
    openedPopNode.value = {};
  }
};

onBeforeUnmount(() => {
  document.removeEventListener('click', closePopNode);
});
/***************************************/

/************对结点的操作************/
const handleClick = (node, field) => {
  nextTick(() => {
    node[field] = true;
    setTimeout(() => {
      if (inputRefs.value[node.id] && inputRefs.value[node.id].$refs.input) {
        inputRefs.value[node.id].$refs.input.focus();
      }
    }, 0);
  });
};

/***********************************/

/**************新增节点*************/
const addSiblingNode = node => {
  console.log(node);
  nullNodeNum.value++;
  const newNode = {
    id: node.id,
    pid: node.pid,
    abilitydeep: node.abilitydeep,
    type: '1',
    cmAbility: {
      name: nullNodeNum.value > 1 ? '未命名节点(' + nullNodeNum.value + ')' : '未命名节点',
      remark: '',
      professionid: node.professionid
    }
  };
  console.log(newNode);
  request.evaluation
    .post('/evaluation/ability/create', newNode)
    .then(res => {
      if (res.code === 200) {
        // console.log('first');
        getTreeData();
      }
    })
    .catch(error => {
      ElMessage.error('新增失败失败' + error);
    });

  node.popVisible = false;
};

const addChildNode = node => {
  nullNodeNum.value++;
  const newNode = {
    id: node.id,
    pid: node.pid,
    abilitydeep: node.abilitydeep,
    type: '0',
    cmAbility: {
      name: nullNodeNum.value > 1 ? '未命名节点(' + nullNodeNum.value + ')' : '未命名节点',
      remark: '',
      professionid: node.professionid
    }
  };
  // console.log(newNode);
  request.evaluation
    .post('/evaluation/ability/create', newNode)
    .then(res => {
      if (res.code === 200) {
        expandedKeys.value.push(node.id); //将该节点id追加到展开的id中
        getTreeData();
      }
    })
    .catch(error => {
      ElMessage.error('获取能力数据失败' + error);
    });

  node.popVisible = false;
};
/***********************************/

/*****************删除节点***************/
const confirmDeleteNodes = node => {
  ElMessageBox.confirm(`是否删除"${node.name}"能力及其下属所有能力?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let deletedNodes = [];
      if (node.children && node.children.length > 0) {
        deletedNodes = findChildNodes(node.children, [node.id]);
      } else deletedNodes.push(node.id);
      // console.log(deletedNodes);

      request.evaluation
        .post('/evaluation/ability/delete', deletedNodes)
        .then(res => {
          if (res.code === 200) {
            getTreeData();

            deletedNodes.forEach(id => {
              // 删除被删除节点的默认展开数据
              let index = -1;
              index = expandedKeys.value.indexOf(id);
              if (index > -1) expandedKeys.value.splice(index, 1);
            });
            // console.log(expandedKeys.value);
          } else {
            ElMessage({
              type: 'error',
              message: res.msg
            });
          }
        })
        .catch(error => {
          ElMessage.error('删除失败' + error);
        });
    })
    .catch(() => {});
  node.popVisible = false;
};

const findChildNodes = (nodes, array = []) => {
  // 查找某一节点的所有子节点id
  nodes.forEach(item => {
    array.push(item.id);
    if (item.children && item.children.length > 0) {
      array = findChildNodes(item.children, array);
    }
  });
  return array;
};
/****************************************/

/***************与输入框显示有关***************/

const inputRefs = ref({});

const setInputRef = (el, node) => {
  if (el) {
    inputRefs.value[`${node.id}`] = el;
  }
};

const blurInput = async (node, field) => {
  node[field] = false;
  console.log(node);
  const postData = {
    id: node.id,
    name: node.name
  };

  try {
    const res = await request.evaluation.post(`/evaluation/ability/update`, postData);
    if (res.code === 200) {
      ElMessage.success('修改成功');
    } else ElMessage.error(res.msg);
  } catch (error) {
    ElMessage.error(res.msg);
  }
};

/********************************************/
</script>

<style scoped>
/* 去掉滚动条 */
.tree-container::-webkit-scrollbar {
  /* 针对Chrome, Safari, Edge, 和 Opera */
  display: none;
}

.element {
  /* 针对Firefox */
  scrollbar-width: none;
}

.element {
  /* 针对IE和Edge旧版本 */
  -ms-overflow-style: none;
}

/*************/
</style>
