<template>
  <el-container style="height: 92vh;">
    <!--两个按钮，靠最左-->
    <el-header
        style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="success" style="margin-left: 0.8vw;" @click="exportData">导出学院</el-button>
      <el-button type="primary" style="margin-left: 0.8vw;" @click="handleRoleAdd">新增学院</el-button>
      <el-button type="danger" @click="handleRoleDel">删除学院</el-button>
<!--      <el-button type="success" @click="">保存</el-button>-->
    </el-header>
    <el-main style="padding: 0;overflow: auto;">
      <!--生成-->
      <el-table :data="tableData" style="height: 100%; table-layout:auto; width: 100%;"
                 @select-all="handleSelectAll" @selection-change="handleSelectionChange"
                :default-sort="{ prop:'levelcode', order: 'ascending' }"  stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="55" label="序号">
          <template v-slot="row">{{ row.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="obsname" label="学院名称" min-width="100">
          <template #default="{ row }">
            <el-input v-if="row.editingobsname" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.obsname"
                      @blur="handleBlur(row, 'editingobsname')"></el-input>
            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingobsname')">{{row.obsname }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="levelcode" label="层级码" min-width="80">
          <template #default="{ row }">
            <el-input v-if="row.editingLevelcode" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.levelcode"
                      @blur="handleBlur(row, 'editingLevelcode')"></el-input>
            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingLevelcode')">{{row.levelcode }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="学院负责人" min-width="100">
          <template #default="{ row }">
            <div style="display: flex; align-items: center;">
              <div style="flex-grow: 1; display: flex; flex-wrap: wrap;">
                <!-- 只在这个div上使用v-for，移除内层的v-for -->
                <div v-for="(user, index) in row.responsiblePersonList" :key="user.id" class="user-bubbles">
                  <!-- 使用v-if来确保只显示前四个负责人 -->
                  <template v-if="index < 4">
            <span class="user-bubble">
              {{ user.username }}
            </span>
                  </template>
                  <!-- 当负责人数量超过4时，显示额外的数量 -->
                  <span v-if="index === 3 && row.responsiblePersonList.length > 4" class="more-users">
            +{{ row.responsiblePersonList.length - 4 }}
          </span>
                </div>
              </div>
              <div>
                <el-icon class="edit-icon" @click="showHeadofDialog(row)">
                  <edit/>
                </el-icon>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="80">
          <template #default="{ row }">
            <el-input v-if="row.editingRemark" :ref="el => setInputRef(el, row)" style="width: 100%; height: 25px;" v-model="row.remark"
                      @blur="handleBlur(row, 'editingRemark')"></el-input>
            <div v-else style="width: 100%; height: 25px;" @click="handleClick(row, 'editingRemark')">{{row.remark }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <EditHeadofCollege v-show="dialogVisible" ref="DialogShow" @formSubmitted="getTableData"/>
    </el-main>
  </el-container>
</template>
<script setup>
import {reactive, ref, computed, onMounted, nextTick, toRaw, isRef} from "vue";
import request from "../../utils/request.js";
import { ElMessage, ElMessageBox } from 'element-plus';
import isEqual from 'lodash/isEqual.js'
import {exportTableToCSV} from "../../utils/exportTableToCSV.js";
import {Edit} from '@element-plus/icons-vue';
import EditHeadofCollege from "./subcomponents/EditHeadofCollege.vue";



/**************获取表单数据，并预处理*******************/

const tableData = ref([]);

//未命名的角色数
const nullRoleNum = ref(0);

const getTableData = () => {
  request.admin.get('/sysmangt/collegemangt')
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          tableData.value = res.data;
          console.log(tableData.value)
          initialize();
        }
      })
      .catch(() => {
            ElMessage({
              type: 'error',
              message: '获取学院列表失败'
            });
          }
      );
};

//初始化数据
const initialize = () => {
  tableData.value.forEach(item => {   // 为每一个表格数据添加是否显示输入框的判定
    item.editingobsname = false;
    item.editingLevelcode = false;
    item.editingRemark = false;
    if (item.obsname.includes('未命名节点')) {
        if (item.obsname.length > 5) {
          let num = '';
          for(let i = 6; item.obsname[i] !== ')'; i++){
            num += item.obsname[i];
          }
          if(nullRoleNum.value < Number(num)) nullRoleNum.value = Number(num);
        }
        else if (item.obsname.length === 5 && nullRoleNum.value === 0) nullRoleNum.value++;
    }
  });
};

/*******************************************************/


const selectedRows = ref([]);

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
  // console.log(selectedRows.value)
};


const handleSelectAll = (selection) => {
  selectedRows.value = selection;
  // console.log(selectedRows.value)
};

const columns = ref([
  { prop: 'obsname', label: '学院名称' },
  {prop: 'levelcode', label: '层级码'},
  {prop: 'responsiblePersonList', label: '学院负责人', isArray: true, arrayProp: 'username'},
  {prop: 'remark', label: '备注'},
]);


const exportData = () => {
  // 获取选中的行
  const dataToExport = selectedRows.value.length > 0 ? selectedRows.value : tableData.value;
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
        console.log(dataToExport)
        exportTableToCSV(dataToExport, columns.value);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消导出',
        })
      })
}

