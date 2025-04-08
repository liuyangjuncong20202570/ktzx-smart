<!--
 * @Date: 2024-07-16 14:59:49
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-19 16:44:48
 * @FilePath: \smarttt_ktzx\src\views\page\practice\info\index.vue
-->
<template>
  <div class="experimental-practiceInfo-wrap">
    <Header :title="isDetail ? '编辑实验' : '新建实验'" :pathData="pathData" />
    <div class="practice-tool">
      <el-form :model="practiceForm" label-width="auto" :inline="true" :rules="rules" ref="practiceFormRef">
        <el-form-item label="" prop="name">
          <div class="custom-form-item">
            <span class="custom-form-item-label">实验名称</span>
            <span class="custom-form-item-line"></span>
            <el-input class="custom-form-item-input" style="width: 200px" v-model.trim="practiceForm.name" :disabled="disable" />
          </div>
        </el-form-item>
        <el-form-item label="" prop="totalScore">
          <div class="custom-form-item">
            <span class="custom-form-item-label">总分</span>
            <span class="custom-form-item-line"></span>
            <el-input-number 
              class="custom-form-item-input" 
              v-model="practiceForm.totalScore" 
              style="width: 100px"  
              :controls="false" 
              :step-strictly="true" 
              :min="20"
              :max="1000"
              :precision="0"
              :disabled="disable"
              @blur="handleTotalScoreBlur"
              @change="handleTotalScoreChange"
              placeholder="请输入总分(20-1000)"
            />
          </div>
        </el-form-item>
      </el-form>
      <el-button v-if="!disable" class="custom-nav-button" :icon="DocumentCopy" type="primary" style="margin-top: 3px !important;" @click="saveData(practiceFormRef)">保存</el-button>
    </div>
    <el-table ref="multipleTableRef" class="custom-table" :data="tableData" style="width: 100%">
      <!-- <el-table-column lebel="选择" type="selection" width="55" fixed="left" :selectable="checkSelectable" /> -->
      <el-table-column label="选择" type="beValid" width="100" fixed="left">
        <template #default="scope">
          <template v-if="scope.row.beDefault==1"></template>
          <template v-else>
            <el-checkbox :disabled="disable" @change="((val) => {
              scope.row.disabled = !val
              if (!val) {
                scope.row.weight = 0;
                scope.row.score = 0;
                // if (scope.row.scoreCfg) {
                //   scope.row.scoreCfg = {
                //     mode: '',
                //     map: {}
                //   };
                // }
                // ElMessage({
                //   message: '已取消选中，相关设置已重置',
                //   type: 'warning',
                //   duration: 3000
                // });
              }
            })" v-model="scope.row.beValid"/>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="itemName">
        <template #default="scope">
          <span style="color: #FF4C48;" v-if="scope.$index==0 || scope.$index==1">*</span> {{ scope.row.itemName }}
        </template>
      </el-table-column>
      <el-table-column label="权重" prop="weight" width="150">
        <template #default="scope">
          <template v-if="scope.row.setWeight == 1">
            <el-input 
              style="width: 80px" 
              type="number" 
              :disabled="disable"
              v-model="scope.row.weight" 
              @input="handleWeightChange(scope.row)"
              @blur="handleWeightBlur(scope.row)"
              :min="0" 
              :max="100" 
              step-strictly
            /> %
            <!-- <div v-if="computedTotalWeight > 100" class="weight-warning">
              总权重超过100%
            </div> -->
          </template>
          <template v-else></template>
        </template>
      </el-table-column>
      <el-table-column label="分数" prop="weight" width="150">
        <template #default="scope">
          <template v-if="scope.row.setWeight == 1">
            <el-input 
              style="width: 100px" 
              type="number" 
              :disabled="true" 
              :value="scope.row.score || calculateScore(scope.row.weight)"
              :min="0" 
              :max="100" 
              step-strictly
            /> 分 
          </template>
          <template v-else></template>
        </template>
      </el-table-column>
      <!-- <el-table-column label="学生可见" prop="stuVisible">
        <template #default="scope">
          <el-checkbox v-model="scope.row.stuVisible" />
        </template>
      </el-table-column> -->
      <el-table-column label="操作" prop="address" width="350">
        <template #default="scope">
          <template  v-if="scope.row.beValid==1">
            <el-button v-if="scope.row.beDefault"  class="custom-link-button custom-link-active-button" type="primary" :text="true" :disabled="!scope.row.defaultPath" @click="lookFile(scope.row)">预览</el-button>
            <el-button 
              v-if="scope.$index!= 0 && scope.$index!= 1"  
              class="custom-link-button custom-link-active-button" 
              type="primary" 
              :text="true" 
              :disabled="!scope.row.score || scope.row.score === 0 || scope.row.score % 1 !== 0"
              @mouseenter="handleButtonHover(scope.row)"
              @click="correctionSetting(scope.row)"
            >
              批改设定
            </el-button>
          </template>
          <template v-if="scope.row.beValid==1&&scope.$index<2">
            <el-button v-if="scope.row.beDefault&&scope.row.defaultPath"  class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="openUpload(scope.row)" :disabled="disable">重新上传</el-button>
            <el-button v-else  class="custom-link-button custom-link-active-button" type="primary" :text="true" @click="openUpload(scope.row)" :disabled="disable">上传</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 选择kwa -->
  <el-dialog
    v-model="isOpenDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    title="选择KWA"
    width="850"
    :before-close="beforeCloseDialog"
  >
    <Kwa ref="kwa" :kwaId="kwaId"></Kwa>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isOpenDialog = false">取消</el-button>
        <el-button type="primary" @click="sureSelect">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 上传文件 -->
  <el-dialog v-model="isOpenUploadDialog"  :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false" title="上传文件" width="850">
    <Upload tag="practice" :fileType="fileType" ref="uploadRef"></Upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isOpenUploadDialog = false">取消</el-button>
        <el-button type="primary" @click="sureUpload">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="isOpenLookDialog"
    :fullscreen="isFullscreen"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="dialogTitle"
    :width="dialogWidth"
  >
    <el-image style="width: 100%;"  :src="fileUrl" fit="cover" v-if="isImg" />
    <iframe ref="iframe" style="width: 100%; height: calc(100vh - 200px)" :src="fileUrl" frameborder="0" v-if="isPdf"></iframe>
    <VideoPlayer v-if="isVideo" :src="fileUrl" :options="playerOptions"></VideoPlayer>
    <!-- <div v-else-if="isWord" class="doc-preview" v-html="docContent"></div> -->
    <WordPreview v-else-if="isWord" :fileUrl="fileUrl" />
    <template #footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button type="primary"  @click="isOpenLookDialog = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>

  <LabReport 
    ref="labReport"
    :currentId="currentId"
    :totalScore="100" 
    :map="labReportMap"
    :mode="labReportMode"
    :disabled="disable"
    @confirm="handleConfirm"
    @close="resetLabReportData"
  />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick, computed, watch } from "vue";
