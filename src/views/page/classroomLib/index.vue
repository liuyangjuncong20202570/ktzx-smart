<template>
  <div class="cpirse-lib">
    <Header title="题库管理" />

    <Kwa type="search" @kwa-event="handleKwaEvent" />

    <div class="cpirse-lib-btn flex-between">
      <el-checkbox label="全选" @change="handleSelectAll"></el-checkbox>
      <div>
        <el-button type="primary" @click="add">新增题目</el-button>
        <el-button type="danger" @click="batchDel">批量删除</el-button>
        <el-button type="primary">批量导入</el-button>
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
      <el-collapse-item v-for="(course, i) in courseList" :key="course.id" :title="`${i+1}、${course.title} (${TOPICTYPE[item?.questionTypeId] ?? '预留题'})`" :name="course.id">
        <div class="topic-item">
          <div class="topic-kwa" v-if="course.answers">
            <span style="margin-right: 20px" v-for="(kwa, kwaIdx) in course.kwas" :key="kwaIdx">{{ kwa.kwaName }}</span>
          </div>
          <div>
            <span class="flex-start">
              <el-checkbox label="" v-model="course.isChecked"></el-checkbox>
              <span class="topic-title">{{ course.title }}</span>
            </span>
            <div class="topic-answer-item" v-for="(answer, answerIdx) in course.answers" :key="answerIdx">
              {{ String.fromCharCode('A'.charCodeAt() + answerIdx) }}: {{ answer.itemContent }}
              <span v-if="answer.isAnswer">正确答案</span>
            </div>
          </div>
          <div class="topic-item-icon flex-between">
            <el-icon @click="edit(course)">
              <Edit />
            </el-icon>
            <el-icon @click="copy(course)">
              <DocumentCopy />
            </el-icon>
            <el-icon @click="del(course)">
              <Delete />
            </el-icon>
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
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { Edit, DocumentCopy, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Kwa from '@/components/kwa/index.vue'
import Header from '../components/header/index.vue'
import Topic from './components/topic/index.vue'
import optionTopic from './components/optionTopic/index.vue'
import { login, classroomLibList, classroomLibCopy, classroomLibDel } from '@/api/classroomLib.js'
import { TOPICTYPE } from '@/utils/consts'

export default defineComponent({
  components: {
    Kwa,
    Topic,
    Header,
    optionTopic,
    Edit,
    DocumentCopy,
    Delete
  },
  setup() {
    onMounted(() => {
      // login().then(res => {
      //   sessionStorage.setItem('token', res?.data)
      //   console.log('res-----', res)
      // })
      getClassroomLibList()
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
    const handleSelectAll = (val) => {
      courseList.value?.forEach((course) => {
        course.isChecked = val
      })
    }
   
    const edit = (answer) => {
      item.value = answer
      topicFlag.value = true
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
      console.log(`${val} items per page`)
    }

    const handleCurrentChange = (val) => {
      params.value.pageIndex = val
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
    return {
      item,
      total,
      params,
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
      TOPICTYPE,
    }
  }
})
</script>

<style scoped>
.cpirse-lib {
  padding: 0 20px 20px 20px;
  background: #fff;
  border-radius: 8px
}

.cpirse-lib-btn {
  padding: 10px 0;
}

.topic-item {
  text-align: left;
  margin: 10px 0;
  /* box-shadow: 0px 1px 13px #a9a9a9; */
  padding: 10px;
  border-radius: 5px;
  width: 600px;
  position: relative;

  .topic-title {
    font-size: 14px;
  }

  .topic-item-icon {
    position: absolute;
    right: 10px;
    bottom: 10px;
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
</style>