<template>
  <el-dialog v-model="dialogVisible" title="实验报告" width="800px" :close-on-click-modal="false" :before-close="handleClose">
    <div class="dialog-content">
      <p class="custom-dialog-title">此项总分: {{ totalScore }}</p>
      <div class="dialog-content-container">
        <div class="section-container" :class="{ 'section-active': selectedMode === 1 }">
          <div class="section-title" :class="{ 'section-active': selectedMode === 1 }">
            <el-radio v-model="selectedMode" :disabled="disabled" :label="1">小分项模式</el-radio>
          </div>
          <div class="left-section">
            <div v-for="(item, index) in sortedLeftItems" :key="item.name" class="item">
              <div class="item-controls">
                <el-input
                  v-model="tempNames[item.name]"
                  class="item-name-input"
                  :disabled="disabled"
                  @input="handleNameInput($event, item.name)"
                  @change="handleNameChange($event, item.name, index)"
                  maxlength="10"
                >
                </el-input>
          
                <el-button class="operate-button" type="primary" size="small" @click="incrementScore(item.name)" :disabled="disabled">+</el-button>
                <el-input
                  width="100"
                  v-model.number="leftItems[item.name]"
                  class="score-input"
                  type="number"
                  :min="0"
                  :max="totalScore"
                  :disabled="disabled"
                  @change="handleLeftScoreChange($event, item.name)"
                  @input="handleLeftScoreInput($event, item.name)"
                />
                <el-button class="operate-button" type="primary" size="small" @click="decrementScore(item.name)" :disabled="disabled">-</el-button>
              </div>
              <el-button class="custom-link-button custom-link-delete-button" size="small" @click="removeLeftItem(item.name)" :disabled="disabled">删除</el-button>
            </div>
            <el-divider />
            <div class="add-item" v-if="Object.keys(leftItems).length < 10">
              <el-input v-model="newLeftItem" placeholder="在此输入新增项" style="width: 290px" :disabled="disabled" />
              <el-button class="custom-link-button custom-link-active-button" style="height: 25px !important" @click="addLeftItem" :disabled="!newLeftItem || disabled">新增</el-button>
            </div>
          </div>
        </div>

        <div class="section-container" :class="{ 'section-active': selectedMode === 2 }">
          <div class="section-title" :class="{ 'section-active': selectedMode === 2 }">
            <el-radio v-model="selectedMode" :disabled="disabled" :label="2">百分比模式</el-radio>
          </div>
          <div class="right-section">
            <div v-for="(item, index) in sortedRightItems" :key="item.name" class="item">
              <div class="item-controls">
                <span class="item-name" :title="item.name">{{ item.name }}</span>
                <el-button class="operate-button" type="primary" size="small" @click="incrementRightScore(item.name)" :disabled="disabled">+</el-button>
                <el-input
                  width="100"
                  v-model.number="rightItems[item.name]"
                  class="score-input"
                  type="number"
                  :min="0"
                  :max="totalScore"
                  :disabled="disabled"
                  @change="handleRightScoreChange($event, item.name)"
                  @input="handleRightScoreInput($event, item.name)"
                />
                <el-button class="operate-button" type="primary" size="small" @click="decrementRightScore(item.name)" :disabled="disabled">-</el-button>
                <!-- <span class="percentage">{{ item.percentage }}%</span> -->
              </div>
              <el-button class="custom-link-button custom-link-delete-button" size="small" @click="removeRightItem(index)" :disabled="disabled">删除</el-button>
            </div>
            <el-divider />
            <el-button class="custom-link-button custom-link-active-button" @click="addRightItem" :disabled="disabled" v-if="Object.keys(rightItems).length < 10">新增</el-button>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer custom-dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="disabled">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineExpose, watch, defineEmits, onMounted } from "vue";