import { getTemplate,savePractice,practiceDetail,kwaTree, practiceUpdate } from "@/api/practice/index.ts";
import { PracticeTemplateVO,ParamVO ,DefaultParamVO,KwaVO,KwaParamVO,ResVO } from "@/api/practice/type.ts";
import { RuleForm } from "./type";
import { host } from "@/api/host.js";
import Kwa from "../components/kwa.vue";
import LabReport from "../components/labReport.vue";
import Upload from "@/components/upload/index.vue";
import { VideoPlayer } from '@videojs-player/vue'
import Header from '@/views/page/components/header/index.vue'
import 'video.js/dist/video-js.css'
import { ElMessage, FormInstance, FormRules, ElMessageBox } from "element-plus";
import { DocumentCopy } from "@element-plus/icons-vue";
import { useRouter } from 'vue-router'
import { getFileExtensionFromUrl } from "@/utils/index.js";
import WordPreview from "@/components/WordPreview/WordPreview.vue";
import mammoth from 'mammoth';
const routes = useRouter()
const { currentRoute } = routes
const route = currentRoute.value
const practiceFormRef = ref<FormInstance>()
const practiceForm = reactive({
  name: "",
  totalScore: 100,
});
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入实验名称', trigger: ['blur','change'] },
  ],
  totalScore: [
    { required: true, message: '请输入总分', trigger: ['blur','change'] },
    { type: 'number', min: 20, message: '总分不能小于20分', trigger: ['blur', 'change'] },
    { type: 'number', max: 1000, message: '总分不能超过1000分', trigger: ['blur', 'change'] }
  ],
})
const isOpenSettingDialog = ref<boolean>(false)
const kwa = ref(null);
const uploadRef = ref(null);
const isOpenDialog = ref(false);
const isOpenUploadDialog = ref(false);
const fileType = reactive<string[]>([]);
const fileUrl = ref("");
const isImg = ref<boolean>(false);
const isVideo = ref<boolean>(false);
const isPdf = ref<boolean>(false);
const isWord = ref<boolean>(false);
const isOpenLookDialog = ref<boolean>(false);
const isFullscreen = ref<boolean>(false);
const dialogTitle = ref<string>('展示');
const dialogWidth = ref<number|string>(650)
const isDetail = ref<boolean>(false)
const kwaId = ref<string>('')
const disable = route.query.disabled || false;
const playerOptions = ref({
  height: 500,
  width: 500, //播放器宽度
  playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
  autoplay: 'any', // 如果true,浏览器准备好时开始回放。
  muted: true, // 默认情况下将会消除任何音频。
  loop: true, // 导致视频一结束就重新开始。
  preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  language: 'zh-CN',
  aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
  fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
  notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
  controls: true,
  controlBar: {
    timeDivider: true,
    durationDisplay: true,
    remainingTimeDisplay: false,
    fullscreenToggle: true // 全屏按钮
  }
})
const pathData = [
  {
    name: '实验管理',
    path: '/homes/courseteacherhome/exam/experimental/labmangt'
  },
  {
    name: isDetail.value ? '编辑实验' : '新建实验',
    path: ''
  }
]
let selectRowKeyData = reactive<PracticeTemplateVO>({});
let uploadRowData = reactive<PracticeTemplateVO>({});
const tableData = reactive<PracticeTemplateVO>([]);
const kwaArr = reactive<KwaVO>([])
  const docContent = ref('');
