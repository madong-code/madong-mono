<template>
  <div class="install-app">
    <!-- 顶部导航 -->
    <header class="top-header">
      <div class="header-inner">
        <div class="brand">
          <div class="brand-logo">
            <img :src="logoUrl" alt="logo" class="logo-img" />
          </div>
          <span class="brand-name">{{ siteInfo.name || 'MD-Admin' }}</span>
        </div>
        <nav class="top-nav">
          <el-link :href="siteInfo.officialWebsite" target="_blank" class="nav-item">官方网站</el-link>
          <el-link :href="siteInfo.community" target="_blank" class="nav-item">技术论坛</el-link>
          <el-link :href="siteInfo.documentation" target="_blank" class="nav-item">开发文档</el-link>
          <div class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到明亮模式' : '切换到暗黑模式'">
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
              'is-last': i === steps.length - 1
            }"
          >
            <div class="sn-indicator">
              <div class="sn-dot">
                <el-icon v-if="currentStep > step.id" :size="14"><Check /></el-icon>
                <span v-else class="sn-num">{{ step.id }}</span>
              </div>
              <div class="sn-label">{{ step.title }}</div>
            </div>
            <div v-if="i < steps.length - 1" class="sn-line" :class="{ 'line-done': currentStep > step.id }"></div>
          </div>
        </div>

        <!-- 步骤内容 -->
        <div class="step-wrap">
          <transition name="slide-up" mode="out-in">
            <agreement-step
              v-if="currentStep === 1" key="s1"
              @next="handleNextStep"
            />
            <environment-step
              v-else-if="currentStep === 2" key="s2"
              @prev="handlePrevStep"
              @next="handleNextStep"
            />
            <database-step
              v-else-if="currentStep === 3" key="s3"
              @prev="handlePrevStep"
              @next="handleNextStep"
            />
            <tenant-step
              v-else-if="currentStep === 4" key="s4"
              @prev="handlePrevStep"
              @next="handleNextStep"
            />
            <config-step
              v-else-if="currentStep === 5" key="s5"
              @prev="handlePrevStep"
              @start-install="startInstallation"
            />
            <complete-step
              v-else-if="currentStep === 6" key="s6"
              :install-data="installData"
            />
          </transition>
        </div>
      </div>
    </main>

    <!-- 底部版权 -->
    <footer class="bottom-footer">
      <span>&copy; {{ new Date().getFullYear() }} MD-Admin. All rights reserved.</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { Check, Sunny, Moon } from '@element-plus/icons-vue'
import { useInstallStore } from './store/module/install'
import AgreementStep from './components/agreement-step.vue'
import EnvironmentStep from './components/environment-step.vue'
import DatabaseStep from './components/database-step.vue'
import TenantStep from './components/tenant-step.vue'
import ConfigStep from './components/config-step.vue'
import CompleteStep from './components/complete-step.vue'
import { initConfig, getConfig } from './utils/config'

const currentStep = ref(1)
const installData = reactive({ agreementAccepted: false, environmentChecked: false, databaseConfig: {}, adminConfig: {}, tenantConfig: {} })
const installStore = useInstallStore()
const logoUrl = ref('./logo.png')
const siteInfo = ref({ name: '', officialWebsite: '', community: '', documentation: '' })

const isDark = ref(false)
// 默认明亮模式
document.documentElement.setAttribute('data-theme', 'light')

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

const steps = [
  { id: 1, title: '许可协议' }, { id: 2, title: '环境检测' }, { id: 3, title: '数据库配置' },
  { id: 4, title: '多租户配置' }, { id: 5, title: '参数配置' }, { id: 6, title: '安装完成' },
]

onMounted(async () => {
  await initConfig(); await installStore.fetchInstallationStatus()
  const config = getConfig()
  logoUrl.value = config.siteInfo?.logo || './logo.png'
  siteInfo.value = config.siteInfo || {}
  if (installStore.checkInstallationStatus()) currentStep.value = 6
})

const handleNextStep = () => { if (currentStep.value < 6) currentStep.value++ }
const handlePrevStep = () => { if (currentStep.value > 1) currentStep.value-- }
const startInstallation = (config: any) => { installData.adminConfig = config; installData.tenantConfig = installStore.tenantConfig }

watch(() => installStore.install_status, (s) => {
  if (s === 'success' && currentStep.value === 5) { installStore.markInstallationCompleted(); setTimeout(() => handleNextStep(), 5000) }
})
</script>

