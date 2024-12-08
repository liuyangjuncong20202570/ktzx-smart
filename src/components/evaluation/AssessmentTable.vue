<!-- 使用vxe-table组件开发 -->
<template>
  <div>
    <el-header style="
        height: 40px;
        padding: 5px 0px;
        width: 100%;
        text-align: left;
        background-color: #deebf7;
      ">
      <el-button type="success" @click="save()" style="margin-left: 0.8vw">保存</el-button>
    </el-header>
    <div id="container" style="height: calc(92vh - 130px); width: 100%">
      <vxe-grid v-bind="gridOptions" v-on="gridEvents" :edit-config="gridOptions.editConfig" class="scroll-container"
        @edit-closed="handleEditClosed"></vxe-grid>
    </div>

    <el-table v-if="info" :data="footer1Data" :show-header="false" :row-class-name="tableRowClassName" border>
      <el-table-column prop="name" width="240" align="center"></el-table-column>
      <el-table-column :prop="item.id" v-for="(item, index) in info.head" :key="index" show-overflow-tooltip
        align="center">
        <template v-slot="scope">
          <div v-if="scope.row[item.id] !== 100" style="color: red; height: 28px">
            合计需为100（当前为：{{ scope.row[item.id] }}）
          </div>
          <div v-else style="height: 28px; color: black">{{ scope.row[item.id] }}</div>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="info" :data="footer2Data" :show-header="false" :row-class-name="tableRowClassName" border>
      <el-table-column prop="name" width="240" align="center"></el-table-column>
      <el-table-column v-for="(item, index) in info.head" :key="index" show-overflow-tooltip align="center">
        <template v-slot="scope">
          <el-input v-if="scope.row.edit[item.id]" style="height: 28px" :ref="el => setInputRef(el, item.id)"
            @blur="handleBlur(scope.row, item.id)" v-model="scope.row[item.id]"></el-input>
          <div v-else @dblclick="handleClick(scope.row, item.id)" :style="{
            color: calcFooter2Data() !== 100 ? 'red' : 'black',
            width: '100%',
            height: '28px'
          }">
            {{ scope.row[item.id] }}
            <span v-if="calcFooter2Data() !== 100" style="color: red"> （总评合计不为100）</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!----------------------------------编辑弹窗-------------------------------------->
    <el-dialog v-model="editDialogVisible" width="600" destroy-on-close>
      <div style="padding: 0 25%; display: flex; justify-content: space-between; margin: -5px 0 15px 0">
        <el-button @click="uploadDialogVisible = true">上传</el-button>
        <el-button @click="associate()">关联</el-button>
      </div>
      <div style="font-weight: bolder; border: 1px solid #ebebeb; height: 30px; line-height: 30px;
			color: #969696; user-select: none;">
        考核项：{{ rightClickItem.title }}
      </div>
      <el-table ref="multipleTableRef" :data="filesTableData" style="height: 350px;" v-loading="filesTableLoading"
        element-loading-background="rgba(0, 0, 0, 0.2)" @selection-change="handleSelectionChange" border>
        <el-table-column align="center" type="selection" width="40"></el-table-column>
        <el-table-column align="center" label="名称" prop="fileName"></el-table-column>
        <el-table-column align="center" label="上传时间" width="200" prop="createTime"></el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template #default="{ row }">
            <div style="display: flex; justify-content: space-between; padding: 0 10px;">
              <el-button type="primary" size="small" @click="openPreviewDialog(row)">预览</el-button>
              <el-button type="danger" size="small" @click="openDeleteDialog(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!----------------------------------上传弹窗-------------------------------------->
    <el-dialog v-model="uploadDialogVisible" width="400" destroy-on-close>
      <el-text type="warning">仅支持.docx、.pdf、.xlsx文件类型<br>如有需要请将.doc和.xls文件转化为允许格式</el-text>
      <el-upload ref="uploadRef" class="upload-demo"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :limit="1" :on-exceed="handleExceed"
        :auto-upload="false" accept=".pdf,.docx,.xlsx" :before-upload="file => storeFileInfo(file, rightClickItem)">
        <template #trigger>
          <el-button type="primary">选择文件</el-button>
        </template>
      </el-upload>
      <el-button @click="uploadFile()">确定</el-button>
    </el-dialog>

    <!----------------------------------预览文件的弹窗-------------------------------------->
    <el-dialog v-model="previewDialogVisible" width="1200" style="height: 90vh; margin-top: 30px; margin-bottom: 30px;"
      destroy-on-close>
      <div style="max-height: 82vh; overflow: auto;">
        <vue-office-docx v-if="fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'"
          style="height: 82vh;" :src="blobData" />
        <vue-office-pdf v-else-if="fileType === 'application/pdf'" style="height: 82vh;" :src="blobData" />
        <vue-office-excel v-else-if="fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
          style="height: 82vh;" :src="blobData" />
        <div v-else>不支持的文件</div>
      </div>
    </el-dialog>
    <!------------------------------------------------------------------------------------->

    <!----------------------------------确认删除的弹框-------------------------------------->
    <el-dialog v-model="deleteDialogVisible" width="350" destroy-on-close>
      <template #header="{ titleId, titleClass }">
        <div style="text-align: left; margin-bottom: -15px">
          <div :id="titleId" :class="titleClass" style="font-size: 15px">
            <el-button link type="warning">
              <el-icon size="20" style="padding-bottom: 3px; box-sizing: border-box">
                <WarningFilled />
              </el-icon>
            </el-button>
            是否要删除选中的文件
          </div>
        </div>
      </template>
      <div v-if="associateFiles.length" style="
          max-height: 300px;
          overflow: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
        <div style="margin-bottom: 5px">
          <el-text type="danger" style="display: flex">
            <div>将删除的文件与以下考核项关联，请先取消关联</div>
          </el-text>
        </div>
        <el-table :data="associateFiles" style="width: 60%; height: 30vh" stripe border>
          <el-table-column label="考核项名" prop="itemName" align="center"></el-table-column>
        </el-table>
      </div>
      <template #footer>
        <div v-if="!associateFiles.length" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="deleteFile()"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-------------------------------------------------------------------------------------->
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import request from '../../utils/request';
import { ElMessage, genFileId } from 'element-plus';
import type { TableInstance } from 'element-plus';
import _ from 'lodash';
import { UploadInstance } from 'element-plus';
import { UploadProps } from 'element-plus';
import { UploadRawFile } from 'element-plus';
import { WarningFilled } from '@element-plus/icons-vue';
import VueOfficeDocx from '@vue-office/docx';
import VueOfficeExcel from '@vue-office/excel';
import '@vue-office/excel/lib/index.css';
import VueOfficePdf from '@vue-office/pdf';

