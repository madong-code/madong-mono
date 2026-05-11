<template>
  <ElUpload
    :http-request="customRequest"
    :show-file-list="false"
    class="m-upload"
    :class="`is-${shape}`"
    list-type="picture-card"
    v-bind="$attrs"
  >
    <div v-if="displayUrl" class="m-avatar-wrap" :class="`is-${shape}`">
      <span class="m-avatar-icon-delete" @click="handleRemove">✕</span>
      <img :src="displayUrl" width="100%" />
    </div>
    <span v-else>+</span>
  </ElUpload>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElUpload, ElMessage } from 'element-plus'

const props = withDefaults(
  defineProps<{
    value?: string
    shape?: 'circle' | 'square'
  }>(),
  {
    value: '',
    shape: 'square',
  },
)

const emit = defineEmits<{
  'update:value': [value: string]
}>()

const displayUrl = computed(() => props.value)

const customRequest = async (e: any) => {
  try {
    const { requestClient } = await import('#/api/request')
    const formData = new FormData()
    formData.append('file', e.file)
    const data = await requestClient.post('/file/upload', formData)
    const url = data?.base_path || data?.url || ''
    emit('update:value', url)
  } catch {
    ElMessage.error('头像上传失败')
  }
}

const handleRemove = (e: Event) => {
  e.stopPropagation()
  emit('update:value', '')
}
</script>

<style scoped>
.m-avatar-wrap {
  position: relative;
  height: 102px;
  overflow: hidden;
}
.m-avatar-wrap.is-circle {
  border-radius: 50%;
}
.m-avatar-wrap.is-square {
  border-radius: 8px;
}
.m-avatar-icon-delete {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  z-index: 10;
  font-size: 12px;
}
.m-avatar-wrap img {
  height: 100%;
  object-fit: cover;
}
.m-upload :deep(.el-upload--picture-card) {
  width: 102px;
  height: 102px;
}
.m-upload.is-circle :deep(.el-upload--picture-card) {
  border-radius: 50%;
}
.m-upload.is-square :deep(.el-upload--picture-card) {
  border-radius: 8px;
}
</style>
