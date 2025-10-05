<template>
  <div class="edit-container" v-loading="isloading" element-loading-text="加载中...">
    <div class="toolbar">
      <div>
        <el-button :class="sharedState.currentTool == 'rectangle' ? 'tool-active' : 'custom-default-btn'" @click="setTool('rectangle')" title="矩形">
          <el-icon><Crop /></el-icon> <span>矩形</span>
        </el-button>
        <el-button :class="sharedState.currentTool == 'highlight' ? 'tool-active' : 'custom-default-btn'" @click="setTool('highlight')" title="高亮">
          <el-icon><Brush /></el-icon><span>高亮</span>
        </el-button>
        <el-button :class="sharedState.currentTool == 'line' ? 'tool-active' : 'custom-default-btn'" @click="setTool('line')" title="划线">
          <el-icon><Minus /></el-icon><span>划线</span>
        </el-button>
        <el-button :class="sharedState.currentTool == 'text' ? 'tool-active' : 'custom-default-btn'" @click="setTool('text')" title="备注">
          <el-icon><EditPen /></el-icon><span>备注</span>
        </el-button>
        <el-button :class="sharedState.currentTool == 'handwriting' ? 'tool-active' : 'custom-default-btn'" @click="setTool('handwriting')" title="手写">
          <el-icon><EditPen /></el-icon><span>手写</span>
        </el-button>
        <el-button :class="sharedState.currentTool == 'checkmark' ? 'tool-active' : 'custom-default-btn'" @click="setSymbolTool('checkmark')" title="添加对勾">
          <el-icon><Check /></el-icon> <span>对号</span>
        </el-button>
        <el-button :class="sharedState.currentTool == 'cross' ? 'tool-active' : 'custom-default-btn'" @click="setSymbolTool('cross')" title="添加叉号">
          <el-icon><Close /></el-icon> <span>错号</span>
        </el-button>
      </div>
      <div>
        <el-button :class="['custom-select-btn', { 'tool-active': sharedState.currentTool === 'select' }]" @click="setSelectTool" title="选择">
          <el-icon><Pointer /></el-icon> <span>选择</span>
        </el-button>
        <el-button type="danger" @click="deleteSelected" :disabled="!selectState.selectedAnnotation">
          <el-icon><Delete /></el-icon><span>删除</span>
        </el-button>
        <el-button class="custom-warning-btn" @click="clearCurrentPage">
          <el-icon><Close /></el-icon><span>清空</span>
        </el-button>
        <el-button class="custom-info-btn" @click="saveAnnotations">
          <el-icon><CopyDocument /></el-icon><span>保存</span>
        </el-button>
      </div>
    </div>
    <div class="edit-img-container">
      <div class="canvas-container" ref="containerRef">
        <img 
          ref="imageRef" 
          :src="imageUrl" 
          @load="handleImageLoad" 
          class="base-image"
          crossorigin="anonymous"
          :style="{
            width: '100%',
            height: 'auto',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }"
        />
        <canvas 
          ref="canvasRef" 
          @mousedown="handleMouseDown" 
          @mousemove="handleMouseMove" 
          @mouseup="handleMouseUp" 
          @mouseleave="handleMouseLeave"
          :style="{ 
            cursor: getCanvasCursor,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2
          }"
          class="annotation-canvas"
        ></canvas>
        <div
          v-show="showTextInput"
          class="text-input"
          :class="{ 'handwriting-input': sharedState.currentTool === 'handwriting' }"
          :style="textInputStyle"
        >
          <el-input
            v-model="textContent"
            type="textarea"
            :rows="2"
            @blur="handleTextBlur"
            @keyup.enter="handleTextEnter"
            ref="textInput"
            :placeholder="sharedState.currentTool === 'handwriting' ? '请输入手写文字' : '请输入备注文字'"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </div>
      </div>
      <div class="tool-container">
        <ScoreInput v-if="scoreCfg.mode == 'subs'" :title="title" :scoreCfg="scoreCfg" :score="score" :dataObj="dataObj" :index="index" :isShowBtn="false" />
        <GradeInput ref="gradeInputRef" v-if="scoreCfg.mode == 'percent'" :title="title" :scoreCfg="scoreCfg" :score="score" :dataObj="dataObj" :index="index" :isShowBtn="false" />
      </div>
    </div>
    <div class="page-control" v-if="false">
      <el-button :disabled="currentPageIndex <= 0" @click="prevPage">上一页</el-button>
      <span class="page-info">{{ currentPageIndex + 1 }}/{{ files.length }}</span>
      <el-button :disabled="currentPageIndex >= files.length - 1" @click="nextPage">下一页</el-button>
    </div>

    <div class="toolbar" v-if="false">
      <!-- 添加符号工具按钮组 -->
      <el-button-group class="symbol-group">
        <el-button
          :type="sharedState.currentTool === 'checkmark' ? 'primary' : 'default'"
          :class="{ 'tool-active': sharedState.currentTool === 'checkmark' }"
          @click="setSymbolTool('checkmark')"
          title="添加对勾"
        >
          <el-icon><Check /></el-icon>
        </el-button>
        <el-button :type="sharedState.currentTool === 'cross' ? 'primary' : 'default'" :class="{ 'tool-active': sharedState.currentTool === 'cross' }" @click="setSymbolTool('cross')" title="添加叉号">
          <el-icon><Close /></el-icon>
        </el-button>
      </el-button-group>

      <!-- 其他工具按钮保持不变 -->
      <el-button-group class="tool-group">
        <el-dropdown split-button trigger="click" @command="handleRectCommand" @click="setTool('rectangle')" :type="sharedState.currentTool === 'rectangle' ? 'primary' : 'default'" ref="rectDropdown">
          矩形
          <template #dropdown>
            <el-dropdown-menu class="tool-dropdown">
              <div class="dropdown-content" @click.stop>
                <div class="dropdown-item">
                  <span class="label">线条粗细：</span>
                  <el-slider v-model="rectConfig.lineWidth" :min="1" :max="10" :step="1" show-input input-size="mini" style="width: 200px"></el-slider>
                </div>
                <div class="dropdown-item">
                  <span class="label">颜色：</span>
                  <el-color-picker v-model="rectConfig.color" size="small" popper-class="color-picker-popper" :close-on-click-modal="false"></el-color-picker>
                </div>
                <el-button type="primary" size="small" style="width: 100%; margin-top: 10px" @click="applyRectTool">应用</el-button>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown
          split-button
          trigger="click"
          @command="handleHighlightCommand"
          @click="setTool('highlight')"
          :type="sharedState.currentTool === 'highlight' ? 'primary' : 'default'"
          ref="highlightDropdown"
        >
          高亮
          <template #dropdown>
            <el-dropdown-menu slot="dropdown" class="tool-dropdown">
              <div class="dropdown-content" @click.stop>
                <div class="dropdown-item">
                  <span class="label">透明度：</span>
                  <el-slider v-model="highlightConfig.opacity" :min="0.1" :max="1" :step="0.1" show-input input-size="mini" style="width: 200px"></el-slider>
                </div>
                <div class="dropdown-item">
                  <span class="label">颜色：</span>
                  <el-color-picker v-model="highlightConfig.color" size="small" popper-class="color-picker-popper" :close-on-click-modal="false"></el-color-picker>
                </div>
                <el-button type="primary" size="small" style="width: 100%; margin-top: 10px" @click="applyHighlightTool">应用</el-button>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown split-button trigger="click" @command="handleLineCommand" @click="setTool('line')" :type="sharedState.currentTool === 'line' ? 'primary' : 'default'" ref="lineDropdown">
          划线
          <template #dropdown>
            <el-dropdown-menu slot="dropdown" class="tool-dropdown">
              <div class="dropdown-content" @click.stop>
                <div class="dropdown-item">
                  <span class="label">线条粗细：</span>
                  <el-slider v-model="lineConfig.lineWidth" :min="1" :max="10" :step="1" show-input input-size="mini" style="width: 200px"></el-slider>
                </div>
                <div class="dropdown-item">
                  <span class="label">颜色：</span>
                  <el-color-picker v-model="lineConfig.color" size="small" popper-class="color-picker-popper" :close-on-click-modal="false"></el-color-picker>
                </div>
                <el-button type="primary" size="small" style="width: 100%; margin-top: 10px" @click="applyLineTool">应用</el-button>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown split-button trigger="click" @command="handleTextCommand" @click="setTool('text')" :type="sharedState.currentTool === 'text' ? 'primary' : 'default'" ref="textDropdown">
          文字
          <template #dropdown>
            <el-dropdown-menu slot="dropdown" class="tool-dropdown">
              <div class="dropdown-content" @click.stop>
                <div class="dropdown-item">
                  <span class="label">字体：</span>
                  <el-select v-model="textConfig.fontFamily" size="small" style="width: 200px">
                    <el-option v-for="font in fontOptions" :key="font.value" :label="font.label" :value="font.value" :style="{ fontFamily: font.value }">
                      {{ font.label }}
                    </el-option>
                  </el-select>
                </div>
                <div class="dropdown-item">
                  <span class="label">字体大小：</span>
                  <el-slider v-model="textConfig.fontSize" :min="12" :max="100" :step="2" show-input input-size="mini" style="width: 200px"></el-slider>
                </div>
                <div class="dropdown-item">
                  <span class="label">字体颜色：</span>
                  <el-color-picker v-model="textConfig.color" size="small" @change="handleTextColorChange" popper-class="color-picker-popper" :close-on-click-modal="false"></el-color-picker>
                </div>
                <el-button type="primary" size="small" style="width: 100%; margin-top: 10px" @click="applyTextTool">应用</el-button>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown
          split-button
          trigger="click"
          @command="handleHandwritingCommand"
          @click="setTool('handwriting')"
          :type="sharedState.currentTool === 'handwriting' ? 'primary' : 'default'"
          ref="handwritingDropdown"
        >
          手写
          <template #dropdown>
            <el-dropdown-menu slot="dropdown" class="tool-dropdown">
              <div class="dropdown-content" @click.stop>
                <div class="dropdown-item">
                  <span class="label">字体大小：</span>
                  <el-slider v-model="fontSize" :min="50" :max="200" :step="4" show-input input-size="mini" style="width: 200px"></el-slider>
                </div>
                <div class="dropdown-item">
                  <span class="label">字体颜色：</span>
                  <el-color-picker v-model="handwritingColor" size="small" @change="handleColorChange" popper-class="color-picker-popper" :close-on-click-modal="false"></el-color-picker>
                </div>
                <div class="dropdown-item">
                  <span class="label">字体风格：</span>
                  <el-select v-model="handwritingStyle" size="small" style="width: 120px">
                    <el-option v-for="style in handwritingStyles" :key="style.value" :label="style.label" :value="style.value"></el-option>
                  </el-select>
                </div>
                <el-button type="primary" size="small" style="width: 100%; margin-top: 10px" @click="applyHandwritingTool">应用</el-button>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-button-group>
      <el-divider direction="vertical"></el-divider>
      <el-button-group class="action-group">
        <el-button @click="undo" :disabled="!canUndo">
          <el-tooltip content="撤销 (Ctrl+Z)" placement="top">
            <span>撤销</span>
          </el-tooltip>
        </el-button>
        <el-button @click="redo" :disabled="!canRedo">
          <el-tooltip content="重做 (Ctrl+Shift+Z)" placement="top">
            <span>重做</span>
          </el-tooltip>
        </el-button>
        <el-button @click="copySelectedAnnotation" :disabled="!sharedState.selectedAnnotation">
          <el-tooltip content="复制 (Ctrl+C)" placement="top">
            <span>复制</span>
          </el-tooltip>
        </el-button>
        <el-button @click="pasteAnnotation" :disabled="!copiedAnnotation">
          <el-tooltip content="粘贴 (Ctrl+V)" placement="top">
            <span>粘贴</span>
          </el-tooltip>
        </el-button>
        <el-button :type="sharedState.currentTool === 'select' ? 'primary' : 'default'" :class="{ 'tool-active': sharedState.currentTool === 'select' }" @click="setSelectTool">选择</el-button>
        <el-button @click="deleteSelected" type="danger" :disabled="!selectState.selectedAnnotation">删除</el-button>
      </el-button-group>
      <el-button-group class="action-group">
        <el-button @click="clearCurrentPage" type="warning">清空当前页</el-button>
        <el-button @click="saveAnnotations" type="success">本地保存</el-button>
        <el-button @click="saveToServer" type="primary" :loading="isSaving" :disabled="isSaving || sharedState.annotations.length === 0">
          {{ isSaving ? "保存中..." : "保存到服务器" }}
        </el-button>
        <el-button @click="generatePreview" type="primary">生成预览图</el-button>
      </el-button-group>
    </div>

    <!-- 预览对话框 -->
    <el-dialog title="预览图片" :visible.sync="previewDialogVisible" width="80%" :before-close="handlePreviewClose">
      <div class="preview-container">
        <img :src="previewImageUrl" class="preview-image" v-if="previewImageUrl" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlePreviewClose">关闭</el-button>
        <el-button type="primary" @click="downloadPreview">下载图片</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick, provide, withDefaults, defineExpose, defineEmits, watchEffect } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Check, Close, ArrowDown } from "@element-plus/icons-vue";
