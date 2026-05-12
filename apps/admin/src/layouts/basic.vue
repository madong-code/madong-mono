<script lang="ts" setup>
import type { NotificationItem } from '#/components/notification-drawer/types';

import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';
import { useWatermark } from '@vben/hooks';
import { BookOpenText, CircleHelp, SvgGithubIcon } from '@vben/icons';
import {
  BasicLayout,
  LockScreen,
  UserDropdown,
} from '@vben/layouts';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { NotificationDrawer } from '#/components/notification-drawer';
import { $t } from '#/locales';
import { useAuthStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

const notifications = ref<NotificationItem[]>([
  {
    id: 1,
    category: 'daily',
    date: '3小时前',
    isRead: true,
    content: '收到了 14 份新周报，请及时查收',
    title: '收到了 14 份新周报',
  },
  {
    id: 2,
    category: 'daily',
    date: '刚刚',
    isRead: false,
    content: '朱偏右 在项目讨论中回复了你',
    title: '朱偏右 回复了你',
  },
  {
    id: 3,
    category: 'daily',
    date: '2024-01-01',
    isRead: false,
    content: '曲丽丽 评论了你的工作日志',
    title: '曲丽丽 评论了你',
  },
  {
    id: 4,
    category: 'attendance',
    date: '1天前',
    isRead: false,
    content: '你有一条待审批的加班申请',
    title: '加班申请待审批',
  },
  {
    id: 5,
    category: 'attendance',
    date: '2天前',
    isRead: true,
    content: '本月考勤异常汇总，请查看详情',
    title: '考勤异常提醒',
  },
  {
    id: 6,
    category: 'approval',
    date: '30分钟前',
    isRead: false,
    content: '张三提交了请假申请，请尽快审批',
    title: '请假申请待审批',
    link: '/workspace',
  },
  {
    id: 7,
    category: 'approval',
    date: '2小时前',
    isRead: false,
    content: '李四提交了报销申请，金额 ¥2,500.00',
    title: '报销申请待审批',
    actionText: '去审批',
  },
]);

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const { isDark } = usePreferences();

const menus = computed(() => [
  {
    handler: () => {
      router.push({ name: 'Profile' });
    },
    icon: 'lucide:user',
    text: $t('page.auth.profile'),
  },
  {
    handler: () => {
      openWindow(VBEN_DOC_URL, {
        target: '_blank',
      });
    },
    icon: BookOpenText,
    text: $t('ui.widgets.document'),
  },
  {
    handler: () => {
      openWindow(VBEN_GITHUB_URL, {
        target: '_blank',
      });
    },
    icon: SvgGithubIcon,
    text: 'GitHub',
  },
  {
    handler: () => {
      openWindow(`${VBEN_GITHUB_URL}/issues`, {
        target: '_blank',
      });
    },
    icon: CircleHelp,
    text: $t('ui.widgets.qa'),
  },
]);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
}

function markRead(id: number | string) {
  const item = notifications.value.find((item) => item.id === id);
  if (item) {
    item.isRead = true;
  }
}

function remove(id: number | string) {
  notifications.value = notifications.value.filter((item) => item.id !== id);
}

function handleMakeAll() {
  notifications.value.forEach((item) => (item.isRead = true));
}

const handleClick = (item: NotificationItem) => {
  markRead(item.id);
  if (item.link) {
    navigateTo(item.link, item.query);
  }
};

function navigateTo(
  link: string,
  query?: Record<string, any>,
  state?: Record<string, any>,
) {
  if (link.startsWith('http://') || link.startsWith('https://')) {
    window.open(link, '_blank');
  } else {
    router.push({ path: link, query: query || {}, state });
  }
}

watch(
  () => ({
    enable: preferences.app.watermark,
    content: preferences.app.watermarkContent,
    isDark: isDark.value,
  }),
  async ({ enable, content, isDark: isDarkValue }) => {
    if (enable) {
      const watermarkColor = isDarkValue
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)';

      await updateWatermark({
        advancedStyle: {
          colorStops: [
            {
              color: watermarkColor,
              offset: 0,
            },
            {
              color: watermarkColor,
              offset: 1,
            },
          ],
          type: 'linear',
        },
        content:
          content ||
          `${userStore.userInfo?.username} - ${userStore.userInfo?.realName}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus
        :text="userStore.userInfo?.realName"
        description="ann.vben@gmail.com"
        tag-text="Pro"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <NotificationDrawer
        :notifications="notifications"
        @read="(item) => item.id && markRead(item.id)"
        @read-all="handleMakeAll"
        @remove="(item) => item.id && remove(item.id)"
        @click="handleClick"
        @batch-read="(ids) => ids.forEach((id) => markRead(id))"
        @batch-remove="(ids) => notifications = notifications.filter((n) => !ids.includes(n.id))"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
