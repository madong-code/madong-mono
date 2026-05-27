<template>
  <span class="reader-api-select-dept">
    <template v-if="loading">
      <span class="loading-text">加载中...</span>
    </template>
    <template v-else>
      {{ displayValue }}
    </template>
  </span>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: string | string[] | null;
    fieldName?: string;
    schema?: any;
    data?: Record<string, any>;
    code?: string;
    rowKey?: string;
  }>(),
  {
    rowKey: 'id',
  },
);

const nameMap = ref<Map<string, string>>(new Map());
const loading = ref(false);

const displayValue = computed(() => {
  if (loading.value) return undefined;
  if (!nameMap.value.size || props.value == null || props.value === '')
    return '--';
  const vals = Array.isArray(props.value)
    ? props.value.map(String)
    : String(props.value).split(',');
  return (
    vals
      .filter(Boolean)
      .map((v) => nameMap.value.get(v) || v)
      .join(', ') || '--'
  );
});

const fetchTree = async () => {
  loading.value = true;
  try {
    const { DeptService } = await import('#/api/system/dept');
    const tree: any[] = await DeptService.getTree();
    const map = new Map<string, string>();
    const walk = (nodes: any[]) => {
      for (const n of nodes) {
        map.set(String(n[props.rowKey]), n.name);
        if (n.children?.length) walk(n.children);
      }
    };
    walk(tree);
    nameMap.value = map;
  } catch {
    nameMap.value = new Map();
  } finally {
    loading.value = false;
  }
};

watch(() => props.value, fetchTree, { immediate: true });
</script>

<style lang="scss" scoped>
.reader-api-select-dept {
  .loading-text {
    color: #94a3b8;
  }
}
</style>
