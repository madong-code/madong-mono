<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';

import { useInstallStore } from '@/store/module/install';
import {
  ArrowLeft,
  Loading,
  Refresh,
  Setting,
  User,
  VideoPlay,
} from '@element-plus/icons-vue';

defineEmits<{ prev: [] }>();
const installStore = useInstallStore();
const formRef = ref<FormInstance>();
const terminalRef = ref<HTMLElement>();
const installing = ref(false);

const formData = reactive({
  username: installStore.adminConfig.username,
  password: installStore.adminConfig.password,
  confirmPassword: installStore.adminConfig.password,
  email: installStore.adminConfig.email,
  siteName: installStore.adminConfig.site_name,
  installDatabase: installStore.adminConfig.install_database,
  buildProject: installStore.adminConfig.build_project,
});

const installProgress = computed(() => installStore.install_progress);
const installStatus = computed(() => installStore.install_status);
const installLogs = computed(() => installStore.install_logs);
const tenantStatusText = computed(() => {
  const mode = installStore.tenantConfig.tenant_mode;
  if (mode === 'none') return '未启用（可上一步开启）';
  if (mode === 'auto')
    return `已启用 · 自动创建默认租户：${
      installStore.tenantConfig.default_tenant_name || '默认'
    }`;
  return '已启用 · 安装后手动管理租户';
});

const scrollT = () => {
  nextTick(() => {
    if (terminalRef.value)
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
  });
};
onMounted(() => scrollT());
watch(
  () => installLogs.value.length,
  () => scrollT(),
);

const rules: FormRules = {
  username: [
    { required: true, trigger: 'blur' },
    { min: 3, max: 20, message: '3~20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_, v, cb) =>
        v === formData.password ? cb() : cb(new Error('密码不一致')),
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, trigger: 'blur' },
    { type: 'email', message: '邮箱格式错误', trigger: 'blur' },
  ],
  siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
};

const startInstallation = async () => {
  installing.value = true;
  if (formRef.value) {
    try {
      await formRef.value.validate();
      installStore.updateAdminConfig({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        site_name: formData.siteName,
        install_database: formData.installDatabase,
        build_project: formData.buildProject,
        enable_tenant: installStore.tenantConfig.enable_tenant,
      });
      installStore.updateTenantConfig({
        enable_tenant: installStore.tenantConfig.enable_tenant,
      });
      await installStore.simulateInstallation();
    } catch {
      // 只有表单验证失败时恢复表单，安装错误保留进度视图
      if (installStore.install_status === 'idle') {
        installing.value = false;
      }
    }
  }
};

/** 返回配置表单（重置安装状态） */
const goBackForm = () => {
  installStore.resetInstall();
  installing.value = false;
};

/** 重试安装 */
const retryInstallation = () => {
  installStore.resetInstall();
  startInstallation();
};

onUnmounted(() => {
  if (installing.value) installStore.resetInstall();
});
</script>

<template>
  <div class="config-step">
    <!-- 安装进度 -->
    <div v-if="installing" class="progress-view">
      <div class="console-box">
        <div class="console-bar">
          <span class="cb-dot"></span><span class="cb-dot" style="background: #e6a23c"></span><span class="cb-dot" style="background: #67c23a"></span>
          <span class="cb-title">安装进程</span>
        </div>
        <div class="console-body" ref="terminalRef">
          <div v-for="(log, i) in installLogs" :key="i" class="cl-line">
            <span class="cl-ts">{{ log.split(']')[0] }}]</span>
            <span class="cl-msg">{{ log.split(']')[1] }}</span>
          </div>
          <div v-if="installStatus === 'installing'" class="cl-cursor">_</div>
        </div>
      </div>

      <div class="progress-block">
        <div class="pb-info">
          <span>安装进度</span>
          <span
            :class="
              installStatus === 'success'
                ? 'c-green'
                : installStatus === 'error'
                  ? 'c-red'
                  : 'c-blue'
            "
          >
            <template v-if="installStatus === 'installing'"><el-icon class="spin"><Loading /></el-icon> 安装中...</template>
            <template v-else-if="installStatus === 'success'">✓ 完成</template>
            <template v-else-if="installStatus === 'error'">✗ 失败</template>
            <template v-else>{{ installProgress }}%</template>
          </span>
        </div>
        <div class="pb-track">
          <div
            class="pb-fill"
            :style="{ width: `${installProgress}%` }"
            :class="
              installStatus === 'success'
                ? 'f-green'
                : installStatus === 'error'
                  ? 'f-red'
                  : 'f-blue'
            "
          ></div>
        </div>
      </div>
    </div>

    <!-- 配置表单 -->
    <div v-else class="config-form">
      <div class="form-row">
        <div class="form-card">
          <div class="fc-title">
            <el-icon color="#409eff"><User /></el-icon> 管理员信息
          </div>
          <el-form
            :model="formData"
            :rules="rules"
            ref="formRef"
            label-width="80px"
            class="inner-form"
          >
            <el-form-item label="账号" prop="username">
              <el-input v-model="formData.username" placeholder="admin" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="至少6位"
                show-password
              />
            </el-form-item>
            <el-form-item label="确认" prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="再次输入"
                show-password
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="formData.email"
                placeholder="admin@madong.tech"
              />
            </el-form-item>
            <el-form-item label="网站" prop="siteName">
              <el-input
                v-model="formData.siteName"
                placeholder="Madong管理系统"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="form-card">
          <div class="fc-title">
            <el-icon color="#e6a23c"><Setting /></el-icon> 安装选项
          </div>
          <div class="opt-list">
            <label class="opt-item">
              <span class="opt-text"><strong>安装数据库</strong><small>创建并导入数据表</small></span>
              <el-switch v-model="formData.installDatabase" />
            </label>
            <label class="opt-item">
              <span class="opt-text"><strong>构建打包</strong><small>编译前端资源</small></span>
              <el-switch v-model="formData.buildProject" />
            </label>
            <label class="opt-item">
              <span class="opt-text">
                <strong>多租户</strong>
                <small>{{ tenantStatusText }}</small>
              </span>
              <el-switch
                :model-value="installStore.tenantConfig.enable_tenant"
                disabled
              />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 安装中/安装结果按钮 -->
    <div v-if="installing" class="step-actions">
      <button
        v-if="installStatus === 'error'"
        class="btn btn-ghost"
        @click="goBackForm"
      >
        <el-icon><ArrowLeft /></el-icon> 返回表单
      </button>
      <div v-else></div>
      <div class="btn-group">
        <button
          v-if="installStatus === 'error'"
          class="btn btn-warning"
          @click="retryInstallation"
        >
          <el-icon><Refresh /></el-icon> 重试安装
        </button>
      </div>
    </div>

    <!-- 配置表单按钮 -->
    <div class="step-actions" v-if="!installing">
      <button class="btn btn-ghost" @click="$emit('prev')">
        <el-icon><ArrowLeft /></el-icon> 上一步
      </button>
      <button class="btn btn-primary" @click="startInstallation">
        <el-icon><VideoPlay /></el-icon> 开始安装
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  min-height: 280px;
}

