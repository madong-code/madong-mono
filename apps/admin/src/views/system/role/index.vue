<script setup lang="ts">
import { ref } from 'vue';

import { useCrud } from '#/adapter/crud';
import { Page } from '#/components/page';

import AuthMenu from './components/auth-menu.vue';
import DataScope from './components/data-scope.vue';
import UserRole from './components/user-role.vue';
import { useCrudSchema } from './schemas';

const authMenuRef = ref();
const userRoleRef = ref();
const dataScopeRef = ref();

const [BasicCrud, crudApi] = useCrud({
  ...useCrudSchema(),
  tableActionColumn: {
    width: 320,
  },
  tableActions: [
    {
      label: '授权菜单',
      type: 'primary',
      link: true,
      auth: 'system:auth:role_menu',
      icon: 'ant-design:safety-certificate-outlined',
      onClick: (_e: any, row: any) => {
        authMenuRef.value?.show({
          data: row,
          getCrudApi: () => crudApi,
        });
      },
    },
    {
      label: '成员管理',
      type: 'primary',
      link: true,
      auth: 'system:auth:role_user_list',
      icon: 'ant-design:team-outlined',
      onClick: (_e: any, row: any) => {
        userRoleRef.value?.show({
          data: row,
          getCrudApi: () => crudApi,
        });
      },
    },
  ],
  dropDownActions: [
    {
      label: '编辑',
      auth: 'system:role:update',
      icon: 'ant-design:edit-outlined',
      onClick: (_e: any, row: any) => {
        crudApi.openEditDialog(row);
      },
    },
    {
      label: '分配权限',
      auth: 'system:role:data_scope',
      icon: 'ant-design:safety-outlined',
      onClick: (_e: any, row: any) => {
        dataScopeRef.value?.show({
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
    <AuthMenu ref="authMenuRef" @success="crudApi?.refreshCreate()" />
    <UserRole ref="userRoleRef" />
    <DataScope ref="dataScopeRef" @success="crudApi?.refreshCreate()" />
  </Page>
</template>
