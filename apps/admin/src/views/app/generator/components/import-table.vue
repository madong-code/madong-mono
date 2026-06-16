<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { useCrud } from '#/adapter/crud';
import { GeneratorCodeService } from '#/api/app/generator';
import { useDialog } from '#/components/dialog';
import { $t } from '#/locales';

defineOptions({ name: 'ImportTable' });

defineEmits<{
  tableSelected: [tableData: any];
  'update:table-name': [tableName: string];
}>();

const [Dialog, dialogApi] = useDialog({
  title: $t('app.generator.import_table.title'),
  dialogType: 'drawer',
  direction: 'rtl',
  width: '60%',
  draggable: true,
  closeOnClickModal: true,
  destroyOnClose: true,
  onConfirm: async () => {
    const selection = crudApi.getRowSelection();
    if (selection.length === 0) {
      ElMessage.warning($t('app.generator.import_table.no_selection'));
      return;
    }
    await GeneratorCodeService.create({ table: selection });
    ElMessage.success($t('common.success'));
    dialogApi.close();
  },
});

const containerRef = ref<HTMLElement | null>(null);
let resizeObserver: null | ResizeObserver = null;

function updateHeight() {
  if (!containerRef.value) return;
  const h = Math.max(200, Math.floor(containerRef.value.clientHeight) - 110);
  crudApi.setGridOptions({ height: h });
}

onMounted(() => {
  const observer = new ResizeObserver(() => updateHeight());
  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
  resizeObserver = observer;
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

const [BasicCrud, crudApi] = useCrud({
  crudApi: { list: (params) => GeneratorCodeService.getTableList(params) },
  rowKey: 'name',
  hasAdd: false,
  hasEdit: false,
  hasRemove: false,
  hasView: false,
  columns: [
    { type: 'checkbox', width: 60 },
    {
      field: 'name',
      title: $t('app.generator.import_table.table_name'),
      minWidth: 150,
    },
    {
      field: 'comment',
      title: $t('app.generator.import_table.table_comment'),
      minWidth: 200,
    },
    {
      field: 'engine',
      title: $t('app.generator.import_table.engine'),
      width: 100,
    },
    {
      field: 'collation',
      title: $t('app.generator.import_table.charset'),
      width: 120,
    },
    {
      field: 'created_date',
      title: $t('app.generator.import_table.create_time'),
      width: 120,
    },
  ],
  searchForm: {
    enabled: true,
    collapsed: true,
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('app.generator.import_table.table_name'),
        componentProps: {
          placeholder: $t('app.generator.import_table.search_placeholder'),
          clearable: true,
        },
      },
    ],
  },
  formDialog: { enabled: false, schema: [] },
});

defineExpose({
  show() {
    dialogApi.open();
  },
});
</script>

<template>
  <Dialog>
    <div ref="containerRef" class="import-table-content">
      <BasicCrud />
    </div>
  </Dialog>
</template>

<style scoped>
.import-table-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
</style>
