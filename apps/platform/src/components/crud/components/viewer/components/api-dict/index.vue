<template>
  <span class="reader-api-dict">
    <template v-if="loading">
      <span class="loading-text">加载中...</span>
    </template>
    <template v-else-if="displayValue !== undefined">
      {{ displayValue }}
    </template>
    <span v-else class="empty-value">--</span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: string | number | null | undefined;
    fieldName?: string;
    schema?: any;
    data?: Record<string, any>;
    code?: string;
    labelField?: string;
    valueField?: string;
  }>(),
  {
    labelField: 'label',
    valueField: 'value',
  },
);

const options = ref<any[]>([]);
const loading = ref(false);

const displayValue = computed(() => {
  if (loading.value || !options.value.length) {
    return undefined;
  }
  if (props.value === undefined || props.value === null) {
    return undefined;
  }
  const option = options.value.find(
    (opt) => opt[props.valueField] === props.value,
  );
  return option ? option[props.labelField] : props.value;
});

const fetchDict = async () => {
  if (!props.code) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const dictModule = await import('#/store/modules/dict');
    const dictStore = dictModule.useDictStore();
    const data = await dictStore.getDictByType(props.code);
    options.value = data;
  } catch {
    options.value = [];
  } finally {
    loading.value = false;
  }
};

watch(() => props.code, fetchDict, { immediate: true });
</script>

<style lang="scss" scoped>
.reader-api-dict {
  .loading-text {
    color: #94a3b8;
  }

  .empty-value {
    color: #94a3b8;
  }
}
</style>
