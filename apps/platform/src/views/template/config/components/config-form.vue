<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';

import {
  ElButton,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElMessage,
  ElOption,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
} from 'element-plus';

import { ConfigTemplateService } from '#/api/template/config';
import ApiDict from '#/components/form/components/api-dict/index.vue';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

type KVRows = Array<{ key: string; type: ValueType; value: string }>;

type ValueType = 'boolean' | 'json' | 'number' | 'string';

const props = defineProps<{
  row?: null | Record<string, any>;
  visible: boolean;
}>();

const emit = defineEmits<{
  saved: [];
  'update:visible': [boolean];
}>();

const isEdit = computed(() => !!props.row?.id);
const formRef = ref();

const valueTypeOptions: { label: string; value: ValueType }[] = [
  { label: $t('template.config.form.value_type.string'), value: 'string' },
  { label: $t('template.config.form.value_type.number'), value: 'number' },
  { label: $t('template.config.form.value_type.boolean'), value: 'boolean' },
  { label: $t('template.config.form.value_type.json'), value: 'json' },
];

const formData = reactive({
  code: '',
  name: '',
  group_code: 'default',
  content_type: 'kv' as 'kv' | 'string',
  content_kv: [] as KVRows,
  content_string: '',
  remark: '',
  enabled: 1,
  sort: 0,
});

const rules = {
  code: [{ required: true, message: $t('common.required'), trigger: 'blur' }],
  name: [{ required: true, message: $t('common.required'), trigger: 'blur' }],
  group_code: [
    { required: true, message: $t('common.required'), trigger: 'change' },
  ],
};

const contentPlaceholder = computed(() =>
  formData.content_type === 'string'
    ? $t('template.config.form.placeholder.content')
    : '',
);

function buildJsonString() {
  if (formData.content_type !== 'kv') return;
  const obj: Record<string, any> = {};
  for (const row of formData.content_kv) {
    if (!row.key) continue;
    let val: any;
    switch (row.type) {
      case 'boolean': {
        val = row.value === 'true';
        break;
      }
      case 'json': {
        try {
          val = row.value ? JSON.parse(row.value) : null;
        } catch {
          val = row.value;
        }
        break;
      }
      case 'number': {
        val = Number(row.value || 0);
        break;
      }
      default: {
        val = row.value ?? '';
      }
    }
    obj[row.key] = val;
  }
  formData.content_string = JSON.stringify(obj, null, 2);
}

function parseJsonString() {
  if (formData.content_type !== 'kv') return;
  if (!formData.content_string) {
    formData.content_kv = [];
    return;
  }
  try {
    const obj = JSON.parse(formData.content_string);
    formData.content_kv =
      obj && typeof obj === 'object' && !Array.isArray(obj)
        ? Object.entries(obj).map(([k, v]) => {
            let type: ValueType = 'string';
            let val = String(v);
            if (typeof v === 'number') type = 'number';
            else if (typeof v === 'boolean') {
              type = 'boolean';
              val = String(v);
            } else if (v !== null && typeof v === 'object') {
              type = 'json';
              val = JSON.stringify(v);
            }
            return { key: k, value: val, type };
          })
        : [];
  } catch {
    // 非 JSON 字符串，保留原内容
  }
}

function addKVRow() {
  formData.content_kv.push({ key: '', value: '', type: 'string' });
}

function removeKVRow(index: number) {
  formData.content_kv.splice(index, 1);
}

const title = computed(() =>
  isEdit.value
    ? $t('template.config.title.edit')
    : $t('template.config.title.create'),
);

const initForm = async () => {
  if (isEdit.value && props.row?.id) {
    const data = await ConfigTemplateService.get(props.row.id);
    Object.assign(formData, {
      code: data.code ?? '',
      name: data.name ?? '',
      group_code: data.group_code ?? 'default',
      content_type: 'string' as const,
      content_kv: [],
      content_string: data.content ?? '',
      remark: data.remark ?? '',
      enabled: data.enabled ?? 1,
      sort: data.sort ?? 0,
    });
    try {
      const parsed = JSON.parse(data.content ?? '');
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        formData.content_type = 'kv';
        nextTick(() => parseJsonString());
      }
    } catch {
      // 非 JSON
    }
  } else {
    Object.assign(formData, {
      code: '',
      name: '',
      group_code: 'default',
      content_type: 'kv',
      content_kv: [],
      content_string: '',
      remark: '',
      enabled: 1,
      sort: 0,
    });
    if (formData.content_kv.length === 0) {
      addKVRow();
    }
  }
};

watch(
  () => props.visible,
  async (v) => {
    if (!v) return;
    await nextTick();
    formRef.value?.resetFields();
    await initForm();
  },
);

watch(
  () => formData.content_type,
  (newType, oldType) => {
    if (newType === 'kv' && oldType === 'string') {
      parseJsonString();
      if (formData.content_kv.length === 0) {
        addKVRow();
      }
    } else if (newType === 'string' && oldType === 'kv') {
      buildJsonString();
    }
  },
);

