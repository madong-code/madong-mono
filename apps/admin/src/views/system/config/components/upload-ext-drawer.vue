<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

import {
  ElButton,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElSwitch,
} from 'element-plus';

import { ConfigService } from '#/api/system/config';
import { $t } from '#/locales';

import { convertStringNumbers, templateField } from '../schemas';

const visible = ref(false);
const formData = reactive<Record<string, any>>({});
const currentMode = ref('');

/** 兼容布尔、'true'、1 等写法 */
const isTrue = (value: any) =>
  value === true || value === 1 || value === '1' || value === 'true';

/** 签名有效期默认值（秒） */
const DEFAULT_TTL = 3600;

const fieldLabelMap: Record<string, Record<string, string>> = {
  root: { root: '根目录' },
  domain: { domain: '域名' },
  dirname: { dirname: '目录名' },
  accessKeyId: { accessKeyId: 'AccessKey ID' },
  accessKeySecret: { accessKeySecret: 'AccessKey Secret' },
  bucket: { bucket: 'Bucket' },
  endpoint: { endpoint: 'Endpoint' },
  region: { region: 'Region' },
  remark: { remark: '备注' },
  accessKey: { accessKey: 'AccessKey' },
  secretKey: { secretKey: 'SecretKey' },
  key: { key: 'Key' },
  secret: { secret: 'Secret' },
  version: { version: 'Version' },
  acl: { acl: 'ACL' },
  is_private: { is_private: '私有空间' },
  ttl: { ttl: '签名有效期(秒)' },
};

const currentGroupFields = computed(() => {
  const fields = templateField(currentMode.value);
  const result: Record<string, string> = {};
  fields.forEach((f: string) => {
    // 签名有效期只在开启私有空间后有实际意义
    if (f === 'ttl' && !isTrue(formData.is_private)) return;
    result[f] = fieldLabelMap[f]?.[f] || f;
  });
  return result;
});

const show = async (values: Record<string, any>) => {
  currentMode.value = values.mode || '';
  Object.assign(formData, values);
  // 加载当前供应商专属配置（限定 default 分组，与 admin 端 UploadScene::admin() 一致）
  const record = (await ConfigService.getByCode(currentMode.value, {
    group_code: 'default',
  })) as any;
  if (record) {
    const fieldKeys = templateField(currentMode.value);
    fieldKeys.forEach((key) => {
      if (record[key] !== undefined) {
        formData[key] = record[key];
      }
    });
  }
  // 私有开关为布尔值，缺省视为公开空间；签名有效期缺省 3600 秒
  if (templateField(currentMode.value).includes('is_private')) {
    formData.is_private = isTrue(record?.is_private);
  }
  if (templateField(currentMode.value).includes('ttl')) {
    formData.ttl = Number(record?.ttl) || DEFAULT_TTL;
  }
  // local 模式下根目录、目录名固定为 public/upload 且不可修改
  if (currentMode.value === 'local') {
    formData.root = 'public';
    formData.dirname = 'upload';
  }
  visible.value = true;
};

const handleClose = () => {
  Object.keys(formData).forEach((k) => delete formData[k]);
};

const handleSave = async () => {
  try {
    // 只保存当前供应商专属字段
    const config: Record<string, any> = {};
    const fieldKeys = templateField(currentMode.value);
    fieldKeys.forEach((key) => {
      if (formData[key] === undefined) return;
      config[key] = key === 'is_private' ? isTrue(formData[key]) : formData[key];
    });
    await ConfigService.update(currentMode.value, {
      group_code: 'default',
      code: currentMode.value,
      name:
        currentMode.value === 'local'
          ? '本地存储'
          : `${currentMode.value.toUpperCase()} 存储`,
      content: convertStringNumbers(config),
    });
    ElMessage.success($t('system.config.save_success'));
    visible.value = false;
  } catch {
    ElMessage.error($t('common.operation_failed'));
  }
};

defineExpose({ show });
</script>

<template>
  <ElDrawer
    v-model="visible"
    :title="$t('system.config.upload.advanced')"
    size="500px"
    @close="handleClose"
  >
    <ElForm :model="formData" label-width="120px">
      <template v-for="(label, key) in currentGroupFields" :key="key">
        <ElFormItem v-if="key === 'is_private'" :label="label">
          <div class="is-private-field">
            <ElSwitch v-model="formData[key]" />
            <div class="is-private-tip">
              开启后该空间为非公开读，前端不能自行拼接地址，需按资源 key 向接口换取带签名的临时直链
            </div>
          </div>
        </ElFormItem>
        <ElFormItem v-else-if="key === 'ttl'" :label="label">
          <ElInputNumber
            v-model="formData[key]"
            :min="60"
            :step="60"
            :placeholder="label"
          />
        </ElFormItem>
        <ElFormItem v-else :label="label">
          <ElInput
            v-model="formData[key]"
            :placeholder="label"
            :disabled="
              currentMode === 'local' && ['root', 'dirname'].includes(key)
            "
            clearable
          />
        </ElFormItem>
      </template>
    </ElForm>
    <template #footer>
      <ElButton @click="visible = false">{{ $t('common.cancel') }}</ElButton>
      <ElButton type="primary" @click="handleSave">
        {{ $t('system.config.save') }}
      </ElButton>
    </template>
  </ElDrawer>
</template>

<style scoped>
.is-private-field {
  width: 100%;
}

.is-private-tip {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}
</style>