const container = ref();

const info = ref(null); // 存储后端传来的的数据

const leafIds = ref({}); // 以id为键存储其所有叶节点的id

const footer1Data = ref([{ name: '分数合计' }]);
const footer2Data = ref([
  {
    name: '总评占比',
    edit: {}
  }
]);

const rightClickItem = ref(); // 存储被右键的考核项

// 用于渲染表格的数据
const gridOptions = ref({
  size: 'mini',
  border: true,
  height: 500, // 表格默认高度，在钩子函数中会修改
  align: 'center',
  showOverflow: true,
  showHeaderOverflow: true,
  editConfig: {
    trigger: 'dblclick',
    mode: 'cell',
    showIcon: false
  },
  columnConfig: {
    resizable: false
  },
  menuConfig: {
    header: {
      options: [[{ code: 'edit', name: '编辑', suffixConfig: { icon: 'vxe-icon-edit' } }]]
    },
    visibleMethod({ options, column }) {
      // 处理右键菜单项显示
      rightClickItem.value = column;
      let isDisabled = true; // 菜单项是否不可可点击
      let isVisible = false; // 菜单项是否可见
      if (info.value.head.some(item => leafIds.value[item.id].includes(column.field))) {
        // 只有子节点才能触发右键菜单
        isDisabled = false;
        isVisible = true;
      }
      options.forEach(list => {
        list.forEach(item => {
          if (item.code === 'edit') {
            item.visible = isVisible;
            item.disabled = isDisabled;
          }
        });
      });
      return true;
    }
  },
  columns: [],
  data: []
});

onMounted(async () => {
  container.value = document.getElementById('container');
  gridOptions.value.height = container.value.clientHeight;
  await getData();
});

