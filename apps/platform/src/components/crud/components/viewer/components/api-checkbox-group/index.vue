<template>
  <span class="reader-api-checkbox-group">{{ displayValue ?? '--' }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';

const props = defineProps<{
  value?: (string | number)[] | null;
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

const displayValue = computed(() => {
  if (!options.value.length || !props.value?.length) return null;
  return props.value
    .map((v) => {
      const opt = options.value.find((o: any) => o[valueField.value] == v);
      return opt ? opt[labelField.value] : v;
    })
    .join(', ');
});

const fetchDict = async () => {
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

watch(() => props.code, fetchDict);
onMounted(fetchDict);
</script>
