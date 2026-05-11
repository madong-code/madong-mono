import type { Component } from 'vue'

import { h, markRaw } from 'vue'

const componentMap = new Map<string, Component>()
const componentObj = import.meta.glob('./components/**/**.vue', { eager: true })

function toPascalCase(str: string): string {
  const match = str.match(/\/([^/]+)\.vue$/)
  if (!match?.[1]) return ''
  const fileName = match[1]
  return fileName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
}

Object.keys(componentObj).forEach((key) => {
  const componentName = toPascalCase(key)
  const comm: any = componentObj[key]
  if (comm) {
    addComponent(componentName, markRaw(comm.default as Component))
  }
})

export function getComponent(name: string) {
  return componentMap.get(name)
}

export function addComponent(name: string, component: Component) {
  componentMap.set(name, component)
}

export function removeComponent(name: string) {
  componentMap.delete(name)
}

export function hasComponent(name: string) {
  return componentMap.has(name)
}

export function getAllComponents() {
  return componentMap
}

export function registerViewComponentToVxe(vxeUI: any) {
  componentMap.forEach((comp, key) => {
    vxeUI.renderer.add(key, {
      renderDefault(renderOpts: any, params: any) {
        const { row, column } = params
        const value = row[column.field]
        return h(comp, {
          ...renderOpts.props,
          value,
        })
      },
    })
  })
}
