import { merge } from '@vben/utils';
import type { SupportedLanguagesType } from '@vben/locales';

/**
 * 语言代码映射: 处理 zh/zh-CN 和 en/en-US 之间的转换
 */
function getLocaleDir(lang: SupportedLanguagesType): string {
  const langMap: Record<string, string> = {
    'zh': 'zh-CN',
    'zh-CN': 'zh-CN',
    'zh_CN': 'zh-CN',
    'zh-Hans': 'zh-CN',
    'en': 'en-US',
    'en-US': 'en-US',
    'en_US': 'en-US',
    'en-GB': 'en-US',
  };
  return langMap[lang] || lang;
}

/**
 * Convert flat object to nested object
 * @param flatObj - Flat object with dot-separated keys
 * @returns Nested object
 */
function toNestedObject(flatObj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in flatObj) {
    const keys = key.split('.');
    let current = result;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        current[k] = flatObj[key];
      } else {
        if (!current[k]) current[k] = {};
        current = current[k];
      }
    });
  }

  return result;
}

export function loadAllLocaleMessages(lang: SupportedLanguagesType): Record<string, any> {
  console.log('========================================');
  console.log('[LocaleLoader] loadAllLocaleMessages called!');
  console.log('[LocaleLoader] lang:', lang);
  console.log('========================================');
  
  const messages: Record<string, any> = {};
  const localeDir = getLocaleDir(lang);
  
  console.log('[LocaleLoader] localeDir:', localeDir);

  // 需要检查的语言目录列表（处理 zh 和 zh-CN 的映射）
  const localeDirsToCheck = lang !== localeDir ? [localeDir, lang] : [localeDir];
  
  console.log('[LocaleLoader] localeDirsToCheck:', localeDirsToCheck);

  // Scan framework lang directory (src/lang/)
  const langModules = import.meta.glob<{ default: Record<string, any> }>(
    '../lang/**/*.json',
    { eager: true }
  );

  // Scan locales langs directory (src/locales/langs/)
  const localesModules = import.meta.glob<{ default: Record<string, any> }>(
    '../locales/langs/**/*.json',
    { eager: true }
  );

  // Scan plugin lang directory (src/plugins/**/lang/)
  const pluginModules = import.meta.glob<{ default: Record<string, any> }>(
    '../plugins/**/lang/**/*.json',
    { eager: true }
  );

  // 额外的调试信息
  console.log('[LocaleLoader] === 扫描结果 ===');
  console.log('[LocaleLoader] langModules keys:', Object.keys(langModules));
  console.log('[LocaleLoader] localesModules keys:', Object.keys(localesModules));
  console.log('[LocaleLoader] pluginModules keys:', Object.keys(pluginModules));
  console.log('[LocaleLoader] pluginModules count:', Object.keys(pluginModules).length);
  
  // 打印每个插件模块的路径
  if (Object.keys(pluginModules).length === 0) {
    console.log('[LocaleLoader] 警告: 没有扫描到任何插件语言包文件!');
    console.log('[LocaleLoader] 当前目录:', import.meta.url);
  } else {
    console.log('[LocaleLoader] 扫描到的插件语言包路径:');
    for (const path of Object.keys(pluginModules)) {
      console.log('[LocaleLoader]   -', path);
    }
  }

  // Process framework locales
  for (const [path, module] of Object.entries({ ...langModules, ...localesModules })) {
    const sep = path.includes('\\') ? '\\' : '/';
    const parts = path.split(sep);
    const localeIndex = parts.findIndex(p => p === 'lang' || p === 'langs');
    if (localeIndex === -1 || localeIndex + 1 >= parts.length) continue;
    
    const dirLocale = parts[localeIndex + 1];
    // 检查目录是否在需要检查的语言目录列表中
    if (!localeDirsToCheck.includes(dirLocale)) continue;
    
    const filePathParts = parts.slice(localeIndex + 2);
    const fileName = filePathParts.pop()?.replace('.json', '') || '';
    const fileKey = [...filePathParts, fileName].join('.');
    
    const content = module.default;
    const nestedContent = toNestedObject(content);
    
    const wrapped: Record<string, any> = {};
    wrapped[fileKey] = nestedContent;
    merge(messages, wrapped);
    
    console.log('[LocaleLoader] Loaded framework:', fileKey, 'from:', dirLocale);
  }

  // Process plugin locales
  for (const [path, module] of Object.entries(pluginModules)) {
    const sep = path.includes('\\') ? '\\' : '/';
    const parts = path.split(sep);
    
    const pluginIndex = parts.findIndex(p => p === 'plugins');
    const langIndex = parts.findIndex(p => p === 'lang');
    
    if (pluginIndex === -1 || langIndex === -1 || langIndex + 1 >= parts.length) continue;
    
    const pluginKey = parts[pluginIndex + 1];
    const dirLocale = parts[langIndex + 1];
    
    // 检查目录是否在需要检查的语言目录列表中
    if (!pluginKey || !localeDirsToCheck.includes(dirLocale)) continue;
    
    const filePathParts = parts.slice(langIndex + 2);
    const fileName = filePathParts.pop()?.replace('.json', '') || '';
    const fileKey = [...filePathParts, fileName].join('.');
    
    const content = module.default;
    const nestedContent = toNestedObject(content);
    
    if (!messages[pluginKey]) messages[pluginKey] = {};
    
    // If fileKey equals pluginKey, merge directly into plugin namespace
    // Otherwise, use fileKey as sub-key and merge the content
    if (fileKey === pluginKey) {
      merge(messages[pluginKey], nestedContent);
    } else {
      // 如果已存在该子键，合并内容；否则直接赋值
      if (messages[pluginKey][fileKey]) {
        merge(messages[pluginKey][fileKey], nestedContent);
      } else {
        messages[pluginKey][fileKey] = nestedContent;
      }
    }
    
    console.log('[LocaleLoader] Loaded plugin:', pluginKey, 'file:', fileKey, 'from:', dirLocale);
  }

  console.log('[LocaleLoader] Final messages:', JSON.stringify(messages, null, 2));
  return messages;
}