const loading = ref(false);

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;
    let content = '';
    if (formData.content_type === 'kv') {
      buildJsonString();
      content = formData.content_string;
    } else {
      content = formData.content_string;
    }
    const params = {
      code: formData.code,
      name: formData.name,
      group_code: formData.group_code,
      content,
      remark: formData.remark,
      enabled: formData.enabled,
      sort: formData.sort,
    };
    await (isEdit.value && props.row
      ? ConfigTemplateService.update(props.row.id, params)
      : ConfigTemplateService.create(params));
    ElMessage.success($t('template.config.save_success'));
    emit('saved');
    emit('update:visible', false);
  } catch {
    // validation failed
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  formRef.value?.resetFields();
  emit('update:visible', false);
};
</script>

<template>
  <ElDrawer
    :model-value="visible"
    :title="title"
    size="700px"
    @close="handleClose"
  >
    <div class="px-4">
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <ElFormItem :label="$t('template.config.form.modal.name')" prop="name">
          <ElInput
            v-model="formData.name"
            :placeholder="$t('template.config.form.placeholder.name')"
          />
        </ElFormItem>

        <ElFormItem :label="$t('template.config.form.modal.code')" prop="code">
          <ElInput
            v-model="formData.code"
            :placeholder="$t('template.config.form.placeholder.code')"
            :disabled="isEdit"
          />
        </ElFormItem>

        <ElFormItem
          :label="$t('template.config.form.modal.group_code')"
          prop="group_code"
        >
          <ApiDict
            v-model="formData.group_code"
            :code="DictEnum.SYS_CONFIG_GROUP_CODE"
            :placeholder="$t('template.config.form.placeholder.group_code')"
          />
        </ElFormItem>

        <ElFormItem :label="$t('template.config.form.modal.enabled')">
          <ElRadioGroup v-model="formData.enabled">
            <ElRadioButton :value="1">
              {{ $t('template.config.form.enabled_on') }}
            </ElRadioButton>
            <ElRadioButton :value="0">
              {{ $t('template.config.form.enabled_off') }}
            </ElRadioButton>
          </ElRadioGroup>
        </ElFormItem>

        <ElFormItem :label="$t('template.config.form.modal.sort')">
          <ElInput
            v-model.number="formData.sort"
            type="number"
            :min="0"
            :placeholder="$t('template.config.form.placeholder.sort')"
          />
        </ElFormItem>

        <ElFormItem :label="$t('template.config.form.modal.content_type')">
          <ElRadioGroup v-model="formData.content_type">
            <ElRadioButton value="kv">
              {{ $t('template.config.form.content_type_kv') }}
            </ElRadioButton>
            <ElRadioButton value="string">
              {{ $t('template.config.form.content_type_string') }}
            </ElRadioButton>
          </ElRadioGroup>
        </ElFormItem>

        <ElFormItem
          v-if="formData.content_type === 'kv'"
          :label="$t('template.config.form.kv_label')"
        >
          <div class="kv-wrapper">
            <div
              v-for="(row, idx) in formData.content_kv"
              :key="idx"
              class="kv-row"
            >
              <ElInput
                v-model="row.key"
                :placeholder="$t('template.config.form.placeholder.kv_key')"
                class="kv-key"
              />
              <ElInput
                v-model="row.value"
                :placeholder="$t('template.config.form.placeholder.kv_value')"
                class="kv-value"
              />
              <ElSelect v-model="row.type" class="kv-type">
                <ElOption
                  v-for="opt in valueTypeOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </ElSelect>
              <ElButton
                type="danger"
                circle
                plain
                class="kv-remove"
                @click="removeKVRow(idx)"
              >
                <ElIcon>
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6H5H21"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </ElIcon>
              </ElButton>
            </div>
            <ElButton type="primary" plain class="kv-add" @click="addKVRow">
              + {{ $t('template.config.form.add_kv') }}
            </ElButton>
          </div>
        </ElFormItem>

        <ElFormItem
          v-else
          :label="$t('template.config.form.modal.content')"
          prop="content_string"
        >
          <ElInput
            v-model="formData.content_string"
            type="textarea"
            :rows="8"
            :placeholder="contentPlaceholder"
          />
        </ElFormItem>

        <ElFormItem
          :label="$t('template.config.form.modal.remark')"
          prop="remark"
        >
          <ElInput
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            :placeholder="$t('template.config.form.placeholder.remark')"
          />
        </ElFormItem>
      </ElForm>
    </div>

    <template #footer>
      <ElButton @click="handleClose">
        {{ $t('common.operate.cancel') }}
      </ElButton>
      <ElButton type="primary" :loading="loading" @click="handleSubmit">
        {{ $t('common.operate.confirm') }}
      </ElButton>
    </template>
  </ElDrawer>
</template>

<style lang="scss" scoped>
.kv-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.kv-row {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.kv-key {
  flex: 1;
  min-width: 0;
}

.kv-value {
  flex: 2;
  min-width: 0;
}

.kv-type {
  flex-shrink: 0;
  width: 110px;
}

.kv-remove {
  flex-shrink: 0;
}

.kv-add {
  width: 100%;
  margin-top: 4px;
}
</style>
