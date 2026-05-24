<template>
  <span class="reader-select">
    <template v-if="displayLabel !== undefined">
      {{ displayLabel }}
    </template>
    <span v-else class="empty-value">--</span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: string | number | null | undefined | (string | number)[];
    fieldName?: string;
    schema?: any;
    data?: Record<string, any>;
    options?: {
      label: string;
      value: string | number;
    }[];
    multiple?: boolean;
    code?: string;
    labelField?: string;
    valueField?: string;
  }>(),
  {
    multiple: false,
    labelField: 'label',
    valueField: 'value',
  },
);

const treeOptions = ref<{ label: string; value: string | number }[]>([]);

const displayLabel = computed(() => {
  const allOptions = props.options || treeOptions.value;

  if (!allOptions || !allOptions.length) {
    return props.value;
  }
  if (props.value === undefined || props.value === null) {
    return undefined;
  }
  if (Array.isArray(props.value)) {
    const labels = props.value.map((val) => {
      const option = allOptions!.find((opt) => opt.value === val);
      return option ? option.label : val;
    });
    return labels.join(', ');
  }
  const option = allOptions.find((opt) => opt.value === props.value);
  return option ? option.label : props.value;
});

const fetchTreeOptions = async () => {
  if (!props.code) return;

  try {
    const dictStore = await import('@vben/stores').then((m) =>
      m.useDictStore(),
    );
    const dict = await dictStore.getDict(props.code);
    treeOptions.value = dict.map((item: any) => ({
      label: item[props.labelField],
      value: item[props.valueField],
    }));
  } catch {
    treeOptions.value = [];
  }
};

watch(() => props.code, fetchTreeOptions);
watch(
  () => props.value,
  () => {},
);

onMounted(fetchTreeOptions);
</script>

<style lang="scss" scoped>
.reader-select {
  .empty-value {
    color: #94a3b8;
  }
}
</style>
