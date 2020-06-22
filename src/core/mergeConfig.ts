import { RequestConfig } from '../type'
import { deepMerge, isPlainObject } from '../helpers/utils'

const onlyCustomFeats = ['url', 'params', 'data']
const deepMergedFeats = ['headers', 'auth']
const strategies = formStrategies()

function mergeConfig(defaultConfig: RequestConfig, customConfig?: RequestConfig) {
  if (!customConfig) {
    return defaultConfig
  }

  let mergedConfig = Object.create(null)

  Object.keys(customConfig).forEach(key => {
    mergedConfig[key] = merge(key)
  })

  Object.keys(defaultConfig).forEach(key => {
    if (!customConfig[key]) {
      mergedConfig[key] = merge(key)
    }
  })

  function merge(key: string): any {
    const defaultVal = defaultConfig[key]
    const customVal = customConfig![key]
    const strategy = strategies[key] || defaultStrategy
    return strategy(defaultVal, customVal)
  }

  return mergedConfig
}

function onlyCustomStrategy(defaults: any, custom?: any) {
  if (custom) {
    return custom
  }
}

function defaultStrategy(defaults: any, custom?: any) {
  if (custom) {
    return custom
  } else {
    return defaults
  }
}

function deepMergeStrategy(defaults: any, custom?: any) {
  if (isPlainObject(custom)) {
    return deepMerge(defaults, custom)
  } else if (typeof custom !== 'undefined') {
    return custom
  } else if (typeof defaults !== 'undefined') {
    return defaults
  }
}

function formStrategies(): any {
  const strategies = Object.create(null)
  onlyCustomFeats.forEach(item => {
    strategies[item] = onlyCustomStrategy
  })
  deepMergedFeats.forEach(item => {
    strategies[item] = deepMergeStrategy
  })
  return strategies
}

export default mergeConfig
