<template>
  <Page auto-content-height>
    <!-- 使用 Crud 单一入口模式 -->
    <Crud
      ref="crudRef"
      :crud-schema="crudSchema"
      :crud-api="crudApi"
      @register="handleRegister"
    />

    <!-- 授权角色弹窗（独立使用） -->
    <GrantRoleDialog />
  </Page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Page } from '@vben/common-ui'
import { ElMessage } from 'element-plus'
import { Crud, type CrudApiInstance } from '#/components/crud'
import { useFormDialog } from '#/components/crud/components/dialog'
import { querySchema, useColumns, formSchema, grantRoleFormSchema } from './schemas'
import { UserService } from '#/api'

// === CRUD 实例 ===
const crudRef = ref<InstanceType<typeof Crud>>()
const crudApi = ref<CrudApiInstance>()

function handleRegister(instance: CrudApiInstance) {
  crudApi.value = instance
}

// === 授权角色弹窗 ===
const [GrantRoleDialog, grantRoleDialogApi] = useFormDialog({
  schema: grantRoleFormSchema,
  api: {
    add: UserService.grantRole,
  },
  title: '授权角色',
  width: 'w-[40%]',
  commonConfig: {
    labelWidth: 80,
  },
  onSuccess: () => {
    crudApi.value?.reload()
  },
})

// === CRUD 配置 ===
const crudSchema = {
  rowKey: 'id',
  columns: useColumns(),
  crudApi: {
    list: (params: any) => UserService.list(params),
    add: UserService.create,
    edit: UserService.update,
    remove: (params: any) => UserService.remove(params),
    view: UserService.get,
  },

  // 搜索表单配置（新版）
  searchForm: {
    enabled: true,
    schema: querySchema(),
    collapsed: true,
    collapsedRows: 2,
    commonConfig: {
      labelWidth: 80,
      componentProps: {
        allowClear: true,
      },
    },
  },

  // 表单弹窗配置（新版）
  formDialog: {
    enabled: true,
    schema: formSchema(),
    layout: 'horizontal',
    wrapperClass: 'grid-cols-2',
    commonConfig: {
      labelWidth: 80,
      labelAlign: 'right',
      componentProps: {
        allowClear: true,
      },
    },
    title: '用户',
    width: 'w-[60%]',
  },

  // 工具栏配置
  toolbarConfig: {
    refresh: true,
    custom: true,
    zoom: true,
    export: true,
  },

  // 表格操作列配置
  tableActionColumn: {
    width: 280,
  },

  // 自定义表格操作
  tableActions: [
    {
      label: '重置密码',
      type: 'primary',
      link: true,
      auth: 'system:user:resetPassword',
      onClick: handleResetPassword,
    },
    {
      label: '授权角色',
      type: 'primary',
      link: true,
      auth: 'system:user:grantRole',
      onClick: handleGrantRole,
    },
    {
      label: '扮演用户',
      type: 'primary',
      link: true,
      auth: 'system:playUser',
      ifShow: (_action: any, record: any) => record.is_locked === 0,
      confirm: {
        title: '提示',
        content: '确定要扮演该用户吗？',
        ok: handlePlayUser,
      },
    },
    {
      label: '锁定',
      type: 'primary',
      link: true,
      auth: 'system:user:locked',
      ifShow: (_action: any, record: any) => record.is_locked === 0,
      confirm: {
        title: '提示',
        content: '确定要锁定该用户吗？',
        ok: handleLocked,
      },
    },
    {
      label: '解锁',
      type: 'primary',
      link: true,
      auth: 'system:user:unLocked',
      ifShow: (_action: any, record: any) => record.is_locked === 1,
      confirm: {
        title: '提示',
        content: '确定要解锁该用户吗？',
        ok: handleUnLocked,
      },
    },
  ],

  // 下拉操作
  dropDownActions: [
    {
      label: '删除',
      icon: 'ant-design:delete-outlined',
      type: 'danger',
      auth: 'system:user:delete',
      confirm: {
        title: '提示',
        content: '确定删除吗？',
        ok: handleDelete,
      },
    },
  ],
}

// === 操作处理 ===
async function handleResetPassword(_action: any, row: any) {
  await UserService.resetPassword({ id: row.id })
  ElMessage.success('重置密码成功')
}

async function handlePlayUser(_action: any, row: any) {
  await UserService.playUser({ id: row.id })
  ElMessage.success('扮演用户成功')
}

async function handleGrantRole(_action: any, row: any) {
  const roleIds = row.roleIds ? row.roleIds.split(',').map(Number) : []
  grantRoleDialogApi.openAdd({
    userId: row.id,
    roleIdList: roleIds,
  })
}

async function handleLocked(_action: any, row: any) {
  await UserService.locked({ id: row.id })
  ElMessage.success('锁定成功')
  crudApi.value?.reload()
}

async function handleUnLocked(_action: any, row: any) {
  await UserService.unLocked({ id: row.id })
  ElMessage.success('解锁成功')
  crudApi.value?.reload()
}

async function handleDelete(_action: any, row: any) {
  await UserService.remove({ ids: [row.id] })
  ElMessage.success('删除成功')
  crudApi.value?.refreshRemove()
}
</script>
