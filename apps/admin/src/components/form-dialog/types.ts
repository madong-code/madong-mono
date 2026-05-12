import type { VbenFormProps, VbenFormSchema } from '#/adapter/form'

/**
 * 表单弹窗类型
 */
export type FormDialogType = 'modal' | 'drawer'

/**
 * 表单弹窗操作类型
 */
export type FormActionType = 'add' | 'edit' | 'view'

/**
 * 表单提交API配置
 */
export interface FormDialogApiConfig {
  /** 新增接口 */
  add?: (params: any) => Promise<any>
  /** 编辑接口 */
  edit?: (params: any) => Promise<any>
  /** 查看详情接口（编辑/查看时获取最新数据） */
  view?: (id: any) => Promise<any>
}

/**
 * 表单弹窗通用配置
 * 与 useVbenForm 的 commonConfig 保持一致
 */
export interface FormDialogCommonConfig {
  /** label 宽度，默认 120 */
  labelWidth?: number
  /** label 对齐方式：left 左对齐 / right 右对齐，默认 right */
  labelAlign?: 'left' | 'right'
  /** 表单 label 对齐方式（仅表单生效）：left 左对齐 / right 右对齐，默认 right */
  formLabelAlign?: 'left' | 'right'
  /** 详情 label 对齐方式（仅详情页生效）：left 左对齐 / right 右对齐，默认 right */
  detailLabelAlign?: 'left' | 'right'
  /** label class */
  labelClass?: string
  /** control class */
  controlClass?: string
  /** wrapper class */
  wrapperClass?: string
  /** 是否隐藏 label */
  hideLabel?: boolean
  /** 是否隐藏必填标记 */
  hideRequiredMark?: boolean
  /** 表单项 class */
  formItemClass?: string | (() => string)
  /** 组件默认 props */
  componentProps?: Record<string, any>
}

/**
 * 表单弹窗配置选项
 *
 * 继承 useVbenForm 的所有参数，并扩展弹窗和接口相关配置
 * 注意：schema 被重新声明以支持函数形式
 */
export interface FormDialogOptions extends Omit<Partial<VbenFormProps>, 'schema'> {
  /** 表单 Schema 定义（支持函数形式，兼容 VbenFormProps.schema） */
  schema?: VbenFormSchema[] | (() => VbenFormSchema[])
  /** 通用配置 */
  commonConfig?: FormDialogCommonConfig
  /** API 接口配置 */
  api?: FormDialogApiConfig
  /** 弹窗类型：modal 或 drawer，默认 modal */
  dialogType?: FormDialogType
  /** 弹窗标题前缀（如"用户"会生成"新增用户"、"编辑用户"等） */
  title?: string
  /** 弹窗宽度 class，默认 'w-[50%]' */
  width?: string
  /** 行数据的 key 字段，默认 'id' */
  rowKey?: string
  /** 是否可拖拽（仅 modal 有效），默认 true */
  draggable?: boolean
  /** 是否显示全屏按钮，默认 true */
  fullscreenButton?: boolean
  /** 提交成功回调 */
  onSuccess?: (type: FormActionType, values: Record<string, any>) => void | Promise<void>
  /** 提交前回调，可修改提交数据，返回 false 可阻止提交 */
  beforeSubmit?: (
    values: Record<string, any>,
    type: FormActionType,
  ) => Record<string, any> | false | Promise<Record<string, any> | false>
  /** 打开弹窗后的回调 */
  onOpen?: (type: FormActionType, data: Record<string, any>) => void | Promise<void>
  /** 自定义确认文本 */
  confirmText?: string
  /** 自定义取消文本 */
  cancelText?: string
  /** 提交前转换表单值（兼容 CrudSchema.transformFormValues） */
  transformFormValues?: (
    values: Record<string, any>,
    type: FormActionType,
  ) => Record<string, any>
}

/**
 * 表单弹窗 API 实例
 */
export interface FormDialogApi {
  /** 打开新增弹窗 */
  openAdd: (data?: Record<string, any>) => void
  /** 打开编辑弹窗 */
  openEdit: (row: Record<string, any>) => void
  /** 打开查看弹窗（只读） */
  openView: (row: Record<string, any>) => void
  /** 关闭弹窗 */
  close: () => void
  /** 获取表单 API 实例（可操作表单） */
  getFormApi: () => any
  /** 获取当前操作类型 */
  getActionType: () => FormActionType
  /** 获取当前行数据 */
  getCurrentRow: () => Record<string, any>
  /**
   * 兼容 crud dialog-form 的 show 方法
   * @internal 供 crud.vue 内部调用
   */
  show: (params: { data: any; type: FormActionType }) => void
}
