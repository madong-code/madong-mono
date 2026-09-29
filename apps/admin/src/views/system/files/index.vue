<script setup lang="ts">
import type { CrudApiInstance } from '#/components/crud/components/types';

import { ref } from 'vue';

import { useCrud } from '#/adapter/crud';
import { Page } from '#/components/page';

import FileDetail from './detail.vue';
import { useCrudSchema } from './schemas';
import FileUpload from './upload.vue';

let crudApiInstance: CrudApiInstance | undefined;
const detailVisible = ref(false);
const detailRow = ref<null | Record<string, any>>(null);
const uploadVisible = ref(false);

function openDetail(row: Record<string, any>) {
  detailRow.value = row;
  detailVisible.value = true;
}

function openUpload() {
  uploadVisible.value = true;
}

const [BasicCrud, crudApi] = useCrud(
  useCrudSchema(() => crudApiInstance, {
    onDetail: openDetail,
    onUpload: openUpload,
  }),
);
crudApiInstance = crudApi;
</script>

<template>
  <Page auto-content-height>
    <BasicCrud />
    <FileDetail v-model:visible="detailVisible" :row="detailRow" />
    <FileUpload v-model:visible="uploadVisible" @success="crudApi.refreshData()" />
  </Page>
</template>
