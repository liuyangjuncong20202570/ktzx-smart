<template>
  <el-container style="height: 92vh;">
    <!--两个按钮，靠最左-->
    <el-header style="height: auto; padding: 5px 0; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="success" @click="">  保存</el-button>
      <el-button type="primary" style="margin-left: 0.8vw;" @click="">上传成绩</el-button>
      <el-button type="primary" style="margin-left: 0.8vw;" @click="">下载成绩</el-button>
      <div class="flex-container"  style="width: 100%;font-weight: bold; font-size: 25px;">课程名称</div>
    </el-header>
    <el-main style="padding: 0; overflow: auto; background-color: white;">
      <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" size="large"
                :cell-style="{color: '#000000','border-color': '#cecece'}"
                :header-cell-style="{'text-align': 'center',color: '#000000','border-color': '#cecece'}">
        <el-table-column label="课程各类考核项">
          <el-table-column prop="name" label="课程目标" width="300"></el-table-column>
          <el-table-column label="平时">
            <el-table-column prop="s1" label="平时作业" width="180">
              <template #default="tableRowData">
                <span v-if="!editRef.get(tableRowData.row.id)['editS1']"
                      @dblclick="editEditRef(tableRowData.row,'editS1')">{{ tableRowData.row.s1 }}</span>
                <el-input ref="inputS1" v-else v-model="tableRowData.row.s1" @blur="saveEditRef(tableRowData.row,'editS1')"
                          @keyup.enter="saveEditRef(tableRowData.row,'editS1')"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="s2" label="课堂表现" width="180">
              <template #default="tableRowData">
                <span v-if="!editRef.get(tableRowData.row.id)['editS2']"
                      @dblclick="editEditRef(tableRowData.row,'editS2')">{{ tableRowData.row.s2 }}</span>
                <el-input ref="inputS2" v-else v-model="tableRowData.row.s2" @blur="saveEditRef(tableRowData.row,'editS2')"
                          @keyup.enter="saveEditRef(tableRowData.row,'editS2')"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="s3" label="课外综合" width="180">
              <template #default="tableRowData">
                <span v-if="!editRef.get(tableRowData.row.id)['editS3']"
                      @dblclick="editEditRef(tableRowData.row,'editS3')">{{ tableRowData.row.s3 }}</span>
                <el-input ref="inputS3" v-else v-model="tableRowData.row.s3" @blur="saveEditRef(tableRowData.row,'editS3')"
                          @keyup.enter="saveEditRef(tableRowData.row,'editS3')"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="s4" label="课程实验" width="180">
              <template #default="tableRowData">
                <span v-if="!editRef.get(tableRowData.row.id)['editS4']"
                      @dblclick="editEditRef(tableRowData.row,'editS4')">{{ tableRowData.row.s4 }}</span>
                <el-input ref="inputS4" v-else v-model="tableRowData.row.s4" @blur="saveEditRef(tableRowData.row,'editS4')"
                          @keyup.enter="saveEditRef(tableRowData.row,'editS4')"></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="s5" label="期末">
            <template #default="tableRowData">
                <span v-if="!editRef.get(tableRowData.row.id)['editS5']"
                      @dblclick="editEditRef(tableRowData.row,'editS5')">{{ tableRowData.row.s5 }}</span>
              <el-input ref="inputS5" v-else v-model="tableRowData.row.s5" @blur="saveEditRef(tableRowData.row,'editS5')"
                        @keyup.enter="saveEditRef(tableRowData.row,'editS5')"></el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <template #append>
          <div style="text-align: center">
            <el-table :data="tableAppendDataFirst" style="width: 100%;" :cell-style="{'background-color': '#eaeaea',color: '#000000','border-color': '#cecece'}" :show-header="false" border>
              <el-table-column align="center" width="300" prop="name"></el-table-column>
              <el-table-column align="center" width="720" prop="num1">
                <template #default="tableRowData">
                  <div v-html="tableRowData.row.num1"></div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="num2">
                <template #default="tableRowData">
                  <div v-html="tableRowData.row.num2"></div>
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="tableAppendDataSecond" style="width: 100%;" :cell-style="{color: '#000000','border-color': '#cecece'}" :show-header="false" border>
              <el-table-column align="center" width="300" prop="name"></el-table-column>
              <el-table-column align="center" width="720" prop="num1">
                <template #default="tableRowData">
                  <span v-if="!editNpRef"
                      @dblclick="editEditRef(tableRowData.row,'editNp')">{{ tableRowData.row.num1 }}</span>
                  <el-input ref="inputNp" v-else v-model="tableRowData.row.num1" @blur="saveEditRef(tableRowData.row,'editNp')"
                            @keyup.enter="saveEditRef(tableRowData.row,'editNp')"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="num2">
                <template #default="tableRowData">
                  <span v-if="!editEpRef"
                      @dblclick="editEditRef(tableRowData.row,'editEp')">{{ tableRowData.row.num2 }}</span>
                  <el-input ref="inputEp" v-else v-model="tableRowData.row.num2" @blur="saveEditRef(tableRowData.row,'editEp')"
                            @keyup.enter="saveEditRef(tableRowData.row,'editEp')"></el-input>
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
const courseId = '2c918af681fa6ea7018209a505c30672';
const tableData = ref(null);
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
const editNpRef = ref(false);
const editEpRef = ref(false);
const inputS1 = ref();
const inputS2 = ref();
const inputS3 = ref();
const inputS4 = ref();
const inputS5 = ref();
const inputNp = ref();
const inputEp = ref();

