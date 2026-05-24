<template>
  <ElSelectV2 v-model="value" :options="options || []">
    <template v-for="(_, slotName) in slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </ElSelectV2>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue';
import { ElSelectV2 } from 'element-plus';

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

const props = defineProps<{
  modelValue?: string | undefined | number | null | Array<string | number>;
  options?: Option[];
}>();

const emit = defineEmits<{
  'update:modelValue': [
    modelValue: string | undefined | number | null | Array<string | number>,
  ];
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const slots = useSlots();

defineExpose({
  getValue() {
    return value.value;
  },
});
</script>
