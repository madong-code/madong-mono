import axios from 'axios'

// 默认配置
const defaultConfig = {
  apiBaseUrl: '/adminapi',
  installInfo: {
    title: 'madodng 安装向导',
    version: '1.0.0',
    description: '极速后台开发框架',
  },
  siteInfo: {
    logo: './logo.png',
    name: 'madong 极速后台开发框架',
    officialWebsite: 'https://madong.tech',
    community: 'https://madong.tech/ask',
    documentation: 'https://madong.tech/docs',
    frontendUrl: '/',
    backendUrl: '/admin',
    configUrl: '/admin#/system/config',
  },
}

// 动态加载配置
export async function loadConfig() {
  const configPaths = [
    './config.json',
    getConfigPath(),
    '/config.json',
    `${window.location.origin}${getConfigPath()}`,
  ]

  for (const path of configPaths) {
    try {
      const response = await axios.get(path, { timeout: 5000 })
      const mergedConfig = deepMerge(defaultConfig, response.data)
      return mergedConfig
    } catch (error) {
      // 忽略，继续尝试下一个路径
    }
  }

  return defaultConfig
}

// 深度合并对象
function deepMerge(target: any, source: any) {
  const result = { ...target }

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}

// 获取配置文件的绝对路径
function getConfigPath() {
  if (typeof window === 'undefined') {
    return './config.json'
  }

  const currentPath = window.location.pathname
  const pathSegments = currentPath.split('/').filter(segment => segment)

  if (pathSegments.length === 0) {
    return './config.json'
  }

  const basePath = pathSegments.slice(0, -1).join('/') || ''
  return basePath ? `/${basePath}/config.json` : '/config.json'
}

// 全局配置实例
let publicConfig = defaultConfig

// 初始化配置
export async function initConfig() {
  try {
    publicConfig = await loadConfig()
    return publicConfig
  } catch (error) {
    console.error('配置初始化失败:', error)
    return publicConfig
  }
}

// 获取当前配置的函数
export function getConfig() {
  return publicConfig
}
