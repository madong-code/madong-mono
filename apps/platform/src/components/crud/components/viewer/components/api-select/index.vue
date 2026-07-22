<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { requestClient } from '#/api/request';

const props = withDefaults(
  defineProps<{
    api?: string;
    data?: Record<string, any>;
    fieldName?: string;
    labelField?: string;
    params?: Record<string, any>;
    requestMethod?: 'get' | 'post';
    resultField?: string;
    schema?: any;
    value?: null | number | string;
    valueField?: string;
  }>(),
  {
    requestMethod: 'get',
    labelField: 'label',
    valueField: 'value',
    api: '',
    data: () => ({}),
    fieldName: '',
    params: () => ({}),
    resultField: '',
    schema: undefined,
    value: null,
  },
);

const options = ref<any[]>([]);
const loading = ref(false);

const labelField = computed(() => props.labelField || 'label');
const valueField = computed(() => props.valueField || 'value');

const displayValue = computed(() => {
  if (options.value.length === 0 || props.value == null) return null;

  if (Array.isArray(props.value)) {
    const labels = props.value.map((val) => {
      const opt = options.value.find((o: any) => o[valueField.value] == val);
      return opt ? opt[labelField.value] : val;
    });
    return labels.join(', ');
  }

  const opt = options.value.find(
    (o: any) => o[valueField.value] == props.value,
  );
  return opt ? opt[labelField.value] : null;
});

const fetchData = async () => {
  if (!props.api) {
    options.value = [];
    return;
  }

  loading.value = true;
  try {
    const method = props.requestMethod || 'get';
    const res = await (requestClient as any)[method](props.api, {
      params: props.params,
    });
    let data = res;
    if (props.resultField) {
      const resultField = props.resultField;
      let current: any = res;
      for (const k of resultField.split('.')) {
        if (current === null || current === undefined) break;
        current = current[k];
      }
      data = current;
    }
    options.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('[ApiSelect Viewer] 获取数据失败:', error);
    options.value = [];
  } finally {
    loading.value = false;
  }
};

watch(() => props.api, fetchData);
watch(
  () => props.value,
  () => {},
);
onMounted(fetchData);
</script>

<template>
  <span class="reader-api-select">
    <template v-if="loading">加载中...</template>
    <template v-else>{{ displayValue ?? value ?? '--' }}</template>
  </span>
</template>

<style lang="scss" scoped>
.reader-api-select {
  color: inherit;
}
</style>
