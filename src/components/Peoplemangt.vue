<template>
  <el-container style="height: 92vh; color: grey;">
    <!--    顶部按钮-->
    <el-header
        style="height: 0; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
<!--      <el-button type="primary" style="margin-left: 0.8vw;margin-right: 0.8vw;">保存</el-button>-->
    </el-header>
    <el-container>
      <!--左侧-->
<!--      <el-aside style="height: 100%;width:20vw;float: left; border: 1px solid #ccc;">-->
      <el-aside :style="{ width: asideWidth + 'px' }" ref="aside">
        <div>
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="topNode in topNodes"
                              :key="topNode.id"
                              :name="topNode.id">
              <template #title>
                <p style="width:100%;justify-content: center;">
                {{ topNode.obsname }}
                </p>
              </template>
              <!-- 移除第一层节点，直接从 children 开始渲染树 -->
              <el-tree :data="topNode.children"
                       node-key="id"
                       highlight-current
                       :props="defaultProps"
                       :expand-on-click-node="true"
                       :check-on-click-node="false"
                       class="tree-with-header"
                       @node-click="treeNodeClick"
                        style="margin-bottom: 0"
              >
                <template #default="{ node }">
            <span>
              <el-icon v-if="node.data.children" color="orange"><Folder /></el-icon>
                <el-icon v-else color="dodgerblue"><Document /></el-icon>
              {{ node.data.obsname }}
            </span>
                </template>
              </el-tree>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-aside>
<!--********************************************** -->

      <div class="resize-handler" @mousedown="startResize"></div>
      <!--右侧-->
      <el-main v-show="showmenu" style="height: 100%; width:40vw; border: 1px solid #ccc;padding:0">
        <el-tabs v-model="activeTab" @tab-click="switchTab" style="margin-left:0.8vw;margin-bottom: 0">
          <el-tab-pane label="教师" name="2" ></el-tab-pane>
          <el-tab-pane label="学生" name="1"></el-tab-pane>
        </el-tabs>
        <div style="width: 99%; display: flex; justify-content: space-between; align-items: center; margin-top: 0" >
          <!-- 左侧按钮 -->
          <div>
            <el-button v-blur-on-click style="margin-left: 0.8vw" type="primary" @click="exportData">导出</el-button>
            <el-button v-blur-on-click type="success" @click="createPeople">新增</el-button>
            <el-button v-blur-on-click type="info" @click="importData">导入</el-button>
            <el-button v-blur-on-click type="danger" @click="deleteSelected">删除</el-button>
          </div>

          <!-- 右侧搜索框和按钮 -->
          <div>
            <el-input v-model="searchKeyword" placeholder="请输入姓名关键字" class="input-with-select"
                      style="width:200px;margin-right:0.8vw"
            ></el-input>
            <el-button type="primary" @click="querySearch">搜索</el-button>
          </div>
        </div>

        <AddPeopleDialog  v-show="dialogVisible"  ref="DialogShow" @formSubmitted="getPeopleList" />

        <!--老师tab-->
        <div v-if="activeTab === '2'" style="" >
          <el-table :data="pagedData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="index" label=""></el-table-column>
            <el-table-column type="selection" label=""></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="loginname" label="登录名称"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="catelog" label="分类" :formatter="formatColumn"></el-table-column>
            <el-table-column prop="status"  label="状态" :formatter="formatColumn" ></el-table-column>
            <el-table-column prop="obsname" label="所属院系"></el-table-column>
          </el-table>
        </div>
        <!--学生tab-->
        <div v-if="activeTab === '1'">
          <el-table :data="pagedData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="index" label=""></el-table-column>
            <el-table-column type="selection" label=""></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="loginname" label="登录名称"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="catelog" label="分类" :formatter="formatColumn"></el-table-column>
            <el-table-column prop="status"  label="状态" :formatter="formatColumn" ></el-table-column>
            <el-table-column prop="obsname" label="所属院系"></el-table-column>
          </el-table>
        </div>
        <el-footer style="display: flex; justify-content: center;">
          <el-pagination
              style="margin-top:20px;text-align: center;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              :hide-on-single-page="true"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </el-footer>
      </el-main>

    </el-container>

  </el-container>
