<template>
  <el-container style="height: 92vh;">
    <!--两个按钮，靠最左-->
    <el-header
      style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="primary" style="margin-left: 0.8vw;" @click="createParentData">新增章节</el-button>
      <el-button type="danger" @click="deleteSel">删除</el-button>
      <el-button type="success" @click="">保存</el-button>
      <el-button v-if="selParent" type="primary" @click="createChildrenData">新增小节</el-button>
      <div class="flex-container" style="width: 100%;font-weight: bold; font-size: 20px;">课程名称</div>
    </el-header>
    <el-main style="padding: 0; background-color: white;">
      <el-table :data="tableData" style="height: 100%; width: 100%;" row-key="id"
        highlight-current-row size="large" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" @current-change="changeSelRow">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="type" label="类型" sortable width="180">
          <template #default="tableRowData">
            <span v-if="!editRef.get(tableRowData.row.id)['editType']"
              @dblclick="editEditRef(tableRowData.row, 'editType')">{{ tableRowData.row.type }}</span>
            <el-input ref="inputTypeRef" v-else v-model="tableRowData.row.type"
              @blur="saveEditRef(tableRowData.row, 'editType')" @keyup.enter="saveEditRef(tableRowData.row, 'editType')"
              style="width: 110px"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="180">
          <template #default="tableRowData">
            <span v-if="!editRef.get(tableRowData.row.id)['editName']"
              @dblclick="editEditRef(tableRowData.row, 'editName')">{{ tableRowData.row.name }}</span>
            <el-input ref="inputNameRef" v-else v-model="tableRowData.row.name"
              @blur="saveEditRef(tableRowData.row, 'editName')"
              @keyup.enter="saveEditRef(tableRowData.row, 'editName')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="datavalue" label="数值" sortable width="100">
          <template #default="tableRowData">
            <span v-if="!editRef.get(tableRowData.row.id)['editDataValue']"
              @dblclick="editEditRef(tableRowData.row, 'editDataValue')">{{ tableRowData.row.datavalue }}</span>
            <el-input ref="inputDataValueRef" v-else v-model="tableRowData.row.datavalue"
              @blur="saveEditRef(tableRowData.row, 'editDataValue')"
              @keyup.enter="saveEditRef(tableRowData.row, 'editDataValue')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="kwas" label="基本教学目标">
          <template #default="tableRowData">
            <span v-if="!tableRowData.row.isChildren">{{ tableRowData.row.tempKwas.map(item => item.name).join(", ")
              }}</span>
            <el-popover v-else placement="bottom" :title="`${tableRowData.row.parentType}/${tableRowData.row.type}`"
              :width="800" trigger="click" @hide="saveEditKwa(tableRowData.row)">
              <el-checkbox-group v-model="tableRowData.row.tempKwas">
                <el-checkbox v-for="item in kwaData" :label="item" size="large">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <template #reference>
                <!--                <el-button class="m-2">Hover to activate</el-button>-->
                <div>
                  <span>{{ tableRowData.row.tempKwas.map(item => item.name).join(", ") }}&nbsp;&nbsp;</span>
                  <el-icon color="dodgerblue">
                    <Edit />
                  </el-icon>
                </div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { Edit } from '@element-plus/icons-vue';
import request from "../../utils/request";


//-------------------------缓存数据变量
//应该存储真正的课程ID
const courseid = "2c918af681fa6ea7018209a505c30672";
var multipleSelection = [];
var selParent = ref(null);
const editRef = ref(new Map());
const inputTypeRef = ref(null);
const inputNameRef = ref(null);
const inputDataValueRef = ref(null);
// var tempKwaData = ref([]);