const computeFileType = (file: string) => {
  const imgType = <string[]>["png", "jpg", "bmp"];
  const videoType = <string[]>["mp4", "avi"];
  const pdfType = <string[]>["pdf"];
  const wordType = <string[]>["doc", "docx"];
  const fileType = getFileExtensionFromUrl(file);
  console.log('fileType', fileType)
  isImg.value =false
  isVideo.value = false
  isPdf.value = false
  isWord.value = false
  if(fileType == 'image' ){
    isImg.value = true
  }
  if(fileType == 'video'){
    isVideo.value = true
  }
  if(fileType == 'pdf'){
    isPdf.value = true
  }
  if(fileType == 'doc' || fileType == 'docx'){
    isWord.value = true
  }
  previewFile(file)
};
const previewFile = (file: string) => {
  fileUrl.value = host + "/static/" + file;
  if (isImg.value) {
    dialogTitle.value = '图片展示'
    dialogWidth.value = 650
    isFullscreen.value = false
    isOpenLookDialog.value  = true
    return
  }
  if (isPdf.value) {
    dialogTitle.value = '文件展示'
    dialogWidth.value = "100vw"
    isFullscreen.value = true
    isOpenLookDialog.value  = true
    return
  }
  if (isWord.value) {
    dialogTitle.value = '文件展示'
    dialogWidth.value = "100vw"
    isFullscreen.value = true
    isOpenLookDialog.value  = true
    
    // lockDoc(fileUrl.value)
    // window.location.href = fileUrl.value
    return
  }
  if (isVideo.value) {
    dialogTitle.value = '视频展示'
    dialogWidth.value = "1200px"
    isFullscreen.value = false
    isOpenLookDialog.value  = true
    return
  }
};
// 查看文件
// 预览相关
const lookFile = (row: any) => {
  computeFileType(row.defaultPath)
};
// 查看doc
const lockDoc = async (url: string,) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    docContent.value = result.value;
  } catch (error) {
    console.error('Error loading doc:', error);
    // 如果预览失败，回退到直接打开
    window.open(url);
  }
}

