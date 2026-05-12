<template>
  <div
    class="detail-view"
    :class="[
      layoutClass,
      wrapperClass,
    ]"
  >
    <template v-for="(schema, index) in mergedSchema" :key="index">
      <template v-if="!schema.hide && shouldShow(schema)">
        <div
          :class="[
            'detail-view-item',
            isGrid ? 'detail-view-item--grid' : '',
            schema.wrapperClass || itemWrapperClass,
            schema.formItemClass || itemFormClass,
          ]"
        >
          <label
            v-if="schema.label && !(schema.hideLabel || mergedHideLabel)"
            :class="['detail-view-label', labelAlignClass, schema.labelClass || mergedLabelClass]"
            :style="labelStyle"
          >
            {{ typeof schema.label === 'function' ? schema.label() : schema.label }}
          </label>
          <div class="detail-view-value" :class="schema.controlClass || mergedControlClass">
            <component
              v-if="schema.viewComponent || getViewComponent(schema.component as string)"
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
import { computed } from 'vue'
import type { VbenFormSchema } from '#/adapter/form'
import { getComponent as getViewComponent } from './component-map'

const props = withDefaults(
  defineProps<{
    model?: Record<string, any>
    schema: VbenFormSchema[] | (() => VbenFormSchema[])
    wrapperClass?: string
    /** 布局方式：水平/垂直/行内 */
    layout?: 'horizontal' | 'vertical' | 'inline'
    /** 通用配置 */
    commonConfig?: {
      labelClass?: string
      labelWidth?: number
      /** label 对齐方式：left 左对齐 / right 右对齐，默认 right */
      labelAlign?: 'left' | 'right'
      controlClass?: string
      wrapperClass?: string
      hideLabel?: boolean
      hideRequiredMark?: boolean
      formItemClass?: string | (() => string)
    }
  }>(),
  {
    model: () => ({}),
    commonConfig: () => ({}),
    layout: 'horizontal',
  },
)

// 合并 commonConfig 到 schema，并过滤 hideInDetail
const mergedSchema = computed(() => {
  const schemaList = typeof props.schema === 'function' ? props.schema() : props.schema
  return schemaList
    .filter((item) => !item.hideInDetail)
    .map((item) => ({
      ...props.commonConfig,
      ...item,
    }))
})

// 判断是否为网格布局（wrapperClass 包含 grid-cols）
const isGrid = computed(() => {
  const cls = props.wrapperClass || ''
  return cls.includes('grid-cols')
})

// 布局 class
const layoutClass = computed(() => {
  const classes: string[] = []
  if (isGrid.value) {
    classes.push('detail-view--grid')
  }
  if (props.layout === 'vertical') {
    classes.push('detail-view--vertical')
  } else if (props.layout === 'inline') {
    classes.push('detail-view--inline')
  }
  return classes.join(' ')
})

// label 对齐 class
const labelAlignClass = computed(() => {
  const align = props.commonConfig?.labelAlign || (isGrid.value ? 'left' : 'right')
  return `detail-view-label--${align}`
})

// label 宽度样式
const labelStyle = computed(() => {
  if (props.layout === 'vertical') return undefined
  const labelWidth = props.commonConfig?.labelWidth || 120
  return { width: `${labelWidth}px`, flexShrink: '0' }
})

// 从 commonConfig 提取的配置
const mergedLabelClass = computed(() => props.commonConfig?.labelClass)
const mergedControlClass = computed(() => props.commonConfig?.controlClass)
const mergedHideLabel = computed(() => props.commonConfig?.hideLabel)
const itemWrapperClass = computed(() => props.commonConfig?.wrapperClass)
const itemFormClass = computed(() => {
  const cls = props.commonConfig?.formItemClass
  return typeof cls === 'function' ? undefined : cls
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

/**
 * 组件名映射为详情展示组件
 * 核心思路：
 * - 带请求的组件 (Api*）→ 都映射到通用的 select（支持 options/code 字典）
 * - 内置数据的组件 (Select/TreeSelect/Cascader) → 也映射到 select
 * - 其他类型按各自语义映射
 */
const transformComponentName = (componentName: string): string => {
  const transformMap: Record<string, string> = {
    // 文本类 → Input
    Input: 'Input',
    InputPassword: 'Input',
    InputTextarea: 'Input',
    Textarea: 'Input',
    // 下拉选择类（含远程和本地）→ Select（通用，支持 options/code）
    Select: 'Select',
    ApiSelect: 'Select',
    TreeSelect: 'Select',
    ApiTreeSelect: 'Select',
    Cascader: 'Select',
    ApiCascader: 'Select',
    // 开关类 → Switch
    Switch: 'Switch',
    // 多选/单选组 → 各自组件
    Checkbox: 'Switch',
    CheckboxGroup: 'CheckboxGroup',
    ApiCheckboxGroup: 'CheckboxGroup',
    RadioGroup: 'RadioGroup',
    ApiRadioGroup: 'RadioGroup',
    // 日期 → DatePicker
    DatePicker: 'DatePicker',
    // 字典 → ApiDict
    ApiDict: 'ApiDict',
    // 特殊组件
    Avatar: 'Avatar',
    Upload: 'Upload',
    Editor: 'Input',
    IconPicker: 'Input',
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

const formatValue = (_schema: VbenFormSchema, value: any) => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }
  return value
}

/**
 * 判断字段是否应该显示
 * 支持 boolean 和 function 类型的 dependencies.show / dependencies.if
 */
const shouldShow = (schema: VbenFormSchema) => {
  if (schema.dependencies?.show !== undefined) {
    if (typeof schema.dependencies.show === 'boolean') {
      return schema.dependencies.show
    }
    if (typeof schema.dependencies.show === 'function') {
      return schema.dependencies.show(props.model, {} as any, {} as any)
    }
  }
  if (schema.dependencies?.if !== undefined) {
    if (typeof schema.dependencies.if === 'boolean') {
      return schema.dependencies.if
    }
    if (typeof schema.dependencies.if === 'function') {
      return schema.dependencies.if(props.model, {} as any, {} as any)
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

/* 网格布局：配合 Tailwind grid-cols-* 使用 */
.detail-view--grid {
  display: grid;
  gap: 16px;
}

/* 垂直布局 */
.detail-view--vertical {
  .detail-view-item {
    flex-direction: column;
    gap: 4px;
  }

  .detail-view-label {
    width: auto !important;
    text-align: left !important;
    padding-right: 0;
  }
}

/* 行内布局 */
.detail-view--inline {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;

  .detail-view-item {
    margin-bottom: 0;
    min-width: 200px;
  }
}

/* 每个 item */
.detail-view-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
  max-width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
}

/* 网格布局模式 item */
.detail-view-item--grid {
  margin-bottom: 0;
}

/* label 对齐方式 */
.detail-view-label--left {
  text-align: left;
}

.detail-view-label--right {
  text-align: right;
}

/* label 基础样式 */
.detail-view-label {
  flex-shrink: 0;
  padding-right: 12px;
  font-weight: 500;
  color: #64748b;
  line-height: 24px;
}

/* 网格模式下 label 间距调整 */
.detail-view-item--grid .detail-view-label {
  padding-right: 8px;
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
