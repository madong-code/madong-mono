import type { Ref } from 'vue';

import type { ActionItem } from './components/table-action';
import type { CrudColumn } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { TableAction } from './components/table-action';

interface UseColumnsOptions {
  columns: CrudColumn[];
  tableActionColumn?: Partial<CrudColumn>;
}

export function useColumns(
  options: UseColumnsOptions,
  tableActions: Ref<ActionItem[]>,
  dropDownActions: Ref<ActionItem[]>,
) {
  return computed(() => {
    const rawColumns = options.columns || [];

    const vxeColumns = rawColumns.map((col: CrudColumn) => {
      const { viewComponent, viewComponentProps, vxeColumn, ...rest } = col;

      const result: any = { ...rest };

      if (viewComponent) {
        result.cellRender = {
          name: viewComponent,
          props: viewComponentProps,
        };
      }

      if (vxeColumn) {
        Object.assign(result, vxeColumn);
      }

      return result;
    });

    if (tableActions.value?.length || dropDownActions.value?.length) {
      const actionCol = options.tableActionColumn || {};
      vxeColumns.push({
        field: '__ACTION__',
        title: $t('components.crud.table.action'),
        width: 220,
        align: 'center',
        showOverflow: 'tooltip',
        slots: {
          default: ({ row }: { row: any }) => (
            <TableAction
              actions={tableActions.value}
              dropDownActions={dropDownActions.value}
              record={row}
            />
          ),
        },
        ...actionCol,
        ...actionCol.vxeColumn,
      });
    }

    return vxeColumns;
  });
}
