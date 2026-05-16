import type { CrudSchema } from '#/components/crud/components/types'

import { ReviewService } from '#/api/setting/review'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: ReviewService.list,
    add: ReviewService.create,
    edit: ReviewService.update,
    remove: ReviewService.delete,
    batchRemove: ReviewService.remove,
    view: ReviewService.get,
  },

  table: {
    hasAdd: false,
    hasEdit: false,
    hasView: false,
    hasRemove: false,
    permissions: {
      add: 'setting:review:create',
      edit: 'setting:review:update',
      remove: 'setting:review:delete',
      view: 'setting:review:read',
    },
    rowKey: 'id',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'title', title: $t('setting.review.table.columns.title'), minWidth: 150 },
      {
        field: 'status',
        title: $t('setting.review.table.columns.status'),
        minWidth: 100,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.REVIEW_STATUS },
      },
      { field: 'applicant', title: $t('setting.review.table.columns.applicant'), minWidth: 100 },
      { field: 'reviewer.real_name', title: $t('setting.review.table.columns.reviewer'), minWidth: 100 },
      { field: 'created_at', title: $t('setting.review.table.columns.created_at'), minWidth: 180 },
      { field: 'reviewed_at', title: $t('setting.review.table.columns.reviewed_at'), minWidth: 180 },
    ],
  },

  searchForm: {
    enabled: true,
    collapsed: true,
    collapsedRows: 2,
    schema: [
      {
        component: 'Input',
        fieldName: 'LIKE_extra_data',
        label: $t('setting.review.table.search.title'),
        componentProps: {
          clearable: true,
          placeholder: $t('setting.review.table.search.placeholder.title'),
        },
      },
      {
        component: 'ApiDict',
        fieldName: 'EQ_type',
        label: $t('setting.review.table.search.type'),
        componentProps: {
          code: DictEnum.REVIEW_TYPE,
          clearable: true,
          placeholder: $t('setting.review.table.search.placeholder.type'),
        },
      },
      {
        component: 'ApiDict',
        fieldName: 'EQ_status',
        label: $t('setting.review.table.search.status'),
        componentProps: {
          code: DictEnum.REVIEW_STATUS,
          clearable: true,
          placeholder: $t('setting.review.table.search.placeholder.status'),
        },
      },
      {
        component: 'Input',
        fieldName: 'LIKE_applicant',
        label: $t('setting.review.table.search.applicant'),
        componentProps: {
          clearable: true,
          placeholder: $t('setting.review.table.search.placeholder.applicant'),
        },
      },
    ],
  },

  formDialog: {
    enabled: true,
    title: $t('setting.review.title'),
    width: 'w-[50%]',
    wrapperClass: 'grid-cols-1',
    commonConfig: {
      labelWidth: 100,
      labelAlign: 'right',
    },
    schema: [
      {
        label: $t('setting.review.form.modal.id'),
        fieldName: 'id',
        component: 'Input',
        formItemClass: 'col-span-2',
        dependencies: { triggerFields: ['id'], show: false },
      },
      {
        label: $t('setting.review.form.modal.title'),
        fieldName: 'title',
        component: 'Input',
        rules: 'required',
        formItemClass: 'col-span-2',
        componentProps: {
          placeholder: $t('setting.review.form.modal.placeholder.title'),
        },
      },
      {
        label: $t('setting.review.form.modal.type'),
        fieldName: 'type',
        component: 'ApiDict',
        rules: 'required',
        formItemClass: 'col-span-2',
        componentProps: {
          code: DictEnum.REVIEW_TYPE,
          clearable: true,
          placeholder: $t('setting.review.form.modal.placeholder.type'),
        },
      },
      {
        label: $t('setting.review.form.modal.content'),
        fieldName: 'content',
        component: 'Input',
        rules: 'required',
        formItemClass: 'col-span-2',
        componentProps: {
          type: 'textarea',
          rows: 5,
          placeholder: $t('setting.review.form.modal.placeholder.content'),
        },
      },
      {
        label: $t('setting.review.form.modal.status'),
        fieldName: 'status',
        component: 'ApiDict',
        formItemClass: 'col-span-2',
        componentProps: {
          code: DictEnum.REVIEW_STATUS,
          clearable: true,
          placeholder: $t('setting.review.form.modal.placeholder.status'),
        },
      },
      {
        label: $t('setting.review.form.modal.review_note'),
        fieldName: 'review_note',
        component: 'Input',
        formItemClass: 'col-span-2',
        componentProps: {
          type: 'textarea',
          rows: 3,
          placeholder: $t('setting.review.form.modal.placeholder.review_note'),
        },
      },
    ],
  },
}
