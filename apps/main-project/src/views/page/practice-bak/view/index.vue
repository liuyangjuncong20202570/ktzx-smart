<!-- 作业答题 -->
<template>

    <!-- 预览 -->
    <div class="task-view">
      <Header title="查看实验" :pathData="pathData" />
      <div class="task-title flex-between">
        <div class="flex-start task-msg">
          <span>当前实验: {{ practiceDetail.name }}</span>
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
                    <div class="file-name">格式：{{ getFileExtensionFromUrl(url) }}</div>
                    <el-button v-if="getFileExtensionFromUrl(url) === 'pdf'" @click="lock(url || host + '/static/' + item.defaultPath)">查看</el-button>
                    <el-button v-else @click="download((host + '/static/' + item.defaultPath), item.itemName)">下载</el-button>
                  </div>
                </div>
              </div>
              <div v-else class="flex-center" style="width: 100%;">暂无提交实验材料</div>
            </div>
            <div class="item-right">
              <el-checkbox-group v-model="item.check" disabled :min="0" @change="handleCheck($event, item)">
                <el-checkbox :label="1">
                  A
                </el-checkbox>
                <el-checkbox :label="0.8">
                  B
                </el-checkbox>
                <el-checkbox :label="0.6">
                  C
                </el-checkbox>
                <el-checkbox :label="0.4">
                  D
                </el-checkbox>
              </el-checkbox-group>
              <div class="flex-between" style="margin: 10px 0 15px 0;">
                <el-button type="text" style="margin-right: 8px;">总分:</el-button>
                <el-input style="width: 60px;" disabled v-model="item.score"></el-input>
                <el-button type="text" style="margin-right: 8px;">得分:</el-button>
                <el-input style="width: 60px;" disabled v-model="item.goal"></el-input>
              </div>
              <div class="flex-center" style="margin-bottom: 10px;" v-for="(v, idx) in taskData" :key="idx">
                <el-button type="text" style="margin-right: 8px;">{{ v.name }}</el-button>
                <el-input-number disabled @change="handleScore($event, item)" v-model="item[v.value]" :min="0" :max="item.score" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Header from '@/views/page/components/header/index.vue'
  import { host } from "@/utils/request.js";
  import { getFileExtensionFromUrl, isImageURL, downloadFile } from '@/utils/index.js'
  import { practiceStuDetail } from "@/api/practice/index.ts";
  const routes = useRouter()
  const { currentRoute } = routes
  const route = currentRoute.value
  const practiceId = route.query?.practiceId
  const stuId = route.query?.stuId
  const teacherTask = ref([])
  const practiceDetail = ref({})

  const pathData = [
    {
      name: '实验管理',
      path: '/homes/courseteacherhome/exam/experimental/labmangt'
    },
    {
      name: '实验学生列表',
      path: '/homes/courseteacherhome/exam/experimental/student',
      query: {
        id: route.query.id,
        privilege: route.query.privilege,
      }
    },
    {
      name: '实验查看',
      path: ''
    },
  ]

  const taskData = [
    {
      name: '报告格式:',
      value: 'format'
    },
    {
      name: '报告字数:',
      value: 'num'
    },
    {
      name: '结构合理:',
      value: 'structure'
    },
    {
      name: '内容充实:',
      value: 'content'
    }
  ]

  onMounted(() => {
    getStuDetail()
  })

  const lock = (url) => {
    window.open(url)
  }

  const download = (url, name) => {
    downloadFile(url, name)
  }

  const getStuDetail = () => {
    practiceStuDetail({ practiceId, stuId }).then(res => {
      if (res?.code === '200') {
        practiceDetail.value = res?.data
        teacherTask.value = res?.data?.items?.filter((item) => item.beDefault === 1)
        const answerMap = res?.data?.stu?.answerMap
        const correctMap = res?.data?.stu?.correctMap
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

        if (correctMap) {
          practiceDetail.value?.items?.forEach((item, i) => {
            item.goal = 0
            taskData.forEach((f,idx) => {
              item[f.value] = correctMap[item.id][idx]
              item.goal+=correctMap[item.id][idx]
            })
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
      item.urlArr = item.urlArr ?? []
      item.urlArr.push(updateUrl)
    }
  }
  </script>
  <style scoped>
  .task-view {
    text-align: left;
    padding-bottom: 10px;
    position: relative;
    background: #fff;
    padding: 0 10px 10px 10px;
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
    font-size: 14px;
    font-weight: bold;
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
    width: 100%;
    min-height: 178px;
  }
  .item-right {
    width: 220px;
  }
  </style>