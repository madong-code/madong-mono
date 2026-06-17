<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';

import defaultLogo from '@/assets/logo.png';
import { Check, Moon, Sunny } from '@element-plus/icons-vue';

import AgreementStep from './components/agreement-step.vue';
import CompleteStep from './components/complete-step.vue';
import ConfigStep from './components/config-step.vue';
import DatabaseStep from './components/database-step.vue';
import EnvironmentStep from './components/environment-step.vue';
import TenantStep from './components/tenant-step.vue';
import { useInstallStore } from './store/module/install';
import { getConfig, initConfig } from './utils/config';

const currentStep = ref(1);
const installData = reactive({
  agreementAccepted: false,
  environmentChecked: false,
  databaseConfig: {},
  adminConfig: {},
  tenantConfig: {},
});
const installStore = useInstallStore();
const logoUrl = ref(defaultLogo);
const siteInfo = ref({
  name: '',
  officialWebsite: '',
  community: '',
  documentation: '',
});

const isDark = ref(false);
// 默认明亮模式
document.documentElement.dataset.theme = 'light';

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light';
};

const steps = [
  { id: 1, title: '许可协议' },
  { id: 2, title: '环境检测' },
  { id: 3, title: '数据库配置' },
  { id: 4, title: '多租户配置' },
  { id: 5, title: '参数配置' },
  { id: 6, title: '安装完成' },
];

onMounted(async () => {
  await initConfig();
  await installStore.fetchInstallationStatus();
  const config = getConfig();
  const configLogo = config.siteInfo?.logo;
  logoUrl.value = configLogo || defaultLogo;
  siteInfo.value = config.siteInfo || {};
  if (installStore.checkInstallationStatus()) currentStep.value = 6;
});

const handleNextStep = () => {
  if (currentStep.value < 6) currentStep.value++;
};
const handlePrevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};
const startInstallation = (config: any) => {
  installData.adminConfig = config;
  installData.tenantConfig = installStore.tenantConfig;
};

watch(
  () => installStore.install_status,
  (s) => {
    if (s === 'success' && currentStep.value === 5) {
      installStore.markInstallationCompleted();
      setTimeout(() => handleNextStep(), 5000);
    }
  },
);
</script>

<template>
  <div class="install-app">
    <!-- 顶部导航 -->
    <header class="top-header">
      <div class="header-inner">
        <div class="brand">
          <div class="brand-logo">
            <img :src="logoUrl" alt="logo" class="logo-img" />
          </div>
          <span class="brand-name">{{ siteInfo.name || 'Madong SaaS' }}</span>
        </div>
        <nav class="top-nav">
          <el-link
            :href="siteInfo.officialWebsite"
            target="_blank"
            class="nav-item"
          >
            官方网站
          </el-link>
          <el-link :href="siteInfo.community" target="_blank" class="nav-item">
            技术论坛
          </el-link>
          <el-link
            :href="siteInfo.documentation"
            target="_blank"
            class="nav-item"
          >
            开发文档
          </el-link>
          <div
            class="theme-toggle"
            @click="toggleTheme"
            :title="isDark ? '切换到明亮模式' : '切换到暗黑模式'"
          >
            <el-icon :size="16"><Sunny v-if="isDark" /><Moon v-else /></el-icon>
          </div>
        </nav>
      </div>
    </header>

    <!-- 主内容：居中 -->
    <main class="main-area">
      <div class="install-card">
        <!-- 步骤进度 -->
        <div class="steps-bar">
          <div
            v-for="(step, i) in steps"
            :key="step.id"
            class="step-node"
            :class="{
              'is-active': currentStep === step.id,
              'is-done': currentStep > step.id,
              'is-last': i === steps.length - 1,
            }"
          >
            <div class="sn-indicator">
              <div class="sn-dot">
                <el-icon v-if="currentStep > step.id" :size="14">
                  <Check />
                </el-icon>
                <span v-else class="sn-num">{{ step.id }}</span>
              </div>
              <div class="sn-label">{{ step.title }}</div>
            </div>
            <div
              v-if="i < steps.length - 1"
              class="sn-line"
              :class="{ 'line-done': currentStep > step.id }"
            ></div>
          </div>
        </div>

        <!-- 步骤内容 -->
        <div class="step-wrap">
          <transition name="slide-up" mode="out-in">
            <AgreementStep
              v-if="currentStep === 1"
              key="s1"
              @next="handleNextStep"
            />
            <EnvironmentStep
              v-else-if="currentStep === 2"
              key="s2"
              @prev="handlePrevStep"
              @next="handleNextStep"
            />
            <DatabaseStep
              v-else-if="currentStep === 3"
              key="s3"
              @prev="handlePrevStep"
              @next="handleNextStep"
            />
            <TenantStep
              v-else-if="currentStep === 4"
              key="s4"
              @prev="handlePrevStep"
              @next="handleNextStep"
            />
            <ConfigStep
              v-else-if="currentStep === 5"
              key="s5"
              @prev="handlePrevStep"
              @start-install="startInstallation"
            />
            <CompleteStep
              v-else-if="currentStep === 6"
              key="s6"
              :install-data="installData"
            />
          </transition>
        </div>
      </div>
    </main>

    <!-- 底部版权 -->
    <footer class="bottom-footer">
      <span>&copy; {{ new Date().getFullYear() }} madong.tech. All rights
        reserved.</span>
    </footer>
  </div>
