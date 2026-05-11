import type { Component } from 'vue'

import { globalShareState } from '@vben/common-ui'

import ApiDict from './components/api-dict.vue'
import Avatar from './components/avatar.vue'
import Editor from './components/editor.vue'

export function registerCustomFormComponents() {
  const customComponents: Record<string, Component> = {
    ApiDict,
    Avatar,
    Editor,
  }

  const existingComponents = globalShareState.getComponents() || {}
  globalShareState.setComponents({
    ...existingComponents,
    ...customComponents,
  })
}