import type { AxiosResponse } from "axios";
import ScoreInput from "./ScoreInput.vue";
import GradeInput from "./GradeInput.vue";

// 定义一些基础状态
const previewDialogVisible = ref(false);
const previewImageUrl = ref("");
const textContent = ref("");
const showTextInput = ref(false);
const textPosition = ref({ x: 0, y: 0 });
const fontSize = ref(80);
const handwritingColor = ref("#FF0000");
const handwritingStyle = ref("cursive");
const history = ref<Array<any>>([]);
const pageAnnotations = ref<Record<number, any[]>>({});
const pageHistory = ref<Record<number, any[]>>({});
const textConfig = reactive({
  fontSize: 16,
  fontFamily: "Arial",
  color: "#FF0000",
});

// 在 script setup 中添加 defineEmits
const emit = defineEmits(["saveCorrection"]);

// 修改 Props 接口，添加 correctStep
interface Props {
  title?: string;
  scoreCfg?: {
    mode: string;
    map: Record<string, number>;
  };
  score?: number;
  imgEditUrl?: string;
  correctStep?: any[]; // 添加批改步骤记录
  isloading?: boolean;
  dataObj?: any;
  index?: number;
}

// 字体选项
const fontOptions = [
  { label: "默认字体", value: "Arial" },
  { label: "宋体", value: "SimSun" },
  { label: "黑体", value: "SimHei" },
  { label: "楷体", value: "KaiTi" },
];

// 手写风格选项
const handwritingStyles = [
  { label: "连笔", value: "cursive", fontFamily: "Ma Shan Zheng" },
  { label: "随意", value: "casual", fontFamily: "Zhi Mang Xing" },
  { label: "工整", value: "neat", fontFamily: "Liu Jian Mao Cao" },
];

