import { get, post } from '@/utils/request'

// 安装相关 API
export const installApi = {
  // 检查安装状态
  checkInstall: () => get('/install/check'),

  // 获取安装协议
  getAgreement: () => get('/install/agreement'),

  // 检查环境
  environment: () => get('/install/environment'),

  // 测试数据库连接
  testDatabase: (data: any) => post('/install/test-database', data),

  // 验证配置
  validateConfig: (data: any) => post('/install/config-validate', data),
}

export default installApi
