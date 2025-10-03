<template>
  <div style="padding:0;margin:0;">
    <el-dialog
        :destroy-on-close="true" :show-close="false" :close-on-click-modal="true"
        style="min-width:60vw;" v-model="dialogVisible" @close="closeDialog">
      <el-container style="margin-left:0">
        <!-- 对话框头部区域 -->
        <el-header style="height: auto; padding: 2px 0px; width:100%; display: flex; align-items: center;">
        </el-header>
        <el-main style="padding-left:0">
          <el-table :data="userlist" empty-text="没有负责人">
            <el-table-column type="index" label="序号" min-width="50"></el-table-column>
            <el-table-column prop="obsname" label="所属部门" min-width="200"></el-table-column>
            <!-- 从这里移除id的显示 -->
            <el-table-column prop="username" label="教师用户名" min-width="100"></el-table-column>
            <el-table-column label="操作" width="120">
              <template v-slot="{ row }"> <!-- 使用 v-slot 访问当前行的数据 -->
                <el-icon class="CloseBold-icon" @click="Deleteteacher(row)">
                  <CloseBold/>
                </el-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer
            style="background-color: #f5f5f5; padding: 6px 0; display: flex; align-items: center; justify-content: space-around;">
          <el-cascader
              ref="myteacherref"
              v-model="teacherid"
              :options="teacherlist"
              placeholder="请选择负责人"
              :props="{ value: 'id', label: 'label', children: 'children', emitPath: false}"
              filterable
              clearable
              :show-all-levels="false"
              @focus="fetchData"
              change-on-select
              @change="handleCascaderChange"
              style="width: 60%;"
          >
          </el-cascader>
          <el-button
              type="primary"
              :disabled="!teacherid"
              @click="addTeacher"
              style="margin-left: 15px;">
            {{ teacherid ? '点击新增教师' : '请选择负责人' }}
          </el-button>
        </el-footer>

      </el-container>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, defineExpose, watch, nextTick, onMounted, getCurrentInstance} from 'vue';

import {ElMessage} from "element-plus";
import {Document, Edit, Folder} from "@element-plus/icons-vue";
import Departmentmangt from "../Departmentmangt.vue"
import request from "../../../utils/request.js";
import {CloseBold} from '@element-plus/icons-vue';

//显示弹窗组件
const dialogVisible = ref(false);

const obsname = ref('');
const collegeobsid = ref('')
const formRef = ref(null);
const userlist = ref([]);
const teacherid = ref('');
const teacherlist = ref([]);
const tableData = ref([])
const alreadyteacheridlist = ref([])

//初始化，用于接受父组件传来的值，并发送请求获取菜单
function init(Parentrow) {
  dialogVisible.value = true;
  userlist.value = Parentrow.responsiblePersonList;
  Parentrow.responsiblePersonList.forEach(item => {
    alreadyteacheridlist.value.push(item.id);
  })
  obsname.value = Parentrow.obsname;
  collegeobsid.value = Parentrow.id;
  console.log(123)
  console.log(userlist.value)
}

const emit = defineEmits(['formSubmitted']);


//将init函数暴露给父组件
defineExpose({init});

