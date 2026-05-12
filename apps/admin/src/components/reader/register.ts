import { globalShareState } from '@vben/common-ui'

import { getAllComponents } from './component-map'

/**
 * 自动扫描组件时需要排除的组件列表
 * 这些组件不适合注册到表单系统（如内部专用组件、特殊组件等）
 */
const excludeComponents: string[] = [
  // 示例：如果有内部组件需要排除，可以添加到这里
  // 'InternalComponent',
]

/**
 * 额外需要注册到表单系统的组件（不在自动扫描范围内的）
 * 用于手动补充注册
 */
const additionalComponents: Record<string, any> = {
  // 示例：手动注册额外组件
  // 'CustomComponent': customComp,
}

/**
 * 获取所有可注册到表单系统的组件
 * 自动扫描 + 排除列表 + 额外注册
 */
function getFormCompatibleComponents() {
  const readerComponents = getAllComponents()
  const formComponents: Record<string, any> = {}

  // 自动扫描：遍历所有组件，排除不需要的
  readerComponents.forEach((comp, name) => {
    if (!excludeComponents.includes(name)) {
      formComponents[name] = comp
    }
  })

  // 手动添加额外组件
  Object.assign(formComponents, additionalComponents)

  return formComponents
}

/**
 * 将阅读组件注册到表单系统
 */
export function registerReaderComponentsToForm() {
  const formComponents = getFormCompatibleComponents()
  const existingComponents = globalShareState.getComponents() || {}
  
  globalShareState.setComponents({
    ...existingComponents,
    ...formComponents,
  })
}

/**
 * 动态排除组件（运行时）
 * @param componentNames 要排除的组件名称列表
 */
export function excludeFromForm(componentNames: string[]) {
  excludeComponents.push(...componentNames)
}

/**
 * 动态添加额外组件（运行时）
 * @param components 要添加的组件对象 { name: component }
 */
export function addToForm(components: Record<string, any>) {
  Object.assign(additionalComponents, components)
}

/**
 * 重新注册所有组件
 * 适用于运行时修改排除/添加列表后重新注册
 */
export function reRegisterReaderComponentsToForm() {
  registerReaderComponentsToForm()
}
