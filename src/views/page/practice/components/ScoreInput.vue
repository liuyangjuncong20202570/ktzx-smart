<template>
  <!-- 全屏loding -->
  <div v-if="loading" class="full-screen-loading">
    <el-icon :size="60" color="#27A5FF" class="loading-icon">
      <Loading />
    </el-icon>
  </div>
  <div class="score-input-container">
    <!-- <div class="grade-total-title">
      <span>此项总分: {{ dataObj.originScore }}</span>
    </div> -->
    <div v-for="(item, index) in scoreItems" :key="index" class="score-item">
      <div class="item-content">
        <span class="item-label" :title="item.label">{{ item.label }}</span>
        <div class="score-control">
          <el-button class="control-btn plus" @click="handlePlus(index)" :disabled="disable">
            <el-icon><Plus /></el-icon>
          </el-button>
          <!-- <span class="score-value">{{ item.score }}</span> -->
          <el-input
            width="50"
            v-model.number="item.score"
            class="score-input"
            :disabled="disable"
            type="number"
            :min="0"
            :max="dataObj.originScore"
            @change="handleItemScoreChange(index, $event)"
            input-style="text-align: center;padding-left: 10px;"
          />
          <el-button class="control-btn minus" @click="handleMinus(index)" :disabled="disable">
            <el-icon><Minus /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
    <div class="score-item">
      <div class="item-content">
        <span class="item-label">得分</span>
        <div class="score-control">
          <el-button class="control-btn plus" @click="handlePlusTotal" :disabled="disable">
            <el-icon><Plus /></el-icon>
          </el-button>
          <!-- <span class="score-value"></span> -->
          <el-input
            v-model.number="totalScore"
            class="score-input total-score"
            :disabled="disable"
            type="number"
            :min="0"
            :max="dataObj.originScore"
            @change="handleScoreChange"
            @input="handleScoreInput"
            @blur="handleScoreBlur"
            input-style="text-align: center;padding-left: 10px;"
          />
          <el-button class="control-btn minus" @click="handleMinusTotal" :disabled="disable">
            <el-icon><Minus /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <div class="button-group" v-if="!(title == '视频' || title == '答辩验收') && isShowBtn ">
      <el-button v-if="urlArr.length > 0 && !disable" class="custom-link-button custom-link-active-button" @click="handleCorrection">手动批改</el-button>
      <el-button v-if="dataObj?.other?.correctImg" class="custom-link-button custom-link-active-button" @click="handleViewCorrection">查看批改</el-button>
    </div>
    <el-dialog v-model="dialogVisible" class="edit-img-dialog" :title="title" width="1400" :before-close="handleClose" fullscreen style="overflow: hidden">
      <EditImgTwo
        :imgEditUrl="imgUrl"
        :index="index"
        :title="title"
        :scoreCfg="scoreCfg"
        :score="score"
        :correctStep="dataObj?.correctStep || dataObj?.other?.stepMap"
        :isloading="isloading"
        :dataObj="dataObj"
        @saveCorrection="handleSaveCorrection"
      />
      <!-- <EditImgTwo :title="title" :scoreCfg="scoreCfg" :score="score" :correctStep="dataObj?.correctStep" @saveCorrection="handleSaveCorrection" /> -->
    </el-dialog>
    
    <!-- 添加查看批改弹框组件 -->
    <ViewCorrectionDialog
      v-model="viewCorrectionVisible"
      :img-url="viewCorrectionImg"
    />
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, watch, defineEmits, nextTick } from "vue";
import { host } from "@/utils/request.js";
import EditImgTwo from "../components/EditImgTwo.vue";
import { synthesisImgApi } from "@/api/practice/index.ts";
import { ElMessage } from "element-plus";
import ViewCorrection from './ViewCorrection.vue'
import ViewCorrectionDialog from './ViewCorrectionDialog.vue'

const emit = defineEmits(["updateDataObj", "update:score"]);
interface Props {
  title?: string;
  scoreCfg?: {
    mode: string;
    map: Record<string, number>;
  };
  score?: number;
  isShowBtn?: boolean;
  dataObj?: any;
  stuId?: string;
  index?: number;
  disable?: boolean;
  urlArr?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  scoreCfg: () => ({
    mode: "subs",
    map: {},
  }),
  score: 0,
  isShowBtn: true,
  dataObj: {},
  stuId: "",
  index: 0,
  disable: false,
  urlArr: [],
});

interface ScoreItem {
  label: string;
  score: number;
}

const scoreItems = ref<ScoreItem[]>([]);

const dialogVisible = ref(false);

const totalScore = ref(props.score);

const handleClose = () => {
  dialogVisible.value = false;
};
const viewCorrectionVisible = ref(false);
const viewCorrectionImg = ref("");
const handleViewCorrection = () => {
  viewCorrectionVisible.value = true;
  viewCorrectionImg.value = props.dataObj.other.correctImg;
};