// 关闭弹框之前做一些处理
const beforeCloseDialog = () => {
  isOpenDialog.value = false;
};
// 确定上传
const sureUpload = async () => {
  await nextTick();
  const filePath = await uploadRef.value?.getFilePath();
  console.log('uploadRowData', uploadRowData)
  if (uploadRowData) {
    let arr = JSON.parse(JSON.stringify(tableData));
    arr.forEach((item: any) => {
      if (item.id == uploadRowData.id) {
        item.defaultPath = filePath;
      }
    });
    tableData.length = 0;
    tableData.push(...arr);
    console.log('arr', arr)
    isOpenUploadDialog.value = false;
  }

};
// 确定选择kwa
const sureSelect = async () => {
  await nextTick();
  const data = await kwa.value?.getFromValue();
  if (selectRowKeyData) {
    let arr = JSON.parse(JSON.stringify(tableData));
    arr.forEach((item: any) => {
      if (item.id == selectRowData.id) {
        item.fullName = data.fullName;
        item.kwaName = data.name;
        item.kwaId = data.kwaId;
      }
    });
    tableData.length = 0;
    tableData.push(...arr);
    isOpenDialog.value = false;
  }
};
// 打开上传弹框
const openUpload = (data: PracticeTemplateVO) => {
  const fileTypeArr = data.fileTypes.split(",");
  fileType.length = 0;
  fileType.push(...fileTypeArr);
  uploadRowData = data
  isOpenUploadDialog.value = true;
};
// 在 setup 中声明响应式数据
const labReport = ref(null);
const currentLabReportData = ref(null);
const totalSmallScore = ref(0);
const currentId = ref(0);
const labReportMap = ref(null);
const labReportMode = ref(null);
// 批改设定
const correctionSetting = (data: PracticeTemplateVO) => {
  console.log('批改设定')
  // 如果分数为0或为小数，不允许设置
  if (!data.score || data.score === 0 || data.score % 1 !== 0) {
    if (data.score % 1 !== 0) {
      ElMessage.warning("分数不能为小数，请调整总分或权重");
    }
    return;
  }
  
  if (labReport.value) {
    // 先重置数据
    labReportMap.value = null;
    labReportMode.value = null;
    
    // 设置新数据
    totalSmallScore.value = data.score
    currentId.value = data.id
   console.log(data.scoreCfg,'走了这里')
    
    // 确保数据存在且格式正确后再赋值
    if (data.scoreCfg) {
      // 直接使用原始数据
      labReportMap.value = data.scoreCfg.map || {};
      labReportMode.value = data.scoreCfg.mode || '';
    }

    // 打开弹窗前确保组件已重置
    labReport.value.resetData();
    labReport.value.openDialog(data);
  }
};
// 重置实验报告数据
const resetLabReportData = () => {
  console.log('重置实验报告数据')
  if (labReport.value) {
    // 清空所有相关数据
    labReport.value.resetData();
    labReportMap.value = null;
    labReportMode.value = null;
    totalSmallScore.value = 0;
    currentId.value = 0;
  }
};
// 打开kwa弹框
const openKwa = (data: PracticeTemplateVO) => {
  kwaId.value = data.kwaId
  selectRowKeyData = data;
  isOpenDialog.value = true;
};
const convertArrayToObject = (array: any[]) => {
  console.log('转换数组为对象')
  if (!Array.isArray(array)) {
    return {};
  }
  // 保持原始数据格式
  return array;
};
const convertArrayToObjectScore = (array: any[]) => {
  if (!Array.isArray(array)) {
    return {};
  }
  return array.reduce((acc, item) => {
    acc[item.name] = item.score;
    return acc;
  }, {});
};
const saveData = async (formEl: FormInstance | undefined) => {
  ElMessageBox.confirm(
    '确定保存吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async() => {
    if (!formEl) return
    await formEl.validate( async (valid, fields) => {
      if (valid) {
        // 检查是否存在小数分数
        const hasDecimalScore = tableData.some(item => {
          if (item.beValid && item.setWeight === 1 && item.weight) {
            const score = (item.weight / 100) * practiceForm.totalScore;
            return score % 1 !== 0;
          }
          return false;
        });
        
        if (hasDecimalScore) {
          ElMessage.error('存在小数分数，请调整总分');
          return;
        }

        // 验证权重总和
        const totalWeight = computed(() => {
          return tableData.reduce((sum, item) => {
            return sum + (item.beValid && item.setWeight ? Number(item.weight) || 0 : 0);
          }, 0);
        });
        if (totalWeight.value !== 100) {
          ElMessage.error('所有项目权重之和必须等于100%');
          return;
        }
        let arr:ParamVO[] = []
        let kwaArr:KwaParamVO[] = []
        let defaultParam:DefaultParamVO = {
          name:practiceForm.name,
          templateCode:tableData[0].templateCode,
          totalScore:practiceForm.totalScore,
          items:[]
        }
        if (isDetail.value) {
          defaultParam.id = route.query.id;
        }
        tableData.forEach((_item: any) => {
          kwaArr.length = 0
          if (_item.kwaId) {
            kwaArr = [{
              itemId: _item.id,
              kwaId: _item.kwaId,
              kwaName: _item.kwaName,
            }]
          }
          if (_item.kwas&&_item.kwas.length>0&&isDetail.value) {
            kwaArr[0].id = _item.kwas[0].id
            kwaArr[0].practiceId = _item.kwas[0].practiceId
          }
          console.info(arr,'--------------')
          arr.push({
            beDefault: _item.beDefault,
            beValid: _item.beValid?1:0,
            defaultPath: _item.defaultPath,
            id: _item.id,
            itemName: _item.itemName,
            weight: _item.weight,
            stuVisible: _item.stuVisible?1:0,
            kwas: [...kwaArr],
            ...(_item.scoreCfg?.map ? {
              scoreCfg: {
                map: _item.scoreCfg.map,
                mode: _item.scoreCfg.mode
              }
            } : {}),
            score: _item.score,
            // totalScore: practiceForm.totalScore
          });
         
        });
        console.info(arr,'2--------------')
        defaultParam.items = arr
        let resData:ResVO = {}
        if (isDetail.value) { //编辑调用更新接口
          resData =  await practiceUpdate(defaultParam)
        }else { //新增调用save接口
          resData = await savePractice(defaultParam)
        }
        if (resData.code==200) {
          ElMessage.success('保存成功！');
          routes.push('/homes/courseteacherhome/exam/experimental/labmangt')
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  }).catch(() => { })
};

// 新增加载默认模版
const getTemplateList = async () => {
  console.log('新增加载默认模版')
  const data = await getTemplate();
  if (data.code == 200) {
    // practiceForm.totalScore =  0
    data.data.forEach((item: any) => {
      item.beValid = item.beValid==1
      item.stuVisible = item.stuVisible==1
      item.fullName = "";
      item.kwaName = "";
      item.kwaId = "";
      item.defaultPath = '';
      item.score = item.weight*0.01*practiceForm.totalScore 
    });
    tableData.length = 0;
    tableData.push(...data.data);
  }
};
const getKwaData = async ()=>{
  const res = await kwaTree()
  if (res.code==200&&res.data.length>0) {
    kwaArr.length = 0
    kwaArr.push(...res.data)
  }
}
const calculateFullName =  (kwaId?: any)=>{
  console.log('计算全名')
  let fullName:string = ''
  kwaArr.forEach((item: any) =>{
    item.abilityList.forEach((item1:any)=>{
      if (item1.kwaId == kwaId) {
        fullName = item1.fullName
      }
    })
  })
  return fullName
}
// 编辑根据数据ID查询详情信息
const getDracticeDetail = async () =>{
  const queryParam = route.query.id;
  const resData = await practiceDetail(queryParam)
  console.log(resData,'resData.data')
  if (resData.code==200) {
    let arr = resData.data.items
    practiceForm.name = resData.data.name
    practiceForm.totalScore = resData.data.totalScore || 0
    nextTick(()=>{
      resData.data.items.forEach(async (item: any) =>{
      item.beValid = item.beValid==1
      item.stuVisible = item.stuVisible==1
      // 保持原始数据格式
      if (item.scoreCfg?.map) {
        item.scoreCfg.map = item.scoreCfg.map;
      }
      item.fullName = item.kwas[0]&&item.kwas[0].kwaId? calculateFullName(item.kwas[0].kwaId):'-';
      item.kwaName = item.kwas[0]?item.kwas[0].kwaName:"";
      item.kwaId = item.kwas[0]?item.kwas[0].kwaId:""
      item.score = item.weight*0.01*practiceForm.totalScore
    })
    tableData.length = 0;
    tableData.push(...arr);
    })
  }
}
// 计算每项分数
const calculateScore = (weight) => {
  const score = ((weight || 0) / 100) * practiceForm.totalScore;
  return score;
};

// 监听总分变化，更新表格中的分数
watch(() => practiceForm.totalScore, (newValue) => {
  if (newValue && tableData.length) {
    console.log(tableData,'走了这里')
    // 强制更新表格以重新计算分数
    tableData.forEach(item => {
      if (item.setWeight === 1) {
        item.score = calculateScore(item.weight);
        // 重置批改设定
        // if (item.scoreCfg) {
        //   item.scoreCfg = {
        //     mode: '',
        //     map: {}
        //   };
        // }
      }
    });
  }
});

// 监听每一行权重的变化
const handleWeightChange = (row) => {
  if (row.setWeight === 1) {
    const newScore = calculateScore(row.weight);
    row.score = newScore;
    
    // 重置当前项的批改设定
    // if (row.scoreCfg) {
    //   row.scoreCfg = {
    //     mode: '',
    //     map: {}
    //   };
    //   // 提示用户
    //   ElMessage({
    //     message: '权重已更改，批改设定已重置',
    //     type: 'warning',
    //     duration: 3000
    //   });
    // }
  }
};

// 修改权重输入框失焦事件处理
const handleWeightBlur = (row) => {
  if (row.setWeight === 1) {
    // 检查是否为小数
    const newScore = calculateScore(row.weight);
    if (newScore % 1 !== 0) {
      ElMessage({
        message: "当前权重会导致小数分数，请调整权重或总分",
        type: "warning",
        duration: 3000
      });
    }
    
    // 计算所有权重之和
    const totalWeight = tableData.reduce((sum, item) => {
      return sum + (item.beValid && item.setWeight === 1 ? Number(item.weight) || 0 : 0);
    }, 0);
    
    // 检查权重总和
    if (totalWeight > 100) {
      ElMessage({
        message: `所有项目权重之和必须等于100%`,
        type: 'warning',
        duration: 3000
      });
      // 重置当前行权重
      // row.weight = Math.max(0, row.weight - (totalWeight - 100));
      // 重新计算分数
      row.score = calculateScore(row.weight);
    } else if (totalWeight < 100) {
      ElMessage({
        message: `所有项目权重之和必须等于100%`,
        type: 'warning',
        duration: 3000
      });
    }
  }
};

// 计算总权重
const computedTotalWeight = computed(() => {
  return tableData.reduce((sum, item) => {
    return sum + (item.beValid && item.setWeight === 1 ? Number(item.weight) || 0 : 0);
  }, 0);
});

const handleConfirm = (data:any) => {
  console.log("data", data);
  tableData.forEach((item:any)=>{
    if (item.id == data.id) {
      item.scoreCfg = {
        map: data.map,
        mode: data.mode
      }
    }
  })
  console.log("tableData", tableData);
}

// 添加处理总分失焦的方法
const handleTotalScoreBlur = () => {
  console.log('走了这里')
  // 检查是否存在小数分数
  const hasDecimalScore = tableData.some(item => {
    if (item.beValid && item.setWeight === 1 && item.weight) {
      const score = (item.weight / 100) * practiceForm.totalScore;
      return score % 1 !== 0;
    }
    return false;
  });
  
  if (hasDecimalScore) {
    ElMessage.warning('当前总分会导致小数分数，请调整总分');
  }
};

// 添加总分变化处理函数
const handleTotalScoreChange = (value: number) => {
  // 如果输入为空，直接返回
  if (!value && value !== 0) {
    practiceForm.totalScore = 100; // 重置为默认值
    ElMessage.warning('总分不能为空，已重置为默认值100分');
    return;
  }

  // 检查是否是有效数字
  if (isNaN(value)) {
    ElMessage.warning('请输入有效的分数');
    practiceForm.totalScore = 100; // 重置为默认值
    return;
  }

  if (value < 20) {
    ElMessage({
      message: '总分不能小于20分，已自动调整为最小值',
      type: 'warning',
      duration: 3000
    });
    practiceForm.totalScore = 20;
  } else if (value > 1000) {
    ElMessage({
      message: '总分不能超过1000分，已自动调整为最大值',
      type: 'warning',
      duration: 3000
    });
    practiceForm.totalScore = 1000;
  }

  // 检查是否存在小数
  if (value % 1 !== 0) {
    ElMessage({
      message: '总分必须为整数，已自动向下取整',
      type: 'warning',
      duration: 3000
    });
    practiceForm.totalScore = Math.floor(value);
  }
};

// 添加按钮悬停处理函数
const handleButtonHover = (row) => {
  if (row.score && row.score % 1 !== 0) {
    ElMessage({
      message: "分数不能为小数，请调整总分或权重",
      type: "warning",
      duration: 3000
    });
  }
};

onMounted(async () => {
  isDetail.value= route.query.id?true:false
  if (isDetail.value) {
    await getKwaData()
    getDracticeDetail()
    return
  }else{
    getTemplateList();
  }
  
});
</script>
<style>
.experimental-practiceInfo-wrap .el-card__body {
  padding: 0 20px 20px 20px !important;
}
.experimental-practiceInfo-wrap .el-form{
  width: 600px;
}
.experimental-practiceInfo-wrap .el-input__wrapper{
  box-shadow: none !important;
}
.experimental-practiceInfo-wrap .el-input__inner{
  text-align: left;
  font-size: 18px;
  color: #1B1B1B;
}
</style>
<style scoped lang="scss">
.custom-form-item{
  display: flex;
  align-items: start;
  vertical-align: center;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #D2D2D2;
  padding: 2px 10px;
  
  .custom-form-item-label{
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #707070;
  }
  .custom-form-item-line{
    display: inline-block;
    width: 1px;
    height: 20px;
    border-left: 1px solid #D2D2D2;
    margin: 5px 15px 0;
  }
  .custom-form-item-input{
    font-family: MicrosoftYaHei;
    font-size: 18px;
    color: #1B1B1B;
  }
}
.practice-tool {
  margin-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  // align-items: center;
  background-color: #fff;

}
.weight-warning {
  color: #F56C6C;
  font-size: 12px;
  margin-top: 4px;
}
.doc-preview {
  max-width: 1200px;
  margin: 0 auto;
    padding: 20px;
    background: white;
    text-align: left;
    
    :deep(p) {
      margin-bottom: 1em;
      line-height: 1.5;
    }
    
    :deep(table) {
      border-collapse: collapse;
      margin: 1em 0;
      
      td, th {
        border: 1px solid #ddd;
        padding: 8px;
      }
    }
  }
</style>
