<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { useCrud } from '#/adapter/crud';
import ListExportButton from '#/plugin/excel/components/list-export-button/index.vue';

import { useCrudSchema } from './schemas';

/** 管理员模型（与后端 Eloquent 类名一致，供导出元数据/黑名单识别） */
const EXPORT_MODEL = String.raw`app\model\system\admin\Admin`;

const schema = useCrudSchema();
const [Grid] = useCrud(schema);

/**
 * 从当前表格列推导默认导出列（排除操作/选择列）
 * 列表轻量导出：所见即所得
 */
function getExportColumns() {
  const cols =
    typeof schema.columns === 'function' ? schema.columns() : schema.columns;
  return (cols || [])
    .filter(
      (col: any) =>
        col?.field &&
        col.field !== 'action' &&
        col.type !== 'checkbox' &&
        col.type !== 'seq',
    )
    .map((col: any) => ({
      field: col.field as string,
      title: (col.title as string) || (col.field as string),
    }));
}
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <ListExportButton
          :model-class="EXPORT_MODEL"
          :get-columns="getExportColumns"
        />
      </template>
    </Grid>
  </Page>
</template>
