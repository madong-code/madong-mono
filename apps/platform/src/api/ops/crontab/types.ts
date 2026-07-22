export interface CrontabRow {
  id: string;
  biz_id: string;
  title: string;
  type: number;
  task_cycle: number;
  cycle_rule: string;
  rule: string;
  target: string;
  running_times: number | string;
  last_running_time: number | string;
  enabled: number;
  /** 任务来源：system=系统内置 plugin=插件自定义 custom=租户/平台自定义 */
  source: string;
  /** 插件编码（source=plugin 时有效） */
  plugin_code: null | string;
  /** 所属租户ID，平台维度为聚合视图，该字段用于区分任务归属 */
  tenant_id: null | string;
}

export interface CrontabLogRow {
  id: string;
  crontab_id: string;
  target: string;
  log: string;
  return_code: string;
  running_time: string;
  tenant_id: null | string;
}