</template>

<style lang="scss">
/* ===== 主题变量 ===== */
:root,
[data-theme='dark'] {
  --bg-body: #0b0f1a;
  --bg-nav: rgb(255 255 255 / 3%);
  --bg-content: rgb(255 255 255 / 3%);
  --text-primary: rgb(255 255 255 / 90%);
  --text-secondary: rgb(255 255 255 / 60%);
  --text-tertiary: rgb(255 255 255 / 35%);
  --text-muted: rgb(255 255 255 / 25%);
  --border-subtle: rgb(255 255 255 / 4%);
  --glow-blue: rgb(64 158 255 / 6%);
  --glow-purple: rgb(99 102 241 / 4%);
  --btn-ghost-bg: rgb(255 255 255 / 6%);
  --btn-ghost-hover: rgb(255 255 255 / 9%);
  --btn-ghost-color: rgb(255 255 255 / 50%);
  --btn-ghost-hover-color: rgb(255 255 255 / 70%);
  --card-bg: rgb(255 255 255 / 4%);
  --tag-bg: rgb(255 255 255 / 6%);
  --badge-bg: rgb(99 102 241 / 15%);
  --brand-gradient: linear-gradient(135deg, #409eff, #6366f1);
  --success-color: #34d399;
  --warning-color: #e6a23c;
  --danger-color: #ef4444;
  --info-color: #409eff;
}

[data-theme='light'] {
  --bg-body: #f0f2f5;
  --bg-nav: rgb(255 255 255 / 82%);
  --bg-content: #fff;
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a6a;
  --text-tertiary: #8e8ea0;
  --text-muted: #b0b0c0;
  --border-subtle: rgb(0 0 0 / 8%);
  --glow-blue: rgb(64 158 255 / 6%);
  --glow-purple: rgb(99 102 241 / 5%);
  --btn-ghost-bg: #f4f4f8;
  --btn-ghost-hover: #ebebf0;
  --btn-ghost-color: #666;
  --btn-ghost-hover-color: #333;
  --card-bg: #f8f8fc;
  --tag-bg: #f0f0f5;
  --badge-bg: rgb(99 102 241 / 10%);
  --brand-gradient: linear-gradient(135deg, #409eff, #6366f1);
  --success-color: #10b981;
  --warning-color: #d97706;
  --danger-color: #dc2626;
  --info-color: #2563eb;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body,
#app {
  height: 100%;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: var(--bg-body);
  transition: background 0.3s;
}
</style>

<style lang="scss" scoped>
.install-app {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-body);
  transition: background 0.3s;
}

/* 背景微光 + 科技网格 */
.install-app::before {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  content: '';
  background:
    radial-gradient(
      ellipse 700px 500px at 20% 50%,
      var(--glow-blue) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 600px 600px at 80% 30%,
      var(--glow-purple) 0%,
      transparent 70%
    );
  transition: background 0.3s;
}

.install-app::after {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  content: '';
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(
    ellipse 80% 70% at 50% 50%,
    rgb(0 0 0 / 12%) 0%,
    transparent 80%
  );
}

/* ===== 导航栏（毛玻璃深色） ===== */
.top-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-nav);
  border-bottom: 1px solid var(--border-subtle);
  backdrop-filter: blur(16px);
  transition:
    background 0.3s,
    border-color 0.3s;

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    height: 56px;
    padding: 0 24px;
    margin: 0 auto;
  }

  .brand {
    display: flex;
    gap: 10px;
    align-items: center;

    .brand-logo {
      display: flex;
      align-items: center;
      width: 28px;
      height: 28px;

      .logo-img {
        width: auto;
        height: 100%;
      }
    }

    .brand-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      transition: color 0.3s;
    }
  }

  .top-nav {
    display: flex;
    gap: 16px;
    align-items: center;

    .nav-item {
      font-size: 13px;
      color: var(--text-tertiary);
      transition: color 0.2s;

      &:hover {
        color: #409eff;
      }
    }

    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      color: var(--text-tertiary);
      cursor: pointer;
      background: var(--btn-ghost-bg);
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        color: #409eff;
        background: var(--btn-ghost-hover);
      }
    }
  }
}

