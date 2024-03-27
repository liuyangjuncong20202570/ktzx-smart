<template>
  <el-container style="height: 92vh;">
    <!--两个按钮，靠最左-->
    <el-header
        style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
      <el-button type="primary" style="margin-left: 0.8vw;" @click="handleClassAdd">新增班级</el-button>
      <el-button type="danger" @click="deleteClass">删除班级</el-button>
      <AddClassDialog  v-show="dialogVisible"  ref="DialogShow" @formSubmitted="getTableData"/>
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
                       :label="classItem.id"
            @change="handleCheckboxChange(classItem.id,item.obsname)">
            {{ classItem.classname }}
<!--            <el-icon @click="removeClass(item, classItem)"><Close/></el-icon>-->
          </el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-if="activeNames.includes(item.obsname) && currentStudentsData[item.obsname].length > 0">
        <el-table v-if="selectedClasses.length > 0" :data="currentStudentsData[item.obsname]" style="width: 100%;height: auto" stripe>
<!--          <el-table-column type="index" width="50"></el-table-column>-->
          <el-table-column prop="id" label="序号"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="studentId" label="学号"></el-table-column>
          <el-table-column prop="className" label="班级"></el-table-column>
        </el-table>
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
import {useProfileStore} from '../../stores/profileStore.js';
import {Close} from '@element-plus/icons-vue'
import request from "../../utils/request.js";
import AddClassDialog from "./subcomponents/AddClassDialog.vue";
import AddPeopleDialog from "./subcomponents/AddPeopleDialog.vue";

const selectedClasses = ref([]);

const currentStudentsData = ref({});


const profileStore = useProfileStore();
const loginInfo = ref({
  userid: profileStore.profileid,
  roleid: profileStore.profileroleid,
  catelog: profileStore.profilecatelog,
});
const currentClassId = ref([])

