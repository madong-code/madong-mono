<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import { BasicLayout, LockScreen, UserDropdown } from '@vben/layouts';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import { FileText, TerminalSquare } from 'lucide-vue-next';

import { $t } from '#/locales';
import { useAuthStore, useTerminalStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';
import NotepadDrawer from '#/views/content/notepad/components/notepad-drawer.vue';
import TerminalDialog from '#/views/devtools/terminal/index.vue';

const notepadDrawerRef = ref<InstanceType<typeof NotepadDrawer> | null>(null);

function openNotepadDrawer() {
  notepadDrawerRef.value?.open();
}

function openTerminalDialog() {
  const terminal = useTerminalStore();
  terminal.toggle(true);
}

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
  // {
  //   handler: () => {
  //     openWindow(VBEN_DOC_URL, {
  //       target: '_blank',
  //     });
  //   },
  //   icon: BookOpenText,
  //   text: $t('ui.widgets.document'),
  // },
  // {
  //   handler: () => {
  //     openWindow(VBEN_GITHUB_URL, {
  //       target: '_blank',
  //     });
  //   },
  //   icon: SvgGithubIcon,
  //   text: 'GitHub',
  // },
  // {
  //   handler: () => {
  //     openWindow(`${VBEN_GITHUB_URL}/issues`, {
  //       target: '_blank',
  //     });
  //   },
  //   icon: CircleHelp,
  //   text: $t('ui.widgets.qa'),
  // },
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
        :description="userStore.userInfo?.email || ''"
        :tag-text="userStore.userInfo?.user_name || 'Pro'"
        @logout="handleLogout"
      />
    </template>
    <!-- 命令终端按钮 -->
    <template #header-right-60>
      <div
        class="hidden size-8 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-accent hover:shadow-md md:flex mr-1"
        title="命令终端"
        @click="openTerminalDialog"
      >
        <TerminalSquare class="size-[18px] text-foreground" />
      </div>
      <TerminalDialog />
    </template>

    <!-- 记事本按钮 -->
    <template #header-right-100>
      <div
        class="hidden size-8 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-accent hover:shadow-md md:flex mr-1"
        title="记事本"
        @click="openNotepadDrawer"
      >
        <FileText class="size-[18px] text-foreground" />
      </div>
      <NotepadDrawer ref="notepadDrawerRef" />
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
