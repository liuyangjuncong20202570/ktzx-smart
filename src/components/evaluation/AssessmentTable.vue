<template>
  <el-container style="height: 92vh;">
    <!--两个按钮，靠最左-->
    <el-header style="height: auto; padding: 5px 0; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="success" @click="">  保存</el-button>
      <el-button type="primary" style="margin-left: 0.8vw;" @click="">上传成绩</el-button>
      <el-button type="primary" style="margin-left: 0.8vw;" @click="">下载成绩</el-button>
      <div style="width: 100%;font-weight: bold; font-size: 25px;">课程名称</div>
    </el-header>
    <el-main style="padding: 0; overflow: auto; background-color: white;">
      <el-table :data="tableData" style="width: 100%;" :cell-style="cellItemNameStyle" :header-cell-style="rowStyle">
        <el-table-column align="center" prop="name" label="课程目标" width="300">
        </el-table-column>
        <el-table-column
            v-for="(item, index) in tableColumns"
            align="center"
            :prop="item.id"
            :label="item.itemName"
            :key="index">

          <template #default="tableRowData">
            <el-table-column
                v-if="item.childrens && item.childrens.length>0"
                v-for="(child1, childIndex1) in item.childrens"
                align="center"
                :prop="child1.id"
                :label="child1.itemName"
                :key="childIndex1">

              <template #default="tableRowData">
                <el-table-column
                    v-if="child1.childrens && child1.childrens.length>0"
                    v-for="(child2, childIndex2) in child1.childrens"
                    align="center"
                    :prop="child2.id"
                    :label="child2.itemName"
                    :key="childIndex2">
                </el-table-column>
                <div v-else>
                  <span v-if="editRef.get(tableRowData.row.id)[child1.id] === undefined"
                    @dblclick="editEditRef(tableRowData.row, child1.id)">{{ tableRowData.row[child1.id] }}</span>
                  <el-input :ref="el => inputRefs.set(child1.id, el)" v-else v-model="tableRowData.row[child1.id]"
                            @blur="saveEditRef(tableRowData.row, child1.id)"
                            @keyup.enter="saveEditRef(tableRowData.row, child1.id)"></el-input>
                </div>
              </template>

            </el-table-column>
            <div v-else>
              <span v-if="editRef.get(tableRowData.row.id)[item.id] === undefined"
                    @dblclick="editEditRef(tableRowData.row, item.id)">{{ tableRowData.row[item.id] }}</span>
              <el-input :ref="el => inputRefs.set(item.id, el)" v-else v-model="tableRowData.row[item.id]"
                        @blur="saveEditRef(tableRowData.row, item.id)"
                        @keyup.enter="saveEditRef(tableRowData.row, item.id)"></el-input>
            </div>
          </template>

        </el-table-column>
        <template #append>
          <div style="text-align: center">
            <el-table :data="tableAppendDataFirst" style="width: 100%;" :cell-style="{'background-color': '#eaeaea',color: '#000000','border-color': '#bdbdbd'}"
                      :span-method="spanMethod" :show-header="false" border>
              <el-table-column align="center" prop="name" width="300"></el-table-column>
              <el-table-column
                  v-for="(item, index) in tableColumns"
                  align="center"
                  :prop="item.id"
                  :label="item.itemName"
                  :key="index">
                <template #default="tableRowData">
                  <el-table-column
                      v-if="item.childrens && item.childrens.length > 0"
                      v-for="(child1, childIndex1) in item.childrens"
                      align="center"
                      :prop="child1.id"
                      :label="child1.itemName"
                      :key="childIndex1">
                    <template #default="tableRowData">
                      <div v-html="tableRowData.row[child1.id]"></div>
                    </template>
                  </el-table-column>
                  <div v-else v-html="tableRowData.row[item.id]"></div>
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="tableAppendDataSecond" style="width: 100%;" :cell-style="cellItemNameStyle"
                      :span-method="spanMethod" :show-header="false" border>
              <el-table-column align="center" prop="name" width="300"></el-table-column>
              <el-table-column
                  v-for="(item, index) in tableColumns"
                  align="center"
                  :prop="item.id"
                  :label="item.itemName"
                  :key="index">
                <template #default="tableRowData">
                  <el-table-column
                      v-if="item.childrens && item.childrens.length > 0"
                      v-for="(child1, childIndex1) in item.childrens"
                      align="center"
                      :prop="child1.id"
                      :label="child1.itemName"
                      :key="childIndex1">
                    <template #default="tableRowData">
                      <div>
                        <span v-if="editRef.get('percent')[child1.id] === undefined"
                              @dblclick="editEditRef('percent',child1.id)">{{ tableRowData.row[child1.id] }}</span>
                        <el-input :ref="el => inputRefs.set('percent' + child1.id, el)" v-else v-model="tableRowData.row[child1.id]"
                                  @blur="saveEditRef(tableRowData.row, child1.id,'percent')"
                                  @keyup.enter="saveEditRef(tableRowData.row, child1.id,'percent')"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <div v-else>
                    <span v-if="editRef.get('percent')[item.id] === undefined"
                              @dblclick="editEditRef('percent', item.id)">{{ tableRowData.row[item.id] }}</span>
                    <el-input :ref="el => inputRefs.set('percent' + item.id, el)" v-else v-model="tableRowData.row[item.id]"
                              @blur="saveEditRef(tableRowData.row, item.id,'percent')"
                              @keyup.enter="saveEditRef(tableRowData.row, item.id,'percent')"></el-input>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import {ElMessage,ElMessageBox} from "element-plus";
