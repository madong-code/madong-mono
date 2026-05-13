/**
 * CRUD 组件类型定义
 * 提供完整的 CRUD 功能类型支持
 */

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form'
import type { ActionItem, PopConfirm } from '#/components/table-action'

// Re-export ActionItem 和 PopConfirm 以确保类型一致性
export type { ActionItem, PopConfirm }

export interface CrudColumn<T = any> {
  type?: 'checkbox' | 'expand' | 'index' | 'seq'
  field?: string
  title?: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  align?: 'left' | 'center' | 'right'
  showOverflow?: boolean | 'tooltip' | 'ellipsis'
  filters?: any[]
  filterMethod?: (value: any, row: any) => boolean
  formatter?: (row: T) => any
  slots?: Record<string, any>
  viewComponent?: string
  viewComponentProps?: Record<string, any>
  hideInDetail?: boolean
  vxeColumn?: Record<string, any>
  [key: string]: any
}

export interface CrudApi {
  list: (params: any) => Promise<any>
  add?: (params: any) => Promise<any>
  edit?: (params: any) => Promise<any>
  /** 单个删除接口 */
  remove?: (params: any) => Promise<any>
  /** 批量删除接口（传入 ids 数组） */
  batchRemove?: (params: { ids: any[] }) => Promise<any>
  view?: (id: any) => Promise<any>
}

// ========== 分页配置 ==========

export interface PaginationConfig {
  currentKey?: string
  sizeKey?: string
  recordFields?: string[]
  totalFields?: string[]
}

// ========== Toolbar 配置 ==========

export interface ToolbarConfig {
  refresh?: boolean
  custom?: boolean
  zoom?: boolean
  export?: boolean
  print?: boolean
  search?: boolean
  tools?: ActionItem[]
}

// ========== 表格代理配置 ==========

export interface TableProxyConfig {
  /** 代理查询接口（可覆盖 crudApi.list） */
  query?: (params: any) => Promise<any>
  /** 代理新增接口（可覆盖 crudApi.add） */
  create?: (params: any) => Promise<any>
  /** 代理编辑接口（可覆盖 crudApi.edit） */
  update?: (params: any) => Promise<any>
  /** 代理单个删除接口 */
  delete?: (params: any) => Promise<any>
  /** 代理批量删除接口（传入 ids 数组） */
  deleteBatch?: (params: { ids: any[] }) => Promise<any>
  /** 代理详情接口（可覆盖 crudApi.view） */
  get?: (id: any) => Promise<any>
}

// ========== 树形配置 ==========

export interface TreeConfig {
  id?: string
  pid?: string
  children?: string
}

// ========== 表格操作权限配置 ==========

export interface TablePermissionConfig {
  add?: string
  edit?: string
  view?: string
  remove?: string
}

// ========== 表格按钮文本配置 ==========

export interface TableButtonTextConfig {
  add?: string
  edit?: string
  view?: string
  remove?: string
}

// ========== 表格配置 ==========

export interface TableConfig {
  // --- 基础配置 ---
  /** 行数据的 key 字段，默认 id */
  rowKey?: string
  /** 表格列定义 */
  columns?: CrudColumn[] | (() => CrudColumn[])

  // --- 分页配置 ---
  /** 分页配置 */
  pagination?: PaginationConfig
  /** Vxe Grid 分页配置 */
  pagerConfig?: boolean | Record<string, any>

  // --- Toolbar 配置 ---
  /** Toolbar 配置 */
  toolbar?: ToolbarConfig

  // --- 操作按钮开关 ---
  /** 是否显示行编辑按钮，默认 true */
  hasEdit?: boolean
  /** 是否显示行详情按钮，默认 false */
  hasView?: boolean
  /** 是否显示行删除按钮，默认 true */
  hasRemove?: boolean
  /** 是否显示新增按钮，默认 true */
  hasAdd?: boolean
  /** 是否显示批量删除按钮，默认 true */
  hasBatchRemove?: boolean

  // --- 操作按钮权限 ---
  /** 操作按钮权限配置 */
  permissions?: TablePermissionConfig

  // --- 操作按钮文本 ---
  /** 操作按钮文本配置 */
  buttonText?: TableButtonTextConfig

