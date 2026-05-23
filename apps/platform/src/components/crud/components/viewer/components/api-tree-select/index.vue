<template>
  <span class="reader-api-tree-select">{{
    displayValue ?? value ?? '--'
  }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';

const props = defineProps<{
  value?: string | number | (string | number)[] | null;
  fieldName?: string;
  schema?: any;
  data?: Record<string, any>;
  code?: string;
  labelField?: string;
  valueField?: string;
}>();

const options = ref<any[]>([]);
const labelField = computed(() => props.labelField || 'label');
const valueField = computed(() => props.valueField || 'value');

const flattenTree = (nodes: any[]): any[] => {
  const result: any[] = [];
  for (const n of nodes) {
    result.push(n);
    if (n.children?.length) result.push(...flattenTree(n.children));
  }
  return result;
};

const displayValue = computed(() => {
  if (!options.value.length || props.value == null) return null;
  const flat = flattenTree(options.value);
  const vals = Array.isArray(props.value) ? props.value : [props.value];
  const names = vals.map((v) => {
    const opt = flat.find((o: any) => o[valueField.value] == v);
    return opt ? opt[labelField.value] : v;
  });
  return names.join(', ');
});

const fetchData = async () => {
  if (!props.code) return;
  try {
    const { useDictStore } = await import('@vben/stores');
    const store = useDictStore();
    const list = await store.getDict(props.code);
    options.value = Array.isArray(list) ? list : [];
  } catch {
    options.value = [];
  }
};

watch(() => props.code, fetchData);
onMounted(fetchData);
</script>
