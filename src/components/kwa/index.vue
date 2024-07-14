<template>
    <div class="bgd-kwa">
        <el-form label-position="left" :model="form" label-width="60px"  v-if="type !== 'courseLibaAdd'">
            <el-form-item label="关键字 ">
                <el-checkbox-group @change="handleChange" v-model="form.keyIds">
                    <el-checkbox v-for="(value, key, i) in kwaMap?.keyMap" :label="key" :key="i">{{ value }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="能力">
                <el-checkbox-group v-model="form.abilityIds" @change="handleChange">
                    <el-checkbox v-for="(value, key, i) in kwaMap?.abilityMap" :label="key" :key="i">{{ value }}</el-checkbox >
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="题型">
                <el-radio-group v-model="form.queTypeId" @change="handleChange">
                    <el-radio v-for="(item, i) in courseType" :key="i" :label="item.queTypeId">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <el-form v-else label-position="left" :model="form" label-width="60px">
            <el-form-item label="关键字 ">
                <el-checkbox-group @change="handleChange" v-model="form.treeIds">
                    <el-checkbox v-for="(item, i) in kwaTree" :key="i" :label="item.keyId">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="能力" v-if="abilityList && abilityList.length">
                <el-checkbox-group @change="addHandleChange" v-model="form.abilityItems">
                    <el-checkbox v-for="(item, i) in abilityList" :key="i" :label="item">{{ item.name }}</el-checkbox >
                </el-checkbox-group>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, defineEmits  } from 'vue'
import { courseLibKwaMap, courseLibKwaTree, courseLibType } from '@/api/courseLib'
const emit = defineEmits(['child-event'])
const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    defaultValue: {
        type: Array,
        defautl: null
    },
})
console.log('kea-props', props)
const { type, defaultValue } = props
const form = ref({})
const kwaMap = ref(null)
const kwaTree = ref(null)
const courseType = ref(null)
const abilityList = ref([])
const getCourseLibKwa = () => {
    // 列表搜索kwa
    if (type === 'search') {
        courseLibKwaMap().then(res => {
            if (res.code === '200') {
                kwaMap.value = res.data
            }
        })
    }
    // 添加题kwa
    if (type === 'courseLibaAdd') {
        courseLibKwaTree().then(res => {
            if (res.code === '200') {
                kwaTree.value = res.data
                if (defaultValue && defaultValue.length) {
                    // kwaTree.
                    const kwaIds = defaultValue?.map((obj) => obj.kwaId)
                    let kwaTreeArr = kwaTree.value.map((obj) =>{
                        const arr = obj.abilityList.filter((f) => kwaIds.includes(f.kwaId))
                        if (arr && arr.length) {
                            return {
                                keyId: obj.keyId,
                                kwas: arr,
                                abilityList: obj.abilityList
                            }
                        } 
                    })
                    // 过滤掉垃圾数据
                    kwaTreeArr = kwaTreeArr.filter((item) => item)
                    // 能力数据
                    abilityList.value = kwaTreeArr?.map((obj) => {
                        if (obj?.abilityList) return obj.abilityList
                    })?.flat() || []
                    // 关键字回显数据
                    form.value.treeIds = kwaTreeArr?.map((kwa) => kwa?.keyId) || []
                    // 能力回显数据
                    form.value.abilityItems = kwaTreeArr?.map((obj) => {
                        if (obj?.kwas) return obj.kwas
                    })?.flat() || []
                    console.log('form.value.abilityItems', form.value.abilityItems)
                    addHandleChange(form.value.abilityItems)
                }
            }
        })
    }
}
// 题型
const getCourseLibType = () => {
    courseLibType().then(res => {
        if (res.code === '200') {
            courseType.value = res.data
        }
    })
}

const handleChange = () => {
    console.log(form.value)
    // 获取添加kwa能力
    if (type === 'courseLibaAdd' && form.value.treeIds) {
        abilityList.value = []
        form.value.abilityItem = []
        form.value.abilityItems = []
        emit('kwa-event', [])
        form.value.treeIds?.forEach((item) => {
            let list = kwaTree.value.find(kwa => kwa.keyId === item)?.abilityList || []
            abilityList.value = [ ...abilityList.value, ...list ]
            console.log('treeItem', abilityList)
        })
    }

    if (type === 'search') {
        emit('kwa-event', form.value);
    }
    
}
const addHandleChange = (arr) => {
    const newArr = arr?.map((arrItem) => {
        if (arrItem) {
            const { fullName, kwaId } = arrItem
            return {
                kwaName: fullName,
                kwaId
            }
        }
    })
    console.log('newArr', newArr)
    emit('kwa-event', newArr);
}

onMounted(() => {
    getCourseLibKwa()
    getCourseLibType()
})
</script>

<style>
.bgd-kwa .el-form-item {
    margin-bottom: 1px !important;
}
</style>