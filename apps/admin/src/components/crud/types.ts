import type { VbenFormSchema } from '#/adapter/form'

import type { ActionItem } from '#/components/table-action'

export type { ActionItem }

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
  vxeColumn?: Record<string, any>
  [key: string]: any
}

export interface CrudApi {
  list: (params: any) => Promise<any>
  add?: (params: any) => Promise<any>
  edit?: (params: any) => Promise<any>
  remove?: (params: any) => Promise<any>
  view?: (id: any) => Promise<any>
}

export interface PaginationConfig {
  currentKey?: string
  sizeKey?: string
  recordFields?: string[]
  totalFields?: string[]
}

export interface TreeConfig {
  id?: string
  pid?: string
  children?: string
}

export interface ToolbarConfig {
  refresh?: boolean
  custom?: boolean
  zoom?: boolean
  export?: boolean
  print?: boolean
  search?: boolean
  tools?: ActionItem[]
}

export interface CrudSchema {
  rowKey?: string
  columns: CrudColumn[] | (() => CrudColumn[])
  crudApi: CrudApi
  paginationConfig?: PaginationConfig
  tree?: TreeConfig
  toolbarConfig?: ToolbarConfig
  immediate?: boolean

  useSearchForm?: boolean
  searchFormSchema?: VbenFormSchema[] | (() => VbenFormSchema[])

  formSchema?: VbenFormSchema[] | (() => VbenFormSchema[])
  dialogTitle?: string
  dialogWidth?: string
  dialogType?: 'modal' | 'drawer'

  useCrud?: boolean
  hasAdd?: boolean
  hasEdit?: boolean
  hasView?: boolean
  hasRemove?: boolean
  addButtonText?: string
  editButtonText?: string
  viewButtonText?: string
  removeButtonText?: string
  addAuth?: string
  editAuth?: string
  viewAuth?: string
  removeAuth?: string

  toolbarActions?: ActionItem[]
  dropDownToolbarActions?: ActionItem[]
  tableActions?: ActionItem[]
  dropDownActions?: ActionItem[]

  tableActionColumn?: Partial<CrudColumn>

  beforeFetch?: (params: any) => any
  afterFetch?: (res: any) => any
  transformFormValues?: (
    values: Record<string, any>,
    type: 'add' | 'edit',
  ) => Record<string, any>
}

export interface CrudReadonlyState {
  selection: any[]
}

export interface CrudApiInstance {
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

  openAddDialog: () => void
  openEditDialog: (row: any) => void
  openViewDialog: (row: any) => void

  removeByApi: (row: any) => void
  executeRemove: (row: any) => void
  executeBatchRemove: () => void

  setState: (state: Partial<CrudSchema>) => Promise<void>
  getState: () => CrudSchema
}
