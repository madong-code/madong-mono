<template>
  <ElInputNumber v-model="value">
    <template v-for="(_, slotName) in slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </ElInputNumber>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue';

const props = defineProps<{
  modelValue: number | undefined | string;
}>();

const emit = defineEmits<{
  'update:modelValue': [modelValue: number | undefined];
}>();

const value = computed({
  get() {
    if (typeof props.modelValue === 'string') {
      return Number(props.modelValue);
    }
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
