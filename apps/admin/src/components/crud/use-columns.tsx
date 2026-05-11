import type { Ref } from 'vue'

import type { ActionItem, CrudColumn, CrudSchema } from './types'

import { computed } from 'vue'

import { TableAction } from '#/components/table-action'

export function useColumns(
  crudSchema: CrudSchema,
  tableActions: Ref<ActionItem[]>,
  dropDownActions: Ref<ActionItem[]>,
) {
  return computed(() => {
    const rawColumns =
      typeof crudSchema.columns === 'function'
        ? crudSchema.columns()
        : crudSchema.columns

    const vxeColumns = rawColumns.map((col: CrudColumn) => {
      const { viewComponent, viewComponentProps, vxeColumn, ...rest } = col

      const result: any = { ...rest }

      if (viewComponent) {
        result.cellRender = {
          name: viewComponent,
          props: viewComponentProps,
        }
      }

      if (vxeColumn) {
        Object.assign(result, vxeColumn)
      }

      return result
    })

    if (tableActions.value?.length || dropDownActions.value?.length) {
      const actionCol = crudSchema.tableActionColumn || {}
      vxeColumns.push({
        field: '__ACTION__',
        title: '操作',
        width: 220,
        align: 'center',
        showOverflow: 'tooltip',
        slots: {
          default: ({ row }: { row: any }) => (
            <TableAction
              record={row}
              actions={tableActions.value}
              dropDownActions={dropDownActions.value}
            />
          ),
        },
        ...(actionCol.vxeColumn || {}),
      })
    }

    return vxeColumns
  })
}