const getData = async () => {
  try {
    const res = await request.evaluation.get(`/evaluation/assessmentPlan/getAssessmentTable`);
    if (res.code === 200) {
      info.value = res.data;
      // console.log(info.value);
      initialize(info.value);
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error('获取考核方案失败', error);
  }
};

const initialize = info => {

  info.head.forEach(item => {
    leafIds.value[item.id] = getLeafIds(item);
    footer1Data.value[0][item.id] = calcSumScore(info.items, leafIds.value[item.id]); // 计算每一大项的所有考核项的总分

    footer2Data.value[0][item.id] = Number(info.percent[item.id]); // 存储每一大项的总评占比
    footer2Data.value[0].edit[item.id] = false; // 设置总评占比每一项是否可编辑
  });

  creatHeader(info?.head, 0); // 创建表头

  info.items.forEach(item => {
    // 处理数据单元格
    item.target = item.name; // 这里新加target是为了对应表格的课程目标列以显示数据，那列的field键值为'target'
  });
  gridOptions.value.data = info.items;
};

// ancextorId存储的是每个最外层节点的id，用于遍历到最深层时能知道其属于哪个最外部节点（考核项大类）
const creatHeader = (head, floor = 0, ancestorId = '') => {
  let finish = false;
  head.forEach((node, idx) => {
    node.title = node.itemName;
    node.field = node.id;
    if (!floor) {
      ancestorId = node.id; // 处于最外层时记录最外层节点的id
      if (idx === head.length - 1) finish = true; // 当处于最外层节点且是最外层的最后一个节点时，代表着递归结束
    }

    if (node.children && node.children.length > 0)
      creatHeader(node.children, floor + 1, ancestorId);
    else {
      // 到达最深层节点（叶节点）
      node.editRender = { name: 'input' }; // 只有叶节点的单元格可编辑，因为表格的每一列的列头实际上对应的是一个个叶节点

      // 设置叶节点宽度，首先根据info.head的长度确定每一个考核项大类（最外部节点）所占宽度，再用它除以这个最外部节点有多少个叶节点来确定每个叶节点的宽度
      // 这样保证了每个考核项大类都占有相同的宽度（繁琐）
      node.width = Number(
        (
          (container.value.clientWidth - 240) /
          info.value.head.length /
          leafIds.value[ancestorId].length
        ).toFixed(0)
      );
    }
  });
  if (finish) {
    gridOptions.value.columns = [
      {
        field: 'target',
        title: '课程目标',
        width: 240
      }
    ];
    gridOptions.value.columns = gridOptions.value.columns.concat(head);
  }
};

const getLeafIds = (node, result = []) => {
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      getLeafIds(child, result);
    });
  } else {
    result.push(node.id);
  }
  return result;
};

const calcSumScore = (array, ids) => {
  let sum = 0;
  array.forEach(item => {
    ids.forEach(id => {
      if (item[id]) sum += Number(item[id]);
    });
  });
  return sum;
};

/**********************表格数据单元双击编辑*********************/
const oldData = ref();
const postData = ref({}); // 存储批量传到后端的数据

const gridEvents = {
  cellDblclick({ row, column }) {
    oldData.value = row[column.field];
  },
  async menuClick({ menu }) {
    if (menu.code === 'edit') {
      editDialogVisible.value = true;
      filesTableLoading.value = true;
      getFileList();
    }
  }
};

const handleEditClosed = async ({ row, column }) => {
  row[column.field] = row[column.field] ? Number(row[column.field]) : 0; // 清空数值则设为0
  let num = row[column.field];
  if (Number.isNaN(num)) {
    // 判断输入的是不是数字
    row[column.field] = oldData.value;
    return;
  }
  if (row[column.field] !== oldData.value) {
    // 当数据变化时再执行
    if (!postData.value.items) postData.value.items = {}; // 初始化post的数据
    row[column.field] = Number(Number(row[column.field]).toFixed(0)); // 若输入小数则四舍五入为整数
    if (num < 0) {
      // 若输入负数则撤销本次操作
      row[column.field] = oldData.value;
      return;
    }

    if (!postData.value.items) postData.value.items = {};
    if (!postData.value.items[row.id]) postData.value.items[row.id] = {}; // 以课程目标的id为键存储其内部所有考核项
    postData.value.items[row.id][column.field] = row[column.field]; // 以考核项的id为键存储其分数
    if (row[column.field] === 0) row[column.field] = undefined; // 值为0需要传给后端，但是前端表格里值为零就设为不显示

    // 每次改变考核项的分数重新计算
    info.value.head.forEach(item => {
      footer1Data.value[0][item.id] = calcSumScore(info.value.items, leafIds.value[item.id]);
    });
  }
};

const tableRowClassName = ({ row, rowIndex }) => {
  return 'footer-row';
};

