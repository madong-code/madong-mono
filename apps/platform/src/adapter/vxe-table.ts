import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { ComponentPropsMap, ComponentType } from './component';

import {
  setupVbenVxeTable,
  useVbenVxeGrid as useGrid,
} from '@vben/plugins/vxe-table';

// 导入渲染器
import { cellRenderers } from '#/components/render';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        // 平台表格默认左对齐（状态/时间列由 useColumns 单独居中，操作栏右对齐）
        align: 'left',
        border: 'none' as any,
        stripe: true,
        columnConfig: {
          resizable: true,
        },
        height: 'auto',
        formConfig: {
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: 'items',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      } as VxeTableGridOptions,
    });

    // 注册所有渲染器
    console.warn('[VxeTable] 注册的渲染器:', Object.keys(cellRenderers));
    Object.entries(cellRenderers).forEach(([name, renderer]) => {
      console.warn(`[VxeTable] 注册 ${name}:`, renderer);
      vxeUI.renderer.add(name, renderer);
    });
  },
  useVbenForm,
});

export const useVbenVxeGrid = <T extends Record<string, any>>(
  ...rest: Parameters<typeof useGrid<T, ComponentType, ComponentPropsMap>>
) => useGrid<T, ComponentType, ComponentPropsMap>(...rest);

export type * from '@vben/plugins/vxe-table';
