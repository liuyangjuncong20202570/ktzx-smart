<template>
  <div class="cpirse-topic">
    <div class="topic-content">
      <h3>{{ headline }}</h3>

      <el-input placeholder="题目title，请填写" style="margin-bottom: 10px;" v-model="item.title">
      </el-input>

      <Wangeditor ref="wangeditor" :data="item.content" @change="handleRichEditorChange" />
      
      <template v-if="headline === '填空题'" >
        <el-button 
          @click="insertContent"
          type="text"
        >插入填空符</el-button>
        <div style="width: 320px" v-for="(option, index) in gapFillingOptions" :key="index">
          <div class="flex-between" style="margin: 5px 0;">
            <div class="option-left flex-start">
              <el-input v-model="option.itemContent" placeholder="请输入答案" />
            </div>
            <div class="option-right flex-between cursor-pointer" style="width: 30px">
              <Hint @save="(val) => {
                option.itemAnalysis = val
              }" :item="option" />
            </div>
          </div>
          <div v-if="option.itemAnalysis" class="option-hint">提示:{{ option.itemAnalysis }}</div>
        </div>
      </template>
      

      <Kwa :defaultValue="keaData" type="courseLibaAdd" @kwa-event="handleKwaEvent" />

      <el-input
        v-if="['编程题', '简答题'].includes(headline)"
        placeholder="请输入建议答案"
        v-model="item.answer"
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
    const { questionTypeId, title, id, kwas, content, answers, answer } = props?.item
    const item = ref({})
    const headline = ref(TOPICTYPE[questionTypeId] ?? '预留题')
    const options = ref([])
    const gapFillingOptions = ref([])
    const wangeditor = ref(null)
    const keaData = ref([])
    item.value = {
      ...item.value,
      title,
      questionTypeId,
      content,
      answer
    }

    // 添加题默认值
    const topicDefaultValue = {
      name: 'A',
      itemAnalysis: '',
      itemPicture: '',
      itemContent: '',
      isAnswer: false
    }
    
    const insertContent = () => {
      if (wangeditor.value) wangeditor.value.insertText()
    }

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
      gapFillingOptions.value = answers.map((answer) => {
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
      if (res?.data) {
        const optionItem = {
          itemAnalysis: '',
          itemContent: '',
          isAnswer: true
        }
        const contentItems = res.data.split(/___/).length - 1
        if (contentItems != gapFillingOptions.value.length) {
          gapFillingOptions.value = []
          for(let i = 0; i < contentItems; i++) {
            gapFillingOptions.value.push({ ...optionItem })
          }
        }
      }
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
            itemAnalysis,
            itemContent,
            itemPicture,
            isAnswer: isAnswer ? 1 : 0
          }
        })
      }

      if (['填空题'].includes(headline.value)) {
        if (!gapFillingOptions.value.length) {
          return ElMessage.error('请添加填空题下划线')
        }
        for(let i = 0; i < gapFillingOptions.value.length; i++) {
          const gapFillingItem = gapFillingOptions.value[i]
          if (!gapFillingItem.itemContent) {
            return ElMessage.error('请检查填空题答案为必填')
          }
        }
        item.value.answers = gapFillingOptions.value.map(option => {
          const { isAnswer, itemAnalysis, itemContent } = option
          return {
            isAnswer: isAnswer ? 1 : 0,
            itemAnalysis,
            itemContent,
          }
        })
      }
      
      // 根据题判断
      const isAnswers = options.value.map((item) => item.isAnswer)
      console.log('isAnswers', isAnswers)
      const num = countOccurrences(isAnswers, true)
      if (headline.value === '单选题') {
        if (num === 0) {
          return ElMessage.error(`${headline.value}必须有一个正确答案`)
        }
        if (num > 1) {
          return ElMessage.error(`${headline.value}只能有一个正确答案`)
        }
      } else if (headline.value === '多选题' || headline.value === '判断题') {
        if (num === 0) {
          return ElMessage.error(`${headline.value}必须有一个正确答案`)
        }
      }
      console.log('item.value', item.value)
      // 添加、更新题接口
      const api = !item.value.id ? addCourseLib : courseLibEdit
      api(item.value).then(res => {
        if (res.code === '200') {
          ElMessage.success(item.value.id ? '修改成功' : '添加成功')
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
      gapFillingOptions,
      headline,
      plus,
      del,
      save,
      handleClose,
      handleRichEditorChange,
      handleKwaEvent,
      keaData,
      wangeditor,
      insertContent,
    };
  }
});
</script>

<style scoped>
.cpirse-topic {
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 10px;
  box-shadow: 0px 1px 13px #a9a9a9;
  padding: 0 10px 10px 10px;
  border-radius: 5px;
}

h3 {
  padding: 10PX 0;
  margin: 0;
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
  font-size: 13px;
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