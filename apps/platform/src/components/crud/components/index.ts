/**
 * CRUD 组件统一导出
 */

// 子组件
export { TableAction } from './table-action';
export type { ActionItem, PopConfirm } from './table-action';

export { DetailViewer } from './viewer';

export { default as FormDialog } from './dialog/dialog.vue';
export { useFormDialog } from './dialog';

// 核心类型
export type {
  CrudSchema,
  CrudColumn,
  CrudApi,
  CrudApiInstance,
  CrudReadonlyState,
  PaginationConfig,
  TreeConfig,
  ToolbarConfig,
  SearchFormConfig,
  FormDialogConfig,
} from './types';
