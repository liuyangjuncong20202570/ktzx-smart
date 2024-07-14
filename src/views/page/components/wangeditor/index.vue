<template>
    <div style="border: 1px solid #ccc; text-align: left;">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="overflow-y: auto; height: 260px;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="onEditorInput"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { host } from '@/api/host.js'
  import '@wangeditor/editor/dist/css/style.css'
  import { ref, watch, onMounted, defineProps } from 'vue'
//   import { appDomain, cdnStorageDomain } from '@/assets/js/config'
  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  import { onBeforeUnmount, shallowRef } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  // import { DomEditor } from '@wangeditor/editor';
  const props = defineProps({
    data: {
      type: String,
      default: ''
    }
  })
  console.log('富文本', props)
  
  const emit = defineEmits(['change']);
  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef()
  // 内容 HTML
  const valueHtml = ref('')
  const mode = ref('default')
  valueHtml.value = props.data ?? ""
  onMounted(() => {
    valueHtml.value = props.data ?? ""
  })
  
  watch(props, (newValue, oldValue) => {
    console.log('值发生了变更', newValue, oldValue);
    valueHtml.value = props.data ?? ""
  });
  
  const toolbarConfig = {
    excludeKeys: ['group-video', 'insertVideo', 'uploadVideo', 'emotion']
  }
  
  const editorConfig = { 
    placeholder: '请输入内容...',
    autoFocus: false,
    MENU_CONF: {
      uploadImage: {
        //上传图片配置
        server: host + '/common/upload', //上传接口地址
        fieldName: 'file', //上传文件名
        methods: 'post',
        metaWithUrl: false, // 参数拼接到 url 上
        meta: {
          tag: 'test',
      },
        // 单个文件上传成功之后
        // onSuccess(file, res) {
        // },
        // 自定义插入图片
        customInsert(res, insertFn) {
          console.log(res, insertFn)
          if (res?.code === '200') {
            insertFn(host + '/static/' + res.data)
          }
          
        },
      },
    }
  }
  
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
  })
  
  const handleCreated = (editor:any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
    /*
    //获取所有可使用的菜单key
    console.log(editor.getAllMenuKeys())
  
    //显示当前菜单key，延迟后才能获取成功
    setTimeout(function(){
      const toolbar = DomEditor.getToolbar(editor)
      const curToolbarConfig = toolbar!.getConfig()
      console.log( curToolbarConfig.toolbarKeys ) // 当前菜单排序和分组
    }, 2000)
    */
  }
  
  const onEditorInput = () => {
    emit('change', {
      data: valueHtml.value
    });
  }
  
  </script>
  
  <style scoped>
  </style>