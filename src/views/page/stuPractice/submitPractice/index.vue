<!-- 作业答题 -->
<template>
    <!-- 预览 -->
    <div class="task-view">
      <Header :title="disabled ? '查看实验' : '提交实验'" />
      <div class="task-title flex-between">
        <div class="flex-start task-msg">
          <span>当前实验: {{ practiceDetail.name }}</span>
        </div>
        <div v-if="practiceDetail && practiceDetail?.items?.length && !disabled">
          <el-button @click="submit('save')">保存</el-button>
          <el-button @click="submit('submit')">提交</el-button>
        </div>
      </div>
      <div v-if="!practiceDetail?.items?.length" class="flex-center">暂无数据</div>

      <div class="task-upload-url flex-start" v-if="teacherTask && teacherTask.length">
        <div class="teacher-task flex-center" v-for="(item, i) in teacherTask" :key="i">
          <div>
            <div class="item-title">{{ item.itemName }}</div>
            <el-button v-if="getFileExtensionFromUrl(item.defaultPath) === 'pdf'" @click="lock(host + '/static/' + item.defaultPath)">查看</el-button>
            <el-button v-else @click="download((host + '/static/' + item.defaultPath), item.itemName)">下载</el-button>
          </div>
        </div>
      </div>

      <div class="task-item" 
        v-for="(item, i) in practiceDetail.items" 
        :key="i" 
      >

        <template v-if="item.beDefault === 0 && item.beValid">
          <div class="item-title" style="flex-wrap: wrap;">{{ item.itemName }}</div>
          <div class="flex-start">
            <div class="task-upload-url flex-start">
              <div v-if="item.urlArr && item.urlArr.length" class="url-wrap" v-for="(url, urlIdx) in item.urlArr" :key="url">
                <!-- isImageURL -->
                <el-image
                  v-if="isImageURL(url)"
                  style="width: 178px; height: 178px"
                  :src="url"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="[url]"
                  :initial-index="4"
                  fit="cover"
                />
                <div class="file-msg flex-center" v-else>
                  <div>
                    <div class="file-name">{{ getFileExtensionFromUrl(url) }}</div>
                    <el-button v-if="getFileExtensionFromUrl(url) === 'pdf'" @click="lock(host + '/static/' + item.defaultPath)">查看</el-button>
                    <el-button v-else @click="download((host + '/static/' + item.defaultPath), item.itemName)">下载</el-button>
                  </div>
                </div>
                <el-icon class="file-close cursor-pointer" v-if="!disabled">
                  <Close @click="delItemUrl(item.urlArr, urlIdx)" />
                </el-icon>
              </div>
              <div v-else-if="disabled">暂无提交实验材料</div>
            </div>
            <div class="task-upload" v-if="!disabled">
              <el-upload
                :action="action"
                :data="data"
                :show-file-list="false"
                :on-success="(response, file) => handleAvatarSuccess(response, file, item)"
              >
                <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { Plus, Close } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import Header from '@/views/page/components/header/index.vue'
  import { stuDetail, practiceSave, practiceSubmit } from '@/api/stuPractice.js'
  import { host } from '@/api/host.js'
  import { getFileExtensionFromUrl, isImageURL, downloadFile } from '@/utils/index.js'
  const routes = useRouter()
  const { currentRoute } = routes
  const route = currentRoute.value
  const practiceId = route.query?.id
  const type = route.query?.type

  const action = ref(host + '/common/upload')
  const data = ref({})
  const teacherTask = ref([])
  data.value = {
    tag: 'test'
  }

  const practiceDetail = ref({})
  const disabled = type === 'view' ? true : false
  onMounted(() => {
    getStuDetail()
  })

  const submit = (name) => {
    const answerMap = {}
    practiceDetail.value?.items?.forEach((item) => {
      let _urlArr = []
      // 截取学生提交的资料url，提交到后台
      if (item.beDefault === 0 && item.urlArr && item.urlArr.length > 0) {
        _urlArr = item.urlArr.map((m) => {
          const value = m?.split('/static/')[1]
          if (value) return value
        })
      }
      answerMap[item.id] = (item.beDefault === 0 ? _urlArr : [item.defaultPath]) ?? []
    })
    const params = {
      practiceId,
      answerMap
    }
    const api = name === 'save' ? practiceSave : practiceSubmit
    api(params).then(res => {
      if (res.code === '200') {
        ElMessage.success(name === 'save' ? '保存成功' : '提交成功')
        if (name === 'submit') {
          routes.push('/homes/studenthome/exam/myexperiment')
        }
      }
    })
  }

  const delItemUrl = (urlArr, idx) => {
    urlArr.splice(idx, 1)
  }

  const lock = (url) => {
    window.open(url)
  }

  const download = (url, name) => {
    downloadFile(url, name)
  }

  const getStuDetail = () => {
    stuDetail(practiceId).then(res => {
      if (res?.code === '200') {
        practiceDetail.value = res?.data
        teacherTask.value = res?.data?.items?.filter((item) => item.beDefault === 1)
        const answerMap = res?.data?.stu?.answerMap
        if (answerMap) {
          // 内容回显
          practiceDetail.value?.items?.forEach((item) => {
            if (item.beDefault === 0 && answerMap[item.id]) {
              item.urlArr = answerMap[item.id]?.map((url) => {
                return host + '/static/' + url
              })
            }
          })
        }
      }
    })
  }
  const handleAvatarSuccess = (
    response,
    uploadFile,
    item
  ) => {
    if (response?.code === '200') {
      const updateUrl = host + '/static/' + response.data
      // item.itemPicture = imgUrl
      // imageUrl.value = imgUrl
      item.urlArr = item.urlArr ?? []
      item.urlArr.push(updateUrl)
      console.log('item-url-arr', item)
      console.log('handleAvatarSuccess', response, uploadFile)
    }
  }
  </script>
  <style>
  .task-upload {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transform: translateY(-4px);
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  </style>
  <style scoped>
  .task-view {
    text-align: left;
    padding-bottom: 10px;
    position: relative;
    background: #fff;
    padding: 10px;
    border-radius: 8px;
    font-size: 13px;
    color: #000000;
  }
  .task-title {
    font-size: 13px;
    margin: 10px 0;
  }
  .task-msg span {
    margin-right: 20px;
  }
  .task-item {
    padding: 10px 0;
  }
  .item-title {
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(116, 116, 116, 0.543);
  }
  .url-wrap {
    width: 178px;
    height: 178px;
    border-radius: 4px;
    overflow: hidden;
    margin: 0 10px 10px 0;
    position: relative;
    border: 1px solid #d9d9d9;
  }
  .file-msg {
    width: 178px;
    height: 178px;
    text-align: center;
    border-radius: 4px;
    overflow: hidden;
  }
  .file-close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-weight: bold;
    font-size: 16px;
    background: #fff;
    border-radius: 50%;
    padding: 2px;
  }
  .file-name {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .teacher-task {
    width: 178px;
    height: 178px;
    border: 1px solid #d9d9d9;
    margin-right: 10px;
    border-radius: 5px;
  }
  .task-upload-url {
    min-height: 178px;
  }
  </style>