<style lang="scss">
/* ===== 主题变量 ===== */
:root, [data-theme="dark"] {
  --bg-body: #0b0f1a;
  --bg-nav: rgba(255,255,255,.03);
  --bg-content: rgba(255,255,255,.03);
  --text-primary: rgba(255,255,255,.9);
  --text-secondary: rgba(255,255,255,.6);
  --text-tertiary: rgba(255,255,255,.35);
  --text-muted: rgba(255,255,255,.25);
  --border-subtle: rgba(255,255,255,.04);
  --glow-blue: rgba(64,158,255,.06);
  --glow-purple: rgba(99,102,241,.04);
  --btn-ghost-bg: rgba(255,255,255,.06);
  --btn-ghost-hover: rgba(255,255,255,.09);
  --btn-ghost-color: rgba(255,255,255,.5);
  --btn-ghost-hover-color: rgba(255,255,255,.7);
  --card-bg: rgba(255,255,255,.04);
  --tag-bg: rgba(255,255,255,.06);
  --badge-bg: rgba(99,102,241,.15);
  --brand-gradient: linear-gradient(135deg, #409eff, #6366f1);
  --success-color: #34d399;
  --warning-color: #e6a23c;
  --danger-color: #ef4444;
  --info-color: #409eff;
}

[data-theme="light"] {
  --bg-body: #f0f2f5;
  --bg-nav: rgba(255,255,255,.82);
  --bg-content: #fff;
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a6a;
  --text-tertiary: #8e8ea0;
  --text-muted: #b0b0c0;
  --border-subtle: rgba(0,0,0,.08);
  --glow-blue: rgba(64,158,255,.06);
  --glow-purple: rgba(99,102,241,.05);
  --btn-ghost-bg: #f4f4f8;
  --btn-ghost-hover: #ebebf0;
  --btn-ghost-color: #666;
  --btn-ghost-hover-color: #333;
  --card-bg: #f8f8fc;
  --tag-bg: #f0f0f5;
  --badge-bg: rgba(99,102,241,.1);
  --brand-gradient: linear-gradient(135deg, #409eff, #6366f1);
  --success-color: #10b981;
  --warning-color: #d97706;
  --danger-color: #dc2626;
  --info-color: #2563eb;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { height: 100%; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; background: var(--bg-body); transition: background .3s; }
</style>

<style lang="scss" scoped>
.install-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-body);
  position: relative;
  transition: background .3s;
}

/* 背景微光 + 科技网格 */
.install-app::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 700px 500px at 20% 50%, var(--glow-blue) 0%, transparent 70%),
    radial-gradient(ellipse 600px 600px at 80% 30%, var(--glow-purple) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transition: background .3s;
}

.install-app::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,.12) 0%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,.12) 0%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}

/* ===== 导航栏（毛玻璃深色） ===== */
.top-header {
  background: var(--bg-nav);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky; top: 0; z-index: 100;
  transition: background .3s, border-color .3s;

  .header-inner {
    max-width: 1200px; margin: 0 auto; height: 56px;
    display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
  }

  .brand {
    display: flex; align-items: center; gap: 10px;
    .brand-logo {
      width: 28px; height: 28px; display: flex; align-items: center;
      .logo-img { height: 100%; width: auto; }
    }
    .brand-name { font-size: 16px; font-weight: 700; color: var(--text-primary); transition: color .3s; }
  }

  .top-nav {
    display: flex; align-items: center; gap: 16px;
    .nav-item { font-size: 13px; color: var(--text-tertiary); transition: color .2s; &:hover { color: #409eff; } }
    .theme-toggle {
      width: 30px; height: 30px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--text-tertiary);
      background: var(--btn-ghost-bg); transition: all .2s;
      &:hover { background: var(--btn-ghost-hover); color: #409eff; }
    }
  }
}

/* ===== 主内容（撑满屏幕） ===== */
.main-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36px 24px 24px;
  position: relative; z-index: 10;
}

.install-card {
  width: 100%;
  max-width: 960px;
  background: transparent;
  padding: 0;
}

/* ===== 步骤条 ===== */
.steps-bar {
  display: flex; align-items: center;
  margin-bottom: 24px; padding: 0;

  .step-node {
    flex: 1; display: flex; align-items: center;
    &.is-last { flex: none; }

    .sn-indicator {
      display: flex; align-items: center; gap: 8px;
      .sn-dot {
        width: 28px; height: 28px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        background: var(--btn-ghost-bg); color: var(--text-muted);
        font-size: 12px; font-weight: 600;
        transition: all .35s cubic-bezier(.4,0,.2,1);
        .el-icon { color: #fff; }
      }
      .sn-label {
        font-size: 13px; font-weight: 500;
        color: var(--text-muted); white-space: nowrap; transition: color .35s;
      }
    }

    .sn-line {
      flex: 1; height: 2px;
      background: var(--border-subtle); margin: 0 14px; transition: background .4s;
    }

    &.is-active {
      .sn-dot { background: linear-gradient(135deg,#409eff,#6366f1); color: #fff; box-shadow: 0 0 18px rgba(64,158,255,.3); }
      .sn-label { color: var(--text-primary); font-weight: 600; }
    }

    &.is-done {
      .sn-dot { background: #34d399; color: #fff; }
      .sn-label { color: var(--text-secondary); }
      .sn-line { background: #34d399; }
    }
  }
}

/* ===== 内容区（更大） ===== */
.step-wrap {
  min-height: 360px;
  background: var(--bg-content);
  border-radius: 12px;
  padding: 32px 36px 28px;
  transition: background .3s;
}

/* ===== 过渡动画 ===== */
.slide-up-enter-active, .slide-up-leave-active { transition: all .3s cubic-bezier(.4,0,.2,1); }
.slide-up-enter-from { opacity: 0; transform: translateY(14px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-14px); }

/* ===== 底部版权 ===== */
.bottom-footer {
  text-align: center; padding: 18px; font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-nav);
  border-top: 1px solid var(--border-subtle);
  position: relative; z-index: 10;
  transition: color .3s, background .3s;
}

@media (max-width: 768px) {
  .step-wrap { padding: 20px 16px; }
  .steps-bar { .step-node { .sn-label { display: none; } } }
}
</style>
