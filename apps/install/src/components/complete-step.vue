<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useInstallStore } from '@/store/module/install';
import {
  ChatDotRound,
  CircleCheckFilled,
  House,
  Monitor,
  Odometer,
  WarningFilled,
} from '@element-plus/icons-vue';

defineProps<{ installData: any }>();
const installStore = useInstallStore();
const currentOrigin = ref('');
const installTime = computed(
  () => installStore.install_time || new Date().toLocaleString('zh-CN'),
);
const installDuration = computed(() => installStore.formattedDuration);
const saasMode = computed(() => installStore.saas_mode);

onMounted(() => {
  if (typeof window !== 'undefined')
    currentOrigin.value = window.location.origin;
});

const goToAdmin = () => window.open('/admin', '_blank');
const goToPlatform = () => window.open('/platform', '_blank');
const goToCommunity = () =>
  window.open('https://madong.tech/question/', '_blank');
const goToFrontend = () => window.open('/', '_blank');
</script>

<template>
  <div class="complete-step">
    <div class="success-wrap">
      <div class="check-circle">
        <div class="cc-bg"></div>
        <el-icon :size="48" color="#67c23a"><CircleCheckFilled /></el-icon>
      </div>

      <h2 class="sc-title">安装成功！</h2>
      <p class="sc-desc">
        Madong SaaS 系统已安装完成，耗时 {{ installDuration }}
      </p>

      <div class="sc-stats">
        <div class="sc-stat">
          <span class="scv">{{ installTime }}</span>
          <span class="scl">完成时间</span>
        </div>
        <div class="sc-divider"></div>
        <div class="sc-stat">
          <span class="scv">{{ installDuration }}</span>
          <span class="scl">耗时</span>
        </div>
        <div class="sc-divider"></div>
        <div class="sc-stat">
          <span class="scv" style="font-size: 13px">{{ currentOrigin }}</span>
          <span class="scl">访问地址</span>
        </div>
      </div>

      <div class="sc-links">
        <el-button
          v-if="saasMode"
          @click="goToPlatform"
          class="sc-btn sc-purple"
        >
          <el-icon><Odometer /></el-icon> 进入平台
        </el-button>
        <el-button @click="goToAdmin" class="sc-btn">
          <el-icon><Monitor /></el-icon> 进入后台
        </el-button>
        <el-button @click="goToFrontend" class="sc-btn sc-green">
          <el-icon><House /></el-icon> 前端首页
        </el-button>
        <el-button @click="goToCommunity" class="sc-btn sc-yellow">
          <el-icon><ChatDotRound /></el-icon> 技术社区
        </el-button>
      </div>

      <div class="sc-security">
        <el-icon color="#e6a23c"><WarningFilled /></el-icon>
        <span>安全提示：为保障系统安全，建议安装完成后删除 install 目录</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.complete-step {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.success-wrap {
  max-width: 560px;
  text-align: center;
}

.check-circle {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;

  .cc-bg {
    @keyframes pulse {
      0%,
      100% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.15);
      }
    }

    position: absolute;
    inset: -8px;
    border: 2px solid var(--success-color);
    border-radius: 50%;
    opacity: 0.2;
    animation: pulse 2s ease-in-out infinite;
  }
}

.sc-title {
  margin-bottom: 6px;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.sc-desc {
  margin-bottom: 24px;
  font-size: 14px;
  color: var(--text-tertiary);
}

.sc-stats {
  display: inline-flex;
  gap: 24px;
  align-items: center;
  padding: 16px 28px;
  margin-bottom: 28px;
  background: var(--btn-ghost-bg);
  border-radius: 10px;

  .sc-stat {
    text-align: center;
  }

  .scv {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .scl {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    color: var(--text-tertiary);
  }

  .sc-divider {
    width: 1px;
    height: 30px;
    background: var(--border-subtle);
  }
}

.sc-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 24px;
}

.sc-btn {
  height: 40px;
  padding: 0 18px;
  font-weight: 500;
  color: var(--btn-ghost-color);
  background: var(--btn-ghost-bg);
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background: linear-gradient(135deg, #409eff, #6366f1);
  }

  &.sc-green:hover {
    background: #67c23a;
    border-color: #67c23a;
  }

  &.sc-yellow:hover {
    background: #e6a23c;
    border-color: #e6a23c;
  }

  &.sc-purple:hover {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-color: #6366f1;
  }
}

.sc-security {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 16px;
  font-size: 12px;
  color: var(--text-tertiary);
  background: rgb(230 162 60 / 8%);
  border-radius: 8px;
}

@media (max-width: 600px) {
  .sc-stats {
    flex-direction: column;
    gap: 12px;

    .sc-divider {
      display: none;
    }
  }

  .sc-links {
    flex-direction: column;
    align-items: center;
  }
}
</style>