const fetchData = () => {
  request.admin.get('/sysmangt/department/departmentRP')
      .then(res => {
        if (res.code === 200) {
          // 假设这里你需要的是过滤后的数据作为级联选择器的选项
          console.log(res.data)
          teacherlist.value = formatDataForCascader(res.data, alreadyteacheridlist.value);
          console.log(teacherlist.value)
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '获取列表失败'
    });
  });
};
// 格式化数据以适应el-cascader组件的需要
// 使用 formatNode 函数递归地处理每个节点。这允许函数处理任意深度的层级结构。
// 对于每个节点，如果它有 children，则递归地格式化这些 children。
// 如果节点代表一个机构（如系或专业），并且它有 responsiblePerson，则将这些 responsiblePerson 作为叶子节点加入。
// 使用 filter 来确保只包含那些至少有一个叶子节点（即至少有一个老师）的机构。
// 通过添加 isLeaf 属性来显式标记叶子节点，这对于 el-cascader 来确定哪些节点是可选择的非常重要。
const formatDataForCascader = (nodes, selectedTeacherIds) => {
  const formatNode = (node) => {
    const formattedNode = {
      ...node,
      label: node.obsname,
    };

    // 递归处理子机构
    if (node.children && node.children.length > 0) {
      formattedNode.children = node.children.map(child => formatNode(child)).filter(child => child !== null);
    }

    // 处理机构下的老师，排除已被选中的老师
    if (node.responsiblePerson && node.responsiblePerson.length > 0) {
      const filteredTeachers = node.responsiblePerson.filter(teacher => !selectedTeacherIds.includes(teacher.id));
      if (filteredTeachers.length > 0) {
        formattedNode.children = (formattedNode.children || []).concat(
            filteredTeachers.map(teacher => ({
              id: teacher.id,
              label: teacher.username,
              isLeaf: true,
            }))
        );
      }
    }

    // 如果节点没有子机构也没有未选中的老师，则过滤掉该节点
    return formattedNode.children && formattedNode.children.length > 0 ? formattedNode : null;
  };

  // 使用递归函数处理每个节点
  return nodes.map(node => formatNode(node)).filter(node => node !== null);
};


const handleCascaderChange = (value, selectedData) => {

  if (selectedData && selectedData.length > 0) {
    const lastSelectedNode = selectedData[selectedData.length - 1];
    if (!lastSelectedNode.children || lastSelectedNode.children.length === 0) {
      // 如果当前选中的节点是最后的子节点，则更新 teacherid
      teacherid.value = lastSelectedNode.id;
    } else {
      // 如果不是最后的子节点，可以根据需求清空 teacherid 或设置为默认值
      teacherid.value = null; // 或者设置为默认值
    }
  }
};

const addTeacher = () => {
  if (!teacherid.value) {
    // 如果 teacherid 为空或未定义，则显示错误消息
    ElMessage.error('教师ID未选择，请选择一个教师。');
    return; // 终止函数执行
  } else {
    const teacherform = {
      userid: teacherid.value,
      obsid: collegeobsid.value,
    }
    request.admin.post('/sysmangt/department/departmentRP/create', teacherform)
        .then(res => {
          if (res.code === 200) {
            // 假设这里你需要的是过滤后的数据作为级联选择器的选项
            ElMessage({
              type: 'success',
              message: '新增负责人成功'
            });
            emit('formSubmitted');
          }
        }).catch(error => {
      ElMessage({
        type: 'error',
        message: '新增负责人失败，请重新尝试'
      });
      teacherid.value = '';
    });
    closeDialog();
  }

};

const Deleteteacher = (row) => {
  const teacherform = ref({
    userid: row.id,
    obsid: collegeobsid.value,
  })
  request.admin.post('/sysmangt/department/departmentRP/delete', teacherform.value)
      .then(res => {
        if (res.code === 200) {
          // 假设这里你需要的是过滤后的数据作为级联选择器的选项
          ElMessage({
            type: 'success',
            message: '删除负责人成功'
          });
          emit('formSubmitted');
          closeDialog();
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '删除负责人失败，请重新尝试'
    });
  });
}


//关闭对话框方法
const closeDialog = () => {
  dialogVisible.value = false;
  setTimeout(() => {
    teacherid.value = ''; // 在对话框动画完成后清空，避免视觉问题
  }, 300);
};


</script>
<style scoped>
::v-deep(.el-table .cell) {
  text-align: center;
}

/*覆盖el-dialog__header的样式*/
::v-deep(.el-dialog__header) {
  padding-top: 0;
  padding-bottom: 0;
}

/*覆盖el-dialog__body 的样式*/
::v-deep(.el-dialog__body) {
  padding-top: 5px;
  padding-bottom: 5px;
}

.CloseBold-icon {
  cursor: pointer; /* 鼠标悬停时变成手形指针 */
  white-space: nowrap; /* 防止文本换行 */
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out; /* 添加颜色变化和旋转动画 */

}

.CloseBold-icon:hover {
  color: #FF4949; /* 悬浮时的颜色 */
  transform: rotate(-90deg); /* 悬浮时旋转180度 */

}
</style>