</template>
<script setup>
import {reactive, ref, nextTick, onMounted, toRaw,computed} from "vue";
import request from "../utils/request.js";
import {ElMessage,ElMessageBox} from "element-plus";
import {Document, Folder, Search} from '@element-plus/icons-vue';
import{ exportTableToCSV } from "../utils/exportTableToCSV.js";
import{ searchInTable } from "../utils/searchInTable.js";
import AddPeopleDialog from "./subcomponents/AddPeopleDialog.vue"
import EditRoleList from "./subcomponents/EditRoleList.vue";

//tab显示，学生-1，老师-2，默认为老师
const activeTab = ref('2');
 //老师还是学生：老师-2，学生-1
//是否展示el-main中的菜单
const showmenu = ref(false);

//el-aside左侧的机构列表
const obsmenulist = ref([]);
//el-main中的师生列表
const peoplelist = ref([]);

const searchKeyword = ref('')


//设置默认的aside宽度
const asideWidth = ref(300);

/***********************************/

const topNodes = ref([]); // 用于存储最顶层节点的数组
const activeNames = ref([]); // 控制哪些 el-collapse-item 是打开状态

const dialogVisible = ref(false);
const DialogShow = ref(null);
/**************移动逻辑*******************/
const startResize = (event) => {
  const startX = event.clientX;
  const startWidth = asideWidth.value;

  const doResize = (moveEvent) => {
    const currentX = moveEvent.clientX;
    const deltaX = currentX - startX;
    asideWidth.value = startWidth + deltaX;
  };

  const stopResize = () => {
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
  };

  document.addEventListener('mousemove', doResize);
  document.addEventListener('mouseup', stopResize);
};

/**************移动逻辑*******************/


const columns = ref([
  { prop: 'username', label: '用户名' },
  { prop: 'loginname', label: '登录名称' },
  { prop: 'phone', label: '手机号' },
  { prop: 'catelog', label: '分类' },
  { prop: 'status', label: '状态' },
  { prop: 'obsname', label: '所属院系' }
]);

//左侧树形展开中的属性。lable是展示的内容，children是指定递归的属性
const defaultProps = {
  children: 'children',
  label: 'obsname'
};

const fetchData = () => {
  // 模拟异步获取数据
  setTimeout(() => {
    //页面进入后，获取左侧的组织机构列表
    request.get('/sysmangt/personnelmangt')
        .then(res => {
          // 登录成功
          if (res.code === 200) {
            obsmenulist.value = res.data;topNodes.value = obsmenulist.value.map(topNode => ({
              ...topNode,
              children: topNode.children ? topNode.children.map(child => removeFirstLayer(child)) : [],
            }));
          }
        }).catch(error => {
      // 获取失败
      ElMessage({
        type: 'error',
        message: '获取组织机构列表失败'
      });
    });
  }, 1000);
};

// 移除第一层节点的函数
const removeFirstLayer = node => {
  if (node.children) {
    return {
      ...node,
      children: node.children.map(child => removeFirstLayer(child)),
    };
  }
  return node;
};

//左侧树中选取的机构
const currentobsid = ref('');
const currentobsname = ref('');


//切换老师学生tab页的方法
const switchTab = (tab, event) => {
  nextTick(() => {
    currentPage.value = 1;
    // 获取数据列表
    getPeopleList();
  });
  selectedRows.value = [];
};

const filteredData = ref([peoplelist.value]);


//左侧树节点点击事件
const treeNodeClick = (data, node, event) => {
  // console.log(data);
  showmenu.value = true;
  currentobsid.value=data.id;
  currentobsname.value = data.obsname;
  getPeopleList();
};




