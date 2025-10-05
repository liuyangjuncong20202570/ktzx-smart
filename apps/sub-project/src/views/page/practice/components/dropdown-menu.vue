<script setup lang="ts">
import { inject, ref } from 'vue'

// 使用默认值防止 undefined
const dropdownContext = inject('dropdownContext', { collectionRef: ref(null) })
const { collectionRef } = dropdownContext

// 使用 collectionRef 的地方需要添加可选链操作符
const handleSomeAction = () => {
  collectionRef?.value?.someMethod?.()
}
</script> 