const handleRoleAdd = ()=>{
  nullRoleNum.value++;
  const newCollege = ref({
    obsname : nullRoleNum.value > 1 ? '未命名节点(' + nullRoleNum.value + ')' : '未命名节点',
    remark : ""}
  )

  request.admin.post('/sysmangt/collegemangt',newCollege.value)
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '新增学院成功'
          });
          getTableData()
        }
      })
      .catch(() => {
            ElMessage({
              type: 'error',
              message: '新增学院失败'
            });
          }
      );
}


/*********处理点击获取焦点和失焦后数据保存********/
const inputsRefs = ref({});

const setInputRef = (el, row) => {
  if (el) {
    inputsRefs.value[`input-${row.id}`] = el;
  }
};

let orirow = null;
let rowdata =null;
let hasChanged = null;

const handleClick = (row, field) => {
  orirow = JSON.parse(JSON.stringify(row));
  // console.log(orirow)
  nextTick(() => {
    row[field] = true;
    setTimeout(() => {
      const inputRef = `input-${row.id}`;
      const inputComponent = inputsRefs.value[inputRef];
      // 检查 inputComponent 并尝试获取其内部的 input 元素
      if (inputComponent && inputComponent.$refs.input) {
        const nativeInputElement = inputComponent.$refs.input;
        nativeInputElement.focus();
        const len = nativeInputElement.value.length;
        nativeInputElement.setSelectionRange(len, len);
      }
    }, 0);
  });
};
const handleBlur = (row, field) => {

  nextTick(() => {

    row[field] = false;
    rowdata= JSON.parse(JSON.stringify(row));
    //isEqual(a,b) a,b是否相同
    hasChanged = isEqual(rowdata, orirow);
    // console.log(hasChanged)

    if(hasChanged){
      ElMessage({
        type: 'info',
        message: '无修改字段'
      });
    }else{
      const updateItem = ref({
        id:toRaw(row).id,
        obsname:toRaw(row).obsname,
        remark:toRaw(row).remark
      })
      request.admin.post('/sysmangt/collegemangt/update',updateItem.value)
          .then(res => {
            // 登录成功
            if (res.code === 200) {
              ElMessage({
                type: 'success',
                message: '修改学院信息成功'
              });
              //这里刷新dom
              getTableData();
            }
          })
          .catch(() => {
                ElMessage({
                  type: 'error',
                  message: '修改学院信息失败'
                });
                getTableData();
              }
          )
    }
  });
};

/**************************************/

const dialogVisible = ref(false);
const DialogShow = ref(null);
const showHeadofDialog = (row) => {

  dialogVisible.value = true;  // 打开弹窗
  console.log(row)
  // DialogShow.value.init(row.stUsersList);
  // console.log(row.responsiblePersonList)
  DialogShow.value.init(row);

}






/**************************************/

const deleteIdList = ref([]);

const handleRoleDel = () => {
  if (selectedRows.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '未选择角色',
      duration: 800
    });
    return;
  }
  else{
    ElMessageBox.confirm(
        '选中的角色将被删除，是否确定',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
        .then(() => {
          selectedRows.value.forEach(item=>{
                deleteIdList.value.push(item.id)
              }
          )
          request.admin.post('/sysmangt/collegemangt/delete',deleteIdList.value)
              .then(res => {
                // 登录成功
                if (res.code === 200) {
                  ElMessage({
                    type: 'success',
                    message: '删除成功'
                  });
                  //这里刷新dom
                  getTableData();
                }
              })
              .catch(() => {
                    ElMessage({
                      type: 'error',
                      message: '删除角色失败'
                    });
                  }
              );
          selectedRows.value = [];
          deleteIdList.value=[];
        }).catch(() => { });
  }
};



onMounted(() => {
  getTableData();
});
</script>

<style scoped>
::v-deep(.el-table .cell) {
  text-align: center;
}
.custom-icon:hover {
  color: rgb(0, 115, 255) !important;
  cursor: pointer;
}

.user-bubbles {
  display: flex;
  flex-wrap: wrap;
  gap: 5px; /* 气泡之间的间距 */
  justify-content: center; /* 居中对齐所有的气泡 */
  align-items: center; /* 垂直居中（如果你的行高较高的话） */
}

.user-bubble {
  background-color: #E6F7FF; /* 气泡的背景颜色 */
  border-radius: 15px; /* 边框圆角，使其看起来像气泡 */
  padding: 5px 10px; /* 内边距 */
  font-size: 14px; /* 文本大小 */
  cursor: pointer; /* 鼠标悬停时的手形指针 */
  white-space: nowrap; /* 防止文本换行 */
}

.more-users {
  background-color: #e4e6eb;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}

.edit-icon {
  cursor: pointer; /* 鼠标悬停时变成手形指针 */
  white-space: nowrap; /* 防止文本换行 */
  margin-left: 8px; /* 与名字标签的间距 */
}

.edit-icon:hover {
  color: #409EFF; /* 悬浮时的颜色 */
}
</style>