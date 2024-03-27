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
        <el-row style="line-height: 40px; background-color: #f5f7fa; border-bottom: 1px solid #ebeef5;">
          <el-col :span="24">学校院系</el-col>
        </el-row>
        <el-tree
            :data="obsmenulist"
            node-key="id"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="true"
            :check-on-click-node="false"
            class="tree-with-header"
            @node-click="treeNodeClick">
            <template #default="{ node }">
              <span>
                <el-icon v-if="node.data.children" color="orange"><Folder /></el-icon>
                <el-icon v-else color="dodgerblue"><Document /></el-icon>
                {{ node.data.obsname }}
              </span>
            </template>
        </el-tree>
        <!--   ********************************************** -->
        <div class="collapse">
          <el-collapse v-model="activeCollapseNames" @change="handlCcollapseChange">
            <el-collapse-item title="Consistency" name="1">
              <div>

              </div>
              <div>
                Consistent within interface: all elements should be consistent, such
                as: design style, icons and texts, position of elements, etc.
              </div>
            </el-collapse-item>
            <el-collapse-item title="Feedback" name="2">
              <div>
                Operation feedback: enable the users to clearly perceive their
                operations by style updates and interactive effects;
              </div>
              <div>
                Visual feedback: reflect current state by updating or rearranging
                elements of the page.
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>


<!--   ********************************************** -->


      </el-aside>
      <div class="resize-handler" @mousedown="startResize"></div>
      <!--右侧-->
      <el-main v-show="showmenu" style="height: 100%; width:40vw; border: 1px solid #ccc;padding:0">
<!--  <el-main v-show="showmenu" style="height: 100%; width:40vw; border: 1px solid #ccc;padding:0">  -->
        <el-tabs v-model="activeTab" @tab-click="switchTab" style="margin-left:10px">
          <el-tab-pane label="教师" name="2" ></el-tab-pane>
          <el-tab-pane label="学生" name="1"></el-tab-pane>
          <!-- ... 其他标签页 ... -->
        </el-tabs>
<!--        老师的内容-->
        <div v-if="activeTab === '2'" style="" >
          <el-row style="">
            <el-col :span="2"><el-button v-blur-on-click style="min-width:100px" type="primary" @click="exportData">导出</el-button></el-col>
            <el-col :span="2"><el-button v-blur-on-click style="min-width:100px" type="success" @click="ccc">新增</el-button></el-col>
            <el-col :span="2"><el-button v-blur-on-click style="min-width:100px" type="info" @click="importData">导入</el-button> </el-col>
            <el-col :span="2"><el-button v-blur-on-click style="min-width:100px" type="danger" @click="deleteSelected">删除</el-button></el-col>
            <el-col :span="2"><el-button v-blur-on-click style="min-width:100px" type="warning" @click="saveData">保存</el-button></el-col>
            <el-col :span="2"><el-button v-blur-on-click style="min-width:100px" @click="resetPassword">重置密码</el-button></el-col>
            <el-col :span="5"></el-col>
            <el-col :span="5">
              <el-input v-model="searchKeyword" placeholder="请输入姓名关键字" class="input-with-select">
              </el-input></el-col>
            <el-col :span="2"><el-button style="width: 85%" type="primary"  @click="querySearch">搜索</el-button></el-col>
          </el-row>
          <el-dialog :modelValue="showDialog" :show-close="false" :close-on-click-modal="false" title="添加数据">
            <p>这是一个弹窗</p>
          </el-dialog>
          <el-table :data="filteredData" style="width: 100%" @selection-change="handleSelectionChange">
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
          <el-row style="">
            <el-col :span="2"><el-button style="width: 85%" type="primary" @click="exportData">导出</el-button></el-col>
            <el-col :span="2"><el-button style="width: 85%" type="success" @click="ccc">新增</el-button></el-col>
            <el-col :span="2"><el-button style="width: 85%" type="info" @click="importData">导入</el-button> </el-col>
            <el-col :span="3"><el-button style="width: 85%" type="danger" @click="deleteSelected">删除</el-button></el-col>
            <el-col :span="2"><el-button style="width: 85%" type="warning" @click="saveData">保存</el-button></el-col>
            <el-col :span="2"><el-button style="width: 85%" @click="resetPassword">重置密码</el-button></el-col>
            <el-col :span="4"></el-col>
            <el-col :span="5">
              <el-input v-model="searchKeyword" placeholder="请输入姓名关键字" class="input-with-select">
              </el-input></el-col>
            <el-col :span="2"><el-button style="width: 85%" type="primary"  @click="querySearch">搜索</el-button></el-col>
          </el-row>
          <el-dialog :modelValue="showDialog" :show-close="false" :close-on-click-modal="false"  title="添加数据">
            <p>这是一个弹窗</p>
          </el-dialog>

          <el-table :data="filteredData" style="width: 100%" @selection-change="handleSelectionChange">
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
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import {reactive, ref,nextTick} from "vue";
import request from "../../utils/request.js";
import {ElMessage,ElMessageBox} from "element-plus";
import {Document, Folder, Search} from '@element-plus/icons-vue';
import{ exportTableToCSV } from "../../utils/exportTableToCSV.js";
import{ searchInTable } from "../../utils/searchInTable.js";
import AddPeopleDialog from "./subcomponents/AddPeopleDialog.vue"

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

