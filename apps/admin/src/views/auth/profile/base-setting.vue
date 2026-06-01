<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

import { onMounted, reactive, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import {
  ElButton,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElRow,
  ElSelect,
} from 'element-plus';

import { ProfileService } from '#/api/auth/profile';

const userStore = useUserStore();

const isEdit = ref(false);
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
  real_name: '',
  nick_name: '',
  sex: 0,
  email: '',
  mobile_phone: '',
  address: '',
  signed: '',
});

const sexOptions = [
  { value: 0, label: '未知' },
  { value: 1, label: '男' },
  { value: 2, label: '女' },
];

const rules: FormRules = {
  real_name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  nick_name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change'],
    },
  ],
  mobile_phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
};

async function loadProfile() {
  try {
    const resp = (await ProfileService.getProfile()) as any;
    form.real_name = resp.real_name || '';
    form.nick_name = resp.nick_name || '';
    form.sex = resp.sex ?? 0;
    form.email = resp.email || '';
    form.mobile_phone = resp.mobile_phone || '';
    form.address = resp.address || '';
    form.signed = resp.signed || '';
  } catch {
    ElMessage.error('加载用户信息失败');
  }
}

async function handleSave() {
  if (!isEdit.value) {
    isEdit.value = true;
    return;
  }

  try {
    await formRef.value?.validate();
    await ElMessageBox.confirm('确定要保存个人信息吗？', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    loading.value = true;
    await ProfileService.updateProfile({ ...form });

    // 刷新 store
    const newUser = (await ProfileService.getProfile()) as any;
    userStore.setUserInfo(newUser);

    ElMessage.success('个人信息更新成功');
    isEdit.value = false;
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('保存失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
}

function handleCancel() {
  isEdit.value = false;
  loadProfile();
}

onMounted(() => {
  loadProfile();
});
</script>

<template>
  <div class="base-setting">
    <div class="setting-card">
      <div class="card-header">
        <h3>基本资料</h3>
        <p class="card-desc">
          管理你的个人基本信息，这些信息将展示在你的个人主页
        </p>
      </div>

      <ElForm
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="left"
        class="setting-form"
      >
        <ElRow :gutter="24">
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="真实姓名" prop="real_name">
              <ElInput
                v-model="form.real_name"
                :disabled="!isEdit"
                placeholder="请输入真实姓名"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="昵称" prop="nick_name">
              <ElInput
                v-model="form.nick_name"
                :disabled="!isEdit"
                placeholder="请输入昵称"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="性别" prop="sex">
              <ElSelect
                v-model="form.sex"
                :disabled="!isEdit"
                placeholder="请选择性别"
              >
                <ElOption
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="邮箱" prop="email">
              <ElInput
                v-model="form.email"
                :disabled="!isEdit"
                placeholder="请输入邮箱"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="手机号码" prop="mobile_phone">
              <ElInput
                v-model="form.mobile_phone"
                :disabled="!isEdit"
                placeholder="请输入手机号码"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="地址" prop="address">
              <ElInput
                v-model="form.address"
                :disabled="!isEdit"
                placeholder="请输入地址"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElFormItem label="个人签名" prop="signed">
          <ElInput
            v-model="form.signed"
            type="textarea"
            :rows="3"
            :disabled="!isEdit"
            placeholder="写一句话介绍自己..."
          />
        </ElFormItem>

        <ElFormItem>
          <div class="form-actions">
            <ElButton v-if="isEdit" @click="handleCancel">取消</ElButton>
            <ElButton type="primary" :loading="loading" @click="handleSave">
              {{ isEdit ? '保存' : '编辑' }}
            </ElButton>
          </div>
        </ElFormItem>
      </ElForm>
    </div>
  </div>
</template>

<style scoped>
.base-setting {
  max-width: 720px;
}

.setting-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.card-header {
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.card-desc {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.setting-form {
  max-width: 600px;
}

.form-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}
</style>
