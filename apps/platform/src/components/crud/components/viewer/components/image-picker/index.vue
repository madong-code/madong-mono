<template>
  <div class="reader-image-picker">
    <template v-if="images.length">
      <img v-for="(img, i) in images" :key="i" :src="img" class="preview-img" />
    </template>
    <span v-else class="empty-value">--</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value?: string | string[] | null;
  fieldName?: string;
  schema?: any;
  data?: Record<string, any>;
}>();

const images = computed(() => {
  if (!props.value) return [];
  return Array.isArray(props.value)
    ? props.value.filter(Boolean)
    : [props.value].filter(Boolean);
});
</script>

<style lang="scss" scoped>
.preview-img {
  width: 40px;
  height: 40px;
  margin-right: 4px;
  object-fit: cover;
  border-radius: 4px;
}

.empty-value {
  color: #94a3b8;
}
</style>
