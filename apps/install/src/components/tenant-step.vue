<template>
  <div class="tenant-step">
    <!-- 三场景选择 -->
    <div class="scenario-list">
      <div
        v-for="opt in scenarios"
        :key="opt.value"
        class="scenario-card"
        :class="{ active: activeMode === opt.value }"
        @click="activeMode = opt.value"
      >
        <div class="sc-radio">
          <div class="sc-dot" :class="{ 'dot-active': activeMode === opt.value }">
            <div v-if="activeMode === opt.value" class="sc-inner"></div>
          </div>
        </div>
        <div class="sc-body">
          <div class="sc-icon" :style="{ '--ic': opt.color }">
            <el-icon :size="18"><component :is="opt.icon" /></el-icon>
          </div>
          <div>
            <h4>{{ opt.title }}</h4>
            <p>{{ opt.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 场景2：自动创建默认租户的配置表单 -->
    <transition name="expand">
      <div v-if="activeMode === 'auto'" class="tenant-form-box">
        <div class="tf-header">
          <el-tag color="#e6a23c" effect="dark" size="small">默认租户配置</el-tag>
          <span class="tf-hint">安装后将自动创建默认租户和管理员</span>
        </div>
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="130px" class="tf-form">
          <el-form-item label="默认租户名称" prop="default_tenant_name">
            <el-input v-model="formData.default_tenant_name" placeholder="默认租户" />
          </el-form-item>
          <el-form-item label="租户管理员账号" prop="tenant_admin_username">
            <el-input v-model="formData.tenant_admin_username" placeholder="tenant_admin" />
          </el-form-item>
          <el-form-item label="租户管理员密码" prop="tenant_admin_password">
            <el-input v-model="formData.tenant_admin_password" type="password" placeholder="至少6位" show-password />
          </el-form-item>
          <el-form-item label="租户管理员邮箱" prop="tenant_admin_email">
            <el-input v-model="formData.tenant_admin_email" placeholder="tenant@example.com" />
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <div class="step-actions">
      <button class="btn btn-ghost" @click="$emit('prev')"><el-icon><ArrowLeft /></el-icon> 上一步</button>
      <button class="btn btn-primary" @click="handleNext">下一步 <el-icon><ArrowRight /></el-icon></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ArrowLeft, ArrowRight, InfoFilled, Switch, User } from "@element-plus/icons-vue";
import { useInstallStore } from "@/store/module/install";
import type { FormInstance, FormRules, Component } from "vue";
import type { TenantMode } from "@/types/install";

const installStore = useInstallStore();
const formRef = ref<FormInstance>();

const scenarios = [
  {
    value: 'none' as TenantMode,
    icon: 'InfoFilled' as any,
    color: '#8e8ea0',
    title: '不启用多租户',
    desc: '单租户模式运行，所有用户共享同一数据空间',
  },
  {
    value: 'auto' as TenantMode,
    icon: 'Switch' as any,
    color: '#e6a23c',
    title: '启用并创建默认租户',
    desc: '安装时自动创建默认租户及管理员账号',
  },
  {
    value: 'manual' as TenantMode,
    icon: 'User' as any,
    color: '#409eff',
    title: '启用多租户，稍后管理',
    desc: '安装后登录后台手动创建租户',
  },
]

const activeMode = ref<TenantMode>(installStore.tenantConfig.tenant_mode || 'none')

const formData = reactive({
  default_tenant_name: installStore.tenantConfig.default_tenant_name || '默认租户',
  tenant_admin_username: installStore.tenantConfig.tenant_admin_username || 'tenant_admin',
  tenant_admin_password: installStore.tenantConfig.tenant_admin_password || '123456',
  tenant_admin_email: installStore.tenantConfig.tenant_admin_email || 'tenant@example.com',
})

const needValidate = computed(() => activeMode.value === 'auto')

const rules: FormRules = {
  default_tenant_name: [{ required: true, message: '请输入默认租户名称', trigger: 'blur' }],
  tenant_admin_username: [{ required: true, message: '请输入租户管理员账号', trigger: 'blur' }],
  tenant_admin_password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' },
  ],
  tenant_admin_email: [{ required: true, message: '请输入租户管理员邮箱', trigger: 'blur' }, { type: 'email', message: '邮箱格式错误', trigger: 'blur' }],
}

const handleNext = async () => {
  if (needValidate.value && formRef.value) {
    try { await formRef.value.validate() } catch (_) { return }
  }
  installStore.updateTenantConfig({
    tenant_mode: activeMode.value,
    default_tenant_name: formData.default_tenant_name,
    tenant_admin_username: formData.tenant_admin_username,
    tenant_admin_password: formData.tenant_admin_password,
    tenant_admin_email: formData.tenant_admin_email,
  })
  emit("next")
}

const emit = defineEmits<{ prev: []; next: [] }>();
</script>

<style lang="scss" scoped>
.tenant-step {}

.scenario-list {
  display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;
}

.scenario-card {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 18px; border-radius: 10px;
  background: var(--btn-ghost-bg);
  border: 1.5px solid transparent;
  cursor: pointer; transition: all .2s;

  &:hover { background: var(--btn-ghost-hover); }

  &.active {
    border-color: var(--info-color);
    background: rgba(64,158,255,.04);
    box-shadow: 0 0 0 1px rgba(64,158,255,.1);
  }

  .sc-radio { flex-shrink: 0; }
  .sc-dot {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid var(--text-muted);
    display: flex; align-items: center; justify-content: center;
    transition: border-color .2s;

    &.dot-active {
      border-color: var(--info-color);
      .sc-inner {
        width: 8px; height: 8px; border-radius: 50%;
        background: var(--info-color);
      }
    }
  }

  .sc-body {
    display: flex; align-items: center; gap: 12px; flex: 1;
  }

  .sc-icon {
    width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
    background: color-mix(in srgb, var(--ic) 12%, transparent);
    display: flex; align-items: center; justify-content: center;
    color: var(--ic);
  }

  h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
  p { font-size: 12px; color: var(--text-tertiary); margin: 0; }
}

.expand-enter-active, .expand-leave-active { transition: all .3s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 400px; }

.tenant-form-box {
  background: var(--btn-ghost-bg); border-radius: 10px; padding: 20px; margin-bottom: 16px;

  .tf-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .tf-hint { font-size: 12px; color: var(--text-tertiary); }

  .tf-form {
    :deep(.el-form-item) { margin-bottom: 14px; }
    :deep(.el-form-item__label) { font-weight: 500; color: var(--text-secondary); font-size: 13px; }
    :deep(.el-input__wrapper) { border-radius: 8px; }
    :deep(.el-input__inner) { height: 36px; }
  }
}

.step-actions { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; }

.btn {
  height: 36px; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; border: none; transition: all .2s;
  .el-icon { font-size: 14px; }
}
.btn-ghost { background: var(--btn-ghost-bg); color: var(--btn-ghost-color); &:hover { background: var(--btn-ghost-hover); color: var(--btn-ghost-hover-color); } }
.btn-primary { background: linear-gradient(135deg,#409eff,#6366f1); color: #fff; margin-left: 8px; box-shadow: 0 3px 12px rgba(64,158,255,.25); &:hover { box-shadow: 0 5px 18px rgba(64,158,255,.35); } }
</style>
