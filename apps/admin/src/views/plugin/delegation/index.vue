<script setup lang="ts">
import { onMounted, ref } from 'vue';

// eslint-disable-next-line n/no-extraneous-import
import { Hide, Key, View } from '@element-plus/icons-vue';

import { ToolsAuthService } from '#/api/plugin';
import { Page } from '#/components/page';
import { $t } from '#/locales';

import AuthDialog from './authorization.vue';

interface AuthInfo {
  company_name: string;
  domain: string;
  auth_code: string;
}

const authInfo = ref<AuthInfo>({ company_name: '', domain: '', auth_code: '' });
const isCodeVisible = ref(false);
const authDialogRef = ref();

const toggleCodeVisibility = () => {
  isCodeVisible.value = !isCodeVisible.value;
};
const hideAuthCode = (code: string) =>
  code ? code.replaceAll(/.(?=.{4})/g, '*') : '--';

onMounted(async () => {
  try {
    authInfo.value = (await ToolsAuthService.getAuthInfo()) || {};
  } catch {}
});
</script>

<template>
  <Page auto-content-height>
    <el-card>
      <div class="title text-base font-bold text-gray-900 mb-8">
        {{ $t('tools.delegation.title') }}
      </div>
      <div class="flex items-center">
        <div class="w-24 h-24 rounded-lg flex justify-center items-center mr-5">
          <el-icon :size="64" color="#409EFF"><Key /></el-icon>
        </div>
        <div class="flex flex-col justify-between font-medium">
          <div class="flex flex-wrap items-center mb-3">
            <span class="mr-1.5 text-sm text-gray-600 w-25 text-left">{{ $t('tools.delegation.company') }}：</span>
            <span class="text-sm text-gray-800">{{
              authInfo.company_name || '--'
            }}</span>
          </div>
          <div class="flex flex-wrap items-center mb-3">
            <span class="mr-1.5 text-sm text-gray-600 w-25 text-left">{{ $t('tools.delegation.domain') }}：</span>
            <span class="text-sm text-gray-800">{{
              authInfo.domain || '--'
            }}</span>
          </div>
          <div class="flex flex-wrap items-center">
            <span class="mr-1.5 text-sm text-gray-600 w-25 text-left">{{ $t('tools.delegation.auth_code') }}：</span>
            <span class="text-sm text-gray-800">
              <span class="mr-2.5">{{
                isCodeVisible
                  ? authInfo.auth_code
                  : hideAuthCode(authInfo.auth_code) || '--'
              }}</span>
              <el-icon
                v-if="!isCodeVisible"
                @click="toggleCodeVisibility"
                class="text-sm cursor-pointer text-gray-500"
                ><View /></el-icon>
              <el-icon
                v-else
                @click="toggleCodeVisibility"
                class="text-sm cursor-pointer text-gray-500"
                ><Hide /></el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-card>
    <AuthDialog ref="authDialogRef" />
  </Page>
</template>
