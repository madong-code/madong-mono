import type { CrudSchema } from '#/components/crud/components/types'

import { ReviewService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: ReviewService.list,
    add: ReviewService.create,
    edit: ReviewService.update,
    remove: ReviewService.remove,
    view: ReviewService.get,
  },

  // 表格配置
  table: {
    hasAdd: false,
    hasEdit: false,
    hasView: true,
    hasRemove: true,
    permissions: {
      remove: 'setting:review:delete',
      view: 'setting:review:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('setting.review.table.columns.id'), minWidth: 60, visible: false },
      { field: 'title', title: $t('setting.review.table.columns.title'), minWidth: 150 },
      {
        field: 'reviewable_type',
        title: $t('setting.review.table.columns.reviewable_type'),
        minWidth: 100,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.REVIEW_TYPE },
      },
      { field: 'applicant', title: $t('setting.review.table.columns.applicant'), minWidth: 100 },
      {
        field: 'status',
        title: $t('setting.review.table.columns.status'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.REVIEW_STATUS },
      },
      { field: 'reviewer_name', title: $t('setting.review.table.columns.reviewer_name'), minWidth: 100 },
      { field: 'reason', title: $t('setting.review.table.columns.reason'), minWidth: 160 },
      { field: 'created_at', title: $t('setting.review.table.columns.created_at'), minWidth: 160 },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_title',
        label: $t('setting.review.search.title'),
        component: 'Input',
      },
      {
        fieldName: 'EQ_reviewable_type',
        label: $t('setting.review.search.type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.REVIEW_TYPE, clearable: true },
      },
      {
        fieldName: 'EQ_status',
        label: $t('setting.review.search.status'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.REVIEW_STATUS, clearable: true },
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: false,
    schema: [],
    title: $t('setting.review.title'),
    width: 'w-[40%]',
  },
}
