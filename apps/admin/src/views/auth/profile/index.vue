<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { ElMessage, ElTabPane, ElTabs } from 'element-plus';

import { ProfileService } from '#/api/auth/profile';
import Avatar from '#/components/form/components/avatar/index.vue';

import BaseSetting from './base-setting.vue';
import OnlineDevice from './online-device.vue';
import SecuritySetting from './security-setting.vue';

const userStore = useUserStore();
const activeTab = ref('basic');

// 头像 URL（双向绑定 Avatar 组件）
const avatarUrl = ref('');
watch(
  () => userStore.userInfo?.avatar,
  (val) => {
    avatarUrl.value = (val as string) || '';
  },
  { immediate: true },
);

// 头像上传成功回调
async function handleAvatarSuccess(newUrl: string) {
  if (!newUrl || newUrl === userStore.userInfo?.avatar) return;
  try {
    await ProfileService.updateAvatar({ avatar: newUrl });
    const info = userStore.userInfo as Record<string, any>;
    if (info) {
      userStore.setUserInfo({ ...info, avatar: newUrl } as any);
    }
    ElMessage.success('头像更新成功');
  } catch {
    ElMessage.error('头像更新失败');
  }
}

// 格式化部门
function formatDepts(depts: any[] | undefined): string {
  if (!depts || depts.length === 0) return '未分配部门';
  return depts.map((d: any) => d.name).join('，');
}

const userInfo = computed(
  () => (userStore.userInfo ?? {}) as Record<string, any>,
);
</script>

<template>
  <Page auto-content-height>
    <!-- 移动端：上下堆叠；桌面端：左右布局 -->
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:gap-4">
      <!-- ========== 左侧：个人信息卡片 ========== -->
      <div
        class="w-full rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden md:w-[340px] md:flex-none"
      >
        <!-- 顶部渐变背景 + 头像 -->
        <div
          class="relative min-h-28 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 flex items-end justify-center"
        >
          <div class="absolute -bottom-11 flex flex-col items-center w-full">
            <Avatar
              v-model="avatarUrl"
              shape="circle"
              class="avatar-upload cursor-pointer"
              @success="handleAvatarSuccess"
            />
          </div>
        </div>

        <!-- 姓名 / 用户名 -->
        <div class="mt-14 flex flex-col items-center gap-1 px-4 pb-2">
          <span class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{
              userInfo?.real_name ||
              userInfo?.realName ||
              userInfo?.username ||
              ''
            }}
          </span>
          <span class="text-sm text-gray-400">
            {{ userInfo?.user_name || userInfo?.username || '' }}
          </span>
        </div>

        <!-- 分割线 -->
        <div class="my-4 mx-6 h-px bg-gray-100 dark:bg-gray-700"></div>

        <!-- 个人简介 -->
        <div class="px-6 pb-2">
          <p class="text-sm text-gray-500 italic">
            {{ userInfo?.signed || '这个人很懒，什么都没有留下' }}
          </p>
        </div>

        <!-- 联系信息 -->
        <div class="px-6 pb-2 space-y-2 text-sm">
          <div class="flex items-center gap-2 text-gray-500">
            <span
              class="i-ant-design:mail-outlined w-4 h-4 text-blue-400"
            ></span>
            <span class="text-gray-700 dark:text-gray-300">{{
              userInfo?.email || '未设置邮箱'
            }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500">
            <span
              class="i-ant-design:phone-outlined w-4 h-4 text-green-400"
            ></span>
            <span class="text-gray-700 dark:text-gray-300">{{
              userInfo?.mobile_phone || '未设置手机'
            }}</span>
          </div>
          <div
            v-if="userInfo?.address"
            class="flex items-center gap-2 text-gray-500"
          >
            <span
              class="i-ant-design:environment-outlined w-4 h-4 text-orange-400"
            ></span>
            <span class="text-gray-700 dark:text-gray-300">{{
              userInfo.address
            }}</span>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="my-3 mx-6 h-px bg-gray-100 dark:bg-gray-700"></div>

        <!-- 部门 & 角色 -->
        <div class="px-6 pb-6 space-y-3 text-sm">
          <div class="flex items-start gap-2">
            <span
              class="i-ant-design:cluster-outlined w-4 h-4 mt-0.5 text-purple-400 shrink-0"
            ></span>
            <span class="text-gray-700 dark:text-gray-300">{{
              formatDepts(userInfo?.depts)
            }}</span>
          </div>
          <div class="flex items-start gap-2">
            <span
              class="i-ant-design:safety-certificate-outlined w-4 h-4 mt-0.5 text-red-400 shrink-0"
            ></span>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="role in userInfo?.roles || []"
                :key="role.id"
                class="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
              >
                {{ role.name }}
              </span>
              <span v-if="!userInfo?.roles?.length" class="text-gray-400">未分配角色</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== 右侧：标签页内容 ========== -->
      <div
        class="flex-1 min-w-0 rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4 md:p-6"
        style="min-height: 60vh"
      >
        <ElTabs v-model="activeTab" class="profile-tabs">
          <ElTabPane label="基本设置" name="basic">
            <BaseSetting />
          </ElTabPane>
          <ElTabPane label="安全设置" name="security">
            <SecuritySetting />
          </ElTabPane>
          <ElTabPane label="在线设备" name="device">
            <OnlineDevice />
          </ElTabPane>
        </ElTabs>
      </div>
    </div>
  </Page>
</template>

<style scoped>
/* 头像上传组件尺寸 */
.avatar-upload {
  cursor: pointer;
}

:deep(.avatar-upload .el-upload--picture-card) {
  width: 88px;
  height: 88px;
  overflow: hidden;
  background: #fff;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}

/* Tabs 样式微调 */
.profile-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

.profile-tabs :deep(.el-tabs__item) {
  height: 44px;
  font-size: 15px;
  line-height: 44px;
}
</style>
