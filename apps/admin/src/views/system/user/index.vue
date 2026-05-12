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
              onClick: () => formDialogApi.openAdd(),
            },
          ]"
        />
      </template>
      <template #ACTION="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('system.user.action.detail'),
              type: 'primary',
              link: true,
              auth: 'system:user:read',
              onClick: () => formDialogApi.openView(row),
            },
            {
              label: $t('system.user.action.edit'),
              type: 'primary',
              link: true,
              auth: 'system:user:update',
              onClick: () => formDialogApi.openEdit(row),
            },
            {
              label: $t('system.user.action.reset_password'),
              type: 'primary',
              link: true,
              auth: 'system:user:resetPassword',
              confirm: {
                title: $t('system.user.confirm.reset_password'),
                ok: () => handleResetPassword(row),
              },
            },
            {
              label: $t('system.user.action.grant_role'),
              type: 'primary',
              link: true,
              auth: 'system:user:grantRole',
              onClick: () => handleGrantRole(row),
            },
          ]"
          :drop-down-actions="[
            {
              label: $t('system.user.action.play_user'),
              type: 'primary',
              link: true,
              auth: 'system:playUser',
              confirm: {
                title: $t('system.user.confirm.play_user'),
                ok: () => handlePlayUser(row),
              },
            },
            {
              label: $t('system.user.action.locked'),
              type: 'primary',
              link: true,
              auth: 'system:user:locked',
              ifShow: (_action: any, record: any) => record.is_locked === 0,
              confirm: {
                title: $t('system.user.confirm.locked'),
                ok: () => handleLocked(row),
              },
            },
            {
              label: $t('system.user.action.unlocked'),
              type: 'primary',
              link: true,
              auth: 'system:user:unLocked',
              ifShow: (_action: any, record: any) => record.is_locked === 1,
              confirm: {
                title: $t('system.user.confirm.unlocked'),
                ok: () => handleUnLocked(row),
              },
            },
            {
              label: $t('system.user.action.delete'),
              type: 'danger',
              link: true,
              auth: 'system:user:delete',
              confirm: {
                title: $t('system.user.confirm.delete'),
                ok: () => handleDelete(row),
              },
            },
          ]"
        />
      </template>
    </Grid>

    <!-- 新增/编辑用户表单弹窗 -->
    <UserFormDialog />

    <!-- 授权角色弹窗 -->
    <GrantRoleDialog />
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@vben/common-ui'
import { useVbenVxeGrid } from '#/adapter/vxe-table'
import { TableAction } from '#/components/table-action'
import { useFormDialog } from '#/components/form-dialog'
import { UserService } from '#/api/system'
import { ElMessage } from 'element-plus'
import { querySchema, useColumns, formSchema, grantRoleFormSchema } from './schemas'

// === 新增/编辑/查看用户表单弹窗 ===
const [UserFormDialog, formDialogApi] = useFormDialog({
  schema: formSchema,
  layout: 'horizontal',
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  api: {
    add: UserService.create,
    edit: UserService.update,
    view: UserService.get,
  },
  title: '用户',
  width: 'w-[60%]',
  onSuccess() {
    gridApi.reload()
  },
})

// === 授权角色弹窗 ===
const [GrantRoleDialog, grantRoleDialogApi] = useFormDialog({
  schema: grantRoleFormSchema,
  api: {
    add: UserService.grantRole,
  },
  title: '授权角色',
  width: 'w-[40%]',
  async beforeSubmit(values: Record<string, any>) {
    return values
  },
  onSuccess() {
    gridApi.reload()
  },
})

// === 列表 ===
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
    },
  },
})

// === 特殊操作 ===

async function handleDelete(row: any) {
  await UserService.remove({ ids: [row.id] })
  ElMessage.success('删除成功')
  gridApi.reload()
}

async function handleResetPassword(row: any) {
  await UserService.resetPassword({ id: row.id })
  ElMessage.success('重置密码成功')
}

async function handlePlayUser(row: any) {
  await UserService.playUser({ id: row.id })
  ElMessage.success('扮演用户成功')
}

async function handleGrantRole(row: any) {
  // 打开授权角色弹窗，传入当前用户信息
  const roleIds = row.roleIds ? row.roleIds.split(',').map(Number) : []
  grantRoleDialogApi.openAdd({
    userId: row.id,
    roleIdList: roleIds,
  })
}

async function handleLocked(row: any) {
  await UserService.locked({ id: row.id })
  ElMessage.success('锁定成功')
  gridApi.reload()
}

async function handleUnLocked(row: any) {
  await UserService.unLocked({ id: row.id })
  ElMessage.success('解锁成功')
  gridApi.reload()
}
</script>
