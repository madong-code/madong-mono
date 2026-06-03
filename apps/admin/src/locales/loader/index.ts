import type { SupportedLanguagesType } from '@vben/locales';

type LocaleMessages = Record<string, any>;

const LOCALE_DIR_MAP: Record<string, string> = {
  en: 'en-US',
  'en-GB': 'en-US',
  'en-US': 'en-US',
  en_US: 'en-US',
  zh: 'zh-CN',
  'zh-CN': 'zh-CN',
  zh_CN: 'zh-CN',
  'zh-Hans': 'zh-CN',
};

function normalizeLocaleDir(lang: SupportedLanguagesType): string {
  return LOCALE_DIR_MAP[lang] || lang;
}

function deepMerge(
  target: LocaleMessages,
  source: LocaleMessages,
): LocaleMessages {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function setNestedValue(
  obj: LocaleMessages,
  keys: string[],
  value: LocaleMessages,
): void {
  if (keys.length === 0) return;

  let current: LocaleMessages = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i] as string;
    if (!current[key]) current[key] = {};
    current = current[key] as LocaleMessages;
  }
  const lastKey = keys[keys.length - 1] as string;
  const existing = current[lastKey];
  if (
    existing &&
    typeof existing === 'object' &&
    !Array.isArray(existing) &&
    typeof value === 'object'
  ) {
    deepMerge(existing as LocaleMessages, value);
  } else {
    current[lastKey] = value;
  }
}

function extractLocaleAndFileKeys(
  path: string,
  langDirName: string,
): { localeDir: string; fileKeys: string[] } | null {
  const parts = path.split('/');
  const langIndex = parts.lastIndexOf(langDirName);
  if (langIndex === -1 || langIndex + 1 >= parts.length) return null;

  const localeDir = parts[langIndex + 1];
  if (!localeDir) return null;

  // 目录仅归档用途，不参与 key 生成；文件名即为 key，支持 . 层级分隔
  const fileName = parts.at(-1)?.replace('.json', '') || '';
  const fileKeys = fileName.split('.');

  return { localeDir, fileKeys };
}

function loadAppLangLocales(localeDir: string): LocaleMessages {
  const messages: LocaleMessages = {};

  const langModules = import.meta.glob<{ default: LocaleMessages }>(
    '../../lang/**/*.json',
    { eager: true },
  );

  for (const [path, module] of Object.entries(langModules)) {
    const result = extractLocaleAndFileKeys(path, 'lang');
    if (!result || result.localeDir !== localeDir) continue;

    setNestedValue(messages, result.fileKeys, module.default);
  }

  return messages;
}

function loadLocalesLangs(localeDir: string): LocaleMessages {
  const messages: LocaleMessages = {};

  const localesModules = import.meta.glob<{ default: LocaleMessages }>(
    '../langs/**/*.json',
    { eager: true },
  );

  for (const [path, module] of Object.entries(localesModules)) {
    const result = extractLocaleAndFileKeys(path, 'langs');
    if (!result || result.localeDir !== localeDir) continue;

    const fileKeys = result.fileKeys;
    if (fileKeys.length > 1) continue;

    setNestedValue(messages, fileKeys, module.default);
  }

  return messages;
}

function loadPluginLocales(localeDir: string): LocaleMessages {
  const messages: LocaleMessages = {};

  const pluginModules = import.meta.glob<{ default: LocaleMessages }>(
    '../../plugins/**/lang/**/*.json',
    { eager: true },
  );

  for (const [path, module] of Object.entries(pluginModules)) {
    const parts = path.split('/');
    const pluginIndex = parts.indexOf('plugins');
    const langIndex = parts.indexOf('lang');

    if (pluginIndex === -1 || langIndex === -1) continue;

    const pluginKey = parts[pluginIndex + 1];
    const dirLocale = parts[langIndex + 1];

    if (!pluginKey || !dirLocale || dirLocale !== localeDir) continue;

    const fileName = parts.at(-1)?.replace('.json', '') || '';
    const fileKeys = [pluginKey, ...fileName.split('.')];

    setNestedValue(messages, fileKeys, module.default);
  }

  return messages;
}

export function loadAllLocaleMessages(
  lang: SupportedLanguagesType,
): LocaleMessages {
  const localeDir = normalizeLocaleDir(lang);
  const messages: LocaleMessages = {};

  deepMerge(messages, loadLocalesLangs(localeDir));
  deepMerge(messages, loadAppLangLocales(localeDir));
  deepMerge(messages, loadPluginLocales(localeDir));

  return messages;
}