import { ElMessage } from "element-plus";
const emit = defineEmits(["confirm"]);
const dialogVisible = ref(false);
const selectedMode = ref(1);
const reportData = ref(null);
const newLeftItem = ref("");
const editingName = ref(''); // 用于存储正在编辑的名称
const isEditing = ref(false); // 用于控制是否处于编辑状态
const tempNames = ref<{ [key: string]: string }>({});
const props = defineProps({
  totalScore: {
    type: Number,
    default: 0,
  },
  currentId: {
    type: Number,
    default: 0,
  },
  map: {
    type: Array,
    default: [],
  },
  mode: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// 计算平均分
const calculateEvenScore = () => {
  const itemCount = 4;
  const baseScore = Math.floor(props.totalScore / itemCount); // 基础分数
  const remainder = props.totalScore % itemCount; // 余数

  // 返回一个数组，包含所有项的分数
  return Array(itemCount)
    .fill(baseScore)
    .map((score, index) => {
      // 将余数从第一项开始分配
      return index < remainder ? score + 1 : score;
    });
};

// 计算百分比对应的分数
const calculatePercentageScore = (percentage: number) => {
  return Math.floor((props.totalScore * percentage) / 100);
};

// 左侧列表数据
const leftItems = ref({
  报告格式: 0,
  报告字数: 0,
  结构合理: 0,
  内容充实: 0,
});

// 右侧列表数据
const rightItems = ref({
  A: calculatePercentageScore(100),
  B: calculatePercentageScore(70),
  C: calculatePercentageScore(50),
  D: calculatePercentageScore(30),
});

// 保存每个等级对应的百分比
const percentages = {
  A: 100,
  B: 70,
  C: 50,
  D: 30,
};

// 重新排序并更新键值
const reorderRightItems = () => {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const currentValues = Object.values(rightItems.value);
  const currentPercentages = Object.values(percentages);

  // 清空当前数据
  rightItems.value = {};
  const newPercentages: Record<string, number> = {};

  // 重新按顺序赋值
  currentValues.forEach((value, index) => {
    const newKey = letters[index];
    rightItems.value[newKey] = value;
    newPercentages[newKey] = currentPercentages[index];
  });

  // 更新百分比对象
  Object.assign(percentages, newPercentages);
};

// 获取下一个可用的字母
const getNextAvailableLetter = () => {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const usedLetters = Object.keys(rightItems.value);
  return letters.find((letter) => !usedLetters.includes(letter)) || "";
};

// 修改右侧列表排序计算
const sortedRightItems = computed(() => {
  return Object.entries(rightItems.value)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, score]) => ({
      name,
      score,
      percentage: percentages[name],
    }));
});

// 左侧分数增减
const incrementScore = (name: string) => {
  if (leftItems.value[name] < props.totalScore) {
    leftItems.value[name]++;
    updateTotalScore();
  } else {
    ElMessage.warning(`单项分数不能超过总分${props.totalScore}分`);
  }
};

const decrementScore = (name: string) => {
  if (leftItems.value[name] > 0) {
    leftItems.value[name]--;
    updateTotalScore();
  }
};

// 添加一个数组来维护左侧项目的顺序
const leftItemsOrder = ref<string[]>(["报告格式", "报告字数", "结构合理", "内容充实"]);

// 左侧添加删除
const addLeftItem = () => {
  if (newLeftItem.value && Object.keys(leftItems.value).length < 10) {
    const trimmedName = newLeftItem.value.trim();
    
    // 检查长度限制
    if (trimmedName.length > 10) {
      ElMessage({
        message: '名称长度不能超过10个字符',
        type: 'warning',
        duration: 2000,
        showClose: true
      });
      return;
    }

    // 检查重复名称
    if (Object.keys(leftItems.value).includes(trimmedName)) {
      ElMessage.warning('已存在相同的名称');
      return;
    }

    leftItems.value[trimmedName] = 0;
    leftItemsOrder.value.push(trimmedName);
    tempNames.value[trimmedName] = trimmedName;
    newLeftItem.value = "";
  }
};

const removeLeftItem = (name: string) => {
  if (Object.keys(leftItems.value).length <= 1) {
    ElMessage.warning("至少需要保留1个评分项");
    return;
  }
  delete leftItems.value[name];
  delete tempNames.value[name];
  leftItemsOrder.value = leftItemsOrder.value.filter((item) => item !== name);
};

// 右侧添加删除
const addRightItem = () => {
  if (Object.keys(rightItems.value).length < 10) {
    // 直接使用当前长度确定下一个字母
    const nextIndex = Object.keys(rightItems.value).length;
    const nextLetter = String.fromCharCode(65 + nextIndex); // 'A' + index
    const percentage = Math.max(10, 100 - Object.keys(rightItems.value).length * 20);
    rightItems.value[nextLetter] = 0;
    percentages[nextLetter] = percentage;
  }
};

const removeRightItem = (index: number) => {
  // 检查是否至少保留1项
  if (Object.keys(rightItems.value).length <= 1) {
    ElMessage.warning("至少需要保留1个评分项");
    return;
  }
  const itemToRemove = sortedRightItems.value[index];
  const key = itemToRemove.name;
  delete rightItems.value[key];
  delete percentages[key];
  reorderRightItems();
};

