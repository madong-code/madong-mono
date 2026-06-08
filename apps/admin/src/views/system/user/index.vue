<script setup lang="ts">
import { ref } from 'vue';

import { useCrud } from '#/adapter/crud';
import { Page } from '#/components/page';
import { $t } from '#/locales';

import GrantRole from './grant-role.vue';
import { useCrudSchema } from './schemas';

const grantRoleRef = ref();

const [BasicCrud, crudApi] = useCrud({
  ...useCrudSchema(),
  dropDownActions: [
    {
      label: $t('system.user.action.grant_role'),
      icon: 'ant-design:team-outlined',
      type: 'primary',
      link: true,
      auth: 'system:user:grant_role',
      ifShow(_action, record) {
        return record?.is_super !== 1;
      },
      onClick(_e, row) {
        grantRoleRef.value?.show({
          data: row,
          getCrudApi: () => crudApi,
        });
      },
    },
  ],
});
</script>

<template>
  <Page auto-content-height>
    <BasicCrud />
    <GrantRole ref="grantRoleRef" @success="crudApi?.refreshUpdate()" />
  </Page>
</template>
