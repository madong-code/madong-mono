<template>
  <span class="reader-checkbox-group">
    <template v-if="displayLabels.length > 0">
      {{ displayLabels.join(', ') }}
    </template>
    <span v-else class="empty-value">--</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: (string | number)[] | string | null | undefined;
    fieldName?: string;
    schema?: any;
    data?: Record<string, any>;
    options?: {
      label: string;
      value: string | number;
    }[];
  }>(),
  {},
);

const displayLabels = computed(() => {
  if (!props.options || !props.options.length) {
    return [];
  }

  let values: (string | number)[] = [];
  if (Array.isArray(props.value)) {
    values = props.value;
  } else if (typeof props.value === 'string') {
    values = props.value.split(',');
  } else if (props.value !== undefined && props.value !== null) {
    values = [props.value];
  }

  return values
    .map((val) => {
      const option = props.options!.find((opt) => opt.value === val);
      return option ? option.label : val;
    })
    .filter(Boolean);
});
</script>

<style lang="scss" scoped>
.reader-checkbox-group {
  .empty-value {
    color: #94a3b8;
  }
}
</style>
