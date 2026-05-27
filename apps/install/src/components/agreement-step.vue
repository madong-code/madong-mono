<template>
  <div class="agreement-step">
    <!-- 加载中 -->
    <div v-if="loading" class="state-box">
      <div class="loader"></div>
      <p class="state-hint">正在检测系统安装状态...</p>
    </div>

    <!-- 已安装 -->
    <div v-else-if="isInstalled" class="state-box">
      <div class="state-icon success-icon">
        <el-icon :size="40"><CircleCheckFilled /></el-icon>
      </div>
      <h3 class="state-title">系统已安装</h3>
      <p class="state-desc">安装时间：{{ installStatus || '未知' }}</p>
      <el-button type="success" @click="handleGoToAdmin" class="go-btn">
        访问后台 <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <!-- 未安装：欢迎 -->
    <div v-else class="welcome-box">
      <div class="welcome-icon">
        <el-icon :size="44" color="#409eff"><Lightning /></el-icon>
      </div>
      <h3 class="state-title">欢迎使用安装向导</h3>
      <p class="state-desc">在开始前，系统将检测环境是否符合运行要求。</p>

      <div class="feature-grid">
        <div class="feat">
          <div class="feat-icon" style="--ic: #409eff"><el-icon><Monitor /></el-icon></div>
          <div><strong>环境检测</strong><span>自动检查 PHP 版本与扩展</span></div>
        </div>
        <div class="feat">
          <div class="feat-icon" style="--ic: #67c23a"><el-icon><Connection /></el-icon></div>
          <div><strong>数据库配置</strong><span>支持 MySQL 数据库</span></div>
        </div>
        <div class="feat">
          <div class="feat-icon" style="--ic: #e6a23c"><el-icon><Setting /></el-icon></div>
          <div><strong>多租户</strong><span>可选数据隔离模式</span></div>
        </div>
      </div>

      <!-- 许可协议勾选 -->
      <div class="agreement-bar">
        <el-checkbox v-model="agreed" class="agreement-checkbox">
          我已阅读并同意
          <el-link type="primary" :underline="false" class="agreement-link" @click.stop="showAgreement = true">
            《许可协议》
          </el-link>
        </el-checkbox>
      </div>

      <el-button type="primary" size="large" :disabled="!agreed" @click="handleContinue" class="start-btn">
        开始安装 <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <!-- 许可协议弹窗 -->
    <el-dialog v-model="showAgreement" title="许可协议" width="640px" :close-on-click-modal="false">
      <div class="agreement-content">
        <h4>MD-Admin 开源软件许可协议</h4>
        <p>感谢您选择 MD-Admin 后台开发框架。在使用本系统前，请仔细阅读以下条款：</p>
        <h5>一、许可授权</h5>
        <p>本系统基于 MIT 协议开源发布，您可以自由使用、修改和分发本系统，但需保留原始版权声明。</p>
        <h5>二、使用范围</h5>
        <p>本系统可用于个人、商业及企业项目，无任何形式的额外授权费用。</p>
        <h5>三、责任限制</h5>
        <p>在适用法律允许的最大范围内，作者不承担因使用本系统而产生的任何直接或间接损失责任。</p>
        <h5>四、协议变更</h5>
        <p>本协议条款可能会根据实际情况进行调整，请关注官方网站获取最新版本。</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="showAgreement = false; agreed = true">我已阅读并同意</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ArrowRight, CircleCheckFilled, Lightning, Monitor, Connection, Setting } from '@element-plus/icons-vue'
import { useInstallStore } from '@/store/module/install'

const installStore = useInstallStore()
const loading = ref(false)
const installStatus = ref('') as any
const isInstalled = computed(() => installStore.checkInstallationStatus())
const agreed = ref(false)
const showAgreement = ref(false)

onMounted(async () => {
  try { loading.value = true; await installStore.fetchInstallationStatus(); installStatus.value = installStore.installation_completed_time || '' }
  catch (e) { console.error(e) } finally { loading.value = false }
})
const handleContinue = () => emit('next')
const handleGoToAdmin = () => { window.location.href = '/admin' }
const emit = defineEmits<{ next: [] }>()
</script>

<style lang="scss" scoped>
.agreement-step { display: flex; flex-direction: column; align-items: center; padding: 24px 0 8px; min-height: 300px; justify-content: center; }

.state-box { text-align: center; }

.state-icon { margin-bottom: 16px; }
.state-title { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
.state-desc { font-size: 14px; color: var(--text-tertiary); margin-bottom: 24px; }

.loader { width: 40px; height: 40px; border-radius: 50%; border: 3px solid #e8e8e8; border-top-color: #409eff; animation: spin .8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.state-hint { font-size: 14px; color: #999; }

.success-icon { color: #67c23a; }

.go-btn { border-radius: 8px; font-weight: 500; padding: 0 24px; height: 40px; }

.welcome-box { text-align: center; }
.welcome-icon { margin-bottom: 16px; }

.feature-grid { display: flex; gap: 12px; margin: 24px 0 28px; }
.feat {
  flex: 1; text-align: left;
  padding: 16px; border-radius: 10px; background: var(--btn-ghost-bg);
  display: flex; gap: 10px;
  .feat-icon {
    width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
    background: var(--btn-ghost-bg);
    display: flex; align-items: center; justify-content: center;
    color: var(--ic);
  }
  strong { display: block; font-size: 13px; color: var(--text-primary); margin-bottom: 2px; }
  span { font-size: 11px; color: var(--text-tertiary); }
}

.start-btn {
  height: 44px; padding: 0 36px; border-radius: 10px; font-weight: 600;
  background: linear-gradient(135deg, #409eff, #6366f1); border: none;
  box-shadow: 0 4px 14px rgba(64,158,255,.3);
  transition: all .3s;
  &:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(64,158,255,.4); transform: translateY(-1px); }
}

/* 许可协议勾选 */
.agreement-bar {
  margin: 22px 0 16px; padding: 10px 0; text-align: center;

  .agreement-checkbox {
    :deep(.el-checkbox__label) { font-size: 13px; color: var(--text-secondary); }
  }
  .agreement-link { font-size: 13px; }
}

/* 协议弹窗内容 */
.agreement-content {
  max-height: 420px; overflow-y: auto; line-height: 1.8; text-align: left;
  h4 { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary); }
  h5 { font-size: 14px; font-weight: 600; margin: 14px 0 6px; color: var(--text-primary); }
  p { font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; }
}

@media (max-width: 600px) { .feature-grid { flex-direction: column; } }
</style>
