<template>
  <span class="reader-api-select">
    <template v-if="loading">加载中...</template>
    <template v-else>{{ displayValue ?? value ?? '--' }}</template>
  </span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { requestClient } from '#/api/request';

const props = withDefaults(
  defineProps<{
    value?: string | number | null;
    fieldName?: string;
    schema?: any;
    data?: Record<string, any>;
    api?: string;
    requestMethod?: 'get' | 'post';
    params?: Record<string, any>;
    labelField?: string;
    valueField?: string;
    resultField?: string;
  }>(),
  {
    requestMethod: 'get',
    labelField: 'label',
    valueField: 'value',
  },
);

const options = ref<any[]>([]);
const loading = ref(false);

const labelField = computed(() => props.labelField || 'label');
const valueField = computed(() => props.valueField || 'value');

const displayValue = computed(() => {
  if (!options.value.length || props.value == null) return null;

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
      data = resultField
        .split('.')
        .reduce((obj: any, key: string) => obj?.[key], res);
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

<style lang="scss" scoped>
.reader-api-select {
  color: inherit;
}
</style>