const getPeopleList=()=>{
  request.get('/sysmangt/personnelmangt/person?obsid='+currentobsid.value+'&catelog='+activeTab.value)
      .then(res => {
        if (res.code === 200) {
          peoplelist.value=res.data;
          searchKeyword.value=null;
          filteredData.value = peoplelist.value;
          total.value = filteredData.value.length;

        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '获取师生列表失败'
    });
  });
}

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0); // 总数据量，初始为0

const singlepageData = ref([]);


// 处理每页显示条目数改变
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  // 重置当前页到第一页
  currentPage.value = 1;
};

// 处理当前页改变
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

// 计算分页数据
const pagedData = computed(() => {
  return filteredData.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});








//格式化el-table中的接口返回数据
//根据列的数值进行format操作
const formatColumn = (row, column, cellValue, index) => {
  if (column.property === 'catelog') {
    return cellValue === '1' ? '学生' : cellValue === '2' ? '老师' : cellValue;
  } else if (column.property === 'status') {
    return cellValue === '1' ? '正常' : cellValue === '0' ? '禁用' : cellValue;
  }
  // 如果是其他列，按原样返回
  return cellValue;
}
//处理行编辑
// 用于跟踪编辑过的行
const editedRows = ref(new Map());

const newform = reactive({
  username: '',
  loginname: '',
  pwd: '',
  personnelno: '',
  phone: '',
  catelog: '',
  status: '1',
  obsid: '',
  obsname:'',
  remark: ''
});

//新增教师
const createPeople = () =>{
  newform.catelog = activeTab.value;
  newform.obsid = currentobsid.value;
  newform.obsname = currentobsname.value;

  dialogVisible.value = true;  // 打开弹窗

  DialogShow.value.init(newform,obsmenulist);
}


const selectedRows = ref([]);

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};


const exportData = () => {
  // 获取选中的行
   const dataToExport = selectedRows.value.length > 0 ? selectedRows.value : peoplelist.value;
  // 检查是否有数据可导出
  if (dataToExport.length === 0) {
    ElMessage({
      type: 'info',
      message: '没有需要导出的内容',
    });
    return; // 退出函数，不再继续执行
  }

  ElMessageBox.confirm(
      selectedRows.value.length > 0 ? `是否要导出所勾选的 ${selectedRows.value.length} 行记录？` : '是否要导出当前的全部记录？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }
  )
      .then(() => {
        exportTableToCSV(dataToExport, columns.value);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消导出',
        })
      })
}
const importData = () => {
  // 处理导入数据逻辑
}
const deleteSelected = () => {
  const ids = selectedRows.value.map(row => row.id);

  request.post('/sysmangt/personnelmangt/delete', ids)
      .then(res => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '删除用户成功'
          });
          getPeopleList();
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '删除用户失败'
    });
  });
}
const saveData = () => {
  // 处理保存数据逻辑
}
const resetPassword = () => {
  // 处理重置密码逻辑
}
const querySearch = () => {
  // 处理搜索逻辑
  filteredData.value = searchInTable(peoplelist.value, searchKeyword.value, 'username');  // 假设我们按 'username' 列搜索

  console.log('搜索内容:', searchKeyword.value)
}


onMounted(() => {
  fetchData();
})
</script>

<style scoped>
.resize-handler {
  background-color: #ccc; /* 分隔条颜色 */
  cursor: ew-resize; /* 鼠标悬停时的光标样式 */
  width: 3px; /* 分隔条宽度 */
  height: 100%;
  float: left; /* 使分隔条正确地位于 aside 和 main 之间 */
}

/* 旋转箭头 */
.el-collapse-item__arrow,
.el-tabs__nav {
  transform: rotate(90deg);
}

/* Vue 3 使用 ::v-deep 选择器 */
/deep/ .el-collapse-item__arrow.is-active {
  transform: rotate(90deg);
}
/deep/ .el-collapse-item__header{
  background-color:whitesmoke;
}
/deep/ button:focus, button:focus-visible {
  outline: none; /* 使用你的颜色 */
}

/deep/ .el-collapse-item__content{
  padding-bottom: 0;
}
/deep/ .el-tabs__header {
  margin: 0 0 5px !important;
}
</style>