// const dialogVisible = ref(false);
const showDialog = ref(false);

//设置默认的aside宽度
const asideWidth = ref(300);
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
//页面进入后，获取左侧的组织机构列表
request.get('/sysmangt/personnelmangt')
    .then(res => {
      // 登录成功
      if (res.code === 200) {
        obsmenulist.value = res.data;
        console.log(obsmenulist.value);
      }
    }).catch(error => {
  // 获取失败
  ElMessage({
    type: 'error',
    message: '获取组织机构列表失败'
  });
});


//左侧树形展开中的属性。lable是展示的内容，children是指定递归的属性
const defaultProps = {
  children: 'children',
  label: 'obsname'
};

//左侧树中选取的机构
const currentobsid = ref('');

//切换老师学生tab页的方法
const switchTab = (tab, event) => {
  nextTick(() => {
  request.get('/sysmangt/personnelmangt/person?obsid='+currentobsid.value+'&catelog='+activeTab.value)
      .then(res => {
        if (res.code === 200) {
          showmenu.value = true;
          peoplelist.value=res.data;
          searchKeyword.value=null;
          filteredData.value = peoplelist.value
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '获取师生列表失败'
    });
  });
   });
  selectedRows.value = [];
  showDialog.value=false;
};

const filteredData = ref([peoplelist.value]);


//左侧树节点点击事件
const treeNodeClick = (data, node, event) => {
  // console.log(data);
  showmenu.value = true;
  currentobsid.value=data.id;
  request.get('/sysmangt/personnelmangt/person?obsid='+currentobsid.value+'&catelog='+activeTab.value)
      .then(res => {
        if (res.code === 200) {
          peoplelist.value=res.data;
          filteredData.value = peoplelist.value
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '获取师生列表失败'
    });
  });

};
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

// 处理单元格编辑
const handleEdit = (row, key) => {
  // 将编辑后的行存储在Map中，以便保存时使用
  editedRows.value.set(row.id, { ...editedRows.value.get(row.id), [key]: row[key] });
};

// 保存编辑
const saveEdits = () => {
  editedRows.value.forEach((value, key) => {
    console.log(`Saving row ${key}`, value);
  });

};


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
const addData = () => {

}
const importData = () => {
  // 处理导入数据逻辑
}
const deleteSelected = () => {
  // 处理删除选中记录逻辑
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

</script>

<style scoped>
.resize-handler {
  background-color: #ccc; /* 分隔条颜色 */
  cursor: ew-resize; /* 鼠标悬停时的光标样式 */
  width: 3px; /* 分隔条宽度 */
  height: 100%;
  float: left; /* 使分隔条正确地位于 aside 和 main 之间 */
}
</style>