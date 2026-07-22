<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import {
  ElButton,
  ElDialog,
  ElInput,
  ElMessage,
  ElOption,
  ElPagination,
  ElSelect,
} from 'element-plus';

import { requestClient } from '#/api/request';
import { Icon } from '#/components/icon';

defineOptions({
  name: 'ResourceManager',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    accept?: string;
    disabled?: boolean;
    modelValue?: string | string[];
    multiple?: boolean;
    objectType?: string;
  }>(),
  {
    modelValue: '',
    multiple: false,
    accept: 'image/*',
    disabled: false,
    objectType: 'default',
  },
);

const emit = defineEmits(['update:modelValue', 'change']);

const dialogVisible = ref(false);
const loading = ref(false);
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(14);
const total = ref(0);
const selectedFiles = ref<string[]>([]);
const fileList = ref<any[]>([]);
const categories = ref<any[]>([]);
const selectedCategory = ref('');

const init = () => {
  if (props.modelValue) {
    if (Array.isArray(props.modelValue)) {
      selectedFiles.value = [...props.modelValue];
    } else {
      selectedFiles.value = props.modelValue ? [props.modelValue] : [];
    }
  }
  fetchCategories();
  fetchFiles();
};

const fetchCategories = async () => {
  try {
    const res = await requestClient.get('/file/categories');
    categories.value = res || [];
  } catch (error) {
    console.error('获取分类失败:', error);
  }
};

const fetchFiles = async () => {
  try {
    loading.value = true;
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      objectType: props.objectType,
    };
    if (selectedCategory.value) params.categoryId = selectedCategory.value;
    const res = await requestClient.get('/file/list', { params });
    fileList.value = res?.list || res?.items || [];
    total.value = res?.total || 0;
  } catch (error) {
    console.error('获取文件列表失败:', error);
    ElMessage.error('获取文件列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchFiles();
};

const handlePaginationChange = () => {
  fetchFiles();
};

const toggleFileSelection = (fileId: string) => {
  if (props.multiple) {
    const index = selectedFiles.value.indexOf(fileId);
    if (index === -1) {
      selectedFiles.value.push(fileId);
    } else {
      selectedFiles.value.splice(index, 1);
    }
  } else {
    selectedFiles.value = [fileId];
  }
};

const openResourceManager = () => {
  if (props.disabled) return;
  init();
  dialogVisible.value = true;
};

const confirmSelection = () => {
  if (selectedFiles.value.length === 0) {
    ElMessage.warning('请选择至少一个文件');
    return;
  }
  const value = props.multiple ? selectedFiles.value : selectedFiles.value[0];
  emit('update:modelValue', value);
  emit('change', value);
  dialogVisible.value = false;
};

const cancelSelection = () => {
  dialogVisible.value = false;
};

const displayValue = computed(() => {
  if (!props.modelValue) return '请选择';
  if (Array.isArray(props.modelValue)) {
    return `${props.modelValue.length} 个文件`;
  }
  return props.modelValue;
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (Array.isArray(val)) {
        selectedFiles.value = [...val];
      } else {
        selectedFiles.value = val ? [val] : [];
      }
    } else {
      selectedFiles.value = [];
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="resource-manager">
    <ElButton type="primary" @click="openResourceManager" :disabled="disabled">
      <Icon icon="lucide:image" />
      选择图片
    </ElButton>

    <div v-if="modelValue" class="selected-info">
      <span>{{ displayValue }}</span>
      <ElButton
        link
        type="danger"
        size="small"
        @click="
          emit('update:modelValue', props.multiple ? [] : '');
          emit('change', props.multiple ? [] : '');
        "
      >
        <Icon icon="lucide:trash-2" />
        清除
      </ElButton>
    </div>

    <ElDialog
      v-model="dialogVisible"
      title="选择图片"
      width="800px"
      destroy-on-close
    >
      <div class="dialog-header">
        <div class="search-area">
          <ElSelect
            v-model="selectedCategory"
            placeholder="请选择"
            style="width: 150px; margin-right: 10px"
            @change="handleSearch"
          >
            <ElOption label="全部" value="" />
            <ElOption
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </ElSelect>
          <ElInput
            v-model="searchKeyword"
            placeholder="搜索图片名称"
            style="width: 300px; margin-right: 10px"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <Icon icon="lucide:search" />
            </template>
          </ElInput>
          <ElButton type="primary" @click="handleSearch">
            <Icon icon="lucide:search" />
            搜索
          </ElButton>
        </div>
      </div>

      <div class="file-list" v-loading="loading">
        <div
          v-for="file in fileList"
          :key="file.id"
          class="file-item"
          :class="{ selected: selectedFiles.includes(file.id) }"
          @click="toggleFileSelection(file.id)"
        >
          <div class="file-preview">
            <img :src="file.base_path || file.url" :alt="file.name" />
          </div>
          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-size">
              {{ file.file_size ? (file.file_size / 1024).toFixed(2) : '' }} KB
            </div>
          </div>
        </div>
        <div v-if="fileList.length === 0 && !loading" class="empty-state">
          <Icon icon="lucide:image-off" :size="48" />
          <p>暂无图片</p>
        </div>
      </div>

      <div class="dialog-footer">
        <div class="pagination">
          <span>共 {{ total }} 条</span>
          <ElPagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 14, 20, 50]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handlePaginationChange"
            @current-change="handlePaginationChange"
          />
        </div>
        <div class="actions">
          <ElButton @click="cancelSelection">取消</ElButton>
          <ElButton type="primary" @click="confirmSelection">确定</ElButton>
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<style scoped>
.resource-manager {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-info {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 12px;
  font-size: 14px;
  color: #303133;
  background: #f5f7fa;
  border-radius: 4px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-area {
  display: flex;
  align-items: center;
}

.file-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  max-height: 400px;
  margin-bottom: 20px;
  overflow-y: auto;
}

.file-item {
  padding: 8px;
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.3s;
}

.file-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.file-item.selected {
  background-color: rgb(64 158 255 / 10%);
  border-color: #409eff;
}

.file-preview {
  width: 100%;
  height: 80px;
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 4px;
}

.file-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-info {
  font-size: 12px;
  color: #606266;
}

.file-info .file-name {
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-info .file-size {
  color: #909399;
}

.empty-state {
  display: flex;
  flex-direction: column;
  grid-column: 1 / -1;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #909399;
}

.empty-state p {
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #ebeef5;
}

.pagination {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pagination span {
  font-size: 14px;
  color: #606266;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
