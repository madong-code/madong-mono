export interface SiteConfig {
  site_open: '0' | '1'
  site_url: string
  site_name: string
  site_logo: string
  site_network_security: string
  site_description: string
  site_record_no: string
  cdn_url?: string
  cdn_url_params?: string
  site_icp_url: string
  site_network_security_url: string | null
}

export interface FilePolicyConfig {
  mode: 'local' | 'remote' | 'hybrid'
  single_limit: number
  total_limit: number
  nums: number
  exclude: string
  advanced?: {
    hash_algorithm?: 'MD5' | 'SHA256'
    virus_scan?: boolean
  }
}

export interface EmailConfig {
  SMTPSecure: 'ssl' | 'tls'
  Host: string
  Port: 465 | 587
  Username: string
  Password: string
  From: string
  FromName: string
  advanced?: {
    timeout?: number
    debugLevel?: 'none' | 'basic' | 'full'
  }
}

export interface SMSConfig {
  enable: '0' | '1'
  access_key_id: string
  access_key_secret: string
  sign_name: string
  advanced?: {
    timeout?: number
    retry_times?: number
    region_id?: 'cn-hangzhou' | 'ap-southeast-1'
  }
}

export interface LocalUploadConfig {
  root: string
  dirname: string
  domain: string
  advanced?: {
    filenameStrategy?: 'timestamp' | 'hash' | 'original'
    depthLevel?: number
    autoPurgeDays?: number
  }
}
