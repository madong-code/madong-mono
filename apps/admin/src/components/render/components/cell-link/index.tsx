/**
 * 单元格链接渲染器
 */
import { ElButton } from 'element-plus'

export const CellLinkRenderer = {
  renderTableDefault(renderOpts: any) {
    const { props } = renderOpts
    return (
      <ElButton size="small" link>
        {props?.text}
      </ElButton>
    )
  },
}