const handlePlus = (index: number) => {
  // 计算其他评分项的总和
  const otherItemsScore = scoreItems.value.reduce((acc, item, idx) => {
    return idx !== index ? acc + item.score : acc;
  }, 0);
  // 检查是否会超过总分
  if (otherItemsScore + scoreItems.value[index].score + 1 > props.dataObj.originScore) {
    ElMessage.warning("评分项总分不能超过小分项总分");
    return;
  }
  scoreItems.value[index].score++;
  updateTotalScore();
};

const handleMinus = (index: number) => {
  if (scoreItems.value[index].score > 0) {
    // 检查是否小于0
    if (scoreItems.value[index].score <= 0) {
      ElMessage.warning("分数不能小于0");
      return;
    }
    scoreItems.value[index].score--;
    updateTotalScore();
  }
};
const handlePlusTotal = () => {
  if (totalScore.value >= props.dataObj.originScore) {
    ElMessage.warning(`得分不能超过总分${props.dataObj.originScore}分`);
    return;
  }
  totalScore.value++;
  updateDataItem();
};

const handleMinusTotal = () => {
  if (totalScore.value > 0) {
    totalScore.value--;
    updateDataItem();
  }
};
const handleItemScoreChange = (index: number, value: number | string) => {
  const numValue = Number(value);
  // 计算其他评分项的总和
  const otherItemsScore = scoreItems.value.reduce((acc, item, idx) => {
    return idx !== index ? acc + item.score : acc;
  }, 0);

  if (isNaN(numValue)) {
    scoreItems.value[index].score = 0;
  } else if (numValue < 0) {
    scoreItems.value[index].score = 0;
  } else if (numValue + otherItemsScore > 100) {
    ElMessage.warning("得分不能超过100分");
    scoreItems.value[index].score = 100 - otherItemsScore;
  } else {
    scoreItems.value[index].score = numValue;
  }
  // 更新总分
  updateTotalScore();
};
// 计算并更新总分
const updateTotalScore = () => {
  const sum = scoreItems.value.reduce((acc, item) => {
    return acc + item.score;
  }, 0);
  totalScore.value = sum;
  // 触发父组件更新
  props.dataObj.score = totalScore.value;
  if (props.type == "pg") {
    props.dataObj.other.score = totalScore.value;
  }
  emit("updateDataObj", props.index, props.dataObj);
  // emit("update:score", totalScore.value);
  updateDataItem();
};
// 更新总分
const updateDataItem = () => {
  let scoreMap = {};
  scoreItems.value.forEach((item) => {
    scoreMap[item.label] = item.score;
  });
  props.dataObj.scoreCfg = {
    mode: props.scoreCfg.mode,
    map: scoreMap || null,
  };
  props.dataObj.score = totalScore.value;
  props.dataObj.scoreCfg = {
    mode: props.scoreCfg.mode,
    map: scoreMap || null,
  };
  props.dataObj.other ? props.dataObj.other : (props.dataObj.other = {});
  props.dataObj.other.score = totalScore.value;
  props.dataObj.other.scoreCfg = {
    mode: props.scoreCfg.mode,
    map: scoreMap || null,
  };
  emit("updateDataObj", props.index, props.dataObj);
};

const imgUrl = ref("");
const isloading = ref(false);
const uploadedOriginalImagePath = ref("");
const handleCorrection = () => {
  dialogVisible.value = true;
  // 添加loding
  isloading.value = true;
  synthesisImgApi({ practiceId: props.dataObj.practiceId, stuId: props.stuId, itemId: props.dataObj.id })
    .then((res) => {
      if (res.code == 200) {
        imgUrl.value = host + res.data;
        uploadedOriginalImagePath.value = res.data;
        isloading.value = false;
      } else {
        isloading.value = false;
      }
    })
    .finally(() => {
      isloading.value = false;
    });
  // 实现手动批改逻辑
  // dialogVisible.value = true;
};

