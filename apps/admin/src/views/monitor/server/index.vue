<template>
  <div class="performance-monitor">
    <el-card shadow="hover" class="mb-20 monitor-card">
      <template #header><div class="card-header"><span><i class="el-icon-cpu"></i> CPU 监控</span></div></template>
      <div class="metric-container">
        <el-statistic :value="serverData.cpu?.cpu_usage_percentage || '0'" :title="serverData.cpu?.cpu_name || '未知CPU'" class="mb-20"><template #suffix><span>%</span></template></el-statistic>
        <el-progress :percentage="parseFloat(serverData.cpu?.cpu_usage_percentage || 0)" :stroke-width="18" :color="customColors" :show-text="false" class="mb-10" />
        <el-descriptions :column="2" border class="cpu-details">
          <el-descriptions-item label="物理核心">{{ serverData.cpu?.physical_cores || "0" }}</el-descriptions-item>
          <el-descriptions-item label="逻辑核心">{{ serverData.cpu?.logical_cores || "0" }}</el-descriptions-item>
          <el-descriptions-item label="缓存大小">{{ serverData.cpu?.cache_size_mb || "0" }} MB</el-descriptions-item>
          <el-descriptions-item label="空闲率">{{ serverData.cpu?.free_cpu_percentage || "0" }}%</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-card shadow="hover" class="mb-20 monitor-card">
      <template #header><div class="card-header"><span><i class="el-icon-memory"></i> 内存监控</span></div></template>
      <div class="metric-container">
        <el-statistic :value="serverData.memory?.memory_usage_rate || '0'" title="内存使用率" class="mb-20"><template #suffix><span>%</span></template></el-statistic>
        <el-progress :percentage="parseFloat(serverData.memory?.memory_usage_rate || 0)" :stroke-width="18" :color="customColors" :show-text="false" class="mb-10" />
        <el-descriptions :column="3" border class="memory-details">
          <el-descriptions-item label="总内存">{{ serverData.memory?.total_memory || "0" }} GB</el-descriptions-item>
          <el-descriptions-item label="已用内存">{{ serverData.memory?.used_memory || "0" }} GB</el-descriptions-item>
          <el-descriptions-item label="可用内存">{{ serverData.memory?.available_memory || "0" }} GB</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-card shadow="hover" class="mb-20 monitor-card">
      <template #header><div class="card-header"><span><i class="el-icon-disk"></i> 磁盘监控</span></div></template>
      <el-table :data="serverData.disk" style="width: 100%">
        <el-table-column prop="filesystem" label="文件系统" /><el-table-column prop="size" label="总大小" /><el-table-column prop="used" label="已用空间" /><el-table-column prop="available" label="可用空间" />
        <el-table-column prop="use_percentage" label="使用率"><template #default="{ row }"><el-progress :percentage="parseInt(row.use_percentage.replace('%', ''))" :stroke-width="12" :show-text="true" :color="customColors" /></template></el-table-column>
        <el-table-column prop="mounted_on" label="挂载点" />
      </el-table>
    </el-card>
    <el-card shadow="hover" class="monitor-card mb-20">
      <template #header><div class="card-header"><span><i class="el-icon-document"></i> PHP 配置</span></div></template>
      <el-descriptions :column="2" border class="php-config" v-if="serverData.php">
        <el-descriptions-item label="PHP版本">{{ serverData.php?.php_version }}</el-descriptions-item>
        <el-descriptions-item label="操作系统">{{ serverData.php?.os }}</el-descriptions-item>
        <el-descriptions-item label="项目路径"><div class="project-path">{{ serverData.php?.project_path }}</div></el-descriptions-item>
        <el-descriptions-item label="内存限制">{{ serverData.php?.memory_limit }}</el-descriptions-item>
        <el-descriptions-item label="最大执行时间">{{ serverData.php?.max_execution_time === "0" ? "无限制" : `${serverData.php?.max_execution_time}秒` }}</el-descriptions-item>
        <el-descriptions-item label="错误报告">{{ serverData.php?.error_reporting }}</el-descriptions-item>
        <el-descriptions-item label="显示错误">{{ serverData.php?.display_errors }}</el-descriptions-item>
        <el-descriptions-item label="上传限制">{{ serverData.php?.upload_max_filesize }}</el-descriptions-item>
        <el-descriptions-item label="POST大小">{{ serverData.php?.post_max_size }}</el-descriptions-item>
        <el-descriptions-item label="扩展目录">{{ serverData.php?.extension_dir }}</el-descriptions-item>
        <el-descriptions-item label="已加载扩展" :span="2"><div class="extensions-container"><el-tag v-for="ext in serverData.php?.loaded_extensions?.split(', ')" :key="ext" size="small" class="php-ext-tag">{{ ext }}</el-tag></div></el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ServerService } from "#/api/monitor"
import { ref, onMounted } from "vue"

const serverData = ref({ cpu: {}, memory: {}, disk: [], php: {} })
const customColors = [{ color: "#409EFF", percentage: 30 }, { color: "#67C23A", percentage: 70 }, { color: "#E6A23C", percentage: 100 }]

const loadServerData = async () => { try { serverData.value = await ServerService.list() } catch (e) { console.error("加载数据失败:", e) } }
onMounted(() => { loadServerData() })
</script>

<style lang="scss" scoped>
.performance-monitor { .monitor-card { margin-bottom: 20px; background: #f5f7fa; border-radius: 8px !important } .mb-20 { margin-bottom: 20px } .mb-10 { margin-bottom: 10px } .card-header { display: flex; align-items: center; font-size: 18px; font-weight: bold; i { margin-right: 8px; color: #409eff } } .metric-container { padding: 0 20px } .cpu-details,.memory-details { margin-top: 20px } .php-ext-tag { margin-right: 5px; margin-bottom: 5px } }
.php-config { :deep(.el-descriptions__label) { min-width: 120px !important } .project-path { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 500px } }
.extensions-container { display: flex; flex-wrap: wrap; gap: 6px; max-height: 120px; overflow-y: auto; padding: 8px; background: #f5f7fa; border-radius: 4px }
:deep(.dark) { .extensions-container { background: #232323 } }
</style>
