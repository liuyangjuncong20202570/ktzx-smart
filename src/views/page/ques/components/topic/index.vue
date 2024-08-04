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
            <!-- <Hint :item="option" /> -->
            <!-- <el-checkbox label="正确答案" v-model="option.isAnswer"></el-checkbox> -->
          </div>
        </div>
        <!-- <div v-if="option.itemAnalysis" class="option-hint">提示:{{ option.itemAnalysis }}</div> -->
      </div>

      <div class="topic-right">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Plus, Minus, Picture, Tickets } from '@element-plus/icons-vue'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import Hint from './components/hint/index.vue'
import ImageUpload from './components/imageUpload/index.vue'
import Wangeditor from '@/views/page/components/wangeditor/index.vue'
import { ElMessage } from 'element-plus'
import { queFormEdit, queFormUpdate } from '@/api/ques.js'
import { TOPICTYPE } from '@/utils/consts.js'
export default defineComponent({
  components: {
    Hint,
    Plus,
    Minus,
    Picture,
    Tickets,
    Wangeditor,
    ImageUpload,
  },
  props: ['item', 'courseList', 'name'],
  setup(props, { emit }) {
    console.log('topic-props', props)
    let {  courseList = [], name = '' } = props
    const { typeId, title, content, items = [] } = props?.item
    const item = ref({})
    const headline = ref(TOPICTYPE[typeId] ?? '预留题')
    const options = ref([])
    const routes = useRouter()
    const route = routes.currentRoute.value
    const id = route.query?.id
    // const keaData = ref([])
    item.value = {
      ...props?.item,
      title,
      typeId,
      content
    }
    console.log('item----------', item.value)

    // 添加题默认值
    const topicDefaultValue = {
      name: 'A',
      itemAnalysis: '',
      itemPicture: '',
      itemContent: '',
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })

    const setName = (val) => {
      name = val
    }

    const resetName = () => {
      options.value.forEach((option, i) => {
        option.name = String.fromCharCode('A'.charCodeAt() + i)
      })
    }

    // 编辑
    if (item.value.id) {
      item.value = {
        id,
        ...item.value,
      }
      options.value = items.map((answer) => {
        return {
          ...answer
        }
      })
      // keaData.value = kwas
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

    const save = () => {
      // 去除选项多余数据
      const flag = ['单选题', '多选题', '判断题'].includes(headline.value)
      if (options.value && options.value.length && flag) {
        item.value.items = options.value.map((option, i) => {
          const { itemAnalysis, itemContent, itemPicture } = option
          return {
            // isAnswer,
            itemOption: i + 1,
            // itemAnalysis,
            itemContent,
            itemPicture,
          }
        })
      }
      
      const _courseList = [ ...courseList ]
      // 删除自定义标识
      if ([true, false].includes(item.value?.topicFlag)) {
        delete item.value.topicFlag
      }
      if (item.value.id) {
        const idx = _courseList.findIndex((course) => course.id === item.value.id)
        if (idx != -1) _courseList[idx] = item.value
      } else {
        _courseList.unshift(item.value)
      }
      const api = id ? queFormUpdate : queFormEdit
      api({
        id: id ? id : undefined,
        topics: _courseList,
        name
      }).then(res => {
        if (res.code === '200') {
          ElMessage.success(id ? '修改成功' : '添加成功')
          emit('save', id ? null : res.data)
        }
      })
    }
    const handleClose = () => {
      emit('close')
    }

    return {
      item,
      options,
      headline,
      setName,
      plus,
      del,
      save,
      handleClose,
      handleRichEditorChange,
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
  width: 350px;
  margin-top: 10px;
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
  width: 55px;
  color: #3c2eff;
}

.topic-right {
  text-align: right;
}
</style>