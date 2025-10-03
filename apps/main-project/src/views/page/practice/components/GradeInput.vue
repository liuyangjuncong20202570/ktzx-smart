<template>
  <div class="grade-input-container">
    <!-- 评分项列表 -->
    <div class="grade-list">
      <!-- <div class="grade-total-title">
        <span>此项总分: {{ dataObj.originScore }}</span>
      </div> -->
      <div v-for="(item, index) in gradeItems" :key="index" class="grade-item">
        <el-radio
          v-model="selectedGradeIndex"
          :label="index"
          :disabled="item.disabled || disable"
          @change="handleItemChange(index)"
          class="custom-radio"
        >
          <div class="grade-content">
            <span class="grade-label">{{ item.label }}</span>
            <div class="score-control">
              <el-button
                class="control-btn"
                @click.prevent.stop="handleItemPlus(index)"
                :disabled="disable"
                :class="{ 'inactive-btn': selectedGradeIndex !== index }"
              >
                <el-icon><Plus /></el-icon>
              </el-button>
              <el-input
                v-model.number="item.score"
                class="score-input"
                :disabled="disable"
                :class="{ 'inactive-input': selectedGradeIndex !== index }"
                type="number"
                :min="0"
                :max="dataObj.originScore"
                @change="handleItemScoreChange(index, $event)"
              />
              <el-button
                class="control-btn"
                @click.prevent.stop="handleItemMinus(index)"
                :disabled="disable"
                :class="{ 'inactive-btn': selectedGradeIndex !== index }"
              >
                <el-icon><Minus /></el-icon>
              </el-button>
            </div>
          </div>
        </el-radio>
      </div>
    </div>

    <!-- 总分控制 -->
    <div class="total-score-container">
      <div class="total-score-label">得分</div>
      <div class="score-control">
        <el-button class="control-btn" @mousedown.prevent.stop="handlePlus" :disabled="disable">
          <el-icon><Plus /></el-icon>
        </el-button>
        <el-input
          v-model.number="totalScore"
          class="score-input grade-score-input"
          :disabled="disable"
          type="number"
          :min="0"
          :max="dataObj.originScore"
          @change="handleScoreChange"
          @input="handleScoreInput"
          @blur="handleScoreBlur"
        />
        <el-button class="control-btn" @click="handleMinus" :disabled="disable">
          <el-icon><Minus /></el-icon>
        </el-button>
      </div>
    </div>
    <!-- 取消按钮 -->
    <div class="button-container" v-if="!(title == '视频' || title == '答辩验收') && isShowBtn">
      <el-button
        v-if="urlArr.length > 0 && !disable"
        class="custom-link-button custom-link-active-button"
        @click="handleCorrection"
        >手动批改</el-button
      >
      <!-- 查看批改 -->
      <el-button
        v-if="dataObj?.other?.correctImg"
        class="custom-link-button custom-link-active-button"
        @click="handleViewCorrection"
        >查看批改</el-button
      >
    </div>
    <el-dialog
      v-model="dialogVisible"
      class="edit-img-dialog"
      title="实验报告"
      width="1400"
      :before-close="handleClose"
      fullscreen
      style="overflow: hidden"
    >
      <!-- <EditImgTwo :title="title" :scoreCfg="scoreCfg" :score="score" :correctStep="dataObj?.correctStep" @saveCorrection="handleSaveCorrection" /> -->
      <EditImgTwo
        :imgEditUrl="imgUrl"
        :index="index"
        :title="title"
        :scoreCfg="scoreCfg"
        :score="score"
        :selectedScoreName="selectedScoreName"
        :correctStep="dataObj?.correctStep || dataObj?.other?.stepMap"
        :isloading="isloading"
        :dataObj="dataObj"
        @saveCorrection="handleSaveCorrection"
      />
    </el-dialog>
    <ViewCorrectionDialog
      v-model="viewCorrectionVisible"
      :img-url="viewCorrectionImg"
      :original-img-url="uploadedOriginalImagePath"
    />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, computed, onMounted, watch, defineEmits, nextTick } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import EditImgTwo from './EditImgTwo.vue';
import { synthesisImgApi } from '@/api/practice/index.ts';
import { ElMessage } from 'element-plus';
import { host } from '@/utils/request.js';
import ViewCorrectionDialog from './ViewCorrectionDialog.vue';
const emit = defineEmits(['updateDataObj', 'update:score']);
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
  title: '',
  scoreCfg: () => ({
    mode: 'percent',
    map: {}
  }),
  score: 0,
  isShowBtn: true,
  dataObj: {},
  stuId: '',
  index: 0,
  disable: false,
  urlArr: []
});

interface GradeItem {
  label: string;
  score: number;
  checked: boolean;
  disabled: boolean;
}

