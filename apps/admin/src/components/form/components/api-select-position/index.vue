<script setup lang="ts">
import type { PostRow } from '#/api/system/post/types';

import { computed, ref, useSlots, watch } from 'vue';

import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElSelectV2,
} from 'element-plus';

import { PostService } from '#/api/system/post';
import { Dialog } from '#/components/dialog';
import { $t } from '#/locales';

import PositionSelectModal from './position-select-dialog.vue';

interface Option {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    buttonText?: string;
    clearable?: boolean;
    deptIds?: string[];
    dialogWidth?: string;
    disabled?: boolean;
    modalTitle?: string;
    modelValue?: null | string | string[];
    multiple?: boolean;
    placeholder?: string;
    rowKey?: string;
    showButton?: boolean;
  }>(),
  {
    modelValue: null,
    multiple: true,
    clearable: true,
    disabled: false,
    showButton: true,
    dialogWidth: '600px',
    rowKey: 'id',
    deptIds: () => [],
    buttonText: '',
    modalTitle: '',
    placeholder: '',
  },
);

const emit = defineEmits<{
  change: [value: null | string | string[]];
  'update:modelValue': [value: null | string | string[]];
}>();

const slots = useSlots();
const dialogRef = ref();
const modalRef = ref();
const options = ref<Option[]>([]);
const tempValue = ref<string[]>([]);
const hasDeptIdsEver = ref(false);

const effectivePlaceholder = computed(
  () => props.placeholder || $t('components.form.select_position.placeholder'),
);
const effectiveButtonText = computed(
  () => props.buttonText || $t('components.form.select_position.modal_button'),
);
const effectiveModalTitle = computed(
  () => props.modalTitle || $t('components.form.select_position.modal_title'),
);

const selectValue = computed({
  get() {
    const v = props.modelValue;
    if (props.multiple)
      return Array.isArray(v) ? v.map(String) : (v ? String(v).split(',') : []);
    return v ? String(v) : '';
  },
  set(val: any) {
    const result = props.multiple ? (Array.isArray(val) ? val : []) : val;
    emit('update:modelValue', result);
    emit('change', result);
  },
});

function initValue() {
  const v = props.modelValue;
  if (v) {
    const values = Array.isArray(v) ? v.map(String) : String(v).split(',');
    tempValue.value = values;
    loadPositionNames(values);
  } else {
    tempValue.value = [];
    options.value = [];
  }
}

async function loadPositionNames(values: string[]) {
  if (!values?.length) {
    options.value = [];
    return;
  }
  try {
    const response: any = await PostService.list();
    let positions = Array.isArray(response)
      ? response
      : response?.items || response?.list || [];
    if (props.deptIds?.length) {
      const deptIdSet = new Set(props.deptIds.map(String));
      positions = positions.filter((p: PostRow) =>
        deptIdSet.has(String(p.dept_id)),
      );
    }
    const positionMap = new Map<string, string>();
    positions.forEach((p: PostRow) =>
      positionMap.set(String(p[props.rowKey as keyof PostRow]), p.name),
    );
    options.value = values
      .filter((v) => positionMap.has(v))
      .map((v) => ({ label: positionMap.get(v) || v, value: v }));
  } catch {
    options.value = values.map((v) => ({ label: v, value: v }));
  }
}

function handleConfirm() {
  const selected = modalRef.value?.getSelected() || [];
  const values = selected.map((item: any) => String(item[props.rowKey]));
  const opts = selected.map((item: any) => ({
    label: item.name,
    value: String(item[props.rowKey]),
  }));
  options.value = opts;
  const result = props.multiple ? values : values[0] || null;
  emit('update:modelValue', result);
  emit('change', result);
  dialogRef.value?.close();
}

function handleTreeCommand(command: string) {
  switch (command) {
    case 'collapse': {
      modalRef.value?.handleCollapseAll();
      break;
    }
    case 'expand': {
      modalRef.value?.handleExpandAll();
      break;
    }
    case 'selectAll': {
      modalRef.value?.handleSelectAll();
      break;
    }
  }
}

function handleSelect(selected: any[]) {
  tempValue.value = selected.map((item: any) => String(item[props.rowKey]));
}

function handleChange(value: any) {
  emit('update:modelValue', value);
  emit('change', value);
}

watch(() => props.modelValue, initValue, { immediate: true });

watch(
  () => props.deptIds,
  async (newDeptIds) => {
    if (newDeptIds?.length) hasDeptIdsEver.value = true;
    // 部门被移除 → 清空
    if ((!newDeptIds || newDeptIds.length === 0) && hasDeptIdsEver.value) {
      options.value = [];
      tempValue.value = [];
      if (props.modelValue) {
        const result = props.multiple ? [] : null;
        emit('update:modelValue', result);
        emit('change', result);
      }
      return;
    }
    // 重新加载过滤
    if (props.modelValue) {
      const values = Array.isArray(props.modelValue)
        ? props.modelValue.map(String)
        : String(props.modelValue).split(',');
      await loadPositionNames(values);
      if (newDeptIds?.length) {
        const validValues = new Set(options.value.map((o) => o.value));
        const filtered = values.filter((v) => validValues.has(v));
        if (filtered.length !== values.length) {
          const result = props.multiple ? filtered : filtered[0] || null;
          emit('update:modelValue', result);
          emit('change', result);
        }
      }
    }
  },
  { deep: true },
);

defineExpose({ getValue: () => selectValue.value });
</script>

<template>
  <div class="select-position">
    <ElSelectV2
      v-model="selectValue"
      :options="options"
      :placeholder="effectivePlaceholder"
      :multiple="multiple"
      :clearable="clearable"
      :disabled="disabled"
      @change="handleChange"
      style="width: 100%"
    >
      <template v-for="(_, slotName) in slots" #[slotName]>
        <slot :name="slotName"></slot>
      </template>
    </ElSelectV2>
    <ElButton
      v-if="showButton"
      type="primary"
      :disabled="disabled"
      @click="dialogRef?.open()"
      style="margin-left: 8px"
    >
      {{ effectiveButtonText }}
    </ElButton>
    <Dialog
      ref="dialogRef"
      :title="effectiveModalTitle"
      :width="dialogWidth"
      custom-class="m-dialog-footer-between"
      @confirm="handleConfirm"
    >
      <PositionSelectModal
        ref="modalRef"
        :multiple="multiple"
        :value="tempValue"
        :dept-ids="deptIds"
        @select="handleSelect"
      />
      <template #prepend-footer>
        <ElDropdown @command="handleTreeCommand">
          <ElButton size="default">
            {{ $t('components.form.select_position.tree_operation') }}
            <ElIcon class="el-icon--right">
              <Icon icon="ri:arrow-down-s-line" />
            </ElIcon>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem command="expand">
                {{ $t('components.form.select_position.expand_all') }}
              </ElDropdownItem>
              <ElDropdownItem command="collapse">
                {{ $t('components.form.select_position.collapse_all') }}
              </ElDropdownItem>
              <ElDropdownItem
                v-if="multiple"
                command="selectAll"
                :divided="true"
              >
                {{
                  modalRef?.allSelected
                    ? $t('components.form.select_position.cancel_select_all')
                    : $t('components.form.select_position.select_all')
                }}
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </template>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.select-position {
  display: flex;
  align-items: center;
  width: 100%;
}
</style>
