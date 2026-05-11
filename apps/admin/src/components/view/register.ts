import { globalShareState } from '@vben/common-ui'

import { getAllComponents } from './component-map'

export function registerViewComponentsToForm() {
  const viewComponents = getAllComponents()
  const formComponents: Record<string, any> = {}

  const formCompatible = [
    'ApiDict',
    'ApiSelect',
    'ApiTreeSelect',
    'ApiRadioGroup',
    'ApiCheckboxGroup',
    'ApiCascader',
  ]

  formCompatible.forEach((name) => {
    const comp = viewComponents.get(name)
    if (comp) {
      formComponents[name] = comp
    }
  })

  const existingComponents = globalShareState.getComponents() || {}
  globalShareState.setComponents({
    ...existingComponents,
    ...formComponents,
  })
}
