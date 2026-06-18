<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { ElMessage } from 'element-plus';

import { useCrud } from '#/adapter/crud';
import { GeneratorCodeService } from '#/api/app/generator';
import { Page } from '#/components/page';
import { $t } from '#/locales';

import CodePreview from './components/code-preview.vue';
import ImportTable from './components/import-table.vue';
import { useCrudSchema } from './schemas';

defineOptions({ name: 'AppGenerator' });

const router = useRouter();
const importTableRef = ref();
const codePreviewRef = ref();

const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const download = async (id: number | string) => {
  const response = await GeneratorCodeService.download(id);
  if (response) {
    downloadFile(response, 'codegen.zip');
    ElMessage.success($t('app.generator.action.download_success'));
  } else {
    ElMessage.error($t('app.generator.action.download_fail'));
  }
};

const [BasicCrud, crudApi] = useCrud({
  ...useCrudSchema(),
  toolbarActions: [
    {
      label: $t('app.generator.action.import_table'),
      type: 'primary',
      sort: 1010,
      icon: 'ant-design:plus-outlined',
      dialogRef: importTableRef,
    },
  ],
  dropDownToolbarActions: [],
  tableActions: [
    {
      label: $t('app.generator.action.edit'),
      type: 'primary',
      sort: 1010,
      link: true,
      icon: 'ant-design:edit-outlined',
      auth: 'generator:code:update',
      onClick: (_e: Event, row: any) => {
        router.push({ path: '/app/generator/code', query: { id: row.id } });
      },
    },
  ],
  dropDownActions: [
    {
      label: $t('app.generator.action.preview'),
      sort: 1010,
      link: true,
      icon: 'ant-design:eye-outlined',
      auth: 'generator:code:preview',
      dialogRef: codePreviewRef,
      dialogParams: (record: any) => ({ record }),
    },
    {
      label: $t('app.generator.action.deploy'),
      sort: 1020,
      link: true,
      icon: 'ant-design:cloud-upload-outlined',
      auth: 'generator:code:deploy',
      onClick: async (_e: Event, row: any) => {
        await GeneratorCodeService.deploy(row.id);
        crudApi.reload();
      },
    },
    {
      label: $t('app.generator.action.download'),
      sort: 1030,
      link: true,
      icon: 'ant-design:download-outlined',
      auth: 'generator:code:download',
      onClick: async (_e: Event, row: any) => {
        download(row.id);
      },
    },
  ],
});
</script>

<template>
  <Page auto-content-height>
    <BasicCrud />
    <ImportTable ref="importTableRef" @success="crudApi.reload()" />
    <CodePreview ref="codePreviewRef" />
  </Page>
</template>
