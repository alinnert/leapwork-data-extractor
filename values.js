export const $id = (id) => document.getElementById(id)
export const $class = (className) => Array.from(document.getElementsByClassName(className))

export const inputEl = $id('input')
export const outputEl = $id('output')
export const dataInfoEl = $id('data-info')

export const resultLineRegex =
  /Timestamp: (\d\d)\.(\d\d)\.(\d\d\d\d) (\d\d:\d\d:\d\d).*Flow: ([^,]+)/
