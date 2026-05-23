/**
 * 组件映射表
 * 自动扫描 components 目录下的所有渲染器
 */

// 自动扫描所有渲染器模块
const modules = import.meta.glob('./**/index.tsx', { eager: true })

const rendererMap: Record<string, any> = {}
for (const path in modules) {
  // 从路径提取组件名：./cell-image/index.tsx -> CellImage
  const match = path.match(/\.\/([^/]+)\/index\.tsx$/)
  if (!match?.[1]) continue

  const dirName = match[1]
  const name = dirName
    .split('-')
    .map((part, i) => (i === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('')
  const mod = modules[path] as Record<string, unknown>
  console.log(`[ComponentMap] 扫描 ${path}:`, { name, keys: Object.keys(mod) })
  const renderer = mod[`${name}Renderer`]
  console.log(`[ComponentMap] ${name}Renderer:`, renderer)
  if (renderer) {
    rendererMap[name] = renderer
  }
}

export const cellRenderers = rendererMap
export default cellRenderers

console.log('[ComponentMap] 扫描到的模块:', modules)
console.log('[ComponentMap] 注册的渲染器:', rendererMap)
