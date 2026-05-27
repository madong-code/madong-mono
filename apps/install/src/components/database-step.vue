<template>
  <div class="database-step">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="90px" class="db-form">
      <div class="form-grid">
        <el-form-item label="主机地址" prop="host">
          <el-input v-model="formData.host" placeholder="localhost" prefix-icon="Monitor" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input-number v-model="formData.port" :min="1" :max="65535" :controls="false" class="port-input" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="root" prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="数据库密码" show-password />
        </el-form-item>
        <el-form-item label="数据库名" prop="database">
          <el-input v-model="formData.database" placeholder="madong" />
        </el-form-item>
        <el-form-item label="表前缀" prop="prefix">
          <el-input v-model="formData.prefix" placeholder="md_" />
        </el-form-item>
      </div>
    </el-form>

    <div v-if="testResult" class="test-result" :class="testResult.type === 'success' ? 'tr-ok' : 'tr-err'">
      <el-icon :size="16"><CircleCheckFilled v-if="testResult.type === 'success'" /><CircleCloseFilled v-else /></el-icon>
      <div><strong>{{ testResult.title }}</strong><p>{{ testResult.description }}</p></div>
    </div>

    <div class="step-actions">
      <button class="btn btn-ghost" @click="$emit('prev')"><el-icon><ArrowLeft /></el-icon> 上一步</button>
      <div>
        <button class="btn btn-ghost" @click="testConnection" :disabled="testing"><el-icon><Connection /></el-icon> 测试连接</button>
        <button class="btn btn-primary" :disabled="!formValid" @click="handleNext">下一步 <el-icon><ArrowRight /></el-icon></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ArrowLeft, ArrowRight, Connection, CircleCheckFilled, CircleCloseFilled, Monitor, User } from "@element-plus/icons-vue";
import { useInstallStore } from "@/store/module/install";
import type { FormInstance, FormRules } from "element-plus";
import installApi from "@/api/install";

const installStore = useInstallStore();
const formRef = ref<FormInstance>();
const testing = ref(false);
const formData = reactive({ ...installStore.databaseConfig });
const testResult = ref<{ title: string; type: "success" | "error"; description: string } | null>(null);
const formValid = computed(() => formData.host && formData.port && formData.username && formData.database && formData.prefix);

const rules: FormRules = {
  host: [{ required: true, message: "请输入主机地址", trigger: "blur" }],
  port: [{ required: true, message: "请输入端口", trigger: "blur" }],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  database: [{ required: true, message: "请输入数据库名", trigger: "blur" }],
  prefix: [{ required: true, message: "请输入表前缀", trigger: "blur" }],
};

const testConnection = async () => {
  testing.value = true; testResult.value = null;
  installApi.testDatabase(formData).then((res: any) => {
    testResult.value = res.code === 0
      ? { title: "连接成功", type: "success", description: "数据库连接测试通过，可以继续安装" }
      : { title: "连接失败", type: "error", description: res.msg || "请检查数据库配置" };
  }).finally(() => { testing.value = false; });
};

const handleNext = async () => {
  if (formRef.value) {
    try { await formRef.value.validate(); installStore.updateDatabaseConfig(formData); emit("next"); }
    catch (_) {}
  }
};

const emit = defineEmits<{ prev: []; next: [] }>();
</script>

<style lang="scss" scoped>
.database-step { }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }

.db-form {
  :deep(.el-form-item) { margin-bottom: 16px; }
  :deep(.el-form-item__label) { font-weight: 500; color: var(--text-secondary); font-size: 13px; }
  :deep(.el-input__wrapper) { border-radius: 8px; }
  :deep(.el-input__inner) { height: 36px; }
}
.port-input { :deep(.el-input-number__wrapper) { width: 100%; } }

.test-result { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 13px;
  &.tr-ok { background: rgba(16,185,129,.08); } &.tr-err { background: rgba(239,68,68,.08); }
  strong { display: block; color: var(--text-primary); margin-bottom: 2px; } p { color: var(--text-tertiary); margin: 0; font-size: 12px; }
}

.step-actions { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; }

.btn {
  height: 36px; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; border: none; transition: all .2s;
  .el-icon { font-size: 14px; }
}
.btn-ghost { background: var(--btn-ghost-bg); color: var(--btn-ghost-color); &:hover { background: var(--btn-ghost-hover); color: var(--btn-ghost-hover-color); } &:disabled { opacity: .4; cursor: not-allowed; } }
.btn-primary { background: linear-gradient(135deg,#409eff,#6366f1); color: #fff; margin-left: 8px; box-shadow: 0 3px 12px rgba(64,158,255,.25); &:hover:not(:disabled) { box-shadow: 0 5px 18px rgba(64,158,255,.35); } &:disabled { opacity: .4; cursor: not-allowed; } }
</style>
