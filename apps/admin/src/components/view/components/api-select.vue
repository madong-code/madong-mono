<template>
  <ApiView
    v-if="value"
    :options="apiOptions"
    :value-field="valueField"
    :label-field="labelField"
    :children-field="childrenField"
    :value="value"
  />
  <span v-else>{{ value }}</span>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import ApiView from '../api-view.vue'

const props = withDefaults(
  defineProps<{
    value?: string | number | null | Array<string | number> | undefined
    labelField?: string
    valueField?: string
    childrenField?: string
    api?: (arg?: any) => Promise<any[] | Record<string, any>>
    params?: Record<string, any>
  }>(),
  {
    labelField: 'name',
    valueField: 'id',
    childrenField: 'children',
  },
)

const apiOptions = ref<any[]>([])

onBeforeMount(async () => {
  if (props.api) {
    try {
      const data = await props.api(props.params)
      apiOptions.value = Array.isArray(data) ? data : (data as any)?.list || []
    } catch {
      apiOptions.value = []
    }
  }
})
</script>
