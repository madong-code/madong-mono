/**
 * 单元格 JSON 渲染器 - 纯 TSX 实现
 * 单元格内以单行紧凑 JSON 展示（等宽字体 + 轻微底色），
 * 悬浮时以 Tooltip 展示格式化后的完整 JSON。
 */
import { ElTooltip } from 'element-plus';

/**
 * 将任意值规整为可展示的对象
 * - 对象/数组：直接使用
 * - JSON 字符串：尝试解析
 * - 其他：返回 null
 */
function normalize(value: any): any[] | null | Record<string, any> {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

const inlineStyle =
  'display:inline-block;max-width:220px;' +
  'font-family:var(--el-font-family-mono,monospace);font-size:12px;' +
  'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;';

export const CellJsonRenderer = {
  renderTableDefault(
    _renderOpts: {
      attrs?: { max?: number };
    },
    params: { column: { field: string }; row: Record<string, any> },
  ) {
    const { column, row } = params;
    const data = normalize(row[column.field]);

    if (!data) {
      return <span class="text-muted-foreground">-</span>;
    }

    const pretty = JSON.stringify(data, null, 2);
    const compact = JSON.stringify(data);

    return (
      <ElTooltip effect="dark" placement="top">
        {{
          content: () => (
            <pre style="margin:0;max-width:360px;white-space:pre-wrap;word-break:break-all;font-size:12px;line-height:1.5;">
              {pretty}
            </pre>
          ),
          default: () => <code style={inlineStyle}>{compact}</code>,
        }}
      </ElTooltip>
    );
  },
};