/* ===== 主内容（撑满屏幕） ===== */
.main-area {
  position: relative;
  z-index: 10;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 36px 24px 24px;
}

.install-card {
  width: 100%;
  max-width: 960px;
  padding: 0;
  background: transparent;
}

/* ===== 步骤条 ===== */
.steps-bar {
  display: flex;
  align-items: center;
  padding: 0;
  margin-bottom: 24px;

  .step-node {
    display: flex;
    flex: 1;
    align-items: center;

    &.is-last {
      flex: none;
    }

    .sn-indicator {
      display: flex;
      gap: 8px;
      align-items: center;

      .sn-dot {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        font-size: 12px;
        font-weight: 600;
        color: var(--text-muted);
        background: var(--btn-ghost-bg);
        border-radius: 50%;
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);

        .el-icon {
          color: #fff;
        }
      }

      .sn-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-muted);
        white-space: nowrap;
        transition: color 0.35s;
      }
    }

    .sn-line {
      flex: 1;
      height: 2px;
      margin: 0 14px;
      background: var(--border-subtle);
      transition: background 0.4s;
    }

    &.is-active {
      .sn-dot {
        color: #fff;
        background: linear-gradient(135deg, #409eff, #6366f1);
        box-shadow: 0 0 18px rgb(64 158 255 / 30%);
      }

      .sn-label {
        font-weight: 600;
        color: var(--text-primary);
      }
    }

    &.is-done {
      .sn-dot {
        color: #fff;
        background: #34d399;
      }

      .sn-label {
        color: var(--text-secondary);
      }

      .sn-line {
        background: #34d399;
      }
    }
  }
}

/* ===== 内容区（更大） ===== */
.step-wrap {
  min-height: 360px;
  padding: 32px 36px 28px;
  background: var(--bg-content);
  border-radius: 12px;
  transition: background 0.3s;
}

/* ===== 过渡动画 ===== */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-14px);
}

/* ===== 底部版权 ===== */
.bottom-footer {
  position: relative;
  z-index: 10;
  padding: 18px;
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  background: var(--bg-nav);
  border-top: 1px solid var(--border-subtle);
  transition:
    color 0.3s,
    background 0.3s;
}

@media (max-width: 768px) {
  .step-wrap {
    padding: 20px 16px;
  }

  .steps-bar {
    .step-node {
      .sn-label {
        display: none;
      }
    }
  }
}
</style>
