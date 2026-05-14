/**
 * 单元格字典标签渲染器
 * 根据 dict code 自动加载字典数据，以 Tag 形式展示
 */
import { defineComponent, ref, onMounted, watch } from 'vue'
import { ElTag } from 'element-plus'
import { useDictStore } from '#/store/modules/dict'

const DictTagInner = defineComponent({
  props: {
    code: { type: String, required: true },
    value: { type: [String, Number], default: '' },
  },
  setup(props) {
    const dictStore = useDictStore()
    const options = ref<{ label: string; value: string | number; bgColor?: string; textColor?: string }[]>([])
    const loading = ref(true)

    const loadDict = async () => {
      loading.value = true
      try {
        options.value = await dictStore.getDictByType(props.code)
      } finally {
        loading.value = false
      }
    }

    onMounted(loadDict)
    watch(() => props.code, loadDict)

    const currentItem = () => options.value.find((item) => item.value === props.value)
    const label = () => currentItem()?.label ?? String(props.value ?? '')
    const bgColor = () => currentItem()?.bgColor
    const textColor = () => currentItem()?.textColor

    return () => {
      if (loading.value) return <span>{String(props.value ?? '')}</span>
      return (
        <ElTag
          style={bgColor() ? { backgroundColor: bgColor(), color: textColor(), border: 'none' } : undefined}
        >
          {label()}
        </ElTag>
      )
    }
  },
})

export const CellDictTagRenderer = {
  renderTableDefault(renderOpts: { attrs?: { code: string } }, params: { column: { field: string }; row: Record<string, any> }) {
    const { column, row } = params
    const code = renderOpts?.attrs?.code
    if (!code) return <span>{row[column.field] ?? ''}</span>
    return (
      <DictTagInner code={code} value={row[column.field]} />
    )
  },
}
