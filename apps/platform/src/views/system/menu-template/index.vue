<template>
  <Page auto-content-height>
    <BasicCrud />
        <InterfaceForm ref="interfaceRef" />
  </Page>
</template>

<script setup lang="ts">
import { useCrud } from '#/adapter/crud'
import { useCrudSchema } from './schemas'
import { Page } from '#/components/page'


const [BasicCrud] = useCrud({
  ...useCrudSchema(),
  dropDownActions: [
    {
      label: '选择权限',
      type: 'primary',
      link: true,
      icon: 'ant-design:link-outlined',
      onClick: (_e: any, row: any) => {

      },
    }
  ],

  })
</script>