import request from "../../utils/request";

//---------------------------------------------数据存储区
const courseId = '1';
const tableColumns = ref([]);
var tableColumnNumAttribute = new Map();
var tableNodeParent = new Map();
const tableData = ref([]);
const tableAppendDataFirst = ref([
  {
    name: '分数合计',
    // num1: 0,
    // num2: 0,
  },
]);
const tableAppendDataSecond = ref([
  {
    name: '总评占比',
    // num1: 0,
    // num2: 0,
  },
]);
const editRef = ref(new Map());
const inputRefs = ref(new Map());

//---------------------------------------------处理方法区
const cellItemNameStyle = ({ row, column, rowIndex, columnIndex }) => {
  if(columnIndex === 0){
    return {
      'background-color': '#eaeaea',
      color: '#000000',
      'border-color': '#bdbdbd'
    };
  }else{
    return {
      'border-color': '#bdbdbd'
    }
  }
}

const rowStyle = ({row, column, rowIndex, columnIndex}) => {
  return {
    'border-color': '#bdbdbd'
  }
}


const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex === 0 && columnIndex !== 0) {
    let id = tableColumnNumAttribute.get(columnIndex);
    if(id === tableColumnNumAttribute.get(columnIndex-1)){
      return [0,0];
    }
    let columnSpan = 1;
    for (let i = columnIndex + 1; i <= tableColumnNumAttribute.size; i++) {
      if (tableColumnNumAttribute.get(i) === id) {
        columnSpan++;
      } else {
        break;
      }
    }
    return [1,columnSpan]; // 返回合并信息
  }
}

//初始化分数合计
onMounted(() => {
  loadData();
});

