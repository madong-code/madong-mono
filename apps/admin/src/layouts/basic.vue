<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';
import { useWatermark } from '@vben/hooks';
import { BookOpenText, CircleHelp, SvgGithubIcon } from '@vben/icons';
import { BasicLayout, LockScreen, UserDropdown } from '@vben/layouts';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { Bell } from 'lucide-vue-next';

import TenantSwitchModal from '#/components/tenant-switch/tenant-switch-modal.vue';
import { $t } from '#/locales';
import { useAuthStore, useNotifyStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';
import MessageDrawer from '#/views/content/message/components/message-drawer.vue';

const notifyStore = useNotifyStore();
const messageDrawerRef = ref<InstanceType<typeof MessageDrawer> | null>(null);

function openMessageDrawer() {
  messageDrawerRef.value?.open();
}

onMounted(() => {
  notifyStore.initPush();
});

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const { isDark } = usePreferences();

/** 当前选中的租户名称 */
const currentTenantName = computed(() => {
  const info = userStore.userInfo as null | Record<string, any>;
  return info?.current_tenant?.name ?? '';
});

/** 租户切换弹窗 ref */
const tenantSwitchRef = ref<null | { open: () => void }>(null);

function handleSwitchTenant() {
  tenantSwitchRef.value?.open();
}

const menus = computed(() => [
  {
    handler: () => {
      router.push({ name: 'Profile' });
    },
    icon: 'lucide:user',
    text: $t('page.auth.profile'),
  },
  // 切换租户菜单（仅平台级超管才有多租户访问权限）
  ...(accessStore.tenantId !== null &&
  (userStore.userInfo as null | Record<string, any>)?.is_platform_super
    ? [
        {
          handler: handleSwitchTenant,
          icon: 'lucide:building-2',
          text: `切换租户${currentTenantName.value ? `（${currentTenantName.value}）` : ''}`,
        },
      ]
    : []),
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
      <div
        class="relative flex items-center cursor-pointer"
        @click="openMessageDrawer"
      >
        <Bell
          class="size-[18px] text-foreground hover:text-primary transition-colors"
        />
        <span
          v-if="notifyStore.unreadCount.total > 0"
          class="absolute -right-0.5 -top-0.5 flex size-[16px] items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
        >
          {{
            notifyStore.unreadCount.total > 99
              ? '99+'
              : notifyStore.unreadCount.total
          }}
        </span>
      </div>
      <MessageDrawer ref="messageDrawerRef" />
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

  <!-- 租户切换弹窗（放在 BasicLayout 外面，弹窗 DOM 由 Vben Modal 管理） -->
  <TenantSwitchModal ref="tenantSwitchRef" />
</template>