const calcFooter2Data = () => {
  let totalFooter2Data = 0; // 存储总评占比之和
  info.value.head.forEach(item => {
    totalFooter2Data += footer2Data.value[0][item.id];
  });
  return totalFooter2Data;
};

const save = async () => {
  if (Object.keys(postData.value).length === 0) return; // 未改变任何值则不执行
  if (
    !info.value.head.every(item => footer1Data.value[0][item.id] === 100) ||
    calcFooter2Data() !== 100
  ) {
    ElMessage.error('数据不合法，无法保存');
    return;
  }
  // 数据合法再传给后端
  try {
    const res = await request.evaluation.post(
      `/evaluation/assessmentPlan/updateAssessmentTable`,
      postData.value
    );
    if (res.code === 200) {
      ElMessage.success('修改成功');
      await getData();
      postData.value = {};
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error('修改失败' + error);
  }
};

/**********************双击修改总评占比栏**********************/
const inputsRefs = ref({});
const oldPercent = ref('');

const setInputRef = (el, id) => {
  if (el) {
    inputsRefs.value[id] = el;
  }
};

const handleClick = (row, field) => {
  nextTick(() => {
    row.edit[field] = true;
    oldPercent.value = row[field];
    setTimeout(() => {
      if (inputsRefs.value[field] && inputsRefs.value[field].$refs.input) {
        inputsRefs.value[field].$refs.input.focus();
      }
    }, 0);
  });
};

const handleBlur = (row, field) => {
  nextTick(async () => {
    row.edit[field] = false;
    if (row[field] !== oldPercent.value) {
      row[field] = Number(Number(row[field]).toFixed(0));
      if (row[field] === '') row[field] = 0;

      if (!postData.value.percent) postData.value.percent = {};
      postData.value.percent[field] = row[field]; // 以id为键存储其总评占比
    }
  });
};

/*************************编辑弹窗*************************/
const editDialogVisible = ref(false);
//---------------------------------------------作业实验表格相关
const filesTableData = ref([]);
const filesTableLoading = ref(true);

const multipleTableRef = ref<TableInstance>();
const multipleSelection = ref([]);
const oldSelection = ref([]); // 存储最初的被勾选的表格行，用于关联时找到哪些是被取消勾选的哪些是新勾选的

/*判定哪些行被选中*/
const handleSelectionChange = selection => {
  multipleSelection.value = selection;
};

const getFileList = async () => {
  try {
    const res = await request.evaluation.get(
      `/evaluation/assessmentPlan/getFileList?checkitemId=${rightClickItem.value.field}`
    );
    if (res.code === 200) {
      res.data.files.forEach(file => {
        // 将 Base64 编码的数据解码为二进制字符串
        const binaryString = atob(file.base64FileData);

        // 创建一个与二进制字符串长度相同的 Uint8Array
        const byteArray = new Uint8Array(binaryString.length);

        // 将二进制字符串中的每个字符的 Unicode 值存储到字节数组中
        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }
        // 使用字节数组创建一个新的 Blob 对象，并设置 MIME 类型
        file.blobData = new Blob([byteArray], { type: file.mimeType });
      });
      filesTableData.value = res.data.files;
      filesTableData.value.forEach(item => {
        item.createTime = item.createTime.replace('T', ' '); // 格式化上传时间
      });
      toggleSelection(res.data.associateFileIds);
      filesTableLoading.value = false;
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error('获取文件列表失败' + error);
  }
};
const toggleSelection = associateFileIds => {
  // 从filesTableData.value中过滤出id和associateFileIds每一个值相同的元素
  const rows = filesTableData.value.filter(file => associateFileIds.includes(file.id));
  oldSelection.value = rows;
  if (rows) {
    nextTick(() => {
      rows.forEach(row => {
        multipleTableRef.value!.toggleRowSelection(row, undefined, false);
      });
    });
  } else {
    multipleTableRef.value!.clearSelection();
  }
};

//---------------------------------------------关联按钮
const associate = async () => {
  // 新增的关联文件id
  const newFiles = multipleSelection.value.filter(item => !oldSelection.value.includes(item));
  // 取消关联的文件id
  const deletedFiles = oldSelection.value.filter(item => !multipleSelection.value.includes(item));
  if (!newFiles.length && !deletedFiles.length) return;

  // 标志着新增和删除关联是否成功
  let associate = true;
  let disassociate = true;
  filesTableLoading.value = true;

  if (newFiles.length) {
    const associatePost = {
      checkitemId: rightClickItem.value.field,
      fileIds: newFiles.map(file => file.id)
    };
    try {
      const res = await request.evaluation.post(
        `/evaluation/assessmentPlan/associate`,
        associatePost
      );
      if (res.code === 200) {
        getFileList();
      } else {
        ElMessage.error(res.msg);
        associate = false;
      }
    } catch (error) {
      ElMessage.error('修改失败' + error);
      associate = false;
    }
  }

  if (deletedFiles.length) {
    const disassociatePost = {
      checkitemId: rightClickItem.value.field,
      fileIds: deletedFiles.map(file => file.id)
    };
    try {
      const res = await request.evaluation.post(
        `/evaluation/assessmentPlan/disassociate`,
        disassociatePost
      );
      if (res.code === 200) {
        getFileList();
      } else {
        ElMessage.error(res.msg);
        disassociate = false;
      }
    } catch (error) {
      ElMessage.error('修改失败' + error);
      disassociate = false;
    }
  }

  if (associate && disassociate) ElMessage.success('修改成功');
};

//---------------------------------------------预览按钮
const previewDialogVisible = ref(false);
const fileType = ref('');
const blobData = ref(null);

const openPreviewDialog = row => {
  // 存储文件的blob流
  blobData.value = row.blobData;
  // 存储文件的类型
  fileType.value = row.blobData.type;
  previewDialogVisible.value = true;
};

//---------------------------------------------删除按钮
const deleteDialogVisible = ref(false);
const filesTableRowData = ref(); // 存储文件列表点击了哪一行的数据
const associateFiles = ref([]);

const openDeleteDialog = async row => {
  deleteDialogVisible.value = true;
  filesTableRowData.value = row;
  try {
    const res = await request.evaluation.get(
      `/evaluation/assessmentPlan/getAssociateCheckitems?fileId=${filesTableRowData.value.id}`
    );
    if (res.code === 200) {
      associateFiles.value = res.data;
    } else ElMessage.error(res.msg);
  } catch (error) {
    ElMessage.error('获取关联考核项失败' + error);
  }
};

const deleteFile = async () => {
  const postData = {
    id: filesTableRowData.value.id,
    checkitemId: rightClickItem.value.field
  };
  try {
    const res = await request.evaluation.post(`/evaluation/assessmentPlan/deleteFile`, postData);
    if (res.code === 200) {
      ElMessage.success('删除成功');
      getFileList();
      deleteDialogVisible.value = false;
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error('删除失败' + error);
  }
};

//---------------------------------------------上传
const uploadDialogVisible = ref(false);
const uploadingFile = ref({});
const uploadRef = ref<UploadInstance>();

// upload使用ref定义的类型为UploadInstance的变量，代表el-upload组件的实例。可通过upload.value访问el-upload的实例方法和属性。
const upload = ref<UploadInstance>();
// 这是处理文件超过限制的事件钩子，类型为 UploadProps['onExceed']，即它是 el-upload 的 onExceed 事件处理函数。files 是用户在操作时尝试上传的文件列表。
const handleExceed: UploadProps['onExceed'] = files => {
  upload.value!.clearFiles();
  // 从传入的 files 数组中取第一个文件，这个文件即是用户新选择的文件，并将其类型强制转换为 UploadRawFile 类型（即原始的文件对象）。
  const file = files[0] as UploadRawFile;
  // 给新选的文件生成一个唯一标识符 uid。Element Plus 内部依赖 uid 来区分不同的文件。如果这个文件对象没有 uid，上传时可能会出错。
  file.uid = genFileId();
  // 最后调用 handleStart(file) 方法，将这个文件手动加入到 el-upload 的上传队列中。handleStart() 是 el-upload 组件内部的方法。
  upload.value!.handleStart(file);
};

const storeFileInfo = (file, checkitem) => {
  if (file) {
    uploadingFile.value = file;
  }
  return false; // 阻止默认上传行为
};

const uploadFile = async () => {
  uploadRef.value!.submit(); // 触发上传文件
  const formData = new FormData();
  formData.append('file', uploadingFile.value);
  try {
    const res = await request.evaluation.post('/evaluation/assessmentPlan/uploadFile', formData);
    if (res.code === 200) {
      ElMessage.success('上传成功');
      getFileList();
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error('上传失败' + error);
  }
  uploadDialogVisible.value = false;
};
</script>

<style scoped lang="scss">
.el-table {
  .footer-row {
    background-color: #fafafa;
  }
}

.scroll-container {
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
