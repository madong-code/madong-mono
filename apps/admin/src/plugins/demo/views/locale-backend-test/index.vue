<template>
  <div class="locale-backend-test">
    <div class="test-container">
      <div class="header">
        <h1>🌐 后端语言包测试页面</h1>
        <p>测试插件语言包是否正确加载</p>
      </div>

      <div class="test-section">
        <button class="reload-btn" @click="reloadLocale">重新加载语言包</button>
        <button class="reload-btn" @click="testTranslation">测试翻译</button>
      </div>

      <div class="test-section">
        <h2>插件语言包测试 (使用全局 $t)</h2>
        <div class="test-grid">
          <div class="test-card">
            <div class="card-label">demo.greeting</div>
            <div class="card-value">{{ $t('demo.greeting') }}</div>
          </div>
          <div class="test-card">
            <div class="card-label">demo.welcome</div>
            <div class="card-value">{{ $t('demo.welcome') }}</div>
          </div>
          <div class="test-card">
            <div class="card-label">demo.menu.home</div>
            <div class="card-value">{{ $t('demo.menu.home') }}</div>
          </div>
          <div class="test-card">
            <div class="card-label">demo.menu.settings</div>
            <div class="card-value">{{ $t('demo.menu.settings') }}</div>
          </div>
        </div>
      </div>

      <div class="test-section">
        <h2>框架语言包测试</h2>
        <div class="test-grid">
          <div class="test-card">
            <div class="card-label">common.confirm</div>
            <div class="card-value">{{ $t('common.confirm') }}</div>
          </div>
          <div class="test-card">
            <div class="card-label">common.cancel</div>
            <div class="card-value">{{ $t('common.cancel') }}</div>
          </div>
        </div>
      </div>

      <div class="test-section">
        <h2>当前语言设置</h2>
        <div class="locale-info">
          <div class="info-row">
            <span class="info-label">当前语言:</span>
            <span class="info-value">{{ currentLocale }}</span>
          </div>
        </div>
      </div>

      <div class="test-section">
        <h2>切换语言</h2>
        <div class="lang-buttons">
          <button 
            class="lang-btn"
            :class="{ active: currentLocale === 'zh-CN' || currentLocale === 'zh' }"
            @click="switchLocale('zh-CN')"
          >
            🇨🇳 中文
          </button>
          <button 
            class="lang-btn"
            :class="{ active: currentLocale === 'en-US' || currentLocale === 'en' }"
            @click="switchLocale('en-US')"
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      <div class="test-section">
        <h2>调试信息</h2>
        <pre class="debug-output">{{ debugInfo }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { $t } from '#/locales';

const { locale, mergeLocaleMessage, messages } = useI18n();
const debugInfo = ref('');

const currentLocale = computed(() => locale.value);

function testTranslation() {
  // 测试翻译
  console.log('测试翻译:');
  console.log('demo.greeting:', $t('demo.greeting'));
  console.log('demo.welcome:', $t('demo.welcome'));
  console.log('demo.menu.home:', $t('demo.menu.home'));
  console.log('demo.menu.settings:', $t('demo.menu.settings'));
  
  // 强制刷新页面
  window.location.reload();
}

async function switchLocale(lang: string) {
  locale.value = lang;
  // 切换语言后重新加载语言包
  await reloadLocaleForLang(lang);
}

async function reloadLocaleForLang(lang: string) {
  try {
    const { loadAllLocaleMessages } = await import('../../../../locales/loader');
    const result = loadAllLocaleMessages(lang as any);
    mergeLocaleMessage(lang, result);
    console.log(`语言包已加载并合并到 ${lang}`);
  } catch (error) {
    console.error('加载语言包失败:', error);
  }
}

onMounted(async () => {
  // 组件挂载时输出调试信息
  debugInfo.value = '=== 组件挂载 ===\n';
  debugInfo.value += '当前语言: ' + currentLocale.value + '\n';
  debugInfo.value += 'messages 类型: ' + typeof messages.value + '\n';
  debugInfo.value += 'messages keys: ' + Object.keys(messages.value).slice(0, 10).join(', ') + '...\n';
  debugInfo.value += 'messages["demo"] exists: ' + (messages.value['demo'] ? 'yes' : 'no') + '\n';
  
  // 直接添加静态语言包来测试
  debugInfo.value += '\n=== 添加静态语言包 ===\n';
  
  const staticMessages = {
    demo: {
      greeting: '你好！欢迎使用插件语言包测试',
      welcome: '欢迎来到后端模式路由测试',
      menu: {
        home: '首页',
        settings: '设置'
      }
    }
  };
  
  debugInfo.value += '静态语言包内容:\n' + JSON.stringify(staticMessages, null, 2) + '\n';
  
  // 合并到当前语言和 zh-CN
  debugInfo.value += '当前语言: ' + currentLocale.value + '\n';
  mergeLocaleMessage(currentLocale.value, staticMessages);
  debugInfo.value += '静态语言包已合并到当前语言: ' + currentLocale.value + '\n';
  
  if (currentLocale.value !== 'zh-CN') {
    mergeLocaleMessage('zh-CN', staticMessages);
    debugInfo.value += '静态语言包已合并到 zh-CN\n';
  }
  
  // 检查合并后的消息
  setTimeout(() => {
    debugInfo.value += '\n=== 合并后的消息检查 ===\n';
    debugInfo.value += 'messages["demo"] exists: ' + (messages.value['demo'] ? 'yes' : 'no') + '\n';
    if (messages.value['demo']) {
      debugInfo.value += 'demo 消息内容:\n' + JSON.stringify(messages.value['demo'], null, 2);
    }
    
    // 测试翻译
    debugInfo.value += '\n=== 测试翻译 ===\n';
    debugInfo.value += '$t("demo.greeting"): ' + $t('demo.greeting') + '\n';
    debugInfo.value += '$t("demo.welcome"): ' + $t('demo.welcome') + '\n';
  }, 500);
});

async function reloadLocale() {
  try {
    // 使用相对路径导入
    const { loadAllLocaleMessages } = await import('../../../../locales/loader');
    debugInfo.value = '=== 开始加载语言包 ===\n';
    
    // 测试加载 zh-CN
    debugInfo.value += '正在加载 zh-CN 语言包...\n';
    const result = loadAllLocaleMessages('zh-CN');
    debugInfo.value += '加载结果类型: ' + typeof result + '\n';
    debugInfo.value += '加载结果 keys: ' + Object.keys(result).join(', ') + '\n';
    
    // 检查是否加载到了 demo 插件的语言包
    if (result['demo']) {
      debugInfo.value += 'demo 插件语言包内容:\n';
      debugInfo.value += JSON.stringify(result['demo'], null, 2);
    } else {
      debugInfo.value += '警告: 没有加载到 demo 插件的语言包!\n';
    }
    
    debugInfo.value += '完整加载结果:\n';
    debugInfo.value += JSON.stringify(result, null, 2);
    
    // 合并到当前语言
    mergeLocaleMessage(currentLocale.value, result);
    debugInfo.value += '\n=== 语言包已合并 ===';
    
    // 刷新页面
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    debugInfo.value = '加载失败: ' + error;
    console.error('加载语言包失败:', error);
  }
}
</script>

<style scoped>
.locale-backend-test {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px;
}

.test-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;

  h1 {
    margin: 0 0 8px 0;
    font-size: 24px;
  }

  p {
    margin: 0;
    opacity: 0.9;
  }
}

.reload-btn {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }
}

.test-section {
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h2 {
    margin: 0 0 16px 0;
    font-size: 18px;
    color: #1f2937;
  }
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.test-card {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #667eea;

  .card-label {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }
}

.locale-info {
  padding: 16px;
  background: #eff6ff;
  border-radius: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .info-label {
    font-weight: 500;
    color: #6b7280;
  }

  .info-value {
    padding: 4px 12px;
    background: white;
    border-radius: 4px;
    font-weight: 600;
    color: #3b82f6;
  }
}

.lang-buttons {
  display: flex;
  gap: 12px;
}

.lang-btn {
  padding: 12px 28px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  &.active {
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
}

.debug-output {
  background: #1f2937;
  color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
  font-size: 12px;
  line-height: 1.5;
}
</style>