const gradeItems = ref<GradeItem[]>([]);
const totalScore = ref(props.score);
const selectedGradeIndex = ref(-1);

const viewCorrectionVisible = ref(false);
const viewCorrectionImg = ref('');
const handleViewCorrection = () => {
  isloading.value = true;
  synthesisImgApi({
    practiceId: props.dataObj.practiceId,
    stuId: props.stuId,
    itemId: props.dataObj.id
  })
    .then(res => {
      if (res.code == 200) {
        imgUrl.value = host + res.data;
        uploadedOriginalImagePath.value = res.data;
        isloading.value = false;
      }
    })
    .finally(() => {
      isloading.value = false;
    });
  viewCorrectionVisible.value = true;
  viewCorrectionImg.value = props.dataObj.other.correctImg;
};
// 初始化数据
const initGradeItems = () => {
  if (props.scoreCfg.mode === 'percent' && props.scoreCfg.map) {
    // 检查 map 是否为空对象
    if (Object.keys(props.scoreCfg.map).length === 0) {
      return;
    }
    gradeItems.value = Object.entries(props.scoreCfg.map).map(([label, score]) => ({
      label,
      score
    }));
    if (props.scoreCfg?.checked) {
      gradeItems.value.map((item, index) => {
        if (item.label == props.scoreCfg?.checked) {
          selectedGradeIndex.value = index;
        }
      });
    } else {
      selectedGradeIndex.value = -1;
    }
  }
};

// 监听属性变化
watch(
  () => props.scoreCfg,
  newVal => {
    // 只在 map 有值时初始化
    if (newVal.mode === 'percent' && newVal.map && Object.keys(newVal.map).length > 0) {
      initGradeItems();
    }
  }
  // { immediate: true }
);

const handlePlus = () => {
  if (totalScore.value >= props.dataObj.originScore) {
    ElMessage.warning(`得分不能超过总分${props.dataObj.originScore}分`);
    return;
  }
  totalScore.value++;
  updateDataItem();
};

const handleMinus = () => {
  if (totalScore.value > 0) {
    totalScore.value--;
    updateDataItem();
  }
};

const dialogVisible = ref(false);

