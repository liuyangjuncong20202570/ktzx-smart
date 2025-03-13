<template>
  <div class="classroomLib-lib">
    <Header title="课堂题库" :pathData="pathData" />

    <Kwa type="classroomLibSearch" @kwa-event="handleKwaEvent" />

    <div class="cpirse-lib-btn flex-between" v-if="!(privilege === 'read')">
      <el-checkbox label="全选" @change="handleSelectAll"></el-checkbox>
      <div>
        <el-dropdown placement="bottom" style="margin-right: 10px;">
            <el-button type="primary" :icon="Plus">新增题目</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(item,i) in libTypeList" :key="i"  @click="handleLibTypeConfirm(item)">{{ item.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        <!-- <el-button type="primary" :icon="Plus" @click="add">新增题目</el-button> -->
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
          <div class="flex-start flex-start1" style="flex-wrap: wrap; height: 50px;width: 100%;text-align: left;">
            <el-checkbox @click.stop label="" v-model="course.isChecked"></el-checkbox>
            <div style="width: calc(100% - 30px);">
              <div class="topic-kwa wdd-ellipsis" v-if="course.answers">
                <span class="topic-kwa-item" style="margin-right: 10px;" v-for="(kwa, kwaIdx) in course.kwas" :key="kwaIdx">{{ kwa.kwaName }}</span>
                <span class="topic-kwa-item">{{ `${TOPICTYPE[course?.questionTypeId] ?? "预留题"}` }}</span>
              </div>
              <div class="topic-header wdd-ellipsis">
                {{ `${i+1}、${course.title}` }}
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
              <span class="topic-item-icon-item"> 
                <el-icon title="当前题型已被锁定" style="color: red;"><Lock /></el-icon>
              </span>
            </template>
            <template v-else>
              <span class="topic-item-icon-item">
                <el-icon title="编辑" @click="edit(course)">
                  <Edit />
                </el-icon>
              </span>
              <span class="topic-item-icon-item">
                <el-icon title="复制" @click="copy(course)">
                  <DocumentCopy />
                </el-icon>
              </span>
              <span class="topic-item-icon-item topic-item-icon-item-delete">
                <el-icon title="删除" @click="del(course)">
                  <Delete />
                </el-icon>
              </span>
            </template>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div v-if="!courseList || !courseList.length">暂无数据</div>

    <div class="pagination flex-end">
      <!-- <el-pagination v-model:currentPage="params.pageIndex" v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" /> -->
        <Pagination :pageIndex="params.pageIndex" :pageSize="params.pageSize" :total="total" @update:pageIndex="handleCurrentChange" />
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
import Pagination from "@/views/page/components/pagination/index.vue";
import Topic from './components/topic/index.vue'
import optionTopic from './components/optionTopic/index.vue'
import { classroomLibList, classroomLibCopy, classroomLibDel, upToCourse, classroomLibWR } from '@/api/classroomLib.js'
import { TOPICTYPE } from '@/utils/consts'
import { courseLibType } from '@/api/courseLib.js' 
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
    NoAccessPermission,
    Pagination
  },
  setup() {
    onMounted(() => {
      getClassroomLibList()
      getWR()
      getCourseLibTypeList();
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
    const libTypeList = ref([])
    const getCourseLibTypeList = () => {
      courseLibType().then(res => {
        if (res.code === '200') {
          libTypeList.value = res?.data.filter((item) => item.status)
        }
      })
    }

    const handleLibTypeConfirm = (libType) => {
      item.value = {
        questionTypeId: libType.queTypeId,
      };
      topicFlag.value = true;
    }

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
      libTypeList,
      handleLibTypeConfirm
    }
  }
})
</script>
<style>
.classroomLib-lib .el-collapse-item__header {
  height: 60px !important;
}
.classroomLib-lib .el-collapse-item__wrap {
  margin-top: 10px;
}
.classroomLib-lib .el-collapse-item__wrap {
  /* border-bottom: none; */
  padding-bottom: 20px;
}
.classroomLib-lib .el-collapse-item__header {
  border-bottom: none;
}
.classroomLib-lib .el-collapse {
  border-top: 2px solid rgba(39, 165, 255, 0.5);
}
.classroomLib-lib .el-collapse-item__arrow {
  background: #eeeeee;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
.classroomLib-lib .el-collapse-item__arrow svg {
  color: #313131;
  font-size: 10px;
}
.classroomLib-lib .el-collapse-item__content .bgd-kwa {
 border: none;
}
</style>
<style lang="scss" scoped>
.classroomLib-lib {
  padding: 0 20px 20px 20px;
  background: #fff;
  position: relative;
  box-sizing: border-box;
  height: 100%;
}

.topic-header {
  text-align: left;
  line-height: 30px;
  width: 98%;
  height: 25px;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  color: #1b1b1b;
  font-weight: normal;
}

.topic-kwa {
  width: 98%;
  height: 25px;
  line-height: 25px;
  transform: translateY(5px);
  margin-bottom: 10px;
}

.topic-kwa-item {
  background: #dff2ff;
  border-radius: 5px;
  padding: 3px 10px;
  margin-right: 10px;
  color: #0078cd;
  font-size: 14px;
}

.cpirse-lib-btn {
  padding: 30px 0 10px;
}

.topic-item {
  text-align: left;
  padding: 0 10px;
  border-radius: 5px;
  position: relative;
  margin-left: 11px;
  padding-left: 35px;

  .topic-title {
    font-size: 14px;
  }

  .topic-item-icon {
    position: absolute;
    right: 0;
    font-size: 18px;
    color: #103ccc;
  }

  .topic-answer-item {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #1b1b1b;
    line-height: 30px;

    span {
      font-size: 12px;
      margin-left: 8px;
      color: #019a48;
      background: rgba(50, 177, 108, 0.15);
      border-radius: 5px;
      padding: 3px 10px;
    }
  }
  .topic-course-content {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #1b1b1b;
    line-height: 30px;
  }
}
.flex-start1 {
  align-items: flex-start;
}
.pagination {
  margin-top: 10px;
}
.topic-item-icon-item {
  font-size: 16px;
  color: #fff;
  width: 26px;
  height: 26px;
  text-align: center;
  background: #27a5ff;
  border-radius: 5px;
  display: inline-block;
  margin-left: 10px;
}
.topic-item-icon-item-delete {
  background: #ff4c48;
}
</style>