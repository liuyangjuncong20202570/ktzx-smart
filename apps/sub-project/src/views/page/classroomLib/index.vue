<template>
  <div class="classroomLib-lib">
    <Header title="课堂题库" :pathData="pathData" />

    <Kwa type="classroomLibSearch" @kwa-event="handleKwaEvent" />

    <div class="cpirse-lib-btn flex-between" v-if="!(privilege === 'read')">
      <el-checkbox label="全选" @change="handleSelectAll"></el-checkbox>
      <div>
        <el-button type="primary" :icon="Plus" @click="add">新增题目</el-button>
        <el-button type="danger" :icon="Delete" @click="batchDel">批量删除</el-button>
        <el-button type="primary" :icon="Upload" @click="massUpload">批量上传</el-button>
      </div>
    </div>

    <Topic 
      v-if="topicFlag" 
      :item="item" 
      @save="() => {
        getClassroomLibList()
        topicFlag = false
      }" 
      @close="() => {
        topicFlag = false
      }" 
    />

    <el-collapse v-model="activeNames">
      <el-collapse-item 
        v-for="(course, i) in courseList" 
        :key="course.id" 
        :name="course.id"
      >
        <template #title>
          <div class="flex-start" style="flex-wrap: wrap; height: 50px;width: 100%;text-align: left;">
            <el-checkbox style="transform: translateY(12px);" @click.stop label="" v-model="course.isChecked"></el-checkbox>
            <div style="width: calc(100% - 30px);">
              <div class="topic-kwa wdd-ellipsis" v-if="course.answers">
                <span style="margin-right: 20px;" v-for="(kwa, kwaIdx) in course.kwas" :key="kwaIdx">{{ kwa.kwaName }}</span>
              </div>
              <div class="topic-header wdd-ellipsis">
                {{ `${i+1}、${course.title} (${TOPICTYPE[course?.questionTypeId] ?? '预留题'})` }}
              </div>
            </div>
          </div>
        </template>
        <Topic 
          v-if="course.topicFlag" 
          :item="course" 
          @save="() => {
            getClassroomLibList()
            course.topicFlag = false
          }" 
          @close="() => {
            course.topicFlag = false
          }" 
        />
        <div class="topic-item">
          <div v-show="course.content !== '<p><br></p>'" class="flex-start" v-html="course.content"></div>
          <div>
            <div class="topic-answer-item" v-for="(answer, answerIdx) in course.answers" :key="answerIdx">
              {{ String.fromCharCode('A'.charCodeAt() + answerIdx) }}: {{ answer.itemContent }}
              <span v-if="answer.isAnswer">正确答案</span>
            </div>
          </div>
          <el-input
            v-if="['编程题', '简答题'].includes(TOPICTYPE[course.questionTypeId]) && course.answer"
            placeholder="请输入建议答案"
            v-model="course.answer"
            disabled
            style="width: 100%;margin-bottom: 10px;"
            :rows="4"
            type="textarea"
            maxlength="3000"
          />
          <div class="topic-item-icon flex-between cursor-pointer" v-if="!(privilege === 'read')">
            <template v-if="course.status === 4">
              <!-- 锁定状态 -->
              <el-icon title="当前题型已被锁定" style="color: red;"><Lock /></el-icon>
            </template>
            <template v-else>
              <el-icon title="编辑" @click="edit(course)">
                <Edit />
              </el-icon>
              <el-icon title="复制" @click="copy(course)">
                <DocumentCopy />
              </el-icon>
              <el-icon title="删除" @click="del(course)">
                <Delete />
              </el-icon>
            </template>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div v-if="!courseList || !courseList.length">暂无数据</div>

    <div class="pagination flex-end">
      <el-pagination v-model:currentPage="params.pageIndex" v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 选择题类型弹窗 -->
    <optionTopic ref="optionTopicRef" @childData="handleChildData" />
    <!-- 无权限显示 -->
    <NoAccessPermission v-if="privilege === 'none'" />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { Edit, DocumentCopy, Delete, Lock, Upload, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Kwa from '@/components/kwa/index.vue'
import Header from '../components/header/index.vue'
import Topic from './components/topic/index.vue'
import optionTopic from './components/optionTopic/index.vue'
import { classroomLibList, classroomLibCopy, classroomLibDel, upToCourse, classroomLibWR } from '@/api/classroomLib.js'
import { TOPICTYPE } from '@/utils/consts'
import NoAccessPermission from '@/views/page/components/noAccessPermission/index.vue'

export default defineComponent({
  components: {
    Kwa,
    Lock,
    Topic,
    Header,
    optionTopic,
    Edit,
    DocumentCopy,
    Delete,
    NoAccessPermission
  },
  setup() {
    onMounted(() => {
      getClassroomLibList()
      getWR()
    })
    const item = ref({})
    const topicFlag = ref(false)
    const activeNames = ref([])
    const optionTopicRef = ref(null)
    const courseList = ref(null)
    const total = ref(0)
    const params = ref({
      pageIndex: 1,
      pageSize: 20,
    })
    const privilege = ref('')
    const pathData = [
      {
        name: '课堂题库',
        path: ''
      }
    ]

    const getWR = () => {
      classroomLibWR().then(res => {
        if (res.code === '200') {
          privilege.value = res.data
        }
      })
    }

    const handleSelectAll = (val) => {
      courseList.value?.forEach((course) => {
        course.isChecked = val
      })
    }
   
    const edit = (answer) => {
      // item.value = answer
      answer.topicFlag = true
    }
    const del = (answer, allIds) => {
      ElMessageBox.confirm(
        `${allIds && allIds.length ? '确定批量删除?' : '确定删除此题型?'}`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        console.log('classroomLibDel', answer)
        classroomLibDel(allIds ?? [answer.id]).then(res => {
          if (res.code === '200') {
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            getClassroomLibList()
          }
        })
      }).catch((err) => { console.log(err) })
    }
    const copy = (answer) => {
      ElMessageBox.confirm(
        '确定复制此题型?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        classroomLibCopy(answer.id).then(res => {
          if (res.code === '200') {
            ElMessage({
              type: 'success',
              message: '复制成功',
            })
            getClassroomLibList()
          }
        })
      }).catch(() => { })
    }
    const add = () => {
      topicFlag.value = false
      if (optionTopicRef.value) {
        optionTopicRef.value.init();
      }
    }

    const batchDel = () => {
      const ids = courseList.value.filter((course) => course.isChecked )?.map((course) => course.id)
      if (ids && ids.length) {
        del(null, ids)
      } else {
        ElMessage.error('请选择要删除的题')
      }
    }

    const handleChildData = (questionTypeId) => {
      item.value = {
        questionTypeId
      }
      topicFlag.value = true
      console.log('topicFlag', topicFlag)
    }

    const handleSizeChange = (val) => {
      params.value.pageSize = val
      handleKwaEvent()
      console.log(`${val} items per page`)
    }

    const handleCurrentChange = (val) => {
      params.value.pageIndex = val
      handleKwaEvent()
      console.log(`current page: ${val}`)
    }

    const handleKwaEvent = (obj) => {
      params.value = {
        ...params.value,
        ...obj
      }
      getClassroomLibList()
    }

    const getClassroomLibList = () => {
      classroomLibList(params.value).then(res => {
        if (res.code === '200') {
          total.value = res?.data?.recordSize ?? 0
          courseList.value = res?.data?.data ?? []
          // 折叠面板默认全部展开
          activeNames.value = courseList.value.map((item) => item.id)
          console.log('res', courseList.value)

        }
      })
    }

    const massUpload = () => {
      const ids = courseList.value.filter((course) => course.isChecked )?.map((course) => course.id)
      if (ids && ids.length) {
        upToCourse({ ids }).then(res => {
          if (res.code === '200') {
            ElMessage.success('上传成功')
          }
        })
      } else {
        ElMessage.error('请选择要上传的题')
      }
    }

    return {
      item,
      total,
      params,
      TOPICTYPE,
      topicFlag,
      courseList,
      activeNames,
      optionTopicRef,
      handleSelectAll,
      add,
      del,
      edit,
      copy,
      batchDel,
      handleKwaEvent,
      handleChildData,
      handleSizeChange,
      getClassroomLibList ,
      handleCurrentChange,
      massUpload,
      privilege,
      Delete,
      Plus,
      Upload,
      pathData,
    }
  }
})
</script>
<style>
.classroomLib-lib .el-collapse-item__header {
  height: 60px !important;
}
</style>
<style scoped>
.classroomLib-lib {
  padding: 0 20px 20px 20px;
  background: #fff;
  position: relative;
  box-sizing: border-box;
  height: 100%;
}

.topic-header {
  text-align: left;
  line-height: 25px;
  width: 98%;
  height: 25px;
  font-size: 14px;
  font-weight: bold;
}

.topic-kwa {
  width: 98%;
  height: 25px;
  line-height: 25px;
}

.cpirse-lib-btn {
  padding: 10px 0;
}

.topic-item {
  text-align: left;
  padding: 0 10px;
  border-radius: 5px;
  position: relative;
  margin-left: 11px;

  .topic-title {
    font-size: 14px;
  }

  .topic-item-icon {
    position: absolute;
    right: 0;
    width: 60px;
    font-size: 18px;
    color: #103ccc;
  }

  .topic-answer-item {
    font-size: 14px;

    span {
      font-size: 12px;
      margin-left: 8px;
      color: #409eff;
    }
  }
}
.pagination {
  margin-top: 10px;
}
</style>