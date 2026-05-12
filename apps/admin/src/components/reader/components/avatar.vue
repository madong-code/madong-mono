<template>
  <span class="reader-avatar">
    <template v-if="value">
      <img :src="value" alt="avatar" class="avatar-img" />
    </template>
    <span v-else class="empty-value">--</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: string | null | undefined
    fieldName?: string
    schema?: any
    data?: Record<string, any>
  }>(),
  {},
)
</script>

<style lang="scss" scoped>
.reader-avatar {
  display: inline-flex;
  align-items: center;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.empty-value {
  color: #94a3b8;
}
</style>
