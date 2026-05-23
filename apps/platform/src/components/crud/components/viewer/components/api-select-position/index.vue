<template>
  <span class="reader-api-select-position">
    <template v-if="loading">
      <span class="loading-text">加载中...</span>
    </template>
    <template v-else>{{ displayValue }}</template>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: string | string[] | null;
    fieldName?: string;
    schema?: any;
    data?: Record<string, any>;
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

const fetchList = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const { PostService } = await import('#/api/setting/post');
    const res: any = await PostService.list();
    const list = Array.isArray(res) ? res : res?.items || res?.list || [];
    const map = new Map<string, string>();
    list.forEach((p: any) => map.set(String(p[props.rowKey]), p.name));
    nameMap.value = map;
  } catch {
    nameMap.value = new Map();
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchList();
});
</script>

<style lang="scss" scoped>
.reader-api-select-position {
  .loading-text {
    color: #94a3b8;
  }
}
</style>
