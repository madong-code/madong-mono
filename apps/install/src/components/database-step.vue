<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

import { computed, reactive, ref } from 'vue';

import installApi from '@/api/install';
import { useInstallStore } from '@/store/module/install';
import {
  ArrowLeft,
  ArrowRight,
  CircleCheckFilled,
  CircleCloseFilled,
  Connection,
  Monitor,
} from '@element-plus/icons-vue';

const emit = defineEmits<{ next: []; prev: [] }>();
const installStore = useInstallStore();
const formRef = ref<FormInstance>();
const testing = ref(false);
const formData = reactive({ ...installStore.databaseConfig });
const testResult = ref<null | {
  description: string;
  title: string;
  type: 'error' | 'success';
}>(null);
const formValid = computed(
  () =>
    formData.host &&
    formData.port &&
    formData.username &&
    formData.database &&
    formData.prefix &&
    formData.redisHost &&
    formData.redisPort,
);

const rules: FormRules = {
  host: [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  database: [{ required: true, message: '请输入数据库名', trigger: 'blur' }],
  prefix: [{ required: true, message: '请输入表前缀', trigger: 'blur' }],
  redisHost: [
    { required: true, message: '请输入 Redis 主机地址', trigger: 'blur' },
  ],
  redisPort: [
    { required: true, message: '请输入 Redis 端口', trigger: 'blur' },
  ],
};

const testConnection = async () => {
  testing.value = true;
  testResult.value = null;
  installApi
    .testDatabase(formData)
    .then((res: any) => {
      const desc = res.data?.message || res.msg || '';
      testResult.value =
        res.code === 0
          ? {
              title: '连接成功',
              type: 'success',
              description: desc || '连接测试通过',
            }
          : {
              title: '连接失败',
              type: 'error',
              description: desc || '请检查配置',
            };
    })
    .finally(() => {
      testing.value = false;
    });
};

const handleNext = async () => {
  if (formRef.value) {
    try {
      await formRef.value.validate();
      installStore.updateDatabaseConfig(formData);
      emit('next');
    } catch {}
  }
};
</script>

<template>
  <div class="database-step">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-width="90px"
      class="db-form"
    >
      <div class="db-section">
        <div class="section-title">
          <el-icon><Monitor /></el-icon> 数据库配置
        </div>
        <div class="form-grid">
          <el-form-item label="主机地址" prop="host">
            <el-input v-model="formData.host" placeholder="localhost" />
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input
              v-model.number="formData.port"
              type="number"
              :min="1"
              :max="65535"
              placeholder="3306"
            />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" placeholder="root" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="数据库密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="数据库名" prop="database">
            <el-input v-model="formData.database" placeholder="madong_saas" />
          </el-form-item>
          <el-form-item label="表前缀" prop="prefix">
            <el-input v-model="formData.prefix" placeholder="md_" />
          </el-form-item>
        </div>
      </div>

      <div class="redis-section">
        <div class="section-title">
          <el-icon><Connection /></el-icon> Redis 配置
        </div>
        <div class="form-grid">
          <el-form-item label="主机地址" prop="redisHost">
            <el-input v-model="formData.redisHost" placeholder="127.0.0.1" />
          </el-form-item>
          <el-form-item label="端口" prop="redisPort">
            <el-input
              v-model.number="formData.redisPort"
              type="number"
              :min="1"
              :max="65535"
              placeholder="6379"
            />
          </el-form-item>
          <el-form-item label="密码" prop="redisPassword">
            <el-input
              v-model="formData.redisPassword"
              type="password"
              placeholder="Redis 密码（可选）"
              show-password
            />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <div
      v-if="testResult"
      class="test-result"
      :class="testResult.type === 'success' ? 'tr-ok' : 'tr-err'"
    >
      <el-icon :size="16">
        <CircleCheckFilled
          v-if="testResult.type === 'success'"
        /><CircleCloseFilled v-else />
      </el-icon>
      <div>
        <strong>{{ testResult.title }}</strong>
        <p>{{ testResult.description }}</p>
      </div>
    </div>

    <div class="step-actions">
      <button class="btn btn-ghost" @click="$emit('prev')">
        <el-icon><ArrowLeft /></el-icon> 上一步
      </button>
      <div>
        <button
          class="btn btn-ghost"
          @click="testConnection"
          :disabled="testing"
        >
          <el-icon><Connection /></el-icon> 测试连接
        </button>
        <button
          class="btn btn-primary"
          :disabled="!formValid"
          @click="handleNext"
        >
          下一步 <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;
}

.db-form {
  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }

  :deep(.el-input__inner) {
    height: 36px;
  }
}

.test-result {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 13px;
  border-radius: 8px;

  &.tr-ok {
    background: rgb(16 185 129 / 8%);
  }

  &.tr-err {
    background: rgb(239 68 68 / 8%);
  }

  strong {
    display: block;
    margin-bottom: 2px;
    color: var(--text-primary);
  }

  p {
    margin: 0;
    font-size: 12px;
    color: var(--text-tertiary);
  }
}

.step-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
}

.btn {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  transition: all 0.2s;

  .el-icon {
    font-size: 14px;
  }
}

.btn-ghost {
  color: var(--btn-ghost-color);
  background: var(--btn-ghost-bg);

  &:hover {
    color: var(--btn-ghost-hover-color);
    background: var(--btn-ghost-hover);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}

.btn-primary {
  margin-left: 8px;
  color: #fff;
  background: linear-gradient(135deg, #409eff, #6366f1);
  box-shadow: 0 3px 12px rgb(64 158 255 / 25%);

  &:hover:not(:disabled) {
    box-shadow: 0 5px 18px rgb(64 158 255 / 35%);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}

.db-section {
  margin-bottom: 8px;
}

.redis-section {
  padding-top: 16px;
  margin-top: 20px;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.section-title {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);

  .el-icon {
    font-size: 15px;
    color: var(--el-color-primary);
  }
}
</style>