const handleSaveCorrection = async (correctionData: any) => {
  if (!props.dataObj) return;

  let uploadedImagePath = "";
  // 上传批改留痕图片
  if (correctionData.currentCanvas) {
    try {
      // 移除 base64 的头部信息
      const base64Data = correctionData.currentCanvas.split(",")[1];

      // 创建 Blob 对象
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // 创建 FormData 对象
      const formData = new FormData();
      formData.append("file", blob, "correction.png");
      formData.append("tag", "practice");

      axios
        .post(host + "/common/upload", formData)
        .then((res) => {
          uploadedImagePath = res.data.data;
          props.dataObj.correctImg = uploadedImagePath;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      ElMessage.error("图片上传失败");
      return;
    }
  }
  // 更新 item 中的数据
  props.dataObj.correctStep = correctionData.annotations || null;

  props.dataObj.totalImg = uploadedOriginalImagePath.value;
  // 更新评分配置
  props.dataObj.scoreDetail = correctionData.scoreConfig.map || null;
  props.dataObj.scoreCfg = {
    mode: correctionData.scoreConfig.mode,
    map: correctionData.scoreConfig.map || null,
  };
  props.dataObj.score = correctionData.scoreConfig.total;
  if (props.type == "pg") {
    props.dataObj.other["scoreCfg"] = {
      mode: correctionData.scoreConfig.mode,
      map: correctionData.scoreConfig.map || null,
    };
    props.dataObj.other["score"] = correctionData.scoreConfig.total;
  }
  emit("updateDataObj", props.index, props.dataObj);
  // 关闭对话框
  dialogVisible.value = false;
};

const initScoreItems = () => {
  if (props.scoreCfg.mode === "subs" && props.scoreCfg.map) {
    scoreItems.value = Object.entries(props.scoreCfg.map).map(([label, score]) => ({
      label,
      score,
    }));
    // scoreItems.value.push({
    //   label: "总分",
    //   score: props.score,
    // });
  }
};
const handleScoreChange = (value: number | string) => {
  const numValue = Number(value);
  // 计算当前所有评分项的总和
  const currentTotalScore = scoreItems.value.reduce((acc, item) => {
    return acc + item.score;
  }, 0);

  if (isNaN(numValue)) {
    totalScore.value = 0;
  } else if (numValue < 0) {
    totalScore.value = 0;
  } else if (numValue > props.dataObj.originScore) {
    ElMessage.warning(`得分不能超过总分${props.dataObj.originScore}分`);
    totalScore.value = props.dataObj.originScore;
    nextTick(() => {
      totalScore.value = props.dataObj.originScore;
    });
  }
  // else if (numValue < currentTotalScore) {
  //   ElMessage.warning("总分不能小于评分项总和");
  //   totalScore.value = currentTotalScore;
  // }
  else {
    totalScore.value = numValue;
  }
  updateDataItem();
};

const handleScoreInput = (value: string) => {
  if (value === "") {
    totalScore.value = 0;
    return;
  }
};

const handleScoreBlur = () => {
  const numValue = Number(totalScore.value);
  if (numValue > 100) {
    ElMessage.warning("得分不能超过100分");
    totalScore.value = 100;
    updateDataItem();
  }
};

watch(
  () => props.scoreCfg,
  () => {
    initScoreItems();
  },
  { immediate: true }
);

watch(
  () => props.score,
  (newScore) => {
    totalScore.value = newScore;
  },
  { immediate: true }
);

onMounted(() => {
  initScoreItems();
});
</script>

<style scoped lang="scss">
.score-input {
  min-width: 50px;
  :deep(.el-input__wrapper) {
    padding: 0;
  }
}
.score-input-container {
  width: 300px;
  padding: 20px;

  .score-item {
    margin-bottom: 15px;

    .item-content {
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 5px;
      border: 1px solid #d2d2d2;
      padding: 8px 15px;
      height: 38px;
      width: 260px;
      overflow: hidden;

      .item-label {
        // flex: 1;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: #707070;
        border-right: 1px solid #d2d2d2;
        padding-right: 15px;
        margin-right: 15px;
        // 超出显示省略号
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }

      .score-control {
        display: flex;
        align-items: center;
        gap: 10px;

        .control-btn {
          padding: 0;
          width: 24px;
          min-width: 24px !important;
          height: 24px;
          min-width: auto;
          border: none;
          background: #27a5ff;
          color: white;
        }

        .score-value {
          font-size: 14px;
          color: #333333;
          min-width: 20px;
          text-align: center;
          display: inline-block;
          width: 50px;
        }
      }
    }
  }

  .button-group {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    .custom-button {
      width: 80px;
      height: 32px;
      border-radius: 4px;
      font-size: 14px;

      &.manual {
        background: #32b16c;
        border-color: #32b16c;
        color: white;

        &:hover {
          background: #2a9d5d;
          border-color: #2a9d5d;
        }
      }

      &.delete {
        background: #ff4d4f;
        border-color: #ff4d4f;
        color: white;

        &:hover {
          background: #ff3336;
          border-color: #ff3336;
        }
      }

      &.cancel {
        background: white;
        border-color: #d2d2d2;
        color: #333333;

        &:hover {
          border-color: #32b16c;
          color: #32b16c;
        }
      }
    }
  }
}

// 添加查看批改相关样式
.correction-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
  
  .correction-image {
    max-width: 100%;
    min-width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }
}
</style>
<style>
.edit-img-dialog {
  /* padding: 0 !important; */
}
.edit-img-dialog .el-dialog__body {
  padding: 0 !important;
}
.edit-img-dialog .el-dialog__header {
  border-bottom: 2px solid #27a5ff;
  text-align: center;
  padding-top: 20px;
}
.score-input-container .score-input .el-input__wrapper {
  box-shadow: none !important;
}
</style>
