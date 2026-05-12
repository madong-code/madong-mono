<template>
  <div class="detail-view" :class="wrapperClass">
    <template v-for="(schema, index) in mergedSchema" :key="index">
      <template v-if="!schema.hide && shouldShow(schema)">
        <div 
          :class="['detail-view-item', schema.wrapperClass, schema.formItemClass]"
        >
          <label
            v-if="schema.label && !schema.hideLabel"
            :class="['detail-view-label', schema.labelClass]"
          >
            {{ typeof schema.label === 'function' ? schema.label() : schema.label }}
            <span v-if="schema.required && !schema.hideRequiredMark" class="required-mark">*</span>
          </label>
          <div class="detail-view-value" :class="schema.controlClass">
            <component
              v-if="schema.viewComponent || getViewComponent(schema.component)"
              :is="getViewComponentInstance(schema)"
              :value="resolveValue(schema.fieldName)"
              :field-name="schema.fieldName"
              :schema="schema"
              :data="model"
              v-bind="getViewComponentProps(schema)"
            />
            <span v-else-if="resolveValue(schema.fieldName) !== undefined && resolveValue(schema.fieldName) !== null">
              {{ formatValue(schema, resolveValue(schema.fieldName)) }}
            </span>
            <span v-else class="empty-value">--</span>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { VbenFormSchema } from '#/adapter/form'
import { getComponent as getViewComponent } from './component-map'

const props = withDefaults(
  defineProps<{
    model?: Record<string, any>
    schema: VbenFormSchema[] | (() => VbenFormSchema[])
    wrapperClass?: string
    commonConfig?: {
      labelClass?: string
      controlClass?: string
      wrapperClass?: string
      hideLabel?: boolean
      hideRequiredMark?: boolean
      formItemClass?: string
    }
  }>(),
  {
    model: () => ({}),
    commonConfig: () => ({}),
  },
)

const mergedSchema = computed(() => {
  const schemaList = typeof props.schema === 'function' ? props.schema() : props.schema
  return schemaList.map((item) => ({
    ...props.commonConfig,
    ...item,
  }))
})

const resolveValue = (fieldName: string) => {
  return props.model?.[fieldName]
}

const getViewComponentInstance = (schema: VbenFormSchema) => {
  if (schema.viewComponent) {
    const comp = getViewComponent(schema.viewComponent as string)
    if (comp) return comp
  }
  const componentName = transformComponentName(schema.component as string)
  return getViewComponent(componentName)
}

const transformComponentName = (componentName: string): string => {
  const transformMap: Record<string, string> = {
    Input: 'Input',
    InputPassword: 'Input',
    InputTextarea: 'Input',
    Select: 'Select',
    TreeSelect: 'Select',
    Switch: 'Switch',
    Checkbox: 'Switch',
    CheckboxGroup: 'CheckboxGroup',
    RadioGroup: 'RadioGroup',
    DatePicker: 'DatePicker',
    ApiDict: 'ApiDict',
    ApiSelect: 'ApiSelect',
    ApiRadioGroup: 'ApiRadioGroup',
    ApiCheckboxGroup: 'ApiCheckboxGroup',
    Cascader: 'Cascader',
    ApiCascader: 'ApiCascader',
    Avatar: 'Avatar',
    Upload: 'Upload',
    Editor: 'Editor',
    IconPicker: 'IconPicker',
  }
  return transformMap[componentName] || componentName
}

const getViewComponentProps = (schema: VbenFormSchema) => {
  const viewComponentProps = schema.viewComponentProps || {}
  const componentProps = schema.componentProps || {}
  
  return {
    ...componentProps,
    ...viewComponentProps,
  }
}

const formatValue = (schema: VbenFormSchema, value: any) => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }
  return value
}

const shouldShow = (schema: VbenFormSchema) => {
  if (schema.dependencies?.show !== undefined) {
    if (typeof schema.dependencies.show === 'boolean') {
      return schema.dependencies.show
    }
  }
  if (schema.dependencies?.if !== undefined) {
    if (typeof schema.dependencies.if === 'boolean') {
      return schema.dependencies.if
    }
  }
  return true
}

defineExpose({
  model: props.model,
  schema: mergedSchema,
})
</script>

<style lang="scss" scoped>
.detail-view {
  width: 100%;
  overflow: visible;
  max-height: none;
}

.detail-view.grid-cols-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}

.detail-view-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
  max-width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
}

.grid-cols-12 .detail-view-item {
  margin-bottom: 0;
  grid-column: span 12;
}

.grid-cols-12 .detail-view-item.col-span-1 {
  grid-column: span 1;
}

.grid-cols-12 .detail-view-item.col-span-2 {
  grid-column: span 2;
}

.grid-cols-12 .detail-view-item.col-span-3 {
  grid-column: span 3;
}

.grid-cols-12 .detail-view-item.col-span-4 {
  grid-column: span 4;
}

.grid-cols-12 .detail-view-item.col-span-5 {
  grid-column: span 5;
}

.grid-cols-12 .detail-view-item.col-span-6 {
  grid-column: span 6;
}

.grid-cols-12 .detail-view-item.col-span-7 {
  grid-column: span 7;
}

.grid-cols-12 .detail-view-item.col-span-8 {
  grid-column: span 8;
}

.grid-cols-12 .detail-view-item.col-span-9 {
  grid-column: span 9;
}

.grid-cols-12 .detail-view-item.col-span-10 {
  grid-column: span 10;
}

.grid-cols-12 .detail-view-item.col-span-11 {
  grid-column: span 11;
}

.grid-cols-12 .detail-view-item.col-span-12 {
  grid-column: span 12;
}

.detail-view-label {
  flex-shrink: 0;
  width: 120px;
  padding-right: 12px;
  font-weight: 500;
  color: #64748b;
  text-align: right;
  line-height: 24px;

  .required-mark {
    color: #ef4444;
    margin-left: 4px;
  }
}

.grid-cols-12 .detail-view-label {
  width: auto;
  padding-right: 8px;
  text-align: left;
  flex-shrink: 0;
}

.detail-view-value {
  flex: 1;
  min-width: 0;
  line-height: 24px;
  color: #1e293b;
  word-break: break-all;
  overflow-wrap: break-word;
}

.empty-value {
  color: #94a3b8;
}
</style>
