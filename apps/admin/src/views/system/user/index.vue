<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <TableAction
          :actions="[
            {
              label: $t('system.user.toolbar.create'),
              type: 'primary',
              icon: 'ant-design:plus-outlined',
              auth: 'system:user:create',
              onClick: onCreate.bind(null),
            },
          ]"
        />
      </template>
      <template #toolbar-tools></template>
      <template #ACTION="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('system.user.action.edit'),
              type: 'primary',
              link: true,
              auth: 'system:user:update',
              onClick: onEdit.bind(null, row),
            },
            {
              label: $t('system.user.action.delete'),
              type: 'danger',
              link: true,
              auth: 'system:user:delete',
              popConfirm: {
                title: $t('system.user.confirm.delete'),
                confirm: onDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
    <UserModal :title="modalTitle" class="w-[60%]" draggable>
      <div class="p-4 space-y-4">
        <el-input v-model="formData.user_name" :placeholder="$t('system.user.form.placeholder.user_name')" />
        <el-input v-model="formData.real_name" :placeholder="$t('system.user.form.placeholder.real_name')" />
        <el-input v-model="formData.email" :placeholder="$t('system.user.form.placeholder.email')" />
        <el-input v-model="formData.mobile_phone" :placeholder="$t('system.user.form.placeholder.mobile_phone')" />
      </div>
    </UserModal>
  </Page>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Page, useVbenModal } from '@vben/common-ui'
import { useVbenVxeGrid } from '#/adapter/vxe-table'
import { TableAction } from '#/components/table-action'
import { UserService } from '#/api/system'
import { dialogTitle, querySchema, useColumns } from './schemas'
import { ElInput } from 'element-plus'

const [UserModal, userModalApi] = useVbenModal({
  async onConfirm() {
    await handleSubmit()
  },
})

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    commonConfig: {
      labelWidth: 80,
      componentProps: {
        allowClear: true,
      },
    },
    schema: querySchema(),
    submitOnChange: false,
    collapsed: true,
  },
  gridOptions: {
    checkboxConfig: {
      highlight: true,
      reserve: true,
      trigger: 'cell',
    },
    columns: useColumns() as any,
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }: any, formValues = {}) => {
          return await UserService.list({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          })
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: true,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
      slots: {
        buttons: 'toolbar-buttons',
      },
    },
  },
})

const viewType = ref<'add' | 'edit' | 'view'>('add')
const currentRow = ref<any>({})
const formData = reactive({
  user_name: '',
  real_name: '',
  email: '',
  mobile_phone: '',
})

const modalTitle = computed(() => {
  if (viewType.value === 'add')
    return `新增${dialogTitle}`
  if (viewType.value === 'edit')
    return `编辑${dialogTitle}`
  return `${dialogTitle}详情`
})

function onCreate() {
  viewType.value = 'add'
  formData.user_name = ''
  formData.real_name = ''
  formData.email = ''
  formData.mobile_phone = ''
  userModalApi.open()
}

function onEdit(row: any) {
  viewType.value = 'edit'
  currentRow.value = row
  formData.user_name = row.user_name || ''
  formData.real_name = row.real_name || ''
  formData.email = row.email || ''
  formData.mobile_phone = row.mobile_phone || ''
  userModalApi.open()
}

async function onDelete(row: any) {
  await UserService.remove({ ids: [row.id] })
  gridApi.reload()
}

async function handleSubmit() {
  try {
    const submitApi = viewType.value === 'edit' ? UserService.update : UserService.create
    await submitApi(formData)
    userModalApi.close()
    gridApi.reload()
  } catch (error) {
    console.error('提交失败:', error)
  }
}
</script>
