<template>
  <el-container style="height: 92vh;">
    <!--两个按钮，靠最左-->
    <el-header
        style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="primary" style="margin-left: 0.8vw;" @click="handleClassAdd">新增班级</el-button>
      <AddClassDialog  v-show="dialogVisible"  ref="DialogShow" @formSubmitted="getTableData"/>
      <el-button type="danger" @click="deleteClass">删除班级</el-button>
      <!--      <el-button type="success" @click="">保存</el-button>-->
    </el-header>
    <el-main style="padding:0px 5px">
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item
        v-for="item in tableData"
        :key="item.id"
        :name="item.obsname"
    >
      <template #title>
        <span style="font-size: 20px;">{{ item.obsname }}</span>
      </template>
      <div v-if="activeNames.includes(item.obsname)" style="display: flex; flex-direction: column;">
        <div v-for="grade in uniqueGrades(item.cmClassList)" :key="grade" class="grade-group" style="display: flex; align-items: center;">
          <div style="margin-right: 20px"><span style="font-size: 15px;" class="grade-label">{{ grade }}级 :</span></div>
          <el-checkbox-group v-model="selectedClasses">
          <el-checkbox v-for="classItem in getClassesByGrade(item.cmClassList, grade)"
                       :key="classItem.id"
                       :label="classItem.id">
<!--            @change="handleCheckboxChange"-->
            {{ classItem.classname }}
<!--            <el-icon @click="removeClass(item, classItem)"><Close/></el-icon>-->
          </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted,watch  } from 'vue';
import { ElMessage } from 'element-plus';
import {useProfileStore} from '../stores/profileStore.js';
import {Close} from '@element-plus/icons-vue'
import request from "../utils/request.js";
import AddClassDialog from "./subcomponents/AddClassDialog.vue";
import AddPeopleDialog from "./subcomponents/AddPeopleDialog.vue";

const profileStore = useProfileStore();
const loginInfo = ref({
  userid: profileStore.profileid,
  roleid: profileStore.profileroleid,
  catelog: profileStore.profilecatelog,
});

const tableData = ref([]);
const activeNames = ref([]);
const getTableData = () => {
  // 假设 request.post 是您项目中的请求方法
  // 这里需要替换为您实际的请求逻辑
  request.post('sysmangt/classmangt', loginInfo.value)
      .then(res => {
        if (res.code === 200) {
          tableData.value = res.data;
          initialize()
        }
      })
      .catch(() => {
        ElMessage({
          type: 'error',
          message: '获取专业列表失败'
        });
      });
};

const professionList = ref([])
const classList = ref([])

const initialize = () => {
  tableData.value.forEach(item => {   // 为每一个表格数据添加是否显示输入框的判定
    const professionItem = {
      id: item.id,
      obsname: item.obsname,
    };
    professionList.value.push(professionItem);

  });
};



const selectedClasses = ref([]);
watch(selectedClasses, (newVal, oldVal) => {
  // console.log('选中的班级变化:', newVal, '之前的值:', oldVal);
  console.log(selectedClasses.value)
  // 这里可以根据需要执行其他逻辑
});

const uniqueGrades = (classList) => {
  return Array.from(new Set(classList.map(item => item.grade)));
};

const getClassesByGrade = (classList, grade) => {
  return classList.filter(item => item.grade === grade);
};

const handleChange = (val) => {
  activeNames.value = val;
};

// const removeClass = (item, classItem) => {
//   const index = item.cmClassList.findIndex(el => el.id === classItem.id);
//   if (index !== -1) {
//     item.cmClassList.splice(index, 1);
//     ElMessage.success('班级删除成功');
//   }
// };

const dialogVisible = ref(false);
const DialogShow = ref(null);

const handleClassAdd = () =>{
  console.log(professionList.value)
  console.log(tableData.value)
  // newform.obsname = currentobsname.value;
  //
  dialogVisible.value = true;  // 打开弹窗


  DialogShow.value.init(professionList.value);
}

const deleteClass = () => {
  console.log(selectedClasses.value)
  request.post('/sysmangt/classmangt/delete', selectedClasses.value)
      .then(res => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '删除班级成功'
          });
          // emit('formSubmitted');
          getTableData();

        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '删除班级失败'
    });
  })
}

onMounted(() => {
  // 假设这里已经加载了数据到tableData
  getTableData();
});
</script>

<style scoped>
.grade-group {
  margin-bottom: 10px;
}

.grade-label {
  font-weight: bold;
}

.class-tag {
  margin-left: 5px;
}
/deep/.el-collapse-item__content{
  padding-bottom :0px;
}
</style>