//---------------------------------------------处理方法区

//初始化分数合计
onMounted(() => {
  loadData();
});

const loadData = () => {
  request.evaluation.get('/evaluation/assessmentPlan/getAssessmentPlanTable?courseid=' + courseId).then((res) => {
    if(res.code === 200){
      tableData.value = res.data.items;
      initialize();
      tableAppendDataSecond.value[0].num1 = res.data.proportion.nproportion;
      tableAppendDataSecond.value[0].num2 = res.data.proportion.eproportion;
    }else{
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error('获取失败' + error);
  })
}

const initialize = () => {
  var sum1=Number(0);
  var sum2=Number(0);
  tableData.value.forEach(item => {
    sum1 += Number(item.s1) + Number(item.s2) + Number(item.s3) + Number(item.s4);
    sum2 += Number(item.s5);
    editRef.value.set(item.id, { "editS1": false, "editS2": false, "editS3": false, "editS4": false, "editS5": false});
  });
  if(sum1 === 100){
    tableAppendDataFirst.value[0].num1 = "100";
  }else{
    tableAppendDataFirst.value[0].num1 = "<span>" + sum1 + "<span style='color: red;'> (分数合计需为100)</span></span>";
  }
  if(sum2 === 100){
    tableAppendDataFirst.value[0].num2 = "100";
  }else{
    tableAppendDataFirst.value[0].num2 = "<span>" + sum2 + "<span style='color: red;'> (分数合计需为100)</span></span>";
  }
}

//双击修改
const editEditRef = (row,field) => {
  if(field === 'editNp' || field === 'editEp'){
    if(field === 'editNp'){
      editNpRef.value = true;
      setTimeout(() => {
        inputNp.value.focus();
      }, 0);
    }else{
      editEpRef.value = true;
      setTimeout(() => {
        inputEp.value.focus();
      }, 0);
    }
  }else{
    editRef.value.get(row.id)[field] = true;
    setTimeout(() => {
      if(field === 'editS1'){
        inputS1.value.focus();
      }else if(field === 'editS2'){
        inputS2.value.focus();
      }else if(field === 'editS3'){
        inputS3.value.focus();
      }else if(field === 'editS4'){
        inputS4.value.focus();
      }else if(field === 'editS5'){
        inputS5.value.focus();
      }
    }, 0);
  }
};

//保存
const saveEditRef = (row,field) => {
  if (field === 'editNp' || field === 'editEp') {
    if(field === 'editNp'){
      editNpRef.value = false;
      tableAppendDataSecond.value[0].num2 = 100-tableAppendDataSecond.value[0].num1;
    }else{
      editEpRef.value = false;
      tableAppendDataSecond.value[0].num1 = 100-tableAppendDataSecond.value[0].num2;
    }
    var newData1 = {
      courseid: courseId,
      nproportion: tableAppendDataSecond.value[0].num1,
      eproportion: tableAppendDataSecond.value[0].num2,
    }
    request.evaluation.post('/evaluation/assessmentPlan/updateAssessmentPlanProportion', newData1).then((res) => {
      if(res.code === 200){
        loadData();
      }else{
        ElMessage.error(res.msg);
      }
    }).catch((error) => {
      ElMessage.error('修改失败' + error);
    });
  } else {
    editRef.value.get(row.id)[field] = false;
    var newData2 = {
      id: row.id,
      s1: row.s1,
      s2: row.s2,
      s3: row.s3,
      s4: row.s4,
      s5: row.s5,
    }
    request.evaluation.post('/evaluation/assessmentPlan/updateAssessmentPlanItem', newData2).then((res) => {
      if(res.code === 200){
        loadData();
      }else{
        ElMessage.error(res.msg);
      }
    }).catch((error) => {
      ElMessage.error('修改失败' + error);
    });
  }
  //信息已被修改，处理
};


</script>
<style scoped>
.appendTable{
  background-color: #a8a8a8; /* 深色背景 */
}
</style>