export interface TableInfo {
  tableName: string
  tableComment: string
  createTime: string
  updateTime: string
}

export interface ColumnInfo {
  columnName: string
  dataType: string
  columnComment: string
  columnKey: string
  isNullable: string
  columnDefault: string
  extra: string
}

export interface BasicConfig {
  tableName: string
  tableComment: string
  plugin: string
  moduleName: string
  className: string
  packageName: string
  author: string
  remark: string
}

export interface FieldConfig {
  columnName: string
  columnComment: string
  dataType: string
  columnLength: number
  isPrimaryKey: boolean
  isRequired: boolean
  defaultValue?: string
  javaType?: string
  htmlType?: string
}

export interface GenerateConfig {
  deleteType: 'logical' | 'physical'
  editMode: 'dialog' | 'page'
  sortField: string
  sortOrder: 'asc' | 'desc'
  parentMenu: string[]
  generateFiles: string[]
}

export interface RelationConfig {
  relationTable: string
  relationType: 'oneToOne' | 'oneToMany' | 'manyToMany'
  relationField: string
  targetField: string
}