// 右侧分数增减
const incrementRightScore = (name: string) => {
  if (rightItems.value[name] < props.totalScore) {
    rightItems.value[name]++;
    updateRightTotalScore();
  } else {
    ElMessage.warning(`单项分数不能超过总分${props.totalScore}分`);
  }
};

const decrementRightScore = (name: string) => {
  if (rightItems.value[name] > 0) {
    rightItems.value[name]--;
    updateRightTotalScore();
  }
};

// 处理右侧分数变化
const handleRightScoreChange = (value: number | string, itemName: string) => {
  const numValue = Number(value);
  console.log("numValue", numValue);
  if (isNaN(numValue)) {
    rightItems.value[itemName] = 0;
  } else if (numValue < 0) {
    rightItems.value[itemName] = 0;
  } else if (numValue > props.totalScore) {
    ElMessage.warning(`单项分数不能超过总分${props.totalScore}分`);
    rightItems.value[itemName] = props.totalScore;
  } else {
    rightItems.value[itemName] = numValue;
  }
  updateRightTotalScore();
};

const handleRightScoreInput = (value: string, itemName: string) => {
  if (value === "") {
    rightItems.value[itemName] = 0;
    updateRightTotalScore();
  }
};

// 更新右侧总分
const updateRightTotalScore = () => {
  const total = Object.entries(rightItems.value).reduce((sum, [key, score]) => {
    return sum + (score * (percentages[key] || 0)) / 100;
  }, 0);
  console.log("total", total);
  // totalScore.value = Math.round(total);
};

// 修改监听总分变化
watch(
  () => props.totalScore,
  (newValue) => {
    if (newValue) {
      const scores = calculateEvenScore();
      Object.keys(leftItems.value).forEach((key, index) => {
        leftItems.value[key] = scores[index];
      });

      // 更新右侧列表分数
      Object.entries(rightItems.value).forEach(([name]) => {
        rightItems.value[name] = calculatePercentageScore(percentages[name]);
      });
    }
  }
);

// 弹框操作
const openDialog = (data: any) => {
  // 先重置所有数据，避免缓存问题
  resetData();

  reportData.value = data;
  dialogVisible.value = true;

  // 根据 mode 设置默认选中项
  if (props.mode) {
    selectedMode.value = props.mode === "subs" ? 1 : 2;
  }

  // 根据 map 初始化数据
  if (props.map && Object.keys(props.map).length > 0) {
    if (props.mode === "subs") {
      // 初始化左侧数据
      leftItems.value = props.map;
      leftItemsOrder.value = Object.keys(props.map);
      // 初始化临时名称 - 移到这里确保在数据加载后初始化
      initTempNames();
    } else if (props.mode === "percent") {
      // 初始化右侧数据
      rightItems.value = props.map;
      reorderRightItems();
    }
  } else {
    // 即使没有 map 数据，也要初始化临时名称
    initTempNames();
  }
};

const handleClose = () => {
  // 关闭时重置数据
  resetData();
  dialogVisible.value = false;
};

const handleCancel = () => {
  // 取消时重置数据
  resetData();
  dialogVisible.value = false;
};

const handleConfirm = () => {
  // 检查是否有重复名称
  if (selectedMode.value === 1) {
    // 检查临时名称中是否有重复
    const tempNameValues = Object.values(tempNames.value);
    const hasDuplicates = tempNameValues.some((name, index) => 
      tempNameValues.indexOf(name) !== index
    );
    console.log("tempNameValues", tempNameValues);
    console.log("hasDuplicates", hasDuplicates);
    if (hasDuplicates) {
      ElMessage({
        message: '存在相同的名称，请修改后再提交',
        type: 'warning',
        duration: 2000,
        showClose: true
      });
      return;
    }
  }

  // 计算左侧分数总和
  if (selectedMode.value === 1) {
    const totalLeftScore = Object.values(leftItems.value).reduce((sum, score) => sum + Number(score), 0);

    // 检查总分是否相等
    if (totalLeftScore !== props.totalScore) {
      if (totalLeftScore > props.totalScore) {
        ElMessage.warning(`所有小分项总分应等于${props.totalScore}分`);
        return;
      } else if (totalLeftScore < props.totalScore) {
        ElMessage.warning(`所有小分项总分应等于${props.totalScore}分`);
        return;
      }
    }
  }

  const result = {
    id: props.currentId,
    mode: selectedMode.value === 1 ? "subs" : "percent",
    map: selectedMode.value === 1 ? 
      Object.fromEntries(
        Object.entries(leftItems.value).map(([key, value]) => [
          tempNames.value[key] || key,
          value
        ])
      ) : 
      rightItems.value,
  };

  emit("confirm", result);
  resetData();
  dialogVisible.value = false;
};

