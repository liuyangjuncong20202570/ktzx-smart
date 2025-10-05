<template>
    <el-popover :visible="visible" placement="bottom" title="请输入提示文案：" :width="300">
        <el-input v-model="itemAnalysis"></el-input>
        <div style="text-align: right; margin-top: 10PX">
            <el-button size="small" text @click="() => {
                visible = false
                itemAnalysis = ''
            }">取消</el-button>
            <el-button size="small" type="primary" @click="() => {
                item.itemAnalysis = itemAnalysis
                console.log('item.itemAnalysis', itemAnalysis)
                visible = false
                emit('save', itemAnalysis)
            }">
                确定
            </el-button>
        </div>
        <template #reference>
            <el-icon @click="() => {
                itemAnalysis = item.itemAnalysis
                visible = !visible
            }">
                <Tickets />
            </el-icon>
        </template>
    </el-popover>
</template>

<script>
import { ref, defineComponent, watch } from 'vue'
import { Tickets } from '@element-plus/icons-vue'
export default defineComponent({
    components: {
        Tickets,
    },
    props: ['item'],
    setup(props, { emit }) {
        const item = props.item || {}
        watch(props.item, (newValue, oldValue) => {
            console.log('newValue', newValue);
            console.log('oldValue', oldValue);
        });
        const visible = ref(false)
        const itemAnalysis = ref('')
        return {
            visible,
            itemAnalysis,
            item,
            emit
        }
    }
})


</script>

<style scoped></style>