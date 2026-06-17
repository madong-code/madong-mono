<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useInstallStore } from '@/store/module/install';
import {
  ArrowRight,
  CircleCheckFilled,
  Connection,
  Lightning,
  Monitor,
  Setting,
} from '@element-plus/icons-vue';

const emit = defineEmits<{ next: [] }>();
const installStore = useInstallStore();
const loading = ref(false);
const installStatus = ref('') as any;
const isInstalled = computed(() => installStore.checkInstallationStatus());
const agreed = ref(false);
const showAgreement = ref(false);

onMounted(async () => {
  try {
    loading.value = true;
    await installStore.fetchInstallationStatus();
    installStatus.value = installStore.installation_completed_time || '';
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
const handleContinue = () => emit('next');
const handleGoToAdmin = () => {
  window.location.href = '/admin';
};
</script>

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
          <div class="feat-icon" style="

--ic: #409eff">
            <el-icon><Monitor /></el-icon>
          </div>
          <div>
            <strong>环境检测</strong><span>自动检查 PHP 版本与扩展</span>
          </div>
        </div>
        <div class="feat">
          <div class="feat-icon" style="

--ic: #67c23a">
            <el-icon><Connection /></el-icon>
          </div>
          <div><strong>数据库配置</strong><span>支持 MySQL 数据库</span></div>
        </div>
        <div class="feat">
          <div class="feat-icon" style="

--ic: #e6a23c">
            <el-icon><Setting /></el-icon>
          </div>
          <div><strong>多租户</strong><span>可选数据隔离模式</span></div>
        </div>
      </div>

      <!-- 许可协议勾选 -->
      <div class="agreement-bar">
        <el-checkbox v-model="agreed" class="agreement-checkbox">
          我已阅读并同意
          <el-link
            type="primary"
            :underline="false"
            class="agreement-link"
            @click.stop="showAgreement = true"
          >
            《许可协议》
          </el-link>
        </el-checkbox>
      </div>

      <el-button
        type="primary"
        size="large"
        :disabled="!agreed"
        @click="handleContinue"
        class="start-btn"
      >
        开始安装 <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <!-- 许可协议弹窗 -->
    <el-dialog
      v-model="showAgreement"
      title="许可协议"
      width="680px"
      :close-on-click-modal="false"
    >
      <div class="agreement-content">
        <h4>Madong SaaS 开源软件许可协议</h4>
        <p>
          感谢您选择 Madong
          SaaS（以下简称"本系统"）。在安装使用前，请仔细阅读以下条款。安装或使用本系统即表示您同意接受本协议约束。
        </p>
        <h5>一、许可授权</h5>
        <p>
          本系统基于
          <strong>Apache License 2.0</strong>
          协议开源发布。您可以自由使用、复制、修改、合并、出版发行、分发、再许可及/或销售本系统的副本，但需保留原始版权声明及许可声明。
        </p>
        <h5>二、使用范围</h5>
        <p>
          本系统可用于个人学习、商业项目及企业生产环境，无需支付任何形式的授权费用。若您对本系统进行二次开发或集成，衍生作品同样受
          Apache 2.0 协议约束。
        </p>
        <h5>三、免责声明</h5>
        <p>
          在适用法律允许的最大范围内，本系统按"现状"提供，不附带任何明示或默示的担保，包括但不限于适销性、特定用途适用性及不侵权保证。作者或版权持有人不对因使用本系统而产生的任何直接、间接、偶然、特殊、惩罚性或后果性损失承担责任。
        </p>
        <h5>四、贡献与反馈</h5>
        <p>
          欢迎通过官方社区提交 Issue 或 Pull Request
          参与系统改进。提交贡献即表示您同意将相关代码以 Apache 2.0
          协议授权给本项目管理方。
        </p>
        <h5>五、其他</h5>
        <p>
          本协议条款可能会根据开源社区规范及法律法规变化进行调整，以官方网站（madong.tech）发布的最新版本为准。如有未尽事宜，参照
          Apache License 2.0 原文执行。
        </p>
      </div>
      <template #footer>
        <el-button
          type="primary"
          @click="
            showAgreement = false;
            agreed = true;
          "
          >
我已阅读并同意
</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.agreement-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 24px 0 8px;
}

.state-box {
  text-align: center;
}

.state-icon {
  margin-bottom: 16px;
}

.state-title {
  margin-bottom: 6px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.state-desc {
  margin-bottom: 24px;
  font-size: 14px;
  color: var(--text-tertiary);
}

.loader {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 3px solid #e8e8e8;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-hint {
  font-size: 14px;
  color: #999;
}

.success-icon {
  color: #67c23a;
}

.go-btn {
  height: 40px;
  padding: 0 24px;
  font-weight: 500;
  border-radius: 8px;
}

.welcome-box {
  text-align: center;
}

.welcome-icon {
  margin-bottom: 16px;
}

.feature-grid {
  display: flex;
  gap: 12px;
  margin: 24px 0 28px;
}

.feat {
  display: flex;
  flex: 1;
  gap: 10px;
  padding: 16px;
  text-align: left;
  background: var(--btn-ghost-bg);
  border-radius: 10px;

  .feat-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    color: var(--ic);
    background: var(--btn-ghost-bg);
    border-radius: 8px;
  }

  strong {
    display: block;
    margin-bottom: 2px;
    font-size: 13px;
    color: var(--text-primary);
  }

  span {
    font-size: 11px;
    color: var(--text-tertiary);
  }
}

.start-btn {
  height: 44px;
  padding: 0 36px;
  font-weight: 600;
  background: linear-gradient(135deg, #409eff, #6366f1);
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgb(64 158 255 / 30%);
  transition: all 0.3s;

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgb(64 158 255 / 40%);
    transform: translateY(-1px);
  }
}

/* 许可协议勾选 */
.agreement-bar {
  padding: 10px 0;
  margin: 22px 0 16px;
  text-align: center;

  .agreement-checkbox {
    :deep(.el-checkbox__label) {
      font-size: 13px;
      color: var(--text-secondary);
    }
  }

  .agreement-link {
    font-size: 13px;
  }
}

/* 协议弹窗内容 */
.agreement-content {
  max-height: 420px;
  overflow-y: auto;
  line-height: 1.8;
  text-align: left;

  h4 {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
  }

  h5 {
    margin: 14px 0 6px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  p {
    margin-bottom: 6px;
    font-size: 13px;
    color: var(--text-secondary);
  }
}

@media (max-width: 600px) {
  .feature-grid {
    flex-direction: column;
  }
}
</style>