const loadData = () => {
  request.evaluation.get('/evaluation/assessmentPlan/getAssessmentTable?courseid=' + courseId).then((res) => {
    if(res.code === 200){
      tableColumns.value = res.data.head;
      tableData.value = res.data.items;
      initialize(res.data.percent);
    }else{
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('获取失败' + error);
  })
}

const initialize = (percentData) => {
  tableColumnNumAttribute = new Map();
  var count = 1;
  //设置列的分类
  tableColumnNumAttribute.set(0,-1);
  tableColumns.value.forEach(item => {
    if(item.childrens && item.childrens.length > 0){
      count = updateTableColumnNumAttribute(item.childrens,item.id,count);
    }else{
      tableColumnNumAttribute.set(count,item.id);
      count++;
    }
  });
  //合计
  //遍历列
  tableColumns.value.forEach(item => {
    var sum = 0;
    if(item.childrens && item.childrens.length > 0){
      let cItem = item.childrens[0];
      while(cItem.childrens.length > 0){
        cItem = cItem.childrens[0];
      }
      tableNodeParent.set(cItem.id,item.id);
      tableAppendDataSecond.value[0][cItem.id] = percentData[item.id];
      item.childrens.forEach(child => {
        sum = countSum(child,sum);
      });
      tableAppendDataFirst.value[0][cItem.id] = sum;
    }else{
      sum = countSum(item,0);
      tableAppendDataFirst.value[0][item.id] = sum;
      tableNodeParent.set(item.id,item.id);
      tableAppendDataSecond.value[0][item.id] = percentData[item.id];
    }
  });
  Object.keys(tableAppendDataFirst.value[0]).forEach(key => {
    if(key !== "name" && tableAppendDataFirst.value[0][key].toString() !== "100"){
      tableAppendDataFirst.value[0][key] = "<span>" + tableAppendDataFirst.value[0][key] + "<span style='color: red;'> (分数合计需为100)</span></span>";
    }
  });
  editRef.value.set('percent',{});
  tableData.value.forEach(item => {
    editRef.value.set(item.id,{});
  });
}
const updateTableColumnNumAttribute = (array,id,count) => {
  array.forEach(item => {
    if(item.childrens.length > 0){
      updateTableColumnNumAttribute(item.childrens,id,count);
    }else{
      tableColumnNumAttribute.set(count,id);
      count++;
    }
  });
  return count;
}
const countSum = (item,count) => {
  if(item.childrens && item.childrens.length > 0){
    item.childrens.forEach(child => {
      count = countSum(child,count);
    });
  }else{
    tableData.value.forEach(data => {
      if(data[item.id]){
        count += data[item.id];
      }else{
        data[item.id] = 0;
      }
    })
  }
  return count;
}

//双击修改
const editEditRef = (row,id) => {
  if(row === "percent"){
    editRef.value.get("percent")[id] = true;
    setTimeout(() => {
      inputRefs.value.get('percent' + id).focus();
    }, 0);
  }{
    editRef.value.get(row.id)[id] = true;
    setTimeout(() => {
      inputRefs.value.get(id).focus();
    }, 0);
  }
};

//保存
const saveEditRef = (row,id,type) => {
  if(!Number(row[id])){
    ElMessage.error("输入了不合法的分数.");
    loadData();
    return;
  }
  if(type === "percent"){
    editRef.value.get("percent")[id] = undefined;
    var data = {
      "id": tableNodeParent.get(id),
      "percent": row[id]
    }
    request.evaluation.post('/evaluation/assessmentPlan/updatePercent', data).then((res) => {
      if(res.code === 200){
        ElMessage.success("修改成功.");
        loadData();
      }else{
        ElMessage.error(res.msg);
      }
    }).catch((error) => {
      ElMessage.error('修改失败' + error);
    });
  }else{
    editRef.value.get(row.id)[id] = undefined;
    data = {
      "courseid": courseId,
      "coursetargetId": row.id,
      "checkitemId": id,
      "standardScore": row[id]
    }
    request.evaluation.post('/evaluation/assessmentPlan/updateStandardScore', data).then((res) => {
      if(res.code === 200){
        ElMessage.success("修改成功.");
        loadData();
      }else{
        ElMessage.error(res.msg);
      }
    }).catch((error) => {
      ElMessage.error('修改失败' + error);
    });
  }
};


</script>
<style scoped>
.appendTable{
  background-color: #a8a8a8; /* 深色背景 */
}
</style>