const resetData = () => {
  // 根据 mode 设置选中模式，如果没有 mode 则默认选中左侧
  selectedMode.value = props.mode ? (props.mode === "subs" ? 1 : 2) : 1;
  newLeftItem.value = "";

  // 重置左侧数据
  leftItems.value = {
    报告格式: 0,
    报告字数: 0,
    结构合理: 0,
    内容充实: 0,
  };

  // 重置右侧数据
  rightItems.value = {
    A: calculatePercentageScore(100),
    B: calculatePercentageScore(70),
    C: calculatePercentageScore(50),
    D: calculatePercentageScore(30),
  };

  // 重置百分比
  Object.assign(percentages, {
    A: 100,
    B: 70,
    C: 50,
    D: 30,
  });

  // 重置左侧顺序
  leftItemsOrder.value = ["报告格式", "报告字数", "结构合理", "内容充实"];

  reportData.value = null;

  // 初始化左侧分数
  initLeftScores();

  // 重置临时名称
  initTempNames();
};

// 监听 props 变化
watch([() => props.mode, () => props.map], ([newMode, newMap]) => {
  if (dialogVisible.value && (newMode || newMap)) {
    if (newMode) {
      selectedMode.value = newMode === "subs" ? 1 : 2;
    }

    if (newMap && Object.keys(newMap).length > 0) {
      if (newMode === "subs") {
        leftItems.value = newMap;
        leftItemsOrder.value = Object.keys(newMap);
        initTempNames();
      } else if (newMode === "percent") {
        rightItems.value = newMap;
      }
    }
  }
});

// 修改左侧列表渲染计算属性，使用顺序数组
const sortedLeftItems = computed(() => {
  return leftItemsOrder.value.map((name) => ({
    name,
    score: leftItems.value[name],
  }));
});

// 处理左侧分数变化
const handleLeftScoreChange = (value: number | string, itemName: string) => {
  const numValue = Number(value);
  if (isNaN(numValue)) {
    leftItems.value[itemName] = 0;
  } else if (numValue < 0) {
    leftItems.value[itemName] = 0;
  } else if (numValue > props.totalScore) {
    ElMessage.warning(`单项分数不能超过总分${props.totalScore}分`);
    leftItems.value[itemName] = props.totalScore;
  } else {
    leftItems.value[itemName] = numValue;
  }
  updateTotalScore();
};

const handleLeftScoreInput = (value: string, itemName: string) => {
  if (value === "") {
    leftItems.value[itemName] = 0;
    updateTotalScore();
  } else {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue > props.totalScore) {
      ElMessage.warning(`单项分数不能超过总分${props.totalScore}分`);
      leftItems.value[itemName] = props.totalScore;
      updateTotalScore();
    }
  }
};

// 更新总分
const updateTotalScore = () => {
  // totalScore.value = Object.values(leftItems.value).reduce((sum, score) => sum + score, 0);
};

// 初始化左侧分数
const initLeftScores = () => {
  const scores = calculateEvenScore();
  const keys = Object.keys(leftItems.value);
  keys.forEach((key, index) => {
    leftItems.value[key] = scores[index];
  });
};

// 修改 initTempNames 方法
const initTempNames = () => {
  tempNames.value = {};
  // 确保每个项目都有对应的临时名称
  Object.keys(leftItems.value).forEach(name => {
    tempNames.value[name] = name;
  });
};

// 修改输入处理方法
const handleNameInput = (value: string, oldName: string) => {
  // 如果输入为空
  if (!value) {
    tempNames.value[oldName] = '';
    return;
  }
  
  // 如果当前输入长度超过10个字符
  if (value.length > 10) {
    // 截取前10个字符
    tempNames.value[oldName] = value.slice(0, 10);
    // 立即显示提示
    ElMessage({
      message: '名称长度不能超过10个字符',
      type: 'warning',
      duration: 2000,
      showClose: true
    });
    return;
  }
  
  tempNames.value[oldName] = value;
};