const handleClose = () => {
  dialogVisible.value = false;
};
const imgUrl = ref('');
const isloading = ref(false);
const uploadedOriginalImagePath = ref('');
const handleCorrection = () => {
  dialogVisible.value = true;
  // 添加loding
  isloading.value = true;
  synthesisImgApi({
    practiceId: props.dataObj.practiceId,
    stuId: props.stuId,
    itemId: props.dataObj.id
  })
    .then(res => {
      if (res.code == 200) {
        imgUrl.value = host + res.data;
        uploadedOriginalImagePath.value = res.data;
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

  let uploadedImagePath = '';
  // 上传批改留痕图片
  if (correctionData.currentCanvas) {
    try {
      // 移除 base64 的头部信息
      const base64Data = correctionData.currentCanvas.split(',')[1];

      // 创建 Blob 对象
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // 创建 FormData 对象
      const formData = new FormData();
      formData.append('file', blob, 'correction.png');
      formData.append('tag', 'practice');

      axios
        .post(host + '/common/upload', formData)
        .then(res => {
          uploadedImagePath = res.data.data;
          props.dataObj.correctImg = uploadedImagePath;
        })
        .catch(err => {});
    } catch (error) {
      ElMessage.error('图片上传失败');
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
    checked: correctionData.scoreConfig.selectedScoreName || null
  };
  props.dataObj.score = correctionData.scoreConfig.total || totalScore.value;
  props.dataObj.selectedScoreName = correctionData.scoreConfig.selectedScoreName;
  emit('updateDataObj', props.index, props.dataObj);
  // 关闭对话框
  dialogVisible.value = false;
};
interface ScoreItem {
  label: string;
  score: number;
}
const scoreItems = ref<ScoreItem[]>([]);
const initScoreItems = () => {
  if (props.scoreCfg.mode === 'subs' && props.scoreCfg.map) {
    scoreItems.value = Object.entries(props.scoreCfg.map).map(([label, score]) => ({
      label,
      score
    }));
  }
};
const selectedScoreName = ref('');
const handleItemChange = (index: number) => {
  selectedGradeIndex.value = index;
  selectedScoreName.value = gradeItems.value[index].label;
  gradeItems.value.forEach((item, idx) => {
    item.checked = idx === index;
  });
  updateTotalScore();
};

watch(
  () => props.scoreCfg,
  () => {
    initScoreItems();
  },
  { deep: true }
);

watch(
  () => props.score,
  newScore => {
    if (newScore) {
      totalScore.value = newScore;
    }
  },
  { immediate: true }
);

onMounted(() => {
  initScoreItems();
  // 只在组件挂载且有数据时初始化
  if (
    props.scoreCfg.mode === 'percent' &&
    props.scoreCfg.map &&
    Object.keys(props.scoreCfg.map).length > 0
  ) {
    initGradeItems();
  }
});

const handleItemScoreChange = (index: number, value: number | string) => {
  const numValue = Number(value);
  const otherItemsScore = gradeItems.value.reduce((acc, item, idx) => {
    return idx !== index && item.checked ? acc + item.score : acc;
  }, 0);

  if (isNaN(numValue)) {
    gradeItems.value[index].score = 0;
  } else if (numValue < 0) {
    gradeItems.value[index].score = 0;
  }
  // else if (numValue + otherItemsScore > props.dataObj.originScore) {
  //   ElMessage.warning("评分项总分不能超过小分项总分");
  //   gradeItems.value[index].score = props.dataObj.originScore - otherItemsScore;
  // }
  else {
    gradeItems.value[index].score = numValue;
  }
  // 更新总分
  updateTotalScore();
};

// 处理总分变化
const handleScoreChange = (value: number | string) => {
  const numValue = Number(value);
  const selectedItem = gradeItems.value[selectedGradeIndex.value];

  if (selectedItem) {
    const score = selectedItem.score;
    // 检查是否会产生小数
    // if (score && numValue) {
    //   const calculatedScore = (score / 100) * numValue;
    //   if (calculatedScore % 1 !== 0) {
    //     ElMessage.warning("当前总分会导致小数分数，请调整总分");
    //     return;
    //   }
    // }
  }

  if (isNaN(numValue)) {
    totalScore.value = 0;
  } else if (numValue < 0) {
    totalScore.value = 0;
  } else if (numValue > 100) {
    ElMessage.warning('得分不能超过100分');
    totalScore.value = 100;
  } else {
    totalScore.value = numValue;
  }
  updateDataItem();
};

// 处理总分输入
const handleScoreInput = (value: string | number) => {
  if (value === '') {
    totalScore.value = 0;
  }
};

const handleScoreBlur = () => {
  if (totalScore.value > 100) {
    ElMessage.warning('得分不能超过100分');

    totalScore.value = 100;
    // emit("update:score", totalScore.value);
    props.dataObj.score = totalScore.value;
    props.dataObj.other ? props.dataObj.other : (props.dataObj.other = {});
    props.dataObj.other.score = totalScore.value;
    emit('updateDataObj', props.index, props.dataObj);
  }
};
// 评分项加减
const handleItemPlus = (index: number) => {
  if (selectedGradeIndex.value === index) {
    if (gradeItems.value[index].score >= 100) {
      ElMessage.warning('得分不能超过100分');
      return;
    }
    gradeItems.value[index].score++;
    updateTotalScore();
  }
};

const handleItemMinus = (index: number) => {
  if (selectedGradeIndex.value === index) {
    if (gradeItems.value[index].score <= 0) {
      ElMessage.warning('分数不能小于0');
      return;
    }
    gradeItems.value[index].score--;
    updateTotalScore();
  }
};

// 计算并更新总分
const updateTotalScore = () => {
  const selectedItem = gradeItems.value[selectedGradeIndex.value];
  const score = selectedItem ? selectedItem.score : 0;

  if (score > props.dataObj.originScore) {
    ElMessage.warning('得分不能超过100分');
    if (selectedItem) {
      selectedItem.score = props.dataObj.originScore;
    }
    totalScore.value = props.dataObj.originScore;
  } else {
    totalScore.value = score;
  }
  // 触发父组件更新
  props.dataObj.score = totalScore.value;
  props.dataObj.other ? props.dataObj.other : (props.dataObj.other = {});
  props.dataObj.other.score = totalScore.value;
  props.dataObj.selectedScoreName = selectedScoreName.value;
  emit('updateDataObj', props.index, props.dataObj);
  // 更新数据
  updateDataItem();
};

// 更新总分和评分配置
const updateDataItem = () => {
  let scoreMap = {} as Record<string, number>;
  gradeItems.value.forEach(item => {
    scoreMap[item.label] = item.score;
  });
  props.dataObj.scoreCfg = {
    mode: props.scoreCfg.mode,
    map: scoreMap || null,
    checked:
      (gradeItems.value[selectedGradeIndex.value] &&
        gradeItems.value[selectedGradeIndex.value].label) ||
      null
  };
  props.dataObj.score = totalScore.value;
  props.dataObj.other ? props.dataObj.other : (props.dataObj.other = {});
  props.dataObj.other.score = totalScore.value;
  props.dataObj.other.scoreCfg = {
    mode: props.scoreCfg.mode,
    map: scoreMap || null,
    checked:
      (gradeItems.value[selectedGradeIndex.value] &&
        gradeItems.value[selectedGradeIndex.value].label) ||
      null
  };
  emit('updateDataObj', props.index, props.dataObj);
};

// 监听选中项变化
watch(
  () => selectedGradeIndex.value,
  newIndex => {
    if (newIndex >= 0) {
      updateTotalScore();
    }
  }
);
</script>

<style scoped lang="scss">
.grade-input-container {
  width: 300px;
  padding: 20px;
  //   background: #FFFFFF;

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
  }

  .grade-list {
    margin-bottom: 15px;

    .grade-item {
      margin-bottom: 20px;

      :deep(.el-radio) {
        width: 100%;
        margin-right: 0;

        .el-radio__input {
          .el-radio__inner {
            width: 16px;
            height: 16px;
            border-color: #27a5ff;
          }

          &.is-checked {
            .el-radio__inner {
              background: #27a5ff;
              border-color: #27a5ff;
            }
          }
        }

        .el-radio__label {
          padding-left: 10px;
          width: calc(100% - 26px);
        }
      }

      .grade-content {
        display: flex;
        align-items: center;
        width: calc(100% - 30px);
        height: 38px;
        padding: 0 15px;
        background: #ffffff;
        border: 1px solid #d2d2d2;
        border-radius: 5px;
        width: 230px;
        opacity: 1 !important;
        visibility: visible !important;

        .grade-label {
          font-size: 16px;
          color: #707070;
          border-right: 1px solid #d2d2d2;
          padding-right: 15px;
          margin-right: 15px;
        }

        .score-control {
          display: flex;
          align-items: center;
          gap: 8px;

          .control-btn {
            padding: 0;
            width: 24px;
            min-width: 24px !important;
            height: 24px;
            min-width: auto;
            border: none;
            background: #27a5ff;
            color: white;
            cursor: pointer;
            border-radius: 4px;

            &:not(:disabled):hover {
              background: #409eff;
            }

            &:disabled {
              background-color: #d2d2d2;
              cursor: not-allowed;
            }

            &:active {
              transform: scale(0.95);
            }

            &.inactive-btn {
              opacity: 0.5;
              cursor: not-allowed;
              background-color: #d2d2d2;
            }
          }
        }

        .score-input {
          min-width: 50px;
          .el-input__wrapper {
            padding: 0;
          }
          :deep(.el-input__inner) {
            text-align: center;
            height: 24px;
            line-height: 24px;
            font-size: 14px;
            color: #333333;
          }

          // 隐藏上下箭头
          :deep(.el-input__inner::-webkit-outer-spin-button),
          :deep(.el-input__inner::-webkit-inner-spin-button) {
            -webkit-appearance: none;
            margin: 0;
          }

          &.is-disabled {
            :deep(.el-input__inner) {
              color: #999999;
              background-color: #f5f7fa;
            }
          }

          &.inactive-input {
            opacity: 0.7;
            pointer-events: none;

            :deep(.el-input__inner) {
              color: #999;
              background-color: #f5f7fa;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  .total-score-container {
    margin-bottom: 20px;
    padding: 8px 15px;
    background: #ffffff;
    border: 1px solid #d2d2d2;
    border-radius: 5px;
    display: flex;
    align-items: center;
    height: 38px;
    width: 260px;

    .total-score-label {
      font-size: 16px;
      color: #707070;
      border-right: 1px solid #d2d2d2;
      padding-right: 15px;
      margin-right: 15px;
    }

    .score-control {
      display: flex;
      align-items: center;
      gap: 8px;

      .control-btn {
        padding: 0;
        width: 24px;
        min-width: 24px !important;
        height: 24px;
        min-width: auto;
        border: none;
        background: #27a5ff;
        color: white;
        cursor: pointer;
        border-radius: 4px;

        &:not(:disabled):hover {
          background: #409eff;
        }

        &:disabled {
          background-color: #d2d2d2;
          cursor: not-allowed;
        }

        &:active {
          transform: scale(0.95);
        }
      }

      .score-input {
        min-width: 50px;
        .el-input__wrapper {
          padding: 0;
        }
        :deep(.el-input__inner) {
          padding: 0 5px;
          text-align: center;
          height: 24px;
          line-height: 24px;
        }

        // 隐藏上下箭头
        :deep(.el-input__inner::-webkit-outer-spin-button),
        :deep(.el-input__inner::-webkit-inner-spin-button) {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }
  }

  .button-container {
    text-align: center;

    .cancel-button {
      width: 80px;
      height: 32px;
      background: #ffffff;
      border: 1px solid #ff4d4f;
      border-radius: 4px;
      font-size: 14px;
      color: #ff4d4f;

      &:hover {
        background: #fff1f0;
      }
    }
  }
}
</style>
<style>
.grade-content .el-input__wrapper {
  box-shadow: none !important;
}
.total-score-container .el-input__wrapper {
  box-shadow: none !important;
}
</style>