// 添加字体样式
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&family=Liu+Jian+Mao+Cao&display=swap');
`;

// 添加到 head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = fontStyles;
document.head.appendChild(styleSheet);

// Props 定义
interface Props {
  fileList?: string[];
}
const props = withDefaults(defineProps<Props>(), {
  fileList: () => [],
});

// 创建共享的响应式状态
const sharedState = reactive({
  collectionRef: null,
  annotations: [] as any[],
  selectedAnnotation: null,
  currentTool: "select", // 默认为选择工具
  isDrawing: false,
});

// 修改选择工具的状态类型定义
interface SelectState {
  isSelected: boolean;
  selectedAnnotation: any;
  isDragging: boolean;
  dragStartPos: { x: number; y: number } | null;
  isSelecting: boolean;
  selectionStart: { x: number; y: number } | null;
  selectionEnd: { x: number; y: number } | null;
}

// 选择工具的状态
const selectState = reactive<SelectState>({
  isSelected: false,
  selectedAnnotation: null,
  isDragging: false,
  dragStartPos: null,
  isSelecting: false,
  selectionStart: null,
  selectionEnd: null
});

// 选中样式配置
const selectStyle = {
  borderColor: "#409EFF",
  borderWidth: 1, // 选中边框宽度改为1px
  dashPattern: [5, 5] as number[],
  handleSize: 6,
  handleColor: "#FFFFFF",
  handleBorder: "#409EFF",
  padding: 4,
  bgColor: "rgba(64, 158, 255, 0.1)",
  selectedBgColor: "rgba(64, 158, 255, 0.15)",
  selectedBorderColor: "#409EFF",
  selectedBorderWidth: 1, // 选中边框宽度改为1px
  selectedHandleSize: 8,
  selectedShadow: "0 0 8px rgba(64, 158, 255, 0.4)",
};

// Canvas 相关状态
const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const startPos = ref<{ x: number; y: number } | null>(null);
const redrawRequestId = ref<number | null>(null);

// 文件相关状态
const files = ref<Array<{ url: string; type: string }>>([]);
const currentPageIndex = ref(0);

// 工具配置
const rectConfig = reactive({
  lineWidth: 2,
  color: "#FF0000",
});

const lineConfig = reactive({
  lineWidth: 2,
  color: "#FF0000",
});

const highlightConfig = reactive({
  opacity: 0.3,
  color: "#FF0000",
});

// 添加图片相关状态
const backgroundImage = ref<HTMLImageElement | null>(null);
const imageLoaded = ref(false);
const imageUrl = ref(props.imgEditUrl);

// 添加图片引用
const imageRef = ref<HTMLImageElement | null>(null);

// 工具相关方法
const setTool = (toolName: string) => {
  if (sharedState.currentTool === toolName) return;

  // 保存当前工具
  if (toolName === "select") {
    lastTool.value = sharedState.currentTool;
  }

  // 清除当前状态
  sharedState.isDrawing = false;
  startPos.value = null;
  selectState.isDragging = false;
  selectState.dragStartPos = null;
  selectState.isSelecting = false;
  selectState.selectionStart = null;
  selectState.selectionEnd = null;
  selectState.selectedAnnotation = null;

  // 设置新工具
  sharedState.currentTool = toolName;
  redrawAnnotations();
};

const setSymbolTool = (symbolType: "checkmark" | "cross") => {
  sharedState.currentTool = symbolType;
  sharedState.selectedAnnotation = null;
};

const setSelectTool = () => {
  sharedState.currentTool = "select";
  // 清除其他工具的状态
  sharedState.isDrawing = false;
  startPos.value = null;
  // 清除选择状态
  selectState.isSelected = false;
  selectState.selectedAnnotation = null;
  selectState.isDragging = false;
  selectState.dragStartPos = null;
  redrawAnnotations();
};

// 工具命令处理方法
const handleRectCommand = () => {
  setTool("rectangle");
};

const handleHighlightCommand = () => {
  setTool("highlight");
};

const handleLineCommand = () => {
  setTool("line");
};

const handleTextCommand = () => {
  setTool("text");
};

const handleHandwritingCommand = () => {
  setTool("handwriting");
};

// 工具应用方法
const applyRectTool = () => {
  setTool("rectangle");
  rectDropdownRef.value?.handleClose?.();
};

const applyHighlightTool = () => {
  setTool("highlight");
  highlightDropdownRef.value?.handleClose?.();
};

const applyLineTool = () => {
  setTool("line");
  lineDropdownRef.value?.handleClose?.();
};

const applyTextTool = () => {
  setTool("text");
  textDropdownRef.value?.handleClose?.();
};

const applyHandwritingTool = () => {
  setTool("handwriting");
  handwritingDropdownRef.value?.handleClose?.();
};

// 删除选中的标注
const deleteSelected = () => {
  if (!selectState.selectedAnnotation) return;

  const index = sharedState.annotations.findIndex((a) => a.id === selectState.selectedAnnotation.id);

  if (index > -1) {
    saveToUndoStack();
    sharedState.annotations.splice(index, 1);
    selectState.isSelected = false;
    selectState.selectedAnnotation = null;
    redrawAnnotations();
  }
};

// 工具下拉菜单引用
const rectDropdownRef = ref();
const highlightDropdownRef = ref();
const lineDropdownRef = ref();
const textDropdownRef = ref();
const handwritingDropdownRef = ref();
const lastTool = ref<string | null>(null);

// 鼠标事件处理方法
const handleMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  if (!canvasRef.value || !ctx.value) return;

  const clickPos = getCanvasPoint(e);

  // 处理选择工具
  if (sharedState.currentTool === "select") {
    // 检查是否点击在已有标注上
    const clickedAnnotation = [...sharedState.annotations].reverse().find((annotation) => isPointInAnnotation(clickPos, annotation));

    if (clickedAnnotation) {
      selectState.selectedAnnotation = clickedAnnotation;
      selectState.isDragging = true;
      selectState.dragStartPos = clickPos;
      redrawAnnotations();
      return;
    } else {
      selectState.selectedAnnotation = null;
      selectState.isDragging = false;
      selectState.dragStartPos = null;
      selectState.isSelecting = true;
      selectState.selectionStart = clickPos;
      selectState.selectionEnd = clickPos;
      redrawAnnotations();
      return;
    }
  }

  // 处理文本和手写工具
  if (sharedState.currentTool === "text" || sharedState.currentTool === "handwriting") {
    // 保存点击位置
    textPosition.value = clickPos;
    
    // 保存鼠标事件用于定位
    lastMouseEvent.value = e;
    
    showTextInput.value = true;
    nextTick(() => {
      const input = document.querySelector(".text-input textarea") as HTMLTextAreaElement;
      if (input) {
        input.focus();
      }
    });
    return;
  }

  // 处理对号和叉号
  if (sharedState.currentTool === "checkmark" || sharedState.currentTool === "cross") {
    const annotation = {
      id: Date.now().toString(),
      type: sharedState.currentTool,
      start: clickPos,
      color: sharedState.currentTool === "checkmark" ? "#FF0000" : "#FF0000",
      lineWidth: 3,
    };
    saveToUndoStack();
    sharedState.annotations.push(annotation);
    redrawAnnotations();
    return;
  }

  // 处理绘制工具
  if (["line", "rectangle", "highlight"].includes(sharedState.currentTool)) {
    startPos.value = clickPos;
    sharedState.isDrawing = true;
    redrawAnnotations();
  }
};

const handleMouseUp = (e: MouseEvent) => {
  e.preventDefault();
  if (!canvasRef.value || !ctx.value) return;

  const endPos = getCanvasPoint(e);

  // 处理选择结束
  if (selectState.isSelecting) {
    const selectedAnnotations = findAnnotationsInSelection();
    if (selectedAnnotations.length > 0) {
      selectState.selectedAnnotation = selectedAnnotations[selectedAnnotations.length - 1];
    }
    selectState.isSelecting = false;
    selectState.selectionStart = null;
    selectState.selectionEnd = null;
    redrawAnnotations();
  }

  // 处理拖动结束
  if (selectState.isDragging) {
    selectState.isDragging = false;
    selectState.dragStartPos = null;
    saveToUndoStack();
    redrawAnnotations();
  }

  // 处理绘制结束
  if (sharedState.isDrawing && startPos.value && ["line", "rectangle", "highlight"].includes(sharedState.currentTool)) {
    addAnnotation(endPos);
    sharedState.isDrawing = false;
    startPos.value = null;
    redrawAnnotations();
  }
};

const handleMouseLeave = () => {
  if (selectState.isDragging) {
    stopDragging();
  }
  if (sharedState.isDrawing) {
    sharedState.isDrawing = false;
    startPos.value = null;
  }
};

// 添加 stopDragging 方法
const stopDragging = () => {
  selectState.isDragging = false;
  selectState.dragStartPos = null;
};

// 添加 startDrawing 方法
const startDrawing = (e: MouseEvent) => {
  if (!["line", "rectangle", "highlight"].includes(sharedState.currentTool)) return;

  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  startPos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  sharedState.isDrawing = true;
};

// 修改 handleMouseMove 方法
const handleMouseMove = (() => {
  let lastTime = 0;
  const throttleDelay = 16; // 约60fps
  
  return (e: MouseEvent) => {
    const now = Date.now();
    if (now - lastTime < throttleDelay) return;
    lastTime = now;
    
    e.preventDefault();
    if (!canvasRef.value || !ctx.value) return;

    const currentPos = getCanvasPoint(e);

    if (selectState.isDragging && selectState.dragStartPos && selectState.selectedAnnotation) {
      const dx = currentPos.x - selectState.dragStartPos.x;
      const dy = currentPos.y - selectState.dragStartPos.y;
      updateAnnotationPosition(selectState.selectedAnnotation, dx, dy);
      selectState.dragStartPos = currentPos;
      redrawAnnotations();
      return;
    }

    if (selectState.isSelecting && selectState.selectionStart) {
      selectState.selectionEnd = currentPos;
      redrawAnnotations();
      return;
    }

    if (sharedState.isDrawing && startPos.value && ["line", "rectangle", "highlight"].includes(sharedState.currentTool)) {
      drawCurrentTool(currentPos);
    }
  };
})();

const stopDrawing = (e: MouseEvent) => {
  if (!sharedState.isDrawing || !canvasRef.value || !startPos.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const endPos = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  addAnnotation(endPos);
  sharedState.isDrawing = false;
  startPos.value = null;
};

// 选择功能相关状态
const isDragging = ref(false);
const dragStartPos = ref<{ x: number; y: number } | null>(null);

// 判断点是否在标注内
const isPointInAnnotation = (point: { x: number; y: number }, annotation: any) => {
  // 增加容差值，使选择更容易
  const tolerance = 10;

  if (annotation.type === "text" || annotation.type === "handwriting") {
    // 文本类型标注的点击检测
    const textBounds = getTextBounds(annotation);
    return (
      point.x >= textBounds.x - tolerance && point.x <= textBounds.x + textBounds.width + tolerance && point.y >= textBounds.y - tolerance && point.y <= textBounds.y + textBounds.height + tolerance
    );
  } else if (annotation.type === "line") {
    // 线条类型的点击检测
    const dx = annotation.end.x - annotation.start.x;
    const dy = annotation.end.y - annotation.start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return false;

    const t = ((point.x - annotation.start.x) * dx + (point.y - annotation.start.y) * dy) / (length * length);
    if (t < 0 || t > 1) return false;

    const projX = annotation.start.x + t * dx;
    const projY = annotation.start.y + t * dy;
    const distance = Math.sqrt(Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2));

    return distance <= tolerance + (annotation.lineWidth || 1) / 2;
  } else if (annotation.type === "rectangle" || annotation.type === "highlight") {
    // 矩形和高亮的点击检测
    const bounds = {
      x: Math.min(annotation.start.x, annotation.end.x) - tolerance,
      y: Math.min(annotation.start.y, annotation.end.y) - tolerance,
      width: Math.abs(annotation.end.x - annotation.start.x) + tolerance * 2,
      height: Math.abs(annotation.end.y - annotation.start.y) + tolerance * 2,
    };

    return point.x >= bounds.x && point.x <= bounds.x + bounds.width && point.y >= bounds.y && point.y <= bounds.y + bounds.height;
  } else if (annotation.type === "checkmark" || annotation.type === "cross") {
    // 对号和叉号的点击检测
    const size = 30; // 增大符号的点击区域
    return (
      point.x >= annotation.start.x - size / 2 - tolerance &&
      point.x <= annotation.start.x + size / 2 + tolerance &&
      point.y >= annotation.start.y - size / 2 - tolerance &&
      point.y <= annotation.start.y + size / 2 + tolerance
    );
  }

  return false;
};

// 获取文本标注的边界
const getTextBounds = (annotation: any) => {
  if (!ctx.value) return { x: 0, y: 0, width: 0, height: 0 };

  ctx.value.save();
  const scaledFontSize = (annotation.fontSize || 16) * scaleFactor.value;
  
  if (annotation.type === "handwriting") {
    ctx.value.font = `${scaledFontSize}px ${annotation.fontFamily || handwritingStyle.value}`;
  } else {
    ctx.value.font = `${scaledFontSize}px ${annotation.fontFamily || 'Arial'}`;
  }
  
  const metrics = ctx.value.measureText(annotation.text);
  ctx.value.restore();

  // 调整文本边界框的计算
  const height = scaledFontSize;
  const yOffset = annotation.type === "handwriting" ? height / 2 : 0;

  return {
    x: annotation.position.x,
    y: annotation.position.y - yOffset,
    width: metrics.width,
    height: height,
  };
};

// 修改 handleCanvasClick 方法
const handleCanvasClick = (e: MouseEvent) => {
  if (!canvasRef.value || sharedState.currentTool === "select") return;

  const rect = canvasRef.value.getBoundingClientRect();
  const clickPos = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  // 处理符号工具
  if (sharedState.currentTool === "checkmark" || sharedState.currentTool === "cross") {
    const annotation = {
      id: Date.now().toString(),
      type: sharedState.currentTool,
      start: clickPos,
      color: sharedState.currentTool === "checkmark" ? "#32CD32" : "#FF0000",
      lineWidth: 3,
    };
    sharedState.annotations.push(annotation);
    redrawAnnotations();
    return;
  }

  // 如果是文本工具，显示文本输入框
  if (sharedState.currentTool === "text" || sharedState.currentTool === "handwriting") {
    textPosition.value = clickPos;
    showTextInput.value = true;
    nextTick(() => {
      if (textInputRef.value) {
        textInputRef.value.focus();
      }
    });
  }
};

// 页面控制方法
const prevPage = () => {
  if (currentPageIndex.value > 0) {
    saveCurrentPageState();
    currentPageIndex.value--;
    loadCurrentPage();
  }
};

const nextPage = () => {
  if (currentPageIndex.value < files.value.length - 1) {
    saveCurrentPageState();
    currentPageIndex.value++;
    loadCurrentPage();
  }
};

// 清空当前页
const clearCurrentPage = () => {
  ElMessageBox.confirm("确定要清空当前页的所有标注吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      sharedState.annotations = [];
      sharedState.selectedAnnotation = null;
      redrawAnnotations();
      saveCurrentPageState();
    })
    .catch(() => {});
};

// 添加 CorrectionData 接口定义
interface CorrectionConfig {
  mode: string;
  map: Record<string, number>;
  total: number;
  index?: number;
  selectedScoreName?: string;
}

interface CorrectionData {
  annotations: any[];
  originalImage: string | undefined;
  currentCanvas: string | undefined;
  scoreConfig: CorrectionConfig;
}

// 修改 saveAnnotations 方法
const saveAnnotations = () => {
  saveCurrentPageState();

  const correctionData: CorrectionData = {
    annotations: sharedState.annotations,
    originalImage: imageUrl.value,
    currentCanvas: canvasRef.value?.toDataURL("image/png"),
    scoreConfig: {
      mode: props.scoreCfg?.mode || '',
      map: props.scoreCfg?.map || {},
      total: props.score || 0,
      index: props.index,
      selectedScoreName: props.dataObj?.selectedScoreName
    }
  };

  // 发送数据给父组件
  emit("saveCorrection", correctionData);
  ElMessage.success("保存成功");
};

interface SaveAnnotationsResponse {
  code: number;
  message: string;
  data?: any;
}

// 添加保存状态
const isSaving = ref(false);

// 修改保存到服务器方法
const saveToServer = async () => {
  if (isSaving.value) return;

  saveCurrentPageState();

  try {
    isSaving.value = true;

    // 准备要保存的数据
    const saveData: CorrectionData = {
      annotations: sharedState.annotations,
      originalImage: imageUrl.value,
      currentCanvas: canvasRef.value?.toDataURL("image/png"),
      scoreConfig: {
        mode: props.scoreCfg?.mode || '',
        map: props.scoreCfg?.map || {},
        total: props.score || 0,
        index: props.index,
        selectedScoreName: props.dataObj?.selectedScoreName
      }
    };
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "保存失败，请重试");
  } finally {
    isSaving.value = false;
  }
};

// 文本输入引用
const textInputRef = ref();

// 修改 drawBackground 方法
const drawBackground = () => {
  if (!ctx.value || !canvasRef.value) return;
  // 只需清除画布，不需要重绘图片
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
};

// 修改图片加载方法
const loadImage = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      resolve(img);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = url;
  });
};

// 修改 initCanvas 方法
const initCanvas = async () => {
  if (!canvasRef.value || !containerRef.value || !imageRef.value) return;
  
  // 等待图片加载完成
  if (!imageRef.value.complete) {
    await new Promise((resolve) => {
      imageRef.value!.onload = resolve;
    });
  }
  
  // 获取图片实际尺寸
  const imgWidth = imageRef.value.naturalWidth;
  const imgHeight = imageRef.value.naturalHeight;
  
  // 设置画布尺寸为图片实际尺寸
  const dpr = window.devicePixelRatio || 1;
  canvasRef.value.width = imgWidth * dpr;
  canvasRef.value.height = imgHeight * dpr;
  canvasRef.value.style.width = '100%';
  canvasRef.value.style.height = 'auto';

  // 获取上下文并设置缩放
  ctx.value = canvasRef.value.getContext('2d', {
    alpha: true,
    willReadFrequently: true
  });
  
  if (!ctx.value) {
    return;
  }

  // 设置缩放
  ctx.value.scale(dpr, dpr);
  
  // 设置初始样式
  ctx.value.fillStyle = 'transparent';
  ctx.value.strokeStyle = '#000000';
  ctx.value.lineWidth = 1;
  
  // 清除画布
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  
  imageLoaded.value = true;
  redrawAnnotations();
};

// 修改 handleImageLoad 方法
const handleImageLoad = () => {
  if (!imageRef.value || !canvasRef.value || !containerRef.value) return;
  
  // 获取图片实际尺寸
  const imgWidth = imageRef.value.naturalWidth;
  const imgHeight = imageRef.value.naturalHeight;
  
  // 设置图片显示尺寸
  imageRef.value.style.width = '100%';
  imageRef.value.style.height = 'auto';
  
  // 设置画布尺寸为图片实际尺寸
  const dpr = window.devicePixelRatio || 1;
  canvasRef.value.width = imgWidth * dpr;
  canvasRef.value.height = imgHeight * dpr;
  canvasRef.value.style.width = '100%';
  canvasRef.value.style.height = 'auto';
  
  // 获取上下文并设置缩放
  ctx.value = canvasRef.value.getContext('2d', {
    alpha: true,
    willReadFrequently: true
  });
  
  if (ctx.value) {
    ctx.value.scale(dpr, dpr);
    ctx.value.fillStyle = 'transparent';
    ctx.value.strokeStyle = '#000000';
  }
  
  // 重新绘制标注
  redrawAnnotations();
};

// 添加缩放比例状态
const scaleFactor = ref(1);

// 修改 getCanvasPoint 方法
const getCanvasPoint = (e: MouseEvent) => {
  if (!canvasRef.value || !imageRef.value) return { x: 0, y: 0 };

  const rect = canvasRef.value.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // 计算实际图片尺寸与显示尺寸的比例
  const scaleX = imageRef.value.naturalWidth / rect.width;
  const scaleY = imageRef.value.naturalHeight / rect.height;

  // 更新缩放比例
  scaleFactor.value = scaleX;

  // 计算相对于画布的点击位置
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  return { x, y };
};

// 修改原有的 handleResize 方法
const handleResize = () => {
  if (!canvasRef.value || !containerRef.value) return;

  // 保存当前状态
  const currentAnnotations = [...sharedState.annotations];

  // 重新初始化画布
  initCanvas();

  // 恢复标注
  sharedState.annotations = currentAnnotations;
  redrawAnnotations();
};

// 绘制相关方法
const drawLine = (annotation: any, context: CanvasRenderingContext2D = ctx.value!) => {
  context.save();
  context.beginPath();
  context.strokeStyle = annotation.color || lineConfig.color;
  context.lineWidth = (annotation.lineWidth || lineConfig.lineWidth) * scaleFactor.value;
  context.moveTo(annotation.start.x, annotation.start.y);
  context.lineTo(annotation.end.x, annotation.end.y);
  context.stroke();
  context.restore();
};

const drawRectangle = (annotation: any, context: CanvasRenderingContext2D = ctx.value!) => {
  context.save();
  context.beginPath();
  context.strokeStyle = annotation.color || rectConfig.color;
  context.lineWidth = (annotation.lineWidth || rectConfig.lineWidth) * scaleFactor.value;
  const width = annotation.end.x - annotation.start.x;
  const height = annotation.end.y - annotation.start.y;
  context.strokeRect(annotation.start.x, annotation.start.y, width, height);
  context.restore();
};

const drawCheckmark = (annotation: any, context: CanvasRenderingContext2D = ctx.value!) => {
  context.save();
  context.beginPath();
  context.strokeStyle = annotation.color || "#FF0000";
  context.lineWidth = (annotation.lineWidth || 3) * scaleFactor.value;
  const { x, y } = annotation.start;
  const size = 30 * scaleFactor.value;
  context.moveTo(x - size / 2, y);
  context.lineTo(x - size / 6, y + size / 2);
  context.lineTo(x + size / 2, y - size / 2);
  context.stroke();
  context.restore();
};

const drawCross = (annotation: any, context: CanvasRenderingContext2D = ctx.value!) => {
  context.save();
  context.beginPath();
  context.strokeStyle = annotation.color || "#FF0000";
  context.lineWidth = (annotation.lineWidth || 3) * scaleFactor.value;
  const { x, y } = annotation.start;
  const size = 30 * scaleFactor.value;
  context.moveTo(x - size / 2, y - size / 2);
  context.lineTo(x + size / 2, y + size / 2);
  context.moveTo(x + size / 2, y - size / 2);
  context.lineTo(x - size / 2, y + size / 2);
  context.stroke();
  context.restore();
};

const drawText = (annotation: any, context: CanvasRenderingContext2D = ctx.value!) => {
  if (!context) return;
  
  context.save();
  
  // 计算缩放后的字体大小
  const scaledFontSize = (annotation.fontSize || 16) * scaleFactor.value;
  
  // 设置字体样式
  if (annotation.type === "handwriting") {
    context.font = `${scaledFontSize}px ${annotation.fontFamily || handwritingStyle.value}`;
    context.textBaseline = "middle";
  } else {
    context.font = `${scaledFontSize}px ${annotation.fontFamily || 'Arial'}`;
    context.textBaseline = "top";
  }
  
  // 设置颜色
  context.fillStyle = annotation.color || "#000000";
  
  // 绘制文本
  context.fillText(annotation.text, annotation.position.x, annotation.position.y);
  
  context.restore();
};

// 添加选中状态的样式配置
const selectedStyle = {
  borderColor: "#409EFF", // 选中边框颜色
  borderWidth: 2, // 选中边框宽度
  borderDash: [5, 5] as number[], // 虚线模式
  handleSize: 6, // 控制点大小
  handleColor: "#FFFFFF", // 控制点颜色
  handleBorder: "#409EFF", // 控制点边框颜色
  padding: 2, // 选中框内边距
};

// 修改 redrawAnnotations 方法
const redrawAnnotations = () => {
  if (!ctx.value || !canvasRef.value) return;
  
  // 清除画布
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  
  // 绘制所有标注
  sharedState.annotations.forEach(annotation => {
    if (annotation !== selectState.selectedAnnotation) {
      drawAnnotation(annotation);
    }
  });
  
  // 如果有选中的标注，最后绘制它
  if (selectState.selectedAnnotation) {
    drawAnnotation(selectState.selectedAnnotation);
    drawSelectedAnnotation(selectState.selectedAnnotation);
  }
  
  // 如果正在选择，绘制选择框
  if (selectState.isSelecting && selectState.selectionStart && selectState.selectionEnd) {
    drawSelectionArea();
  }
};

// 修改 drawAnnotation 方法
const drawAnnotation = (annotation: any, context: CanvasRenderingContext2D = ctx.value!) => {
  if (!context) return;

  switch (annotation.type) {
    case "line":
      drawLine(annotation, context);
      break;
    case "rectangle":
      drawRectangle(annotation, context);
      break;
    case "highlight":
      drawHighlight(annotation, context);
      break;
    case "checkmark":
      drawCheckmark(annotation, context);
      break;
    case "cross":
      drawCross(annotation, context);
      break;
    case "text":
    case "handwriting":
      drawText(annotation, context);
      break;
  }
};

const drawSelectedAnnotation = (annotation: any, context: CanvasRenderingContext2D = ctx.value!, yOffset: number = 0) => {
  if (!context) return;

  const adjustedAnnotation = {...annotation};
  
  // 应用Y轴偏移
  if (annotation.type === "text" || annotation.type === "handwriting") {
    adjustedAnnotation.position = {
      x: annotation.position.x,
      y: annotation.position.y + yOffset
    };
  } else {
    adjustedAnnotation.start = {
      x: annotation.start.x,
      y: annotation.start.y + yOffset
    };
    if (annotation.end) {
      adjustedAnnotation.end = {
        x: annotation.end.x,
        y: annotation.end.y + yOffset
      };
    }
  }
  
  const bounds = getAnnotationBounds(adjustedAnnotation);
  
  context.save();
  
  // 绘制选中效果
  context.shadowColor = selectStyle.selectedBorderColor;
  context.shadowBlur = 8;
  context.strokeStyle = selectStyle.selectedBorderColor;
  context.lineWidth = selectStyle.selectedBorderWidth;
  context.strokeRect(
    bounds.x - selectStyle.padding,
    bounds.y - selectStyle.padding,
    bounds.width + selectStyle.padding * 2,
    bounds.height + selectStyle.padding * 2
  );
  
  context.restore();
};

// 获取标注的边界框
const getAnnotationBounds = (annotation: any) => {
  if (annotation.type === "text" || annotation.type === "handwriting") {
    // 计算文本的实际边界
    if (!ctx.value) return { x: 0, y: 0, width: 0, height: 0 };

    ctx.value.save();
    if (annotation.type === "handwriting") {
      ctx.value.font = `${annotation.fontSize || fontSize.value}px ${annotation.fontFamily || handwritingStyle.value}`;
    } else {
      ctx.value.font = `${annotation.fontSize || 16}px Arial`;
    }

    const metrics = ctx.value.measureText(annotation.text);
    // 增加手写文本的高度计算
    const height = annotation.type === "handwriting" ? annotation.fontSize || fontSize.value : annotation.fontSize || 16;

    ctx.value.restore();

    // 增加内边距
    const padding = annotation.type === "handwriting" ? 20 : 10; // 手写文本使用更大的内边距

    return {
      x: annotation.position.x - padding,
      y: annotation.position.y - height / 2 - padding, // 修改Y轴位置计算
      width: metrics.width + padding * 2,
      height: height + padding * 2,
    };
  } else if (annotation.type === "rectangle" || annotation.type === "highlight") {
    const width = Math.abs(annotation.end.x - annotation.start.x);
    const height = Math.abs(annotation.end.y - annotation.start.y);
    return {
      x: Math.min(annotation.start.x, annotation.end.x),
      y: Math.min(annotation.start.y, annotation.end.y),
      width,
      height,
    };
  } else if (annotation.type === "line") {
    // 为线条添加一定的选择范围
    const padding = 5;
    return {
      x: Math.min(annotation.start.x, annotation.end.x) - padding,
      y: Math.min(annotation.start.y, annotation.end.y) - padding,
      width: Math.abs(annotation.end.x - annotation.start.x) + padding * 2,
      height: Math.abs(annotation.end.y - annotation.start.y) + padding * 2,
    };
  } else if (annotation.type === "checkmark" || annotation.type === "cross") {
    // 为符号添加固定大小的选择范围
    const size = 40;
    return {
      x: annotation.start.x - size / 2,
      y: annotation.start.y - size / 2,
      width: size,
      height: size,
    };
  }
  return { x: 0, y: 0, width: 0, height: 0 };
};

// 绘制控制点
const drawControlHandles = (bounds: any) => {
  if (!ctx.value) return;

  const handlePositions = [
    { x: bounds.x, y: bounds.y }, // 左上
    { x: bounds.x + bounds.width, y: bounds.y }, // 右上
    { x: bounds.x + bounds.width, y: bounds.y + bounds.height }, // 右下
    { x: bounds.x, y: bounds.y + bounds.height }, // 左下
  ];

  handlePositions.forEach((pos) => {
    ctx.value!.beginPath();
    // 绘制控制点阴影
    ctx.value!.shadowColor = selectStyle.selectedBorderColor;
    ctx.value!.shadowBlur = 4;

    // 绘制控制点外框
    ctx.value!.strokeStyle = selectStyle.selectedBorderColor;
    ctx.value!.lineWidth = 2;
    ctx.value!.rect(pos.x - selectStyle.selectedHandleSize / 2, pos.y - selectStyle.selectedHandleSize / 2, selectStyle.selectedHandleSize, selectStyle.selectedHandleSize);

    // 填充控制点
    ctx.value!.fillStyle = selectStyle.handleColor;
    ctx.value!.fill();
    ctx.value!.stroke();
  });
};

// 绘制当前工具（预览）
const drawCurrentTool = (currentPos: { x: number; y: number }) => {
  if (!ctx.value || !startPos.value) return;

  redrawAnnotations();

  switch (sharedState.currentTool) {
    case "line":
      drawLine({
        start: startPos.value,
        end: currentPos,
        color: lineConfig.color,
        lineWidth: lineConfig.lineWidth,
      });
      break;
    case "rectangle":
      drawRectangle({
        start: startPos.value,
        end: currentPos,
        color: rectConfig.color,
        lineWidth: rectConfig.lineWidth,
      });
      break;
    case "highlight":
      drawHighlight({
        start: startPos.value,
        end: currentPos,
        color: highlightConfig.color,
        opacity: highlightConfig.opacity,
      });
      break;
  }
};

// 添加标注
const addAnnotation = (endPos: { x: number; y: number }) => {
  if (!startPos.value) return;

  saveToUndoStack();

  const annotationId = Date.now().toString();

  let annotation: any = {
    id: annotationId,
    type: sharedState.currentTool,
    start: { ...startPos.value },
    end: { ...endPos },
  };

  // 根据工具类型添加特定属性
  switch (sharedState.currentTool) {
    case "line":
      annotation = {
        ...annotation,
        color: lineConfig.color,
        lineWidth: lineConfig.lineWidth,
      };
      break;
    case "rectangle":
      annotation = {
        ...annotation,
        color: rectConfig.color,
        lineWidth: rectConfig.lineWidth,
      };
      break;
    case "highlight":
      annotation = {
        ...annotation,
        color: highlightConfig.color,
        opacity: highlightConfig.opacity,
      };
      break;
  }

  sharedState.annotations.push(annotation);
  history.value.push(annotation);
  saveCurrentPageState();
  redrawAnnotations();
};

// 监听文件列表变化
watch(
  () => props.fileList,
  (newFiles) => {
    if (newFiles && newFiles.length > 0) {
      files.value = newFiles.map((url) => ({
        url,
        type: "image/png",
      }));
      currentPageIndex.value = 0;
      loadCurrentPage();
    }
  },
  { immediate: true }
);
watch(
  () => props.isloading,
  (newIsloading) => {
    if (newIsloading) {
      loadCurrentPage();
    }
  }
);
// 导出和导入功能
const exportAnnotations = () => {
  // 保存当前页面状态
  saveCurrentPageState();

  // 返回所有页面的标注数据
  return {
    pages: Object.keys(pageAnnotations.value).map((pageIndex) => ({
      pageIndex: parseInt(pageIndex),
      annotations: pageAnnotations.value[parseInt(pageIndex)],
    })),
  };
};

const importAnnotations = (annotationsData: any) => {
  if (annotationsData && annotationsData.pages) {
    annotationsData.pages.forEach((page: any) => {
      pageAnnotations.value[page.pageIndex] = page.annotations;
    });

    // 加载当前页面的标注
    restorePageState();
    redrawAnnotations();
  }
};

// 保存当前页面状态
const saveCurrentPageState = () => {
  if (currentPageIndex.value !== undefined) {
    pageAnnotations.value[currentPageIndex.value] = [...sharedState.annotations];
  }
};

// 恢复页面状态
const restorePageState = () => {
  sharedState.annotations = pageAnnotations.value[currentPageIndex.value] || [];
};

// 加载页面
const loadCurrentPage = async () => {
  try {
    // 恢复该页面的标注
    sharedState.annotations = pageAnnotations.value[currentPageIndex.value] || [];
    // 清除选中状态
    sharedState.selectedAnnotation = null;
    // 重绘
    redrawAnnotations();
  } catch (error) {
    ElMessage.error("页面加载失败");
  }
};

// 组件挂载和卸载
onMounted(() => {
  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("keydown", handleKeyDown);
  
  // 确保图片加载完成后初始化画布
  if (imageRef.value?.complete) {
    initCanvas();
  } else {
    imageRef.value?.addEventListener('load', initCanvas);
  }
  
  loadSavedAnnotations();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKeyDown);
  imageRef.value?.removeEventListener('load', handleImageLoad);
});

// 导出组件方法
defineExpose({
  exportAnnotations,
  importAnnotations,
  loadAnnotationsFromServer: () => {
    // 实现服务器加载逻辑
  },
});

// 处理方法
const handlePreviewClose = () => {
  previewDialogVisible.value = false;
};

const handleTextColorChange = (color: string) => {
  textConfig.color = color;
};

const handleColorChange = (color: string) => {
  handwritingColor.value = color;
};

const handleTextEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) return;
  e.preventDefault();
  handleTextBlur();
};

const handleTextBlur = () => {
  if (!textContent.value.trim()) {
    showTextInput.value = false;
    return;
  }

  saveToUndoStack();

  const annotation = {
    id: Date.now().toString(),
    type: sharedState.currentTool,
    text: textContent.value,
    position: {
      x: textPosition.value.x,
      y: textPosition.value.y
    },
    // 保存原始大小，不乘以缩放因子
    fontSize: sharedState.currentTool === "handwriting" ? fontSize.value : textConfig.fontSize,
    fontFamily: sharedState.currentTool === "handwriting" ? 
      (handwritingStyles.find((s) => s.value === handwritingStyle.value) || handwritingStyles[0]).fontFamily : 
      textConfig.fontFamily,
    color: sharedState.currentTool === "handwriting" ? handwritingColor.value : textConfig.color,
    style: sharedState.currentTool === "handwriting" ? handwritingStyle.value : undefined,
  };

  sharedState.annotations.push(annotation);
  redrawAnnotations();

  showTextInput.value = false;
  textContent.value = "";
};

const loadSavedAnnotations = () => {
  // 清空当前标注
  sharedState.annotations = [];
  
  // 重新加载批改步骤
  if (props?.correctStep) {
    props.correctStep.forEach((step) => {
      sharedState.annotations.push(step);
    });
  }
  
  // 重新绘制
  redrawAnnotations();
};


const generatePreview = () => {
  if (!canvasRef.value) return;
  previewImageUrl.value = canvasRef.value.toDataURL("image/png");
  previewDialogVisible.value = true;
};

const downloadPreview = () => {
  if (!previewImageUrl.value) return;
  const link = document.createElement("a");
  link.download = `preview_${currentPageIndex.value + 1}.png`;
  link.href = previewImageUrl.value;
  link.click();
};

// 几何计算辅助方法
const isPointNearLine = (point: { x: number; y: number }, start: { x: number; y: number }, end: { x: number; y: number }, tolerance: number) => {
  const A = point.x - start.x;
  const B = point.y - start.y;
  const C = end.x - start.x;
  const D = end.y - start.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = start.x;
    yy = start.y;
  } else if (param > 1) {
    xx = end.x;
    yy = end.y;
  } else {
    xx = start.x + param * C;
    yy = start.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;

  return Math.sqrt(dx * dx + dy * dy) <= tolerance;
};

const isPointInRect = (point: { x: number; y: number }, rect: any) => {
  const x = Math.min(rect.start.x, rect.end.x);
  const y = Math.min(rect.start.y, rect.end.y);
  const width = Math.abs(rect.end.x - rect.start.x);
  const height = Math.abs(rect.end.y - rect.start.y);

  return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
};

const isPointInHighlight = (point: { x: number; y: number }, highlight: any) => {
  const x = Math.min(highlight.start.x, highlight.end.x);
  const y = Math.min(highlight.start.y, highlight.end.y);
  const width = Math.abs(highlight.end.x - highlight.start.x);
  const height = Math.abs(highlight.end.y - highlight.start.y);

  return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
};

const isPointInTextArea = (point: { x: number; y: number }, annotation: any) => {
  const { position, fontSize = 16, text = "" } = annotation;
  const width = ctx.value?.measureText(text)?.width || text.length * fontSize * 0.6;
  const height = fontSize;

  return point.x >= position.x - 5 && point.x <= position.x + width + 5 && point.y >= position.y - height / 2 - 5 && point.y <= position.y + height / 2 + 5;
};

const isPointNearSymbol = (point: { x: number; y: number }, annotation: any) => {
  const { start } = annotation;
  const size = 30; // 符号大小
  const tolerance = 15; // 点击容差

  return Math.abs(point.x - start.x) <= size / 2 + tolerance && Math.abs(point.y - start.y) <= size / 2 + tolerance;
};

// 添加撤销/重做功能
const undoStack = ref<Array<any>>([]);
const redoStack = ref<Array<any>>([]);

const canUndo = computed(() => undoStack.value.length > 0);
const canRedo = computed(() => redoStack.value.length > 0);

const saveToUndoStack = () => {
  undoStack.value.push([...sharedState.annotations]);
  // 清空重做栈
  redoStack.value = [];
  // 限制撤销栈大小
  if (undoStack.value.length > 20) {
    undoStack.value.shift();
  }
};

const undo = () => {
  if (!canUndo.value) return;

  // 保存当前状态到重做栈
  redoStack.value.push([...sharedState.annotations]);

  // 恢复上一个状态
  const previousState = undoStack.value.pop();
  if (previousState) {
    sharedState.annotations = [...previousState];
    redrawAnnotations();
  }
};

const redo = () => {
  if (!canRedo.value) return;

  // 保存当前状态到撤销栈
  undoStack.value.push([...sharedState.annotations]);

  // 恢复下一个状态
  const nextState = redoStack.value.pop();
  if (nextState) {
    sharedState.annotations = [...nextState];
    redrawAnnotations();
  }
};

// 添加键盘快捷键支持
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case "z":
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
        break;
      case "y":
        e.preventDefault();
        redo();
        break;
      case "c":
        if (sharedState.selectedAnnotation) {
          e.preventDefault();
          copySelectedAnnotation();
        }
        break;
      case "v":
        if (copiedAnnotation.value) {
          e.preventDefault();
          pasteAnnotation();
        }
        break;
      case "delete":
      case "backspace":
        if (sharedState.selectedAnnotation) {
          e.preventDefault();
          deleteSelected();
        }
        break;
    }
  }
};

// 复制粘贴功能
const copiedAnnotation = ref<any>(null);

const copySelectedAnnotation = () => {
  if (!sharedState.selectedAnnotation) return;
  copiedAnnotation.value = JSON.parse(JSON.stringify(sharedState.selectedAnnotation));
};

const pasteAnnotation = () => {
  if (!copiedAnnotation.value || !canvasRef.value) return;

  const newAnnotation = JSON.parse(JSON.stringify(copiedAnnotation.value));
  newAnnotation.id = Date.now().toString();

  // 为粘贴的标注添加偏移
  const offset = { x: 20, y: 20 };

  if (newAnnotation.type === "text" || newAnnotation.type === "handwriting") {
    newAnnotation.position.x += offset.x;
    newAnnotation.position.y += offset.y;
  } else {
    newAnnotation.start.x += offset.x;
    newAnnotation.start.y += offset.y;
    if (newAnnotation.end) {
      newAnnotation.end.x += offset.x;
      newAnnotation.end.y += offset.y;
    }
  }

  saveToUndoStack();
  sharedState.annotations.push(newAnnotation);
  redrawAnnotations();
};

// 在 onMounted 中添加键盘事件监听
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  // ... 其他已有的代码
});

// 在 onBeforeUnmount 中移除键盘事件监听
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  // ... 其他已有的代码
});

// 修改高亮绘制方法
const drawHighlight = (annotation: any, context: CanvasRenderingContext2D = ctx.value!) => {
  context.save();
  context.globalAlpha = annotation.opacity || highlightConfig.opacity;
  context.beginPath();
  context.fillStyle = annotation.color || highlightConfig.color;
  const x = Math.min(annotation.start.x, annotation.end.x);
  const y = Math.min(annotation.start.y, annotation.end.y);
  const width = Math.abs(annotation.end.x - annotation.start.x);
  const height = Math.abs(annotation.end.y - annotation.start.y);
  context.fillRect(x, y, width, height);
  context.restore();
};

// 监听图片URL变化
watch(imageUrl, async (newUrl) => {
  if (newUrl) {
    try {
      backgroundImage.value = await loadImage(newUrl);
      imageLoaded.value = true;
      await initCanvas();
    } catch (error) {
      ElMessage.error("图片加载失败");
    }
  }
});
// 监听图片URL变化
watch(
  () => props.imgEditUrl,
  async (newUrl) => {
    if (newUrl) {
      imageUrl.value = newUrl;
    }
  },
  { immediate: true }
);

// 保留手动保存提醒功能
let saveTimeout: number | null = null;
watch(
  () => sharedState.annotations,
  () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = window.setTimeout(() => {
      if (sharedState.annotations.length > 0) {
        ElMessage.info({
          message: "有未保存的更改，请记得保存",
          duration: 3000,
          showClose: true,
        });
      }
    }, 30000); // 30秒后提示
  },
  { deep: true }
);

// 添加 startDragging 方法
const startDragging = (e: MouseEvent) => {
  e.preventDefault(); // 防止事件冲突
  // 如果不是选择工具，直接返回
  if (sharedState.currentTool !== "select") return;

  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const clickPos = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  // 如果已经有选中的标注，检查是否点击在选中标注上
  if (sharedState.selectedAnnotation) {
    if (isPointInAnnotation(clickPos, sharedState.selectedAnnotation)) {
      selectState.selectedAnnotation = sharedState.selectedAnnotation;
      selectState.isDragging = true;
      selectState.dragStartPos = clickPos;
      return;
    }
  }

  // 如果点击在其他标注上，选中该标注
  const clickedAnnotation = [...sharedState.annotations].reverse().find((annotation) => isPointInAnnotation(clickPos, annotation));

  if (clickedAnnotation) {
    selectState.selectedAnnotation = clickedAnnotation;
    selectState.isDragging = true;
    selectState.dragStartPos = clickPos;
  } else {
    // 如果点击在空白处，取消选中
    selectState.selectedAnnotation = null;
  }

  redrawAnnotations();
};

// 修改选择工具相关的状态
const isSelecting = ref(false);
const selectionStart = ref<{ x: number; y: number } | null>(null);
const selectionEnd = ref<{ x: number; y: number } | null>(null);

// 添加选择区域绘制方法
const drawSelectionArea = () => {
  if (!ctx.value || !selectionStart.value || !selectionEnd.value) return;

  ctx.value.save();
  ctx.value.strokeStyle = "#409EFF";
  ctx.value.lineWidth = 1;
  ctx.value.setLineDash([5, 5]);

  const x = Math.min(selectionStart.value.x, selectionEnd.value.x);
  const y = Math.min(selectionStart.value.y, selectionEnd.value.y);
  const width = Math.abs(selectionEnd.value.x - selectionStart.value.x);
  const height = Math.abs(selectionEnd.value.y - selectionStart.value.y);

  ctx.value.strokeRect(x, y, width, height);
  ctx.value.restore();
};

// 添加查找选区内标注的方法
const findAnnotationsInSelection = () => {
  if (!selectionStart.value || !selectionEnd.value) return [];

  const selectionBounds = {
    x: Math.min(selectionStart.value.x, selectionEnd.value.x),
    y: Math.min(selectionStart.value.y, selectionEnd.value.y),
    width: Math.abs(selectionEnd.value.x - selectionStart.value.x),
    height: Math.abs(selectionEnd.value.y - selectionStart.value.y),
  };

  return sharedState.annotations.filter((annotation) => {
    const bounds = getAnnotationBounds(annotation);
    return isRectOverlap(selectionBounds, bounds);
  });
};

// 添加矩形重叠检测方法
const isRectOverlap = (rect1: any, rect2: any) => {
  return !(rect1.x + rect1.width < rect2.x || rect2.x + rect2.width < rect1.x || rect1.y + rect1.height < rect2.y || rect2.y + rect2.height < rect1.y);
};

// 添加更新标注位置的辅助方法
const updateAnnotationPosition = (annotation: any, dx: number, dy: number) => {
  if (annotation.type === "text" || annotation.type === "handwriting") {
    annotation.position.x += dx;
    annotation.position.y += dy;
  } else {
    annotation.start.x += dx;
    annotation.start.y += dy;
    if (annotation.end) {
      annotation.end.x += dx;
      annotation.end.y += dy;
    }
  }
};

// 修改 canvas 的鼠标样式
const getCanvasCursor = computed(() => {
  if (sharedState.currentTool === "select") {
    return selectState.isDragging ? "move" : "pointer";
  }
  return "crosshair";
});

// 添加 watchEffect 来监听 correctStep 变化并重新渲染
// watchEffect(() => {
//   if (props.correctStep && props.correctStep.length > 0) {
//     console.log("props.correctStep", props.correctStep);
//     // 清空当前标注
//     sharedState.annotations = [];

//     // 重新加载批改步骤
//     props.correctStep.forEach((step) => {
//       sharedState.annotations.push(step);
//     });

//     // 重新绘制
//     redrawAnnotations();
//   }
// });

// 在 script 部分添加 ref
const gradeInputRef = ref(null);

// 添加虚拟滚动相关状态
const viewportHeight = ref(0);
const scrollTop = ref(0);
const visibleStart = ref(0);
const visibleEnd = ref(0);
const itemHeight = ref(1000); // 每块的高度
const bufferSize = 2; // 缓冲区大小

// 添加分块渲染相关的状态
const CHUNK_SIZE = 5000; // 每块的最大高度
const chunks = ref<Array<{start: number, end: number}>>([]);
const currentChunk = ref(0);

// 修改滚动处理方法
const handleScroll = (e: Event) => {
  if (!canvasRef.value) return;
  
  const target = e.target as HTMLElement;
  const scrollTop = target.scrollTop;
  
  // 计算当前应该显示哪个块
  const newChunkIndex = Math.floor(scrollTop / CHUNK_SIZE);
  
  if (newChunkIndex !== currentChunk.value) {
    currentChunk.value = newChunkIndex;
    renderCurrentChunk();
  }
};

// ... existing code ...

// 修改文本输入框的样式
const textInputStyle = computed(() => {
  if (!showTextInput.value || !canvasRef.value || !containerRef.value || !lastMouseEvent.value) return {};
  
  // 获取canvas容器的位置和滚动位置
  const containerRect = containerRef.value.getBoundingClientRect();
  const containerScrollTop = containerRef.value.scrollTop;
  const containerScrollLeft = containerRef.value.scrollLeft;
  
  // 计算相对于canvas容器的位置
  const relativeX = lastMouseEvent.value.clientX - containerRect.left + containerScrollLeft;
  const relativeY = lastMouseEvent.value.clientY - containerRect.top + containerScrollTop;
  
  return {
    left: `${relativeX}px`,
    top: `${relativeY}px`,
    position: 'absolute', // 改回绝对定位
    width: sharedState.currentTool === 'handwriting' ? `${Math.max(200, fontSize.value * 4)}px` : '200px',
    zIndex: 1000,
  };
});

// ... existing code ...

// 添加鼠标事件引用
const lastMouseEvent = ref<MouseEvent | null>(null);

watch(
  () => props.correctStep,
  (newCorrectStep) => {
    if (newCorrectStep) {
      loadSavedAnnotations();
    }
  },
  { immediate: true }
)

// 添加弹框可见性监听
watch(
  () => props.isloading,
  (newIsloading) => {
    if (newIsloading) {
      loadSavedAnnotations();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.edit-container {
  /* padding: 20px;
  viewportHeight.value = window.innerHeight - 200; // 减去工具栏等高度
  
  // 计算可见区域
  updateVisibleRange();
  
  // 如果有批改步骤，渲染它们
  if (props.correctStep && props.correctStep.length > 0) {
    sharedState.annotations = [...props.correctStep];
    redrawAnnotations();
  }
};

// 添加更新可见区域的方法
const updateVisibleRange = () => {
  if (!canvasRef.value) return;
  
  const start = Math.floor(scrollTop.value / itemHeight.value) - bufferSize;
  const end = Math.ceil((scrollTop.value + viewportHeight.value) / itemHeight.value) + bufferSize;
  
  visibleStart.value = Math.max(0, start);
  visibleEnd.value = Math.min(Math.ceil(canvasRef.value.height / itemHeight.value), end);
};

// 添加滚动事件处理
const handleScroll = (e: Event) => {
  if (!canvasRef.value) return;
  
  const target = e.target as HTMLElement;
  scrollTop.value = target.scrollTop;
  updateVisibleRange();
  redrawAnnotations();
};
</script>

<style scoped>
.edit-container {
  /* padding: 20px;
  height: calc(100vh - 100px); */
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px; /* 增加间距 */
  align-items: center;
  position: sticky;
  bottom: 0;
  background: #f8f9fa;
  z-index: 1;
  padding: 16px; /* 增加内边距 */
  border-radius: 0px; /* 增加圆角 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* 增强阴影 */
}
.edit-img-container {
  display: flex;
  padding: 20px !important;
  justify-content: center; /* 居中显示 */
  width: 100%;
  gap: 40px; /* 增加间距 */
  overflow: auto; /* 允许容器滚动 */
}
.tool-container {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 10px;
  flex-shrink: 0;
}
.canvas-container {
  position: relative; /* 确保是相对定位 */
  width: 1000px;
  min-width: 1000px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  background: #f5f5f5;
  height: calc(100vh - 150px);
  margin: 0 auto;
  will-change: transform;
  transform: translateZ(0);
}

.base-image {
  width: 1000px;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  will-change: transform;
  transform: translateZ(0);
}

.annotation-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background: transparent;
  will-change: transform;
  transform: translateZ(0);
}

canvas {
  width: 1000px; /* 固定宽度 */
  height: auto;
  object-fit: contain;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: default;
}

/* 统一字体声明 */
@font-face {
  font-family: "SmileySans";
  src: url("../assets/fonts/SmileySans-Oblique.ttf") format("truetype");
  font-display: swap;
}

@font-face {
  font-family: "Xingkai SC";
  src: local("Xingkai SC"), local("STXingkai");
  font-display: swap;
}

@font-face {
  font-family: "Kaiti SC";
  src: local("Kaiti SC"), local("STKaiti");
  font-display: swap;
}

/* 手写字体声明 */
/* @font-face {
  font-family: "Handwriting-Regular";
  src: url("@/assets/fonts/handwriting-regular.ttf") format("truetype");
  font-display: swap;
}

@font-face {
  font-family: "Handwriting-Neat";
  src: url("@/assets/fonts/handwriting-neat.ttf") format("truetype");
  font-display: swap;
}

@font-face {
  font-family: "Handwriting-Casual";
  src: url("@/assets/fonts/handwriting-casual.ttf") format("truetype");
  font-display: swap;
} */

/* 基础输入框样式 */
.text-input {
  position: absolute; /* 改回绝对定位 */
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 8px;
  max-width: 300px;
  transform-origin: center top;
  z-index: 1000;
}

.handwriting-input {
  background-color: rgba(255, 255, 255, 0.95);
  font-family: var(--handwriting-font, "Ma Shan Zheng"), cursive;
}

/* 添加输入框容器的样式 */
.canvas-container {
  position: relative; /* 确保是相对定位 */
}

/* 工具栏样式优化 */
.toolbar {
  height: 48px;
  display: flex;
  gap: 16px; /* 增加间距 */
  align-items: center;
  position: sticky;
  bottom: 0;
  background: #f8f9fa;
  z-index: 1;
  border-radius: 8px; /* 增加圆角 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* 增强阴影 */
  background: rgba(39, 165, 255, 0.1);
}

/* 按钮组样式 */
.tool-group,
.action-group {
  display: flex;
  gap: 4px; /* 按钮之间的间距 */
}

/* 按钮悬停效果 */
.el-button:not(:disabled):hover {
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

/* 按钮组之间的分隔线样式 */
.el-divider--vertical {
  height: 24px; /* 调整分隔线高度 */
  margin: 0 12px; /* 增加分隔线两侧间距 */
}

/* 禁用状态的按钮样式 */
.el-button.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 下拉按钮的箭头图标样式 */
.el-icon--right {
  margin-left: 6px;
  transition: transform 0.3s ease;
}

/* 下拉菜单打开时箭头旋转 */
.el-dropdown.is-active .el-icon--right {
  transform: rotate(180deg);
}

/* 页面控制按钮组样式 */
.page-control {
  background-color: #fff;
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 页码信息样式 */
.page-info {
  font-weight: 500;
  color: #409eff;
  padding: 0 8px;
}

/* 添加选择工具的鼠标样式 */
.canvas-container canvas {
  cursor: v-bind("currentTool === 'select' ? 'pointer' : 'crosshair'");
  margin: 0 !important;
}

/* 选中状态下的鼠标样式 */
.canvas-container canvas.dragging {
  cursor: move;
}
.dropdown-content {
  padding: 20px;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 预览对话框样式 */
:deep(.el-dialog__body) {
  flex: 1;
  overflow: auto;
  padding: 0 !important;
}

:deep(.el-dialog__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

:deep(.el-dialog__footer) {
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.symbol-group {
  display: flex;
  gap: 4px;
}

.upload-btn {
  display: inline-block;
  margin-right: 8px;
}

/* 符号按钮的图标样式 */
.symbol-group .el-button i {
  font-size: 18px;
  font-weight: bold;
}

/* 符号按钮悬停提示 */
.symbol-group .el-button {
  position: relative;
}

.symbol-group .el-button:hover::after {
  content: attr(title);
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}

/* 添加矩形工具按钮样式 */
.tool-group .el-button {
  min-width: 80px;
}

.tool-dropdown {
  min-width: 280px;
}

.symbol-input-content {
  display: none;
}

.dialog-footer {
  text-align: right;
  margin-top: 20px;
}

.tool-buttons {
  display: flex;
  gap: 12px;
}

.tool-button-group {
  display: none;
}

.tool-button-group .el-button {
  border-radius: 4px;
}

.tool-button-group .el-button:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.tool-button-group .el-button:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 12px;
}

.tool-button-group .el-icon-setting {
  font-size: 14px;
}

.dropdown-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-item .label {
  min-width: 70px;
  color: #606266;
}

.dropdown-content {
  padding: 16px;
}

/* 手写字体声明 */
/* @font-face {
  font-family: "Regular Script";
  src: url("@/assets/fonts/regular-script.ttf") format("truetype");
  font-display: swap;
} */

.handwriting-input textarea {
  font-family: var(--handwriting-font, "Ma Shan Zheng"), cursive;
  line-height: 1.8;
  letter-spacing: 1px;
  font-weight: normal;
}
.toolbar .el-button {
  width: 90px;
  height: 30px;
  border-radius: 10px;
  margin: 0 5px;
}
.toolbar .custom-default-btn {
  border: 1px solid #27a5ff;
  background: transparent;
  color: #27a5ff;
}
.custom-select-btn {
  border: 1px solid #32b16c;
  background: #32b16c;
  color: #fff;
}
.custom-error-btn {
  border: 1px solid #ff4c48;
  background: #ff4c48;
  color: #fff;
}
.custom-warning-btn {
  border: 1px solid #ff9748;
  background: #ff9748;
  color: #fff;
}
.custom-info-btn {
  border: 1px solid #27a5ff;
  background: #27a5ff;
  color: #fff;
}
.custom-page-btn {
  width: 40px !important;
  height: 40px !important;
  background: #27a5ff !important;
  border-radius: 5px !important;
  color: #fff !important;
}
/* 选中工具的按钮样式 */
.tool-active {
  position: relative;
  font-weight: 600; /* 加粗字体 */
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2); /* 添加阴影效果 */
  border-color: #409eff !important; /* 强制使用主题色边框 */
  color: #27a5ff !important;
  background: #fff !important;
}
</style>