//-------------------------数据
const tableData = ref([
  // {
  //   id: 1,
  //   type: '第一章',
  //   name: '基础知识',
  //   datavalue: 0.00,
  //   children: [
  //     {
  //       id: 2,
  //       type: '第一节',
  //       name: '晶振时序',
  //       datavalue: 0.00,
  //       kwas: [
  //         {
  //           id: 'A1-B1',
  //           name: '中断系统-代码编写能力',
  //         },
  //         {
  //           id: 'A1-B2',
  //           name: '中断系统-实验能力'
  //         },
  //       ],
  //     },
  //     {
  //       id: 3,
  //       type: '第二节',
  //       name: '时序逻辑',
  //       datavalue: 0.00,
  //       kwas: [
  //         {
  //           id: 'A2-B6',
  //           name: '串口并口通讯-程序实验能力'
  //         },
  //         {
  //           id: 'A2-B1',
  //           name: '串口并口通讯-代码编写能力'
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   type: '第二章',
  //   name: '硬件基础',
  //   datavalue: 0.00,
  //   children: [
  //     {
  //       id: 5,
  //       type: '第一节',
  //       name: '晶振时序',
  //       datavalue: 0.00,
  //       kwas: [
  //         {
  //           id: 'A1-B1',
  //           name: '中断系统-代码编写能力',
  //         },
  //         {
  //           id: 'A1-B2',
  //           name: '中断系统-实验能力'
  //         },
  //       ],
  //     },
  //     {
  //       id: 6,
  //       type: '第二节',
  //       name: '时序逻辑1',
  //       datavalue: 0.00,
  //       kwas: [
  //         {
  //           id: 'A2-B6',
  //           name: '串口并口通讯-程序实验能力'
  //         },
  //         {
  //           id: 'A2-B1',
  //           name: '串口并口通讯-代码编写能力'
  //         },
  //       ],
  //     },
  //     {
  //       id: 7,
  //       type: '第三节',
  //       name: '时序逻辑2',
  //       datavalue: 0.00,
  //       kwas: [
  //         {
  //           id: 'A2-B1',
  //           name: '串口并口通讯-代码编写能力'
  //         },
  //       ],
  //     },
  //   ],
  // },
])
const kwaData = ref([
  // {
  //   id: 'A1-B1',
  //   name: '中断系统-代码编写能力'
  // },
  // {
  //   id: 'A1-B2',
  //   name: '中断系统-实验能力'
  // },
  // {
  //   id: 'A1-B3',
  //   name: '中断系统-概念辨识能力'
  // },
  // {
  //   id: 'A1-B4',
  //   name: '中断系统-直接应用能力'
  // },
  // {
  //   id: 'A1-B5',
  //   name: '中断系统-程序实验能力'
  // },
  // {
  //   id: 'A2-B6',
  //   name: '串口并口通讯-程序实验能力'
  // },
  // {
  //   id: 'A2-B1',
  //   name: '串口并口通讯-代码编写能力'
  // },
  // {
  //   id: 'A2-B2',
  //   name: '串口并口通讯-实验能力'
  // },
]);


//-------------------------处理方法
//children行class显示
const tableRowClassName = ({ row, rowIndex }) => {
  // console.log(row);
  if (row.isChildren) {
    return 'child-row'
  }
  return ''
}

//初始化
onMounted(() => {
  loadKwaData();
  loadData();
});
const loadKwaData = () => {
  request.evaluation.get('/evaluation/kwadict').then((res) => {
    if (res.code === 200) {
      kwaData.value = res.data;
      kwaData.value.forEach(item => {
        // ElMessage.success(item.name);
      })
    } else {
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('获取失败' + error);
  })
}
const loadData = () => {
  request.evaluation.get('/evaluation/knowledgeUnit/getKnowledgeUnitTree?courseid=' + courseid).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data;
      initialize();
    } else {
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('获取失败' + error);
  })
}
const initialize = () => {
  tableData.value.forEach((item) => {
    item.datavalue = Number(item.datavalue).toFixed(2);
    // item.kwas = [];
    item.isChildren = false;
    editRef.value.set(item.id, { "editName": false, "editDataValue": false });
    if (item.children) {
      item.children.forEach((i) => {
        i.datavalue = Number(i.datavalue).toFixed(2);
        i.isChildren = true;
        i.parentType = item.type;
        editRef.value.set(i.id, { "editName": false, "editDataValue": false });
        // if(i.kwas){
        //   item.kwas=item.kwas.concat(i.kwas);
        //   item.kwas=[...new Set(item.kwas.map(mapItem => JSON.stringify(mapItem)))].map(mapItem => JSON.parse(mapItem));
        //   item.kwas.sort((a, b) => a.id.localeCompare(b.id));
        // }
        updateTempKwa(i);
        // i.tempKwas.forEach(item => {
        //   ElMessage.success(item.name);
        // });
      });
    }
    updateTempKwa(item);
  });
}

const updateTempKwa = (row) => {
  row.tempKwas = [];
  row.kwas.forEach(kwa => {
    row.tempKwas.push(kwaData.value.find(data => {
      return data.id === kwa.kwaid;
    }));
  });
}

//选中
const handleSelectionChange = (val) => {
  multipleSelection = val;
}

//选中行
const changeSelRow = (row) => {
  if (row) {
    if (!row.isChildren) {
      selParent.value = row;
    } else {
      selParent.value = null;
    }
  } else {
    selParent.value = null;
  }
};

// var idCache = 100;

