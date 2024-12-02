<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :close-on-click-modal="false"
    style="width: 20vw; padding-top: 0"
    v-model="importdialogViaible"
  >
    <h2 style="margin-top: 0">导入Excel文件</h2>
    <el-upload
      class="upload-demo"
      ref="uploadRef"
      auto-upload="false"
      show-file-list="false"
      :before-upload="beforeUpload"
      style="margin-bottom: 20px"
    >
      <!-- 使用输入框作为上传的触发器 -->
      <el-input
        slot="trigger"
        v-model="fileName"
        placeholder="未选择文件"
        readonly
        style="cursor: pointer; text-align: center"
      ></el-input>
    </el-upload>

    <div style="text-align: center; margin-bottom: 20px">
      <!-- 添加内联样式 -->
      <!-- 下载链接 -->
      <a href="/file/任课教师-导入学生名单模板.xlsx" download>点击下载模板文件</a>
    </div>

    <div>
      <!-- 添加内联样式 -->
      <!-- 上传按钮 -->
      <el-button style="margin-right: 10px" @click="closeimportdialogViable">关闭</el-button>
      <!-- 添加内联样式 -->
      <el-button type="success" @click="submitUpload">上传</el-button>
    </div>
  </el-dialog>
</template>

<script setup></script>

<style lang="less" scoped></style>
