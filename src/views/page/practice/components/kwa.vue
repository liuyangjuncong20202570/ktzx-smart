<!--
 * @Date: 2024-07-17 10:38:46
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-19 13:46:37
 * @FilePath: \smarttt_ktzx\src\views\page\practice\components\kwa.vue
-->
<template>
  <el-form :model="kwaForm" label-width="auto" class="custom-form">
    <el-form-item label="关键字" prop="key">
      <el-radio-group v-model="kwaForm.key">
        <el-radio :value="item.keyId" :label="item.keyId" v-for="item in kwaArr" :key="item.keyId" @change="radioChange">{{ item.name }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="能力" prop="kwaId" v-if="kwaForm.key">
      <el-radio-group v-model="kwaForm.kwaId">
        <el-radio :value="item.kwaId" :label="item.kwaId" v-for="item in kwaIdArr" :key="item.kwaId" @change="kwaChange(item.fullName,item.name)">{{ item.name }}</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
  import { onMounted,reactive} from "vue";
  import { ElMessage } from 'element-plus';
  import {kwaTree } from "@/api/practice/index.ts";
  import { KwaVO,KwaDataVO } from "@/api/practice/type.ts";
  const kwaForm = reactive<KwaDataVO>({
    key:'',
    kwaId:'',
    fullName:'',
    name:''
  })
  const kwaArr = reactive<KwaVO>([])
  const kwaIdArr = reactive<KwaVO>([])
  const props = defineProps({
    kwaId: {
      type: String,
      default: "",
    },
  });
  // 定义计算属性
  // const kwaIdValue = computed(() => props.kwaId)

  const radioChange = (value: string)=>{
    kwaForm.kwaId = ''
    const kwaId = kwaArr.filter((item: { keyId: string; })=> item.keyId == value)[0].abilityList
    kwaIdArr.length = 0
    kwaIdArr.push(...kwaId)
  }
  const kwaChange = (fullName: string,name: string)=>{
    kwaForm.fullName = fullName
    kwaForm.name = name
  }

  const getKwaData = async ()=>{
    const res = await kwaTree()
    if (res.code==200&&res.data.length>0) {
      kwaArr.length = 0
      kwaArr.push(...res.data)
    }
    if (props.kwaId) {
      res.data.forEach((item:any)=>{
        item.abilityList.forEach((item1:any)=>{
          if (item1.kwaId==props.kwaId) {
            kwaForm.key = item.keyId
            kwaForm.kwaId = item1.kwaId
            kwaForm.fullName = item1.fullName
            kwaForm.name = item1.name
          }
        })
        const isRightAbilityList:boolean = item.abilityList.some((item2:any)=>item2.kwaId==props.kwaId)
        if (isRightAbilityList) {
          kwaIdArr.length = 0
          kwaIdArr.push(...item.abilityList)
        }
      })
    }
  }
  const getFromValue = async ()=>{
    if (!kwaForm.key) {
      ElMessage({
        message: '请选择关键字',
        type: 'error',
      })
      return false
    }
    if (!kwaForm.kwaId) {
      ElMessage({
        message: '请选择能力',
        type: 'error',
      })
      return false
    }
    return kwaForm
  }
  defineExpose({getFromValue})
  onMounted(()=>{
    getKwaData()
  })
</script>
<style>
.custom-form .el-radio__label{
  font-size: 14px;
  font-weight: normal;
}
</style>