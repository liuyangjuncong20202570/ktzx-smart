<template>
    <div class="title">
        {{ title }}
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    title: {
        type: String,
        default: "title"
    },
})
</script>
<style scoped>
.title {
    font-weight: bold;
    padding: 10px 0;
    text-align: left;
    border-bottom: 1px solid #e1e1e1;
}
</style>