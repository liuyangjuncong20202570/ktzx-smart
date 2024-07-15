<template>
  <div class="cpirse-topic">
    <div class="topic-content">
      <h3>{{ headline }}</h3>

      <el-input placeholder="题目title，请填写" style="margin-bottom: 10px;" v-model="item.title">
      </el-input>

      <Wangeditor :data="item.content" @change="handleRichEditorChange" />

      <el-button v-if="headline === '填空题'" @click="(() => {
        item.content = `<div>${item.content}___</div>`
      })" type="text">插入填空符</el-button>

      <Kwa :defaultValue="keaData" type="courseLibaAdd" @kwa-event="handleKwaEvent" />

      <el-input
        v-if="headline === '填空题'"
        disabled
        style="width: 100%;margin-bottom: 10px;"
        :rows="4"
        type="textarea"
      />

      <div 
        v-if="['判断题', '单选题', '多选题'].includes(headline)" 
        class="topic-option" 
        v-for="(option, index) in options" :key="index"
      >
        <div class="flex-between">
          <div class="option-left flex-start">
            {{ option.name }}: <el-input v-model="option.itemContent" placeholder="请输入选项" />
          </div>
          <div class="option-right flex-between cursor-pointer">
            <el-icon @click="plus">
              <Plus />
            </el-icon>
            <el-icon @click="del(index)">
              <Minus />
            </el-icon>
            <ImageUpload :item="option" />
            <Hint :item="option" />
            <el-checkbox label="正确答案" v-model="option.isAnswer"></el-checkbox>
          </div>
        </div>
        <div v-if="option.itemAnalysis" class="option-hint">提示:{{ option.itemAnalysis }}</div>
      </div>

      <div class="topic-right">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Plus, Minus, Picture, Tickets } from '@element-plus/icons-vue'
import { defineComponent, ref, watch } from 'vue';
import Kwa from '@/components/kwa/index.vue'
import Hint from './components/hint/index.vue'
import ImageUpload from './components/imageUpload/index.vue'
import Wangeditor from '@/views/page/components/wangeditor/index.vue'
import { ElMessage } from 'element-plus'
import { addCourseLib, courseLibEdit } from '@/api/courseLib.js'
import { TOPICTYPE } from '@/utils/consts.js'
export default defineComponent({
  components: {
    Kwa,
    Hint,
    Plus,
    Minus,
    Picture,
    Tickets,
    Wangeditor,
    ImageUpload,
  },
  props: ['item'],
  setup(props, { emit }) {
    console.log('topic-props', props)
    const { questionTypeId, title, id, kwas, content, answers } = props?.item
    const item = ref({})
    const headline = ref(TOPICTYPE[questionTypeId] ?? '预留题')
    const options = ref([])
    const keaData = ref([])
    item.value = {
      ...item.value,
      title,
      questionTypeId,
      content
    }

    // 添加题默认值
    const topicDefaultValue = {
      name: 'A',
      itemAnalysis: '',
      itemPicture: '',
      itemContent: '',
      isAnswer: false
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })

    const resetName = () => {
      options.value.forEach((option, i) => {
        option.name = String.fromCharCode('A'.charCodeAt() + i)
      })
    }

    // 编辑
    if (id) {
      item.value = {
        id,
        ...item.value,
      }
      options.value = answers.map((answer) => {
        return {
          ...answer,
          isAnswer: answer.isAnswer ? true : false
        }
      })
      keaData.value = kwas
      resetName()
      console.log('edit-item', item)
    } else {
      const NUM = {
        '单选题': 4,
        '多选题': 4,
        '判断题': 2,
      }
      const num = NUM[headline.value]
      // 单选多选默认生成四个选项
      if (num) {
        for(let i = 0; i < num; i++) {
          options.value.push({ ...topicDefaultValue })
          resetName()
        }
      }
    }
    // 富文本
    const handleRichEditorChange = (res) => {
      console.log('handleRichEditorChange', res)
      item.value.content = res.data
    }

    // 添加题
    const plus = () => {
      options.value.push(
        { ...topicDefaultValue }
      )
      resetName()
    }
    // 删除题
    const del = (i) => {
      if (!i) return
      options.value.splice(i, 1)
      resetName()
    }

    const countOccurrences = (arr, num) => {
      let count = 0;
      for (let item of arr) {
        if (item === num) {
          count++;
        }
      }
      return count;
    }

    const save = () => {
      // 去除选项多余数据
      const flag = ['单选题', '多选题', '判断题'].includes(headline.value)
      if (options.value && options.value.length && flag) {
        item.value.answers = options.value.map(option => {
          const { isAnswer, itemAnalysis, itemContent, itemPicture } = option
          return {
            isAnswer,
            itemAnalysis,
            itemContent,
            itemPicture,
            isAnswer: option.isAnswer ? 1 : 0
          }
        })
      }
      
      // 根据题判断
      const isAnswers = options.value.map((item) => item.isAnswer)
      console.log('isAnswers', isAnswers)
      const num = countOccurrences(isAnswers, true)
      if (headline.value === '单选题' || headline.value === '判断题') {
        if (num === 0) {
          return ElMessage.error(`${headline.value}必须有一个正确答案`)
        }
        if (num > 1) {
          return ElMessage.error(`${headline.value}只能有一个正确答案`)
        }
      } else if (headline.value === '多选题') {
        if (num === 0) {
          return ElMessage.error(`${headline.value}必须有一个正确答案`)
        }
      }
      console.log('item.value', item.value)
      // 添加、更新题接口
      const api = !item.value.id ? addCourseLib : courseLibEdit
      api(item.value).then(res => {
        if (res.code === '200') {
          ElMessage.success(item.id ? '修改成功' : '添加成功')
          emit('save')
        }
      })
    }
    const handleClose = () => {
      emit('close')
    }

    const handleKwaEvent = (obj) => {
      item.value.kwas = obj
      console.log('kwa-add', obj)
    }

    return {
      item,
      options,
      headline,
      plus,
      del,
      save,
      handleClose,
      handleRichEditorChange,
      handleKwaEvent,
      keaData
    };
  }
});
</script>

<style scoped>
.cpirse-topic {
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 10px;
  box-shadow: 0px 1px 13px #a9a9a9;
  padding: 10px;
  border-radius: 5px;
}

.topic-content {
  /* width: 500px;
  text-align: right; */
  text-align: left;
}

.topic-option {
  width: 500px;
  margin-bottom: 5px;
}

.option-left {
  width: 280px;
}

.option-hint {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.option-right {
  width: 160px;
  color: #3c2eff;
}

.topic-right {
  text-align: right;
}
</style>