  // --- 自定义操作按钮 ---
  /** 工具栏操作按钮 */
  toolbarActions?: ActionItem[]
  /** 工具栏下拉操作 */
  dropDownToolbarActions?: ActionItem[]
  /** 表格行操作按钮 */
  tableActions?: ActionItem[]
  /** 表格行下拉操作 */
  dropDownActions?: ActionItem[]

  // --- 数据处理 ---
  /** 请求前处理参数 */
  beforeFetch?: (params: any) => any
  /** 请求后处理结果 */
  afterFetch?: (res: any) => any

  // --- 树形配置 ---
  /** 树形结构配置（设置后自动启用树形表格模式） */
  tree?: TreeConfig

  // --- 删除操作路径参数 ---
  /** 删除时需要携带的路径参数配置，例如 parentId、deptId 等 */
  pathParams?: {
    /** 参数名称 */
    key: string
    /** 参数值来源：'row' 从行数据获取，'route' 从路由参数获取 */
    source: 'row' | 'route'
    /** 当 source 为 'row' 时，指定行数据中的字段名 */
    field?: string
    /** 当 source 为 'route' 时，指定路由参数名，默认使用 key */
    routeKey?: string
  }[]

  // --- 表格操作列配置 ---
  tableActionColumn?: Partial<CrudColumn>

  // --- Vxe Grid 常用配置 ---
  /** 表格高度，默认 'auto' */
  height?: string | number
  /** 是否保持源码，默认 true */
  keepSource?: boolean
  /** 是否显示边框，默认 'full' */
  border?: boolean | 'none' | 'full' | 'outer' | 'inner'
  /** 斑马纹，默认 false */
  stripe?: boolean
  /** 鼠标单元格悬停高亮，默认 true */
  hoverRow?: boolean
  /** 高亮当前行，默认 true */
  highlightCurrentRow?: boolean
  /** 高亮hover列，默认 false */
  highlightHoverColumn?: boolean
  /** 行号列宽，默认 60 */
  seqColumnWidth?: number
  /** 选择列宽，默认 60 */
  checkboxColumnWidth?: number
  /** 是否可选择行，默认 true */
  checkable?: boolean | ((params: { row: any }) => boolean)
  /** 工具提示配置 */
  showOverflow?: boolean | 'tooltip' | 'ellipsis' | 'title' | null
  /** 排序配置 */
  sortConfig?: boolean | Record<string, any>
  /** 筛选配置 */
  filterConfig?: boolean | Record<string, any>
  /** 导出配置 */
  exportConfig?: boolean | Record<string, any>
  /** 快捷菜单配置 */
  contextMenuConfig?: boolean | Record<string, any>
  /** 滚动配置 */
  scrollY?: boolean | Record<string, any>
  /** 代理配置（可覆盖 crudApi） */
  proxyConfig?: TableProxyConfig

  // --- 其他 Vxe Grid 配置 ---
  [key: string]: any
}

// ========== 表单相关类型 ==========

