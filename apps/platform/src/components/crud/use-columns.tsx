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

/**
 * 框架内置对齐规则：未显式指定 align 时，状态列 / 时间列默认居中，其余默认左对齐
 */
const BUILTIN_CENTER_COLUMNS = (col: CrudColumn) =>
  col.cellRender?.name === 'CellDictTag' ||
  col.cellRender?.name === 'CellDict' ||
  /(_at|_time)$|^(created|updated|create|update|time|date)/i.test(
    String(col.field ?? ''),
  );

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

      // 框架内置对齐规则：未显式指定 align 时，状态列 / 时间列默认居中，其余默认左对齐
      if (result.align === undefined) {
        result.align = BUILTIN_CENTER_COLUMNS(col) ? 'center' : 'left';
      }

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
        // 操作栏默认固定显示在右侧，可通过 tableActionColumn.fixed 显式覆盖
        fixed: 'right',
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
