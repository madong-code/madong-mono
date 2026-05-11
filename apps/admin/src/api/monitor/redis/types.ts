export interface RedisMonitorData {
  uptime_in_seconds: number
  connected_clients: number
  used_memory: string
  memory_fragmentation_ratio: number
  total_commands_processed: number
  total_connections_received: number
  keyspace_hits: number
  keyspace_misses: number
  hit_rate: number
  variable: RedisVariableInfo
  data: RedisDataEntries
}

export interface RedisVariableInfo {
  redis_version: string
  redis_git_sha1: number | string
  redis_git_dirty: number
  redis_build_id: string
  redis_mode: 'standalone' | 'cluster'
  os: string
  arch_bits: 64 | 32
  multiplexing_api: string
  process_id: number
  run_id: string
  tcp_port: number
  uptime_in_seconds: number
  uptime_in_days: number
  hz: number
  lru_clock: number
  config_file: string
  client_longest_output_list: number
  client_biggest_input_buf: number
  blocked_clients: number
  used_memory: number
  used_memory_human: string
  used_memory_rss: number
  used_memory_peak: number
  used_memory_peak_human: string
  used_memory_lua: number
  mem_fragmentation_ratio: number
  mem_allocator: string
}

interface RedisDataEntries {
  [key: string]: string
}