const tableData = ref([]);
const activeNames = ref([]);
const getTableData = () => {
  // 假设 request.post 是您项目中的请求方法
  // 这里需要替换为您实际的请求逻辑
  request.admin.post('sysmangt/classmangt', loginInfo.value)
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
const studentsData = ref([
  { "id": "001", "name": "张三", "classId": "1597933787-748aca38-95d5-4132-a361-03591b045ace", "studentId": "202101","className":"计算机-21-1班" },
  { "id": "002", "name": "李四", "classId": "1597933787-748aca38-95d5-4132-a361-03591b045ace", "studentId": "202102","className":"计算机-21-1班" },
  { "id": "003", "name": "王五", "classId": "1597933787-748aca38-95d5-4132-a361-03591b045ace", "studentId": "202103","className":"计算机-21-1班" },
  { "id": "004", "name": "赵六", "classId": "1597933787-748aca38-95d5-4132-a361-03591b045ace", "studentId": "202104","className":"计算机-21-1班" },
  { "id": "005", "name": "钱七", "classId": "1597933787-748aca38-95d5-4132-a361-03591b045ace", "studentId": "202105","className":"计算机-21-1班" },
  { "id": "006", "name": "孙八", "classId": "1597933787-748aca38-95d5-4132-a361-03591b045ace", "studentId": "202106","className":"计算机-21-1班" },
  { "id": "007", "name": "周九", "classId": "1597933787-748aca38-95d5-4132-a361-03591b045ace", "studentId": "202107","className":"计算机-21-1班" },
  { "id": "008", "name": "吴十", "classId": "1597933787-748aca38-95d5-4132-a361-03591b045ace", "studentId": "202108","className":"计算机-21-1班" },
  { "id": "009", "name": "郑十一", "classId": "1597933787-748aca38-95d5-4132-a361-03591b045ace", "studentId": "202109","className":"计算机-21-1班" },
  { "id": "010", "name": "王十二", "classId": "1597933787-748aca38-95d5-4132-a361-03591b045ace", "studentId": "202110","className":"计算机-21-1班" },
  { "id": "011", "name": "陈十三", "classId": "4456565", "studentId": "202301","className":"计算机23-1班" },
  { "id": "012", "name": "林十四", "classId": "4456565", "studentId": "202302","className":"计算机23-1班" },
  { "id": "013", "name": "张十五", "classId": "4456565", "studentId": "202303","className":"计算机23-1班" },
  { "id": "014", "name": "李十六", "classId": "4456565", "studentId": "202304","className":"计算机23-1班" },
  { "id": "015", "name": "王十七", "classId": "4456565", "studentId": "202305","className":"计算机23-1班" },
  { "id": "016", "name": "赵十八", "classId": "4456565", "studentId": "202306","className":"计算机23-1班" },
  { "id": "017", "name": "钱十九", "classId": "4456565", "studentId": "202307","className":"计算机23-1班" },
  { "id": "018", "name": "孙二十", "classId": "4456565", "studentId": "202308","className":"计算机23-1班" },
  { "id": "019", "name": "周二十一", "classId": "4456565", "studentId": "202309","className":"计算机23-1班" },
  { "id": "020", "name": "吴二十二", "classId": "4456565", "studentId": "202310","className":"计算机23-1班" },
  { "id": "001", "name": "张sdad", "classId": "1597933787-2c1921fb-1749-4322-90fd-0500870a8b1b", "studentId": "202101","className":"物联网23-1班" },
  { "id": "002", "name": "李asdad", "classId": "1597933787-2c1921fb-1749-4322-90fd-0500870a8b1b", "studentId": "202102","className":"物联网23-1班" },
  { "id": "003", "name": "王2232", "classId": "1597933787-2c1921fb-1749-4322-90fd-0500870a8b1b", "studentId": "202103","className":"物联网23-1班" },
  { "id": "004", "name": "赵565", "classId": "1597933787-2c1921fb-1749-4322-90fd-0500870a8b1b", "studentId": "202104","className":"物联网23-1班" },
  { "id": "005", "name": "钱77", "classId": "1597933787-2c1921fb-1749-4322-90fd-0500870a8b1b", "studentId": "202105","className":"物联网23-1班" },
  { "id": "006", "name": "孙八", "classId": "1597933787-2c1921fb-1749-4322-90fd-0500870a8b1b", "studentId": "202106","className":"物联网23-1班" },
  { "id": "007", "name": "周九", "classId": "1597933787-2c1921fb-1749-4322-90fd-0500870a8b1b", "studentId": "202107","className":"物联网23-1班" },
  { "id": "008", "name": "吴十", "classId": "1597933787-2c1921fb-1749-4322-90fd-0500870a8b1b", "studentId": "202108","className":"物联网23-1班" },
  { "id": "009", "name": "郑十一", "classId": "1597933787-2c1921fb-1749-4322-90fd-0500870a8b1b", "studentId": "202109","className":"物联网23-1班" },
  { "id": "010", "name": "王十二", "classId": "1597933787-2c1921fb-1749-4322-90fd-0500870a8b1b", "studentId": "202110","className":"物联网23-1班" }

]);


const initialize = () => {
  tableData.value.forEach(item => {   // 为每一个表格数据添加是否显示输入框的判定
    const professionItem = {
      id: item.id,
      obsname: item.obsname,
    };
    professionList.value.push(professionItem);
    currentStudentsData.value[item.obsname] = []; // 为每个专业设置默认的空数组

  });
};

const handleCheckboxChange = (classId, obaName) => {
  console.log(classId, obaName)
  // 当选中复选框时
  if (selectedClasses.value.includes(classId)) {
    // 如果是添加到选中的班级，则直接使用getStudentsByClassId获取数据
    const students = getStudentsByClassId(classId, obaName);

    // 更新currentStudentsData中的数据
    const currentTableData = currentStudentsData.value[obaName] || [];
    currentTableData.push(...students);
    currentStudentsData.value[obaName] = currentTableData;
  } else {
    // 当复选框被取消选中时
    // 从selectedClasses数组中移除班级ID
    const index = selectedClasses.value.indexOf(classId);
    if (index !== -1) {
      selectedClasses.value.splice(index, 1);
    }

    // 从currentStudentsData中移除对应班级的学生数据
    const newStudentsData = currentStudentsData.value[obaName]?.filter(student => student.classId !== classId) || [];
    currentStudentsData.value[obaName] = newStudentsData;
  }
};



const getStudentsByClassId = (classId, obsName) => {
  // 假设studentsData是一个包含所有学生数据的数组
  // 筛选出当前专业的学生数据
  return studentsData.value.filter(student => student.classId === classId);
};


const uniqueGrades = (classList) => {
  return Array.from(new Set(classList.map(item => item.grade)))
              .sort((a, b) => a - b);
};

const getClassesByGrade = (classList, grade) => {
  return classList.filter(item => item.grade === grade)
                  .sort((a, b) => a - b);
};

const handleChange = (val) => {
  activeNames.value = val;
};



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
  request.admin.post('/sysmangt/classmangt/delete', selectedClasses.value)
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