export interface FormDialogCommonConfig {
  /** label 宽度，默认 120 */
  labelWidth?: number
  /** label 对齐方式 */
  labelAlign?: 'left' | 'right'
  /** 表单 label 对齐方式（仅表单生效） */
  formLabelAlign?: 'left' | 'right'
  /** 详情 label 对齐方式（仅详情页生效） */
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

export type FormDialogType = 'modal' | 'drawer'

export type FormActionType = 'add' | 'edit' | 'view'

export interface FormDialogApiConfig {
  add?: (params: any) => Promise<any>
  edit?: (params: any) => Promise<any>
  view?: (id: any) => Promise<any>
}

export interface FormDialogOptions extends Omit<Partial<VbenFormProps>, 'schema'> {
  schema?: VbenFormSchema[] | (() => VbenFormSchema[])
  commonConfig?: FormDialogCommonConfig
  api?: FormDialogApiConfig
  dialogType?: FormDialogType
  title?: string
  width?: string
  rowKey?: string
  draggable?: boolean
  fullscreenButton?: boolean
  onSuccess?: (type: FormActionType, values: Record<string, any>) => void | Promise<void>
  beforeSubmit?: (
    values: Record<string, any>,
    type: FormActionType,
  ) => Record<string, any> | false | Promise<Record<string, any> | false>
  onOpen?: (type: FormActionType, data: Record<string, any>) => void | Promise<void>
  confirmText?: string
  cancelText?: string
  transformFormValues?: (
    values: Record<string, any>,
    type: FormActionType,
  ) => Record<string, any>
}

// ========== 搜索表单配置 ==========

export interface SearchFormConfig {
  /** 是否启用搜索表单，默认 true */
  enabled?: boolean
  /** 搜索表单 schema */
  schema?: VbenFormSchema[] | (() => VbenFormSchema[])
  /** 搜索表单通用配置 */
  commonConfig?: Partial<VbenFormProps>
  /** 提交方式：change 时立即提交，submit 时按钮提交，默认 submit */
  submitOnChange?: boolean
  /** 是否折叠，默认 false */
  collapsed?: boolean
  /** 折叠时显示行数，默认 2 */
  collapsedRows?: number
}

// ========== 表单弹窗配置 ==========

export interface FormDialogConfig {
  /** 是否启用表单弹窗，默认 true */
  enabled?: boolean
  /** 表单 schema */
  schema?: VbenFormSchema[] | (() => VbenFormSchema[])
  /** 表单通用配置 */
  commonConfig?: FormDialogCommonConfig
  /** API 接口配置 */
  api?: FormDialogApiConfig
  /** 弹窗类型，默认 modal */
  dialogType?: FormDialogType
  /** 弹窗标题前缀 */
  title?: string
  /** 弹窗宽度 */
  width?: string
  /** 表单布局 */
  layout?: 'horizontal' | 'vertical' | 'inline'
  /** Grid 布局 class，用于控制表单列数，如 'grid-cols-1' 一列，'grid-cols-2' 两列，'grid-cols-3' 三列 */
  wrapperClass?: string
  /** 行数据的 key 字段，默认 id */
  rowKey?: string
  /** 是否可拖拽（仅 modal 有效），默认 true */
  draggable?: boolean
  /** 是否显示全屏按钮，默认 true */
  fullscreenButton?: boolean
  /** 提交成功回调 */
  onSuccess?: (type: FormActionType, values: Record<string, any>) => void | Promise<void>
  /** 提交前回调 */
  beforeSubmit?: (
    values: Record<string, any>,
    type: FormActionType,
  ) => Record<string, any> | false | Promise<Record<string, any> | false>
  /** 提交前数据转换 */
  transformFormValues?: (
    values: Record<string, any>,
    type: FormActionType,
  ) => Record<string, any>
  /** 打开弹窗后的回调 */
  onOpen?: (type: FormActionType, data: Record<string, any>) => void | Promise<void>
  /** 自定义确认文本 */
  confirmText?: string
  /** 自定义取消文本 */
  cancelText?: string
}

// ========== CRUD Schema ==========

export interface CrudSchema {
  // --- API 接口 ---
  /** API 接口 */
  crudApi: CrudApi

  // --- 表格配置 ---
  /** 表格配置（包含列定义、分页、Toolbar、操作按钮、权限、数据处理等） */
  table?: TableConfig

  // --- 兼容旧版配置 ---
  /** 行数据的 key 字段，默认 id（旧版顶层配置） */
  rowKey?: string
  /** 表格列定义（旧版顶层配置） */
  columns?: CrudColumn[] | (() => CrudColumn[])
  /** 删除操作路径参数（旧版顶层配置） */
  pathParams?: TableConfig['pathParams']

  // --- 搜索表单配置 ---
  /** 搜索表单配置 */
  searchForm?: SearchFormConfig

  // --- 表单弹窗配置 ---
  /** 表单弹窗配置 */
  formDialog?: FormDialogConfig
}

// ========== 状态和 API ==========

export interface CrudReadonlyState {
  selection: any[]
}

export interface CrudApiInstance {
  // 数据操作
  query: (params?: Record<string, any>) => Promise<void>
  reload: (params?: Record<string, any>) => Promise<void>
  setLoading: (loading: boolean) => void
  getGridInstance: () => any
  getFormApi: () => any
  getRowSelection: () => any[]
  getReadonlyState: () => CrudReadonlyState
  refreshData: () => void
  refreshSoft: () => void
  refreshCreate: () => void
  refreshUpdate: () => void
  refreshRemove: () => void

  // 弹窗操作
  openAddDialog: (data?: Record<string, any>) => void
  openEditDialog: (row: any) => void
  openViewDialog: (row: any) => void

  // 删除操作
  removeByApi: (row: any) => void
  executeRemove: (row: any) => void
  executeBatchRemove: () => void

  // 状态管理
  setState: (state: Partial<CrudSchema>) => Promise<void>
  getState: () => CrudSchema
}