// 修改 handleNameChange 方法
const handleNameChange = (newName: string, oldName: string, index: number) => {
  const trimmedName = newName.trim();
  
  // 如果名称为空，恢复原值并提示
  if (!trimmedName) {
    ElMessage({
      message: '名称不能为空，请重新输入',
      type: 'warning',
      duration: 2000,
      showClose: true
    });
    tempNames.value[oldName] = oldName;
    return;
  }
  
  // 检查长度限制
  if (trimmedName.length > 10) {
    ElMessage({
      message: '名称长度不能超过10个字符，请重新输入',
      type: 'warning',
      duration: 2000,
      showClose: true
    });
    tempNames.value[oldName] = oldName;
    return;
  }

  // 检查是否有重复名称（排除自身）
  // const isDuplicate = Object.values(tempNames.value).some(
  //   (name) => name === trimmedName && name !== oldName
  // );
  
  // if (isDuplicate) {
  //   ElMessage({
  //     message: '已存在相同的名称，请重新输入',
  //     type: 'warning',
  //     duration: 2000,
  //     showClose: true
  //   });
  //   // tempNames.value[oldName] = oldName;
  //   return;
  // }

  // 更新临时名称
  tempNames.value[oldName] = trimmedName;
};

// 暴露方法给父组件
defineExpose({
  openDialog,
  resetData,
});

// 组件挂载时初始化分数
onMounted(() => {
  initLeftScores();
});

// 添加名称编辑相关方法
const handleNameEdit = (name: string) => {
  if (disabled) return;
  editingName.value = name;
  isEditing.value = true;
};
</script>

<style scoped lang="scss">
.dialog-content {
  padding: 0 20px;

  .custom-dialog-title {
    font-family: MicrosoftYaHei;
    font-size: 18px;
    color: #0078cd;
    line-height: 24px;
    text-align: center;
    width: 100%;
    margin: 20px 0;
  }
  .dialog-content-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
}

.section-container {
  width: 48%;
  border-radius: 10px;
  border: 1px solid rgba(0, 30, 56, 0.07);
  .section-title {
    font-size: 18px;
    color: #1b1b1b;
    height: 50px;
    line-height: 50px;
    background: rgba(0, 30, 56, 0.07);
    border-radius: 10px 10px 0px 0px;
    &.section-active {
      background: rgba(39, 165, 255, 0.1);
      border-radius: 10px 10px 0px 0px;
    }
  }
  &.section-active {
    border-radius: 10px;
    border: 1px solid rgba(39, 165, 255, 0.5);
  }
}

.left-section,
.right-section {
  padding: 15px;

  min-height: 300px;
  transition: all 0.3s;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;

  .item-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 5px;
    border: 1px solid #d2d2d2;
    padding: 4px 15px;
    width: 250px;
    .item-name {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #707070;
      width: 120px !important;
      text-align: left;
      // 超一行省略号
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-right: 1px solid #d2d2d2;
    }

    .score {
      min-width: 30px;
      text-align: center;
    }

    .percentage {
      color: #909399;
      margin: 0 10px;
    }
  }
}

.add-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding: 0 8px;
}
.right-section {
  .item-controls {
    .item-name {
      width: 30px !important;
    }
  }

  .score {
    width: 60px !important;
  }
}

:deep(.el-dialog__body) {
  padding: 20px 0;
}

.score-input {
  width: 100px;
  height: 20px;

  :deep(.el-input__inner) {
    text-align: center;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #333333;
    // background-color: #fff;
    // border: 1px solid #dcdfe6;

    &:focus {
      border-color: #409eff;
    }

    &:hover {
      border-color: #c0c4cc;
    }
  }

  // 隐藏上下箭头
  :deep(.el-input__inner::-webkit-outer-spin-button),
  :deep(.el-input__inner::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-button {
    padding: 4px 8px;
  }
}

.item-name-input {
  width: 140px !important;
  
  :deep(.el-input__wrapper) {
    padding: 0 8px;
    box-shadow: none !important;
    background: transparent;
  }

  :deep(.el-input__inner) {
    height: 24px;
    font-size: 14px;
    color: #707070;
    text-align: left;
  }
}

.item-name {
  cursor: pointer;
  &:hover {
    color: #409EFF;
  }
}
</style>
<style>
.el-dialog__header {
  border-bottom: 2px solid #93d2ff;
}
.el-radio__label {
  font-family: MicrosoftYaHei;
  font-size: 18px;
  color: #1b1b1b;
}
</style>
