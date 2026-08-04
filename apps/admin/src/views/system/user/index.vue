<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { useCrud } from '#/adapter/crud';

import { useCrudSchema } from './schemas';

const schema = useCrudSchema();
const [Grid] = useCrud(schema);
</script>
<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