//创建章
const createParentData = () => {
  var newData = {
    courseid: courseid,
    type: '未命名的章节',
    name: '未命名的名称',
    datavalue: 0.00,
  }
  request.evaluation.post('/evaluation/knowledgeUnit/insertChapter', newData).then((res) => {
    if (res.code === 200) {
      loadData();
      ElMessage.success('新增成功');
    } else {
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('新增失败' + error);
  });
}

//创建节
const createChildrenData = () => {
  // if(!selParent.value.children){
  //   selParent.value.children = [];
  // }
  var newData = {
    courseid: courseid,
    pid: selParent.value.id,
    type: '未命名的小节',
    name: '未命名的名称',
    datavalue: 0.00,
  }
  request.evaluation.post('/evaluation/knowledgeUnit/insertSection', newData).then((res) => {
    if (res.code === 200) {
      loadData();
      ElMessage.success('新增成功');
    } else {
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('新增失败' + error);
  });
  // selParent.value.children.push({
  //   id: idCache++,
  //   type: '未命名的小节',
  //   name: '未命名的名称',
  //   datavalue: 0.00,
  // });
}

//双击修改章节、名称
const editEditRef = (row, field) => {
  editRef.value.get(row.id)[field] = true;
  setTimeout(() => {
    if (field === 'editType') {
      inputTypeRef.value.focus();
    } else if (field === 'editName') {
      inputNameRef.value.focus();
    } else if (field === 'editDataValue') {
      inputDataValueRef.value.focus();
    }
  }, 0);
};

//保存章节、名称修改
const saveEditRef = (row, field) => {
  editRef.value.get(row.id)[field] = false;
  request.evaluation.post('/evaluation/knowledgeUnit/updateKnowledgeUnit', row).then((res) => {
    if (res.code === 200) {
      loadData();
      ElMessage.success('更新成功');
    } else {
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('更新失败' + error);
  });
  //信息已被修改，处理
};

// const loadEditKwa = (row) => {
//   row.kwas.forEach(item => {
//     tempKwaData.value.push(kwaData.value.find(value => {
//       value.id = item.kwaid;
//     }))
//   })
// }

//保存kwa修改
const saveEditKwa = (row) => {
  var newKwas = [];
  var deleteKwas = [];
  row.kwas.forEach(item => {
    if (row.tempKwas.find(ele => {
      return ele.id === item.kwaid;
    }) === undefined) {
      //删除这个kwa
      deleteKwas.push(item.kwaid);
    } else {
      newKwas.push(item);
    }
  })
  if (deleteKwas.length !== 0) {
    request.evaluation.post('/evaluation/knowledgeUnit/deleteKnowledgeUnitKwa?unitid=' + row.id, deleteKwas).then((res) => {
      if (res.code === 200) {
        // ElMessage.success('删除kwa成功');
      } else {
        ElMessage.error(res.msg);
      }
    }).catch((error) => {
      ElMessage.error('删除kwa失败' + error);
    });
  }
  row.tempKwas.forEach(item => {
    if (newKwas.find(ele => {
      return ele.kwaid === item.id;
    }) === undefined) {
      //新加这个kwa
      var newKwa = {
        unitid: row.id,
        kwaid: item.id,
        statue: 0,
      };
      newKwas.push(newKwa);
      request.evaluation.post('/evaluation/knowledgeUnit/insertKnowledgeUnitKwa', newKwa).then((res) => {
        if (res.code === 200) {
          // ElMessage.success('添加kwa成功');
        } else {
          ElMessage.error(res.msg);
        }
      }).catch((error) => {
        ElMessage.error('添加kwa失败' + error);
      });
    }
  })
  loadData();
}

//删除章
const deleteSel = () => {
  if (multipleSelection.length === 0) {
    ElMessage({
      type: 'warning',
      message: '未选择关键字',
      duration: 800
    });
    return;
  }
  ElMessageBox.confirm(
    '选中的知识单元将被删除，是否确定',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    var ids = [];
    for (const sel of multipleSelection) {
      ids.push(sel.id);
    }
    request.evaluation.post('/evaluation/knowledgeUnit/deleteKnowledgeUnit', ids).then((res) => {
      if (res.code === 200) {
        loadData();
        ElMessage.success('删除成功');
      } else {
        ElMessage.error(res.msg);
      }
    }).catch((error) => {
      ElMessage.error('删除失败' + error);
    });
  }).catch(() => { })
}
</script>

<style scoped>
.el-table>>>.child-row {
  background-color: rgb(250, 250, 250);
  /*color:royalblue*/
}
</style>