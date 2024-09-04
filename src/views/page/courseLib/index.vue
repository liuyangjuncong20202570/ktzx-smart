<template>
  <div class="cpirse-lib">
    <Header title="题库管理" />

    <Kwa type="courseLibSearch" @kwa-event="handleKwaEvent" />

    <div class="cpirse-lib-btn flex-between">
      <el-checkbox label="全选" @change="handleSelectAll"></el-checkbox>
      <div>
        <template v-if="!(privilege === 'read')">
          <el-button type="primary" @click="add">新增题目</el-button>
          <el-button type="danger" @click="batchDel">批量删除</el-button>
          <el-button type="primary">批量导入</el-button>
        </template>
      </div>
    </div>

    <Topic 
      v-if="topicFlag" 
      :item="item" 
      @save="() => {
        getCourseLibList()
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
          <span class="flex-start">
            <el-checkbox @click.stop label="" v-model="course.isChecked"></el-checkbox>
            {{ `${i+1}、${course.title}(${TOPICTYPE[course?.questionTypeId] ?? '预留题'})` }}
          </span>
        </template>
        <Topic 
          v-if="course.topicFlag"
          :item="course" 
          @save="() => {
            getCourseLibList()
            course.topicFlag = false
          }" 
          @close="() => {
            course.topicFlag = false
          }" 
        />
        <div class="topic-item">
          <div class="topic-kwa" v-if="course.answers">
            <span style="margin-right: 20px" v-for="(kwa, kwaIdx) in course.kwas" :key="kwaIdx">{{ kwa.kwaName }}</span>
          </div>
          <div class="flex-start" v-html="course.content"></div>
          <div v-if="['单选题', '多选题', '判断题'].includes(TOPICTYPE[course.questionTypeId])" class="topic-answer-item" v-for="(answer, answerIdx) in course.answers" :key="answerIdx">
            {{ String.fromCharCode('A'.charCodeAt() + answerIdx) }}: {{ answer.itemContent }}
            <span v-if="answer.isAnswer">正确答案</span>
          </div>
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
import { Edit, DocumentCopy, Delete, Lock } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Kwa from '@/components/kwa/index.vue'
import Header from '../components/header/index.vue'
import Topic from './components/topic/index.vue'
import optionTopic from './components/optionTopic/index.vue'
import NoAccessPermission from '@/views/page/components/noAccessPermission/index.vue'
import { courseLibList, courseLibCopy, courseLibDel, courseLibWR } from '@/api/courseLib.js'
import { TOPICTYPE } from '@/utils/consts'

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
      getCourseLibList()
      getCourseLibWR()
    })
    const item = ref({})
    const topicFlag = ref(false)
    const activeNames = ref([])
    const optionTopicRef = ref(null)
    const courseList = ref(null)
    const total = ref(0)
    const privilege = ref('')
    const params = ref({
      pageIndex: 1,
      pageSize: 20,
    })

    const getCourseLibWR = () => {
      courseLibWR().then(res => {
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
        console.log('courseLibDel', answer)
        courseLibDel(allIds ?? [answer.id]).then(res => {
          if (res.code === '200') {
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            getCourseLibList()
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
        courseLibCopy(answer.id).then(res => {
          if (res.code === '200') {
            ElMessage({
              type: 'success',
              message: '复制成功',
            })
            getCourseLibList()
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
      getCourseLibList()
    }

    const getCourseLibList = () => {
      courseLibList(params.value).then(res => {
        if (res.code === '200') {
          total.value = res?.data?.recordSize ?? 0
          courseList.value = res?.data?.data ?? []
          console.log('courseList.value', courseList.value)
          // 折叠面板默认全部展开
          activeNames.value = courseList.value.map((item) => item.id)
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
      getCourseLibList ,
      handleCurrentChange,
      TOPICTYPE,
      privilege,
    }
  }
})
</script>

<style scoped>
.cpirse-lib {
  padding: 0 20px 20px 20px;
  background: #fff;
  border-radius: 8px;
  position: relative;
  box-sizing: border-box;
  height: 100%;
}

.cpirse-lib-btn {
  padding: 10px 0;
}

.topic-item {
  text-align: left;
  padding: 0 10px;
  border-radius: 5px;
  position: relative;

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