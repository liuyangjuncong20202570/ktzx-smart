<template>
  <div class="custom-checkbox-group">
    <div v-for="(item, index) in options" :key="index" :class="['checkbox-item', { active: isSelected(item.value) }]" @click="handleClick(item.value)">
      {{ item.label }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  max: {
    type: Number,
    default: Infinity,
  },
  isQuestionType: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue", "change"]);

const isSelected = (value) => {
  return props.modelValue.includes(value);
};

const handleClick = (value) => {
  let newValue = [...props.modelValue];
  const index = newValue.indexOf(value);

  if (props.isQuestionType) {
    // Special handling for question type selection
    if (value === '0') {
      // If clicking "全部", only select "全部"
      newValue = ['0'];
    } else {
      // If clicking other options, remove "全部" if it exists
      newValue = newValue.filter(v => v !== '0');
      if (index === -1) {
        if (props.max && newValue.length >= props.max) {
          newValue.shift();
        }
        newValue.push(value);
      } else {
        newValue.splice(index, 1);
      }
      // If no options are selected, automatically select "全部"
      if (newValue.length === 0) {
        newValue = ['0'];
      }
    }
  } else {
    // Normal checkbox group behavior
    if (index === -1) {
      if (props.max && newValue.length >= props.max) {
        newValue.shift();
      }
      newValue.push(value);
    } else {
      newValue.splice(index, 1);
    }
  }

  emit("update:modelValue", newValue);
  emit("change", newValue);
};
</script>

<style lang="scss" scoped>
.custom-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .checkbox-item {
    padding: 0 10px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #707070;
    line-height: 19px;
    cursor: pointer;
    background: #ffffff;
    border-radius: 13px;
    border: 1px solid #d2d2d2;

    &:hover {
      background: #f5f7fa;
    }

    &.active {
      background: #27a5ff;
      color: white;
      border: 1px solid #27a5ff;
    }
  }
}
</style>
