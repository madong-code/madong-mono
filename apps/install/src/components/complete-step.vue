<template>
  <div class="complete-step">
    <div class="success-wrap">
      <div class="check-circle">
        <div class="cc-bg"></div>
        <el-icon :size="48" color="#67c23a"><CircleCheckFilled /></el-icon>
      </div>

      <h2 class="sc-title">安装成功！</h2>
      <p class="sc-desc">MD-Admin 系统已安装完成，耗时 {{ installDuration }}</p>

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
          <span class="scv" style="font-size:13px">{{ currentOrigin }}</span>
          <span class="scl">访问地址</span>
        </div>
      </div>

      <div class="sc-links">
        <el-button @click="goToAdmin" class="sc-btn"><el-icon><Monitor /></el-icon> 进入后台</el-button>
        <el-button @click="goToFrontend" class="sc-btn sc-green"><el-icon><House /></el-icon> 前端首页</el-button>
        <el-button @click="goToCommunity" class="sc-btn sc-yellow"><el-icon><ChatDotRound /></el-icon> 技术社区</el-button>
      </div>

      <div class="sc-security">
        <el-icon color="#e6a23c"><WarningFilled /></el-icon>
        <span>安全提示：为保障系统安全，建议安装完成后删除 install 目录</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CircleCheckFilled, Monitor, ChatDotRound, House, WarningFilled } from '@element-plus/icons-vue'
import { useInstallStore } from '@/store/module/install'

const installStore = useInstallStore()
const currentOrigin = ref('')
const installTime = computed(() => new Date().toLocaleString('zh-CN'))
const installDuration = computed(() => installStore.formattedDuration)

onMounted(() => { if (typeof window !== 'undefined') currentOrigin.value = window.location.origin })

const goToAdmin = () => window.open('/admin', '_blank')
const goToCommunity = () => window.open('https://madong.tech/question/', '_blank')
const goToFrontend = () => window.open('/', '_blank')

defineProps<{ installData: any }>()
</script>

<style lang="scss" scoped>
.complete-step { display: flex; align-items: center; justify-content: center; min-height: 300px; }

.success-wrap { text-align: center; max-width: 560px; }

.check-circle {
  position: relative; display: inline-block; margin-bottom: 16px;

  .cc-bg {
    position: absolute; inset: -8px; border-radius: 50%;
    border: 2px solid var(--success-color); opacity: .2;
    animation: pulse 2s ease-in-out infinite;
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  }
}

.sc-title { font-size: 24px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
.sc-desc { font-size: 14px; color: var(--text-tertiary); margin-bottom: 24px; }

.sc-stats {
  display: inline-flex; align-items: center; gap: 24px;
  padding: 16px 28px; border-radius: 10px; background: var(--btn-ghost-bg); margin-bottom: 28px;

  .sc-stat { text-align: center; }
  .scv { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); }
  .scl { display: block; font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }
  .sc-divider { width: 1px; height: 30px; background: var(--border-subtle); }
}

.sc-links { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }

.sc-btn {
  border-radius: 8px; font-weight: 500; height: 40px; padding: 0 18px;
  background: var(--btn-ghost-bg); color: var(--btn-ghost-color);
  transition: all .2s;
  &:hover { background: linear-gradient(135deg,#409eff,#6366f1); color: #fff; }

  &.sc-green:hover { background: #67c23a; border-color: #67c23a; }
  &.sc-yellow:hover { background: #e6a23c; border-color: #e6a23c; }
}

.sc-security {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--text-tertiary); padding: 8px 16px; border-radius: 8px;
  background: rgba(230,162,60,.08);
}

@media (max-width: 600px) {
  .sc-stats { flex-direction: column; gap: 12px; .sc-divider { display: none; } }
  .sc-links { flex-direction: column; align-items: center; }
}
</style>
