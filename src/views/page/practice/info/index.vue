<!--
 * @Date: 2024-07-16 14:59:49
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-19 16:44:48
 * @FilePath: \smarttt_ktzx\src\views\page\practice\info\index.vue
-->
<template>
  <el-card class="experimental-practiceInfo-wrap">
    <Header :title="`${isDetail ? '编辑' : '新建'}实验`" />
    <div class="practice-tool">
      <el-form :model="practiceForm" label-width="auto" :inline="true" :rules="rules" ref="practiceFormRef">
        <el-form-item label="实验名称" prop="name">
          <el-input v-model.trim="practiceForm.name" />
        </el-form-item>
        <el-form-item label="总分" prop="totalScore">
          <el-input-number v-model="practiceForm.totalScore" :controls="false" :step-strictly="true" />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="saveData(practiceFormRef)">保存</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%">
      <!-- <el-table-column lebel="选择" type="selection" width="55" fixed="left" :selectable="checkSelectable" /> -->
      <el-table-column label="选择" type="beValid" width="55" fixed="left">
        <template #default="scope">
          <template v-if="scope.row.beDefault==1">-</template>
          <template v-else>
            <el-checkbox @change="((val) => {
              scope.row.disabled = !val
              if (!val) {
                scope.row.weight = 0
              }
            })" v-model="scope.row.beValid"/>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="itemName" width="200" fixed="left"></el-table-column>
      <el-table-column label="KWA" prop="fullName" />
      <el-table-column label="权重" prop="weight" width="240">
        <template #default="scope">
          <template v-if="scope.row.setWeight == 1"> <el-input-number :disabled="scope.row.disabled" v-model="scope.row.weight" :min="0" :max="100" step-strictly />% </template>
          <template v-else>-</template>
        </template>
      </el-table-column>
      <!-- <el-table-column label="学生可见" prop="stuVisible">
        <template #default="scope">
          <el-checkbox v-model="scope.row.stuVisible" />
        </template>
      </el-table-column> -->
      <el-table-column label="操作" prop="address" width="280">
        <template #default="scope">
          <template  v-if="scope.row.beValid==1">
            <el-button v-if="scope.row.beDefault" type="primary" :text="true" :disabled="!scope.row.defaultPath" @click="lookFile(scope.row)">预览</el-button>
            <el-button v-if="scope.row.beDefault" type="primary" :text="true" @click="openUpload(scope.row)">上传</el-button>
            <el-button type="primary" :text="true" v-if="scope.row.setKwa == 1" @click="openKwa(scope.row)">KWA关联</el-button>
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
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
    <iframe ref="iframe" style="width: 100%; height: calc(100vh - 200px)" :src="fileUrl" frameborder="0" v-if="isPdf"</iframe>
    <VideoPlayer v-if="isVideo" :src="fileUrl" :options="playerOptions"></VideoPlayer>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary"  @click="isOpenLookDialog = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from "vue";
import { getTemplate,savePractice,practiceDetail,kwaTree, practiceUpdate } from "@/api/practice/index.ts";
import { PracticeTemplateVO,ParamVO ,DefaultParamVO,KwaVO,KwaParamVO,ResVO } from "@/api/practice/type.ts";
import { RuleForm } from "./type";
import { host } from "@/api/host.js";
import Kwa from "../components/kwa.vue";
import Upload from "@/components/upload/index.vue";
import { VideoPlayer } from '@videojs-player/vue'
import Header from '@/views/page/components/header/index.vue'
import 'video.js/dist/video-js.css'
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { useRouter } from 'vue-router'
const routes = useRouter()
const { currentRoute } = routes
const route = currentRoute.value
const practiceFormRef = ref<FormInstance>()
const practiceForm = reactive({
  name: "",
  totalScore: "",
});
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入实验名称', trigger: ['blur','change'] },
  ],
  totalScore: [
    { required: true, message: '请输入总分', trigger: ['blur','change'] },
  ],
})
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
let selectRowKeyData = reactive<PracticeTemplateVO>({});
let uploadRowData = reactive<PracticeTemplateVO>({});
const tableData = reactive<PracticeTemplateVO>([]);
const kwaArr = reactive<KwaVO>([])
const computeFileType = (file: string) => {
  const imgType = <string[]>["png", "jpg", "bmp"];
  const videoType = <string[]>["mp4", "avi"];
  const pdfType = <string[]>["pdf"];
  const wordType = <string[]>["doc", "docx"];
  const fileType = file.slice(file.lastIndexOf(".") + 1);
  isImg.value =false
  isVideo.value = false
  isPdf.value = false
  isWord.value = false
  if(imgType.includes(fileType)){
    isImg.value = true
  }
  if(videoType.includes(fileType)){
    isVideo.value = true
  }
  if(pdfType.includes(fileType)){
    isPdf.value = true
  }
  if(wordType.includes(fileType)){
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
    window.location.href = fileUrl.value
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
const lookFile = (row: any) => {
  computeFileType(row.defaultPath)
  // defaultPath
  // return row.beDefault == 1 ? false : true;
};
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
      if (item.id == selectRowKeyData.id) {
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
// 打开kwa弹框
const openKwa = (data: PracticeTemplateVO) => {
  kwaId.value = data.kwaId
  selectRowKeyData = data;
  isOpenDialog.value = true;
};
const saveData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate( async (valid, fields) => {
    if (valid) {
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
        console.info(888)
        console.info(kwaArr)
        arr.push({
          beDefault: _item.beDefault,
          beValid: _item.beValid?1:0,
          defaultPath: _item.defaultPath,
          id: _item.id,
          itemName: _item.itemName,
          weight: _item.weight,
          stuVisible: _item.stuVisible?1:0,
          kwas: [...kwaArr],
        });
      });
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
};
// 新增加载默认模版
const getTemplateList = async () => {
  const data = await getTemplate();
  if (data.code == 200) {
    data.data.forEach((item: any) => {
      item.beValid = item.beValid==1
      item.stuVisible = item.stuVisible==1
      item.fullName = "";
      item.kwaName = "";
      item.kwaId = "";
      item.defaultPath = ''
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
  if (resData.code==200) {
    let arr = JSON.parse(JSON.stringify(resData.data.items))
    practiceForm.name = resData.data.name
    practiceForm.totalScore = resData.data.totalScore
    arr.forEach(async (item: any) =>{
      item.beValid = item.beValid==1
      item.stuVisible = item.stuVisible==1
      item.fullName = item.kwas[0]&&item.kwas[0].kwaId? calculateFullName(item.kwas[0].kwaId):'-';
      item.kwaName = item.kwas[0]?item.kwas[0].kwaName:"";
      item.kwaId = item.kwas[0]?item.kwas[0].kwaId:""
    })
    tableData.length = 0;
    tableData.push(...arr);
  }
}
onMounted(async () => {
  isDetail.value= route.query.id?true:false
  if (isDetail.value) {
    await getKwaData()
    getDracticeDetail()
    return
  }
  getTemplateList();
  
});
</script>
<style>
.experimental-practiceInfo-wrap .el-card__body {
  padding: 0 20px 20px 20px !important;
}
</style>
<style scoped>
.practice-tool {
  margin-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}
</style>
