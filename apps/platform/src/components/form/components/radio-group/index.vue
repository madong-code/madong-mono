<template>
  <ElRadioGroup v-model="value">
    <template v-if="isBtn">
      <ElRadioButton
        :size="size"
        v-for="item in options || []"
        :key="item.value + ''"
        :value="item.value"
        >{{ item.label }}</ElRadioButton
      >
    </template>
    <template v-else>
      <ElRadio
        :size="size"
        v-for="item in options || []"
        :key="item.value + ''"
        :value="item.value"
        >{{ item.label }}</ElRadio
      >
    </template>
  </ElRadioGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElRadioButton, ElRadio, ElRadioGroup } from 'element-plus';

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

const props = defineProps<{
  modelValue?: string | number | boolean | undefined;
  options?: Option[];
  isBtn?: boolean;
  size?: 'default' | 'small' | 'large' | undefined;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean | undefined];
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

defineExpose({
  getValue() {
    return value.value;
  },
});
</script>
