export interface DbSettingRow {
  id: number;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  driver: string;
  prefix?: string;
  charset?: string;
  collation?: string;
  enabled: number;
  is_default?: number;
  sort?: number;
  description?: string;
  extra_config?: Record<string, any>;
  /** 是否为使用现有数据库（存储在 extra_config 中） */
  is_existing?: boolean;
  last_test_result?: boolean;
  last_test_time?: number;
  create_time?: string;
  update_time?: string;
  created_at?: string;
  updated_at?: string;
}
