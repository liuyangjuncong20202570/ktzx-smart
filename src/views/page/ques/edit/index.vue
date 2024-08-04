<template>
  <div class="ques-lib">
    <Header :title=" id ? '编辑问卷' : '新建问卷'" />
    <div class="ques-publish flex-between">
      <div class="flex-start">
        问卷名称: <el-input style="width: 150px;margin-left: 10px;" v-model="name" @input="handleInput"></el-input>
      </div>
    </div>
    <div class="ques-lib-btn flex-between">
      <el-checkbox label="全选" @change="handleSelectAll"></el-checkbox>
      <div>
        <el-button type="text" @click="add">新增题目</el-button>
        <el-button type="danger" @click="batchDel">批量删除</el-button>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="publish">发布</el-button>
      </div>
    </div>

    <Topic 
      v-if="topicFlag" 
      :courseList="courseList"
      ref="topic"
      :item="item" 
      :name="name"
      @save="(data) => {
        if (data) id = data
        getCourseLibList()
        topicFlag = false
      }" 
      @close="() => {
        topicFlag = false
      }" 
    />
    <vuedraggable v-model="courseList" @start="drag = true" @end="drag = false" item-key="index">
      <template #item="{ element, index }">
        <Topic 
          v-if="element.topicFlag" 
          :item="element" 
          :name="name"
          :courseList="courseList"
          @save="() => {
            getCourseLibList()
            element.topicFlag = false
          }" 
          @close="() => {
            element.topicFlag = false
          }" 
        />
        <div class="topic-item" v-else>
          <div>
            <span class="flex-start">
              <el-checkbox label="" v-model="element.isChecked"></el-checkbox>
              <span class="topic-title">{{ element.title }}</span>
            </span>
            <span v-html="element.content"></span>
            <div 
              v-if="['单选题', '多选题', '判断题'].includes(TOPICTYPE[element.typeId])" 
              class="topic-answer-item" 
              v-for="(answer, answerIdx) in element.items" 
              :key="answerIdx"
            >
              {{ String.fromCharCode('A'.charCodeAt() + answerIdx) }}: {{ answer.itemContent }}
              <span v-if="answer.isAnswer">正确答案</span>
            </div>
          </div>
          <div class="topic-item-icon flex-between cursor-pointer">
            <el-icon title="编辑" @click="() => {
              element.topicFlag = true
            }">
              <Edit />
            </el-icon>
            <el-icon title="复制" @click="copy(element, index)">
              <DocumentCopy />
            </el-icon>
            <el-icon title="删除" @click="del(element)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </template>
    </vuedraggable>

    <div v-if="!courseList || !courseList.length">暂无数据</div>

    <!-- 选择题类型弹窗 -->
    <optionTopic ref="optionTopicRef" @childData="handleChildData" />
  </div>
</template>

<script>
import vuedraggable from "vuedraggable"
import { defineComponent, ref, onMounted } from 'vue'
import { Edit, DocumentCopy, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Header from '@/views/page/components/header/index.vue'
import Topic from '../components/topic/index.vue'
import optionTopic from '../components/optionTopic/index.vue'
import { useRouter } from 'vue-router'
import { queFormDetail, deleteTopic, queFormUpdate, quePublish } from '@/api/ques.js'
import { TOPICTYPE } from '@/utils/consts'

export default defineComponent({
  components: {
    Topic,
    Header,
    optionTopic,
    Edit,
    DocumentCopy,
    Delete,
    vuedraggable,
  },
  setup() {
    const routes = useRouter()
    const route = routes.currentRoute.value

    onMounted(() => {
      getCourseLibList()
    })
    const item = ref({})
    const topicFlag = ref(false)
    const optionTopicRef = ref(null)
    const courseList = ref([])
    const name = ref('问卷1')
    const total = ref(0)
    const topic = ref(null)
    const id = ref(route.query?.id ?? '')

    const handleInput = (val) => {
      if (topic?.value) topic.value.setName(val)
    }

    const save = () => {
      queFormUpdate(
        {
          id: id.value,
          topics: courseList.value,
          name: name.value
        }
      ).then(res => {
        if (res.code === '200') {
          ElMessage.success('保存成功')
        }
      })
    }

    const publish = () => {
      ElMessageBox.confirm(
        '确定发布此问卷?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        quePublish(id.value).then(res => {
          if (res.code === '200') {
            ElMessage({
              type: 'success',
              message: '发布成功',
            })
            routes.push('/page/ques/list')
          }
        })
      }).catch((err) => { console.log(err) })
      
    }

    const handleSelectAll = (val) => {
      courseList.value?.forEach((course) => {
        course.isChecked = val
      })
    }
   
    const edit = (answer) => {
      console.log('编辑', answer)
      item.value = answer
      // topic.value.init({ ...answer })
      topicFlag.value = true
    }
    const del = (answer, allIds) => {
      ElMessageBox.confirm(
        `${allIds && allIds.length ? '确定批量删除?' : '确定删除此问卷?'}`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        console.log('deleteTopic', answer)
        deleteTopic(allIds ?? [answer.id]).then(res => {
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
    const copy = (answer, index) => {
      ElMessageBox.confirm(
        '确定复制此问卷?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        // 复制一份避免影响原数据
        const _answer = { ...answer }
        if (_answer.id) delete _answer.id
        if (_answer.qfId) delete _answer.qfId
        if (_answer.items && _answer.items.length) {
          // 数组数据也需要复制，避免污染原数据
          _answer.items = answer.items.map((m) => { return { ...m } })
          _answer.items.forEach((a) => {
            if (a.id) delete a.id
          })
        }
        queFormUpdate({
          id: id.value,
          topics: courseList.value,
          name: name.value
        }).then(res => {
          if (res.code === '200') {
            ElMessage.success('复制成功')
            getCourseLibList()
          }
        })
      }).catch(() => { })
    }
    const add = () => {
      // topicFlag.value = false
      item.value = {}
      if (optionTopicRef.value) {
        optionTopicRef.value.init();
      }
    }

    const batchDel = () => {
      const ids = courseList.value.filter((course) => course.isChecked )?.map((course) => course.id)
      if (ids && ids.length) {
        del(null, ids)
      } else {
        ElMessage.error('请选择要删除的问卷')
      }
    }

    const handleChildData = (id) => {
      item.value = {
        typeId: id
      }
      topicFlag.value = true
      console.log('topicFlag', topicFlag)
    }

    const getCourseLibList = () => {
      if (id.value) queFormDetail(id.value).then(res => {
        if (res.code === '200') {
          name.value = res.data.name
          courseList.value = res?.data?.topics ?? []
        }
      })
    }
    return {
      name,
      item,
      total,
      topicFlag,
      courseList,
      optionTopicRef,
      handleSelectAll,
      add,
      del,
      edit,
      copy,
      batchDel,
      handleChildData,
      getCourseLibList,
      TOPICTYPE,
      topic,
      id,
      save,
      publish,
      handleInput
    }
  }
})
</script>

<style scoped>
.ques-lib {
  padding: 0 20px 20px 20px;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  color: #000000;
}

.ques-publish {
  margin-top: 10px;
}

.ques-lib-btn {
  padding: 10px 0;
}

.topic-item {
  text-align: left;
  margin: 10px 0;
  /* box-shadow: 0px 1px 13px #a9a9a9; */
  border-radius: 5px;
  position: relative;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;

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