.form-card {
  padding: 20px;
  background: rgb(255 255 255 / 3%);
  border-radius: 10px;

  .fc-title {
    display: flex;
    gap: 6px;
    align-items: center;
    padding-bottom: 12px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }
}

.inner-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
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

.opt-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.opt-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  .opt-text {
    strong {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    small {
      font-size: 12px;
      color: var(--text-tertiary);
    }
  }
}

/* 终端 */
.progress-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.console-box {
  display: flex;
  flex-direction: column;
  min-height: 220px;
  max-height: calc(100vh - 390px);
  overflow: hidden;
  background: #1e1e1e;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
}

.console-bar {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  background: #252526;
  border-bottom: 1px solid #333;

  .cb-dot {
    width: 10px;
    height: 10px;
    background: #f56c6c;
    border-radius: 50%;
  }

  .cb-title {
    margin-left: auto;
    font-family: monospace;
    font-size: 11px;
    color: #888;
  }
}

.console-body {
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  flex: 1;
  padding: 12px 14px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.7;

  .cl-line {
    display: flex;
  }

  .cl-ts {
    flex-shrink: 0;
    margin-right: 8px;
    color: #6a9955;
  }

  .cl-msg {
    color: #d4d4d4;
  }

  .cl-cursor {
    color: #67c23a;
    animation: blink 1s step-end infinite;
  }
}

.console-body::-webkit-scrollbar {
  width: 4px;
}

.console-body::-webkit-scrollbar-thumb {
  background: rgb(255 255 255 / 8%);
  border-radius: 4px;
}

.progress-block {
  padding: 14px 18px;
  background: var(--btn-ghost-bg);
  border-radius: 8px;
}

.pb-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--text-tertiary);

  .c-green {
    display: flex;
    gap: 4px;
    align-items: center;
    font-weight: 600;
    color: #67c23a;
  }

  .c-red {
    font-weight: 600;
    color: #f56c6c;
  }

  .c-blue {
    display: flex;
    gap: 4px;
    align-items: center;
    font-weight: 600;
    color: #409eff;
  }
}

.pb-track {
  height: 6px;
  overflow: hidden;
  background: var(--border-subtle);
  border-radius: 3px;
}

.pb-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;

  &.f-blue {
    background: linear-gradient(90deg, #409eff, #6366f1);
  }

  &.f-green {
    background: #67c23a;
  }

  &.f-red {
    background: #f56c6c;
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
}

.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, #409eff, #6366f1);
  box-shadow: 0 3px 12px rgb(64 158 255 / 25%);

  &:hover {
    box-shadow: 0 5px 18px rgb(64 158 255 / 35%);
  }
}

.btn-warning {
  color: #fff;
  background: linear-gradient(135deg, #e6a23c, #f56c6c);
  box-shadow: 0 3px 12px rgb(230 162 60 / 25%);

  &:hover {
    box-shadow: 0 5px 18px rgb(230 162 60 / 35%);
  }
}

.btn-group {
  display: flex;
  gap: 8px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
