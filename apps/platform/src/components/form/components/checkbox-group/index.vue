<template>
  <ElCheckboxGroup v-model="value">
    <template v-if="isBtn">
      <ElCheckboxButton
        :size="size"
        v-for="item in options || []"
        :key="item.value + ''"
        :value="item.value"
        >{{ item.label }}</ElCheckboxButton
      >
    </template>
    <template v-else>
      <ElCheckbox
        :size="size"
        v-for="item in options"
        :key="item.value + ''"
        :value="item.value"
        >{{ item.label }}</ElCheckbox
      >
    </template>
  </ElCheckboxGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElCheckboxButton, ElCheckbox, ElCheckboxGroup } from 'element-plus';

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
  bgColor?: string;
  textColor?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: Array<string | number>;
    options?: Option[];
    isBtn?: boolean;
    size?: 'default' | 'small' | 'large';
  }>(),
  { modelValue: () => [], isBtn: false },
);

const emit = defineEmits<{
  'update:modelValue': [modelValue: Array<string | number> | undefined];
}>();

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

defineExpose({
  getValue() {
    return value.value;
  },
});
</script>
