<template>
  <ApiComponent
    v-model="value"
    :component="ElCascader"
    :value-field="valueField"
    :label-field="labelField"
    :children-field="childrenField"
    style="width: 100%"
  />
</template>

<script setup lang="ts">
import ApiComponent from '../api-component/index.vue';
import { computed } from 'vue';
import { ElCascader } from 'element-plus';

const props = withDefaults(
  defineProps<{
    modelValue?: Array<string | number>;
    valueField?: string;
    labelField?: string;
    childrenField?: string;
  }>(),
  {
    modelValue: () => [],
    valueField: 'id',
    labelField: 'name',
    childrenField: 'children',
  },
);

const emit = defineEmits<{
  'update:modelValue': [modelValue: Array<string | number> | undefined];
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
