<template>
  <div class="environment-step">
    <!-- 系统环境 -->
    <div class="section">
      <div class="section-title"><el-icon color="#409eff"><Monitor /></el-icon> 系统环境要求</div>
      <div class="env-list" v-loading="loading">
        <div v-for="item in environmentCheckItems" :key="item.name" class="env-item" :class="item.status === 'success' ? 'ok' : item.status === 'warning' ? 'warn' : 'err'">
          <div class="ei-left">
            <div class="ei-dot" :class="item.status === 'success' ? 'dot-ok' : 'dot-err'"></div>
            <div class="ei-info">
              <span class="ei-name">{{ item.name }}</span>
              <span class="ei-detail">需要 {{ item.need }} · 当前 {{ item.current }}</span>
            </div>
          </div>
          <div class="ei-right">
            <span class="ei-status" :class="item.status === 'success' ? 'st-ok' : item.status === 'warning' ? 'st-warn' : 'st-err'">{{ item.statusText }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 目录权限 -->
    <div class="section">
      <div class="section-title"><el-icon color="#67c23a"><FolderOpened /></el-icon> 目录权限要求</div>
      <div class="dir-list" v-loading="loading">
        <div v-for="item in directoryCheckItems" :key="item.path" class="dir-item" :class="!item.status ? 'dir-err' : ''">
          <div class="di-left">
            <div class="di-icon"><el-icon :color="item.status ? '#67c23a' : '#f56c6c'"><Folder v-if="item.status" /><WarningFilled v-else /></el-icon></div>
            <div class="di-info">
              <span class="di-name">{{ item.pathName }}</span>
              <code class="di-path">{{ item.path }}</code>
            </div>
          </div>
          <div class="di-right">
            <span class="perm-tag" :class="'pt-'+item.permissionType">{{ { read_write: '读写', read_only: '只读', write_only: '只写' }[item.permissionType] || item.permissionType }}</span>
            <span class="di-status" :class="item.status ? 'st-ok' : 'st-err'">{{ item.status ? '正常' : '异常' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果 -->
    <div v-if="!loading" class="result-banner" :class="checkResult.type === 'success' ? 'rb-ok' : 'rb-err'">
      <el-icon :size="18"><CircleCheckFilled v-if="checkResult.type === 'success'" /><WarningFilled v-else /></el-icon>
      <div><strong>{{ checkResult.title }}</strong><p>{{ checkResult.description }}</p></div>
    </div>

    <!-- 按钮 -->
    <div class="step-actions">
      <button class="btn btn-ghost" @click="$emit('prev')"><el-icon><ArrowLeft /></el-icon> 上一步</button>
      <div>
        <button class="btn btn-ghost" @click="recheckEnvironment" :disabled="loading"><el-icon><Refresh /></el-icon> 重新检测</button>
        <button class="btn btn-primary" :disabled="!environmentPassed || !directoryPassed" @click="handleNext">下一步 <el-icon><ArrowRight /></el-icon></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from "vue";
import { ArrowLeft, ArrowRight, Refresh, Monitor, FolderOpened, Folder, WarningFilled, CircleCheckFilled } from "@element-plus/icons-vue";
import { useInstallStore } from "@/store/module/install";

const installStore = useInstallStore();
const loading = computed(() => installStore.environmentData.loading);
const environmentCheckItems = computed(() => installStore.environmentCheckItems);
const directoryCheckItems = computed(() => installStore.directoryCheckItems);
const environmentPassed = computed(() => installStore.environmentPassed);
const directoryPassed = computed(() => directoryCheckItems.value.length === 0 ? false : !directoryCheckItems.value.some((i: any) => i.required && !i.status));

const checkResult = reactive({
  title: computed(() => {
    if (loading.value) return "检测中...";
    const e = environmentPassed.value, d = directoryPassed.value;
    if (e && d) return "环境检测通过";
    return !e && !d ? "环境检测未通过" : !e ? "系统环境未通过" : "目录权限未通过";
  }),
  type: computed(() => (environmentPassed.value && directoryPassed.value) ? "success" : "error") as any,
  description: computed(() => {
    if (loading.value) return "正在检测...";
    if (environmentPassed.value && directoryPassed.value) return "所有环境要求已满足，可以继续安装";
    const ee = environmentCheckItems.value.filter((i: any) => i.isRequired && !i.status);
    const de = directoryCheckItems.value.filter((i: any) => i.required && !i.status);
    const m: string[] = [];
    if (ee.length) m.push(`${ee.length} 个环境要求`);
    if (de.length) m.push(`${de.length} 个目录权限`);
    return `有 ${m.join(' 和 ')} 未达标，请解决后重试`;
  }),
});

onMounted(() => installStore.checkEnvironment());
const recheckEnvironment = () => installStore.checkEnvironment();
const handleNext = () => { if (environmentPassed.value && directoryPassed.value) emit("next"); };
const emit = defineEmits<{ prev: []; next: [] }>();
</script>

<style lang="scss" scoped>
.environment-step { display: flex; flex-direction: column; gap: 18px; }

.section-title { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; }

.env-list { display: flex; flex-direction: column; gap: 6px; }
.env-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; border-radius: 8px; background: var(--btn-ghost-bg); transition: background .2s;
  &:hover { background: var(--btn-ghost-hover); }
  &.ok { border-left: 3px solid #34d399; }
  &.warn { border-left: 3px solid #f59e0b; }
  &.err { border-left: 3px solid #ef4444; background: rgba(239,68,68,.05); }
}
.ei-left { display: flex; align-items: center; gap: 10px; }
.ei-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; &.dot-ok { background: #34d399; } &.dot-err { background: #ef4444; } }
.ei-info { .ei-name { display: block; font-size: 13px; font-weight: 500; color: var(--text-primary); } .ei-detail { font-size: 11px; color: var(--text-tertiary); } }
.ei-status { font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: 10px; }
.st-ok { background: rgba(52,211,153,.12); color: var(--success-color); }
.st-warn { background: rgba(245,158,11,.12); color: #f59e0b; }
.st-err { background: rgba(239,68,68,.12); color: var(--danger-color); }

.dir-list { display: flex; flex-direction: column; gap: 4px; }
.dir-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; border-radius: 8px; background: var(--btn-ghost-bg);
  &.dir-err { background: rgba(239,68,68,.04); }
}
.di-left { display: flex; align-items: center; gap: 10px; }
.di-icon { width: 30px; height: 30px; background: var(--btn-ghost-bg); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.di-info { .di-name { display: block; font-size: 13px; font-weight: 500; color: var(--text-primary); } .di-path { display: block; font-size: 11px; color: var(--text-tertiary); font-family: 'Courier New', monospace; margin-top: 1px; } }
.di-right { display: flex; align-items: center; gap: 8px; }
.perm-tag { font-size: 11px; padding: 1px 8px; border-radius: 6px; font-weight: 500; }
.pt-read_write { background: rgba(52,211,153,.12); color: var(--success-color); }
.pt-read_only { background: rgba(245,158,11,.12); color: #f59e0b; }
.pt-write_only { background: rgba(129,140,248,.12); color: #818cf8; }
.di-status { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 6px; }

.result-banner { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-radius: 8px; font-size: 13px;
  &.rb-ok { background: rgba(16,185,129,.08); } &.rb-err { background: rgba(239,68,68,.08); }
  strong { display: block; color: var(--text-primary); margin-bottom: 2px; } p { color: var(--text-tertiary); margin: 0; font-size: 12px; }
}

.step-actions { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; }

.btn {
  height: 36px; padding: 0 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; border: none; transition: all .2s;
  .el-icon { font-size: 14px; }
}
.btn-ghost { background: var(--btn-ghost-bg); color: var(--btn-ghost-color); &:hover { background: var(--btn-ghost-hover); color: var(--btn-ghost-hover-color); } &:disabled { opacity: .4; cursor: not-allowed; } }
.btn-primary {
  background: linear-gradient(135deg,#409eff,#6366f1); color: #fff; margin-left: 8px; box-shadow: 0 3px 12px rgba(64,158,255,.25);
  &:hover:not(:disabled) { box-shadow: 0 5px 18px rgba(64,158,255,.35); }
  &:disabled { opacity: .4; cursor: not-allowed; }
}
</style>
