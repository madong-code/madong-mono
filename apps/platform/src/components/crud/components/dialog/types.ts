/**
 * FormDialog 类型定义
 */

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';

export type FormDialogType = 'modal' | 'drawer';
export type FormActionType = 'add' | 'edit' | 'view';

export interface FormDialogApiConfig {
  add?: (params: any) => Promise<any>;
  edit?: (params: any) => Promise<any>;
  view?: (id: any) => Promise<any>;
}

export interface FormDialogCommonConfig {
  labelWidth?: number;
  labelAlign?: 'left' | 'right';
  formLabelAlign?: 'left' | 'right';
  detailLabelAlign?: 'left' | 'right';
  labelClass?: string;
  controlClass?: string;
  wrapperClass?: string;
  hideLabel?: boolean;
  hideRequiredMark?: boolean;
  formItemClass?: string | (() => string);
  componentProps?: Record<string, any>;
}

export interface FormDialogOptions extends Omit<
  Partial<VbenFormProps>,
  'schema'
> {
  schema?: VbenFormSchema[] | (() => VbenFormSchema[]);
  commonConfig?: FormDialogCommonConfig;
  api?: FormDialogApiConfig;
  dialogType?: FormDialogType;
  title?: string;
  width?: string;
  rowKey?: string;
  draggable?: boolean;
  fullscreenButton?: boolean;
  onSuccess?: (
    type: FormActionType,
    values: Record<string, any>,
  ) => void | Promise<void>;
  beforeSubmit?: (
    values: Record<string, any>,
    type: FormActionType,
  ) => Record<string, any> | false | Promise<Record<string, any> | false>;
  onOpen?: (
    type: FormActionType,
    data: Record<string, any>,
  ) => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  transformFormValues?: (
    values: Record<string, any>,
    type: FormActionType,
  ) => Record<string, any>;
}

export interface FormDialogApi {
  openAdd: (data?: Record<string, any>) => void;
  openEdit: (row: Record<string, any>) => void;
  openView: (row: Record<string, any>) => void;
  close: () => void;
  getFormApi: () => any;
  getActionType: () => FormActionType;
  getCurrentRow: () => Record<string, any>;
  show: (params: { data: any; type: FormActionType }) => void;
}
