<template>
  <div class="locale-test-page">
    <BasicLayout>
      <div class="locale-test-content">
        <div class="header">
          <h1>{{ $t('demos.localeTest.title') }}</h1>
          <p>{{ $t('demos.localeTest.description') }}</p>
        </div>

        <div class="test-section">
          <h2>{{ $t('demos.localeTest.basicTest') }}</h2>
          <div class="test-items">
            <div class="test-item">
              <span class="label">{{ $t('demos.localeTest.greeting') }}:</span>
              <span class="value">{{ $t('common.greeting') }}</span>
            </div>
            <div class="test-item">
              <span class="label">{{ $t('demos.localeTest.login') }}:</span>
              <span class="value">{{ $t('authentication.login.title') }}</span>
            </div>
            <div class="test-item">
              <span class="label">{{ $t('demos.localeTest.password') }}:</span>
              <span class="value">{{ $t('authentication.login.password') }}</span>
            </div>
          </div>
        </div>

        <div class="test-section">
          <h2>{{ $t('demos.localeTest.currentLocale') }}</h2>
          <div class="locale-info">
            <div class="info-item">
              <span class="label">Current Locale:</span>
              <span class="value">{{ currentLocale }}</span>
            </div>
            <div class="info-item">
              <span class="label">Mapped Locale:</span>
              <span class="value">{{ mappedLocale }}</span>
            </div>
          </div>
        </div>

        <div class="test-section">
          <h2>{{ $t('demos.localeTest.switchLanguage') }}</h2>
          <div class="language-buttons">
            <button 
              class="lang-btn" 
              :class="{ active: currentLocale === 'zh-CN' }"
              @click="switchLanguage('zh-CN')"
            >
              {{ $t('demos.localeTest.chinese') }}
            </button>
            <button 
              class="lang-btn" 
              :class="{ active: currentLocale === 'en-US' }"
              @click="switchLanguage('en-US')"
            >
              {{ $t('demos.localeTest.english') }}
            </button>
          </div>
        </div>

        <div class="test-section">
          <h2>{{ $t('demos.localeTest.availableKeys') }}</h2>
          <div class="keys-container">
            <div class="keys-header">
              <span>Key</span>
              <span>Value</span>
            </div>
            <div 
              v-for="(value, key) in testKeys" 
              :key="key" 
              class="key-item"
            >
              <span class="key-name">{{ key }}</span>
              <span class="key-value">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </BasicLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BasicLayout from '@/layouts/BasicLayout.vue';

const { locale, t } = useI18n();

const currentLocale = computed(() => locale.value);

const mappedLocale = computed(() => {
  const langMap: Record<string, string> = {
    'zh': 'zh-CN',
    'zh-CN': 'zh-CN',
    'en': 'en-US',
    'en-US': 'en-US',
  };
  return langMap[locale.value] || locale.value;
});

const testKeys = computed(() => {
  return {
    'common.greeting': t('common.greeting'),
    'common.confirm': t('common.confirm'),
    'common.cancel': t('common.cancel'),
    'common.save': t('common.save'),
    'authentication.login.title': t('authentication.login.title'),
    'authentication.login.username': t('authentication.login.username'),
    'authentication.login.password': t('authentication.login.password'),
    'preferences.title': t('preferences.title'),
    'profile.title': t('profile.title'),
    'demos.localeTest.title': t('demos.localeTest.title'),
  };
});

function switchLanguage(lang: string) {
  locale.value = lang;
}
</script>

<style lang="scss" scoped>
.locale-test-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.locale-test-content {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;

  h1 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: #1f2937;
  }

  p {
    margin: 0;
    color: #6b7280;
  }
}

.test-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;

  h2 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #374151;
  }
}

.test-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.test-item, .info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #fff;
  border-radius: 4px;

  .label {
    font-weight: 500;
    color: #6b7280;
  }

  .value {
    color: #1f2937;
  }
}

.locale-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.language-buttons {
  display: flex;
  gap: 12px;
}

.lang-btn {
  padding: 10px 24px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &.active {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  }
}

.keys-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.keys-header {
  display: flex;
  padding: 10px 12px;
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;

  span {
    flex: 1;
  }
}

.key-item {
  display: flex;
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  .key-name {
    flex: 1;
    font-family: monospace;
    color: #6b7280;
  }

  .key-value {
    flex: 1;
    text-align: right;
    color: #1f2937;
  }
}
</style>