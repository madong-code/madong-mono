import type { Ref } from 'vue'

type Fn = (...args: any[]) => any

export interface PopConfirm {
  title: string
  okText?: string
  cancelText?: string
  confirm: Fn
  cancel?: Fn
  icon?: string
}

export interface ActionItem {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  link?: boolean
  size?: 'large' | 'default' | 'small'
  onClick?: Fn
  label?: string
  color?: string
  icon?: string | any
  sort?: number
  popConfirm?: PopConfirm
  disabled?: boolean
  divider?: boolean
  auth?: string
  ifShow?: ((action: ActionItem, record: any) => boolean) | boolean
  tooltip?: string | Record<string, any>
  confirm?: {
    title?: string
    content?: string
    ok?: (record: any) => void
    cancel?: (record: any) => void
    [key: string]: any
  }
  dialogRef?: Ref<any>
  dialogParams?: Record<string, any> | ((record: Record<string, any>) => Record<string, any>)
  dynamicProps?: (record: Record<string, any>) => Partial<ActionItem>
}
