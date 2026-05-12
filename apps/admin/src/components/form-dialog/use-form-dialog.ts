import type { FormDialogApi, FormDialogOptions } from './types'

import { defineComponent, h, ref } from 'vue'

import FormDialogComponent from './form-dialog.vue'

/**
 * 简化的公共表单弹窗 composable
 *
 * 兼容 useVbenForm 的所有参数，并扩展弹窗和接口相关配置。
 * crud.vue 的 dialog-form 也可复用此封装。
 *
 * @example
 * ```ts
 * // 基础用法 - 兼容 useVbenForm 参数
 * const [FormDialog, formDialogApi] = useFormDialog({
 *   schema: formSchema,
 *   commonConfig: { labelWidth: 80, componentProps: { allowClear: true } },
 *   api: { add: UserService.create, edit: UserService.update, view: UserService.get },
 *   title: '用户',
 * })
 *
 * // 使用 Drawer
 * const [FormDialog, formDialogApi] = useFormDialog({
 *   schema: formSchema,
 *   api: { add, edit, view },
 *   title: '用户',
 *   dialogType: 'drawer',
 * })
 *
 * // 完整 useVbenForm 参数
 * const [FormDialog, formDialogApi] = useFormDialog({
 *   schema: formSchema,
 *   commonConfig: { labelWidth: 100 },
 *   handleValuesChange: (values, fieldsChanged) => { ... },
 *   submitOnChange: false,
 *   api: { add, edit, view },
 *   title: '用户',
 * })
 *
 * // 打开弹窗
 * formDialogApi.openAdd()      // 新增
 * formDialogApi.openEdit(row)  // 编辑
 * formDialogApi.openView(row)  // 查看
 *
 * // 兼容 crud dialog-form 的 show 方法
 * formDialogApi.show({ data: row, type: 'edit' })
 * ```
 */
export function useFormDialog(options: FormDialogOptions) {
  const dialogRef = ref<any>(null)

  const formDialogApi: FormDialogApi = {
    openAdd(data) {
      dialogRef.value?.openAdd(data)
    },
    openEdit(row) {
      dialogRef.value?.openEdit(row)
    },
    openView(row) {
      dialogRef.value?.openView(row)
    },
    close() {
      dialogRef.value?.close()
    },
    getFormApi() {
      return dialogRef.value?.getFormApi()
    },
    getActionType() {
      return dialogRef.value?.getActionType()
    },
    getCurrentRow() {
      return dialogRef.value?.getCurrentRow()
    },
    show(params) {
      dialogRef.value?.show(params)
    },
  }

  const FormDialog = defineComponent({
    name: 'FormDialog',
    setup(_, { attrs, slots }) {
      return () =>
        h(
          FormDialogComponent,
          {
            ...attrs,
            options,
            ref: dialogRef,
          },
          slots,
        )
    },
  })

  return [FormDialog, formDialogApi] as const
}
