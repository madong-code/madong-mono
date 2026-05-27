import { installApi } from '@/api/install'
import { getConfig } from '@/utils/config'
import { defineStore } from 'pinia'
import type { TenantConfig, DatabaseConfig, AdminConfig } from '@/types/install'

export const useInstallStore = defineStore('install', {
  state: () => ({
    // 协议数据
    agreementData: null as any,

    // 环境检测数据
    environmentData: {
      check_items: [] as any[],
      directory_check_items: [] as any[],
      passed: false,
      loading: false,
    },

    // 数据库配置
    databaseConfig: {
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'madong',
      prefix: 'md_',
    } as DatabaseConfig,

    // 多租户配置
    tenantConfig: {
      tenant_mode: 'none',
      enable_tenant: false,
      create_default_tenant: false,
      default_tenant_name: '默认租户',
      tenant_admin_username: 'tenant_admin',
      tenant_admin_password: '123456',
      tenant_admin_email: 'tenant@example.com',
    } as TenantConfig,

    // 管理员配置
    adminConfig: {
      username: 'admin',
      password: '123456',
      email: '405784684@qq.com',
      site_name: 'Madong管理系统',
      install_database: true,
      build_project: true,
      // 多租户字段（新增）
      enable_tenant: false,
      default_tenant_name: '默认租户',
      tenant_admin_username: 'tenant_admin',
      tenant_admin_password: '123456',
      tenant_admin_email: 'tenant@example.com',
    } as AdminConfig,

    // 安装进度
    install_progress: 0,
    // 安装日志
    install_logs: [] as string[],
    // 安装状态
    install_status: 'idle' as 'idle' | 'installing' | 'success' | 'error',
    // 安装开始时间
    install_start_time: null as Date | null,
    // 安装是否完成
    installation_completed: false,
    // 安装完成时间
    installation_completed_time: null as Date | null,
    // 安装结束时间
    install_end_time: null as Date | null,
  }),

  getters: {
    installDuration: (state) => {
      if (!state.install_start_time) return 0
      const endTime = state.install_end_time || new Date()
      return Math.floor((endTime.getTime() - state.install_start_time.getTime()) / 1000)
    },

    formattedDuration: (state) => {
      const duration = state.install_end_time && state.install_start_time
        ? Math.floor((state.install_end_time.getTime() - state.install_start_time.getTime()) / 1000)
        : 0

      if (duration < 60) {
        return `${duration}秒`
      } else {
        const minutes = Math.floor(duration / 60)
        const seconds = duration % 60
        return `${minutes}分${seconds}秒`
      }
    },

    environmentPassed: (state) => {
      if (state.environmentData.check_items.length === 0) return false
      const hasRequiredError = state.environmentData.check_items.some(
        (item: any) => item.is_required && item.status === false
      )
      return !hasRequiredError
    },

    environmentCheckItems: (state) => {
      return state.environmentData.check_items.map((item: any) => ({
        name: item.name,
        need: item.need,
        required: item.required,
        current: item.current,
        status: item.status,
        statusText: item.status_text,
        message: item.message,
        isRequired: item.is_required,
      }))
    },

    directoryCheckItems: (state) => {
      return state.environmentData.directory_check_items.map((item: any) => ({
        path: item.path,
        pathName: item.path_name,
        name: item.name,
        required: item.required,
        permissionType: item.permission_type,
        description: item.description,
        exists: item.exists,
        isReadable: item.is_readable,
        isWritable: item.is_writable,
        status: item.status,
        statusText: item.status_text,
        message: item.message,
      }))
    },
  },

  actions: {
    async fetchInstallationStatus() {
      const res = await installApi.checkInstall()
      this.installation_completed = res.data?.installed || false
      return res.data?.installation_completed || false
    },

    async fetchAgreementData() {
      const res = await installApi.getAgreement()
      this.agreementData = res.data || {}
      return res.data || {}
    },

    async checkEnvironment() {
      this.environmentData.loading = true
      const res = await installApi.environment()
      this.environmentData.check_items = res.data?.check_items || []
      this.environmentData.directory_check_items = res.data?.directory_check_items || []
      this.environmentData.loading = false
    },

    async simulateInstallation() {
      try {
        this.startInstall()

        const config = getConfig()
        const params = new URLSearchParams()

        // 数据库配置参数
        params.append('db_host', this.databaseConfig.host || '')
        params.append('db_port', this.databaseConfig.port?.toString() || '')
        params.append('db_database', this.databaseConfig.database || '')
        params.append('db_username', this.databaseConfig.username || '')
        params.append('db_password', this.databaseConfig.password || '')
        params.append('db_prefix', this.databaseConfig.prefix || '')

        // 管理员配置参数
        params.append('admin_username', this.adminConfig.username || '')
        params.append('admin_password', this.adminConfig.password || '')
        params.append('admin_email', this.adminConfig.email || '')
        params.append('site_name', this.adminConfig.site_name || '')
        params.append('install_database', this.adminConfig.install_database ? '1' : '0')
        params.append('build_project', this.adminConfig.build_project ? '1' : '0')

        // 多租户配置参数
        params.append('enable_tenant', this.tenantConfig.enable_tenant ? '1' : '0')
        params.append('create_default_tenant', this.tenantConfig.create_default_tenant ? '1' : '0')
        if (this.tenantConfig.enable_tenant && this.tenantConfig.create_default_tenant) {
          params.append('default_tenant_name', this.tenantConfig.default_tenant_name || '')
          params.append('tenant_admin_username', this.tenantConfig.tenant_admin_username || '')
          params.append('tenant_admin_password', this.tenantConfig.tenant_admin_password || '')
          params.append('tenant_admin_email', this.tenantConfig.tenant_admin_email || '')
        }

        // 拼接完整的 SSE URL
        const sseUrl = `${config.apiBaseUrl}/install?${params.toString()}`.replace('//', '/')

        return new Promise((resolve, reject) => {
          const eventSource = new EventSource(sseUrl)

          eventSource.addEventListener('progress', (event) => {
            try {
              const response = JSON.parse((event as MessageEvent).data)
              const data = response.data || {}
              if (data.progress !== undefined) {
                this.updateProgress(data.progress, data.message || '安装进行中...')
              } else {
                this.install_logs.push(`[${new Date().toLocaleTimeString()}] ${data.message || '安装进行中...'}`)
              }
            } catch (error) {
              console.error('解析进度消息失败:', error)
            }
          })

          eventSource.addEventListener('runtime_error', (event) => {
            try {
              const response = JSON.parse((event as MessageEvent).data)
              const data = response.data || {}
              if (data.status === 'error') {
                this.updateProgress(100, data.message || '安装异常...')
              }
              this.installFailed(data.message || '安装异常...')
              eventSource.close()
              resolve(response)
            } catch (error) {
              eventSource.close()
              console.error('解析错误消息失败:', error)
            }
          })

          eventSource.addEventListener('completed', (event) => {
            try {
              const response = JSON.parse((event as MessageEvent).data)
              this.installComplete()
              eventSource.close()
              resolve(response)
            } catch (error) {
              console.error('解析完成消息失败:', error)
              eventSource.close()
              reject(error)
            }
          })

          eventSource.onmessage = (event) => {
            try {
              const response = JSON.parse(event.data)
              const data = response.data || {}
              const message = data.message || response.message || '安装进行中...'
              this.install_logs.push(`[${new Date().toLocaleTimeString()}] ${message}`)
            } catch (error) {
              console.error('解析通用消息失败:', error)
            }
          }

          const timeout = setTimeout(() => {
            if (eventSource.readyState !== EventSource.CLOSED) {
              console.warn('SSE 连接超时')
              this.installFailed('安装超时')
              eventSource.close()
              reject(new Error('安装超时'))
            }
          }, 1000000)

          eventSource.addEventListener('completed', () => {
            clearTimeout(timeout)
          })
        })
      } catch (error) {
        console.error('安装初始化失败:', error)
        this.installFailed('安装初始化失败')
        throw error
      }
    },

    // 更新数据库配置
    updateDatabaseConfig(config: Partial<DatabaseConfig>) {
      this.databaseConfig = { ...this.databaseConfig, ...config }
    },

    // 更新多租户配置
    updateTenantConfig(config: Partial<TenantConfig>) {
      this.tenantConfig = { ...this.tenantConfig, ...config }
      // 根据 tenant_mode 自动派生 enable_tenant / create_default_tenant
      if (config.tenant_mode !== undefined) {
        this.tenantConfig.enable_tenant = config.tenant_mode !== 'none'
        this.tenantConfig.create_default_tenant = config.tenant_mode === 'auto'
      }
      // 同步到 adminConfig 以便后端兼容
      this.adminConfig.enable_tenant = this.tenantConfig.enable_tenant
      this.adminConfig.create_default_tenant = this.tenantConfig.create_default_tenant
      this.adminConfig.default_tenant_name = this.tenantConfig.default_tenant_name
      this.adminConfig.tenant_admin_username = this.tenantConfig.tenant_admin_username
      this.adminConfig.tenant_admin_password = this.tenantConfig.tenant_admin_password
      this.adminConfig.tenant_admin_email = this.tenantConfig.tenant_admin_email
    },

    // 更新管理员配置
    updateAdminConfig(config: Partial<AdminConfig>) {
      this.adminConfig = { ...this.adminConfig, ...config }
    },

    // 开始安装
    startInstall() {
      this.install_status = 'installing'
      this.install_start_time = new Date()
      this.install_end_time = null
      this.install_progress = 0
      this.install_logs = ['开始安装...']
    },

    // 更新安装进度
    updateProgress(progress: number, log: string) {
      this.install_progress = progress
      this.install_logs.push(`[${new Date().toLocaleTimeString()}] ${log}`)
    },

    // 安装完成
    installComplete() {
      this.install_status = 'success'
      this.install_end_time = new Date()
      this.install_progress = 100
      this.install_logs.push(`安装完成，耗时: ${this.formattedDuration}`)
    },

    // 安装失败
    installFailed(error: string) {
      this.install_status = 'error'
      this.install_end_time = new Date()
      this.install_logs.push(`安装失败: ${error}`)
    },

    // 标记安装完成
    markInstallationCompleted() {
      this.installation_completed = true
      this.installation_completed_time = new Date()
    },

    // 检查安装状态
    checkInstallationStatus() {
      return this.installation_completed
    },

    // 重置安装状态
    resetInstall() {
      this.install_progress = 0
      this.install_logs = []
      this.install_status = 'idle'
      this.install_start_time = null
      this.install_end_time = null
    },
  },
})
