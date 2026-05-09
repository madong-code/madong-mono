import type { Language } from 'element-plus/es/locale';
import type { App } from 'vue';
import type { LocaleSetupOptions, SupportedLanguagesType } from '@vben/locales';

import { ref } from 'vue';
import {
  $t,
  setupI18n as coreSetup,
  loadLocalesMapFromDir,
} from '@vben/locales';
import { preferences } from '@vben/preferences';

import dayjs from 'dayjs';
import enLocale from 'element-plus/es/locale/lang/en';
import defaultLocale from 'element-plus/es/locale/lang/zh-cn';

import { loadAllLocaleMessages } from './loader';

const elementLocale = ref<Language>(defaultLocale);

const modules = import.meta.glob('./langs/**/*.json');

// 使用支持 Windows 路径的正则表达式（同时支持 / 和 \）
const localesMap = loadLocalesMapFromDir(
  /\.\/langs[/\\]([^/\\]+)[/\\](.*)\.json$/,
  modules,
);

/**
 * 语言代码映射: 处理 zh/zh-CN 和 en/en-US 之间的转换
 */
function getLocaleKey(lang: string): SupportedLanguagesType {
  const langMap: Record<string, SupportedLanguagesType> = {
    'zh': 'zh-CN',
    'zh-CN': 'zh-CN',
    'zh_CN': 'zh-CN',
    'zh-Hans': 'zh-CN',
    'en': 'en-US',
    'en-US': 'en-US',
    'en_US': 'en-US',
    'en-GB': 'en-US',
  };
  return langMap[lang] || 'zh-CN';
}

/**
 * 加载应用特有的语言包
 * @param lang - 语言代码（可能是 'zh', 'zh-CN', 'en', 'en-US' 等）
 */
async function loadMessages(lang: string) {
  console.log('========================================');
  console.log('[loadMessages] STARTED with lang:', lang);
  
  // 获取正确的语言目录名称
  const localeKey = getLocaleKey(lang);
  console.log('[loadMessages] localeKey:', localeKey);
  
  console.log('[loadMessages] localesMap keys:', Object.keys(localesMap));
  
  // 先尝试从映射后的语言代码加载，再回退到原始语言代码
  const [appLocaleMessages] = await Promise.all([
    localesMap[localeKey]?.() || localesMap[lang]?.(),
    loadThirdPartyMessage(localeKey),
  ]);

  console.log('[loadMessages] appLocaleMessages:', appLocaleMessages);
  
  // 加载框架和插件语言包 - 使用映射后的语言代码
  console.log('[loadMessages] Calling loadAllLocaleMessages with localeKey:', localeKey);
  const extMessages = loadAllLocaleMessages(localeKey as SupportedLanguagesType);
  console.log('[loadMessages] extMessages:', JSON.stringify(extMessages, null, 2));

  // 如果当前语言与映射后的语言不同，也加载当前语言的语言包
  let extMessagesLang = {};
  if (lang !== localeKey) {
    console.log('[loadMessages] Also loading messages for original lang:', lang);
    extMessagesLang = loadAllLocaleMessages(lang as SupportedLanguagesType);
    console.log('[loadMessages] extMessagesLang:', JSON.stringify(extMessagesLang, null, 2));
  }

  // 合并所有语言包（优先级: app > plugins > framework）
  const result = {
    ...extMessages,
    ...extMessagesLang,
    ...appLocaleMessages?.default,
  };
  
  console.log('[loadMessages] Final Result:', JSON.stringify(result, null, 2));
  console.log('========================================');
  
  return result;
}

/**
 * 加载第三方组件库的语言包
 * @param lang
 */
async function loadThirdPartyMessage(lang: SupportedLanguagesType) {
  await Promise.all([loadElementLocale(lang), loadDayjsLocale(lang)]);
}

/**
 * 加载dayjs的语言包
 * @param lang
 */
async function loadDayjsLocale(lang: SupportedLanguagesType) {
  let locale;
  if (lang === 'en-US') {
    locale = await import('dayjs/locale/en');
  } else if (lang === 'zh-CN') {
    locale = await import('dayjs/locale/zh-cn');
  } else {
    locale = await import('dayjs/locale/en');
  }
  if (locale) {
    dayjs.locale(locale);
  } else {
    console.error(`Failed to load dayjs locale for ${lang}`);
  }
}

/**
 * 加载element-plus的语言包
 * @param lang
 */
function loadElementLocale(lang: SupportedLanguagesType) {
  if (lang === 'en-US') {
    elementLocale.value = enLocale;
  } else if (lang === 'zh-CN') {
    elementLocale.value = defaultLocale;
  }
}

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  console.log('========================================');
  console.log('[setupI18n] Called!');
  console.log('[setupI18n] preferences.app.locale:', preferences.app.locale);
  // 确保默认语言代码被正确映射
  const defaultLang = getLocaleKey(preferences.app.locale);
  console.log('[setupI18n] defaultLang:', defaultLang);
  
  await coreSetup(app, {
    defaultLocale: defaultLang,
    loadMessages,
    missingWarn: !import.meta.env.PROD,
    ...options,
  });
  
  console.log('[setupI18n] Completed!');
}

export { $t, elementLocale, setupI18n };
