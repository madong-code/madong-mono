/**
 * CRUD 组件类型定义
 * 重新导出自 components/types.ts
 */

// 从 components 重新导出所有类型
export type {
  // 基础类型
  ActionItem,
  PopConfirm,
  CrudColumn,
  CrudApi,
  CrudApiInstance,
  CrudReadonlyState,
  PaginationConfig,
  TreeConfig,
  ToolbarConfig,

  // 新配置类型
  SearchFormConfig,
  FormDialogConfig,
  FormDialogCommonConfig,
  FormDialogType,
  FormActionType,
  FormDialogApiConfig,
  FormDialogOptions,
  FormDialogApi,

  // Schema
  CrudSchema,
} from './components/types'

// 兼容旧版导出（可选）
export type { VbenFormSchema } from '#/adapter/form'
