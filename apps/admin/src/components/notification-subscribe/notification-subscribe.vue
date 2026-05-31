<script lang="ts" setup>
import type {
  NotificationCategory,
} from '#/api/notification/types';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import {
  NotificationCategoryApi,
  NotificationSubscribeApi,
} from '#/api/notification';

const loading = ref(false);
const saving = ref(false);

// 分类列表（带模块）
const categoryList = ref<NotificationCategory[]>([]);

// 订阅设置（按分类分组）
const subscribeSettings = ref<
  Record<
    string,
    { category_subscribed: boolean; modules: Record<string, boolean> }
  >
>({});

// 加载数据
async function loadData() {
  loading.value = true;
  try {
    // 加载分类
    const categories = await NotificationCategoryApi.getAll();
    categoryList.value = Array.isArray(categories) ? categories : [];

    // 加载我的订阅设置
    const subscribeData = await NotificationSubscribeApi.getMine();

    // 初始化订阅设置
    const settings: Record<
      string,
      { category_subscribed: boolean; modules: Record<string, boolean> }
    > = {};

    for (const cat of categoryList.value) {
      const catData = subscribeData.find(
        (item: any) => item.category_key === cat.key,
      );
      settings[cat.key] = {
        category_subscribed: catData?.is_subscribed ?? true,
        modules: {},
      };

      // 初始化模块订阅状态
      if (cat.modules) {
        for (const mod of cat.modules) {
          const modData = catData?.modules?.find(
            (m: any) => m.module_key === mod.key,
          );
          settings[cat.key].modules[mod.key] = modData?.is_subscribed ?? true;
        }
      }
    }

    subscribeSettings.value = settings;
  } catch (error) {
    console.error('加载订阅设置失败', error);
    ElMessage.error('加载订阅设置失败');
  } finally {
    loading.value = false;
  }
}

// 切换分类订阅
function toggleCategory(categoryKey: string) {
  const setting = subscribeSettings.value[categoryKey];
  if (setting) {
    setting.category_subscribed = !setting.category_subscribed;
  }
}

// 切换模块订阅
function toggleModule(categoryKey: string, moduleKey: string) {
  const setting = subscribeSettings.value[categoryKey];
  if (setting && setting.modules[moduleKey] !== undefined) {
    setting.modules[moduleKey] = !setting.modules[moduleKey];
  }
}

// 全选分类下的所有模块
function selectAllModules(categoryKey: string) {
  const setting = subscribeSettings.value[categoryKey];
  if (setting) {
    for (const key in setting.modules) {
      setting.modules[key] = true;
    }
  }
}

// 取消全选分类下的所有模块
function deselectAllModules(categoryKey: string) {
  const setting = subscribeSettings.value[categoryKey];
  if (setting) {
    for (const key in setting.modules) {
      setting.modules[key] = false;
    }
  }
}

// 保存设置
async function saveSettings() {
  saving.value = true;
  try {
    const settings: Array<{
      category_key: string;
      is_subscribed: boolean;
      module_key?: string;
    }> = [];

    for (const catKey in subscribeSettings.value) {
      const setting = subscribeSettings.value[catKey];

      // 添加分类订阅设置
      settings.push({
        category_key: catKey,
        is_subscribed: setting.category_subscribed,
      });

      // 添加模块订阅设置
      for (const modKey in setting.modules) {
        settings.push({
          category_key: catKey,
          module_key: modKey,
          is_subscribed: setting.modules[modKey],
        });
      }
    }

    await NotificationSubscribeApi.batchSet(settings);
    ElMessage.success('订阅设置已保存');
    modalApi.close();
  } catch (error) {
    console.error('保存订阅设置失败', error);
    ElMessage.error('保存订阅设置失败');
  } finally {
    saving.value = false;
  }
}

// Modal API
const [Modal, modalApi] = useVbenModal({
  title: '消息订阅设置',
  width: '600px',
  onConfirm: saveSettings,
  onOpen: loadData,
});

defineExpose({
  open: () => modalApi.open(),
});
</script>

<template>
  <Modal>
    <div class="p-4">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="text-muted-foreground">加载中...</div>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="cat in categoryList"
          :key="cat.key"
          class="rounded-lg border border-border p-4"
        >
          <!-- 分类标题 -->
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                class="size-4 cursor-pointer rounded border-border text-primary focus:ring-primary"
                :checked="
                  subscribeSettings[cat.key]?.category_subscribed ?? true
                "
                @change="toggleCategory(cat.key)"
              />
              <span class="font-medium">{{ cat.name }}</span>
            </div>

            <div
              v-if="cat.modules && cat.modules.length > 0"
              class="flex gap-2"
            >
              <button
                class="text-xs text-blue-500 hover:text-blue-600"
                @click="selectAllModules(cat.key)"
              >
                全选
              </button>
              <button
                class="text-xs text-muted-foreground hover:text-foreground"
                @click="deselectAllModules(cat.key)"
              >
                取消全选
              </button>
            </div>
          </div>

          <!-- 模块列表 -->
          <div
            v-if="cat.modules && cat.modules.length > 0"
            class="ml-6 space-y-2"
          >
            <div
              v-for="mod in cat.modules"
              :key="mod.key"
              class="flex items-center gap-2"
            >
              <input
                type="checkbox"
                class="size-3.5 cursor-pointer rounded border-border text-primary focus:ring-primary"
                :checked="subscribeSettings[cat.key]?.modules[mod.key] ?? true"
                :disabled="!subscribeSettings[cat.key]?.category_subscribed"
                @change="toggleModule(cat.key, mod.key)"
              />
              <span
                class="text-sm"
                :class="
                  subscribeSettings[cat.key]?.category_subscribed
                    ? 'text-foreground'
                    : 'text-muted-foreground line-through'
                "
              >
                {{ mod.name }}
              </span>
              <span
                v-if="mod.description"
                class="text-xs text-muted-foreground"
              >
                ({{ mod.description }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped></style>
