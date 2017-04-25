import mobxFormatters from './formatters'

// optional global check
if (typeof mobx !== 'undefined') {
  mobx.installDevTools = install.bind(null, mobx)
}

let installed = false

export default function install(mobx) {
  if (typeof window === 'undefined') {
    throw new Error('Can only install mobx-devtools in a browser environment.')
  }

  // Don't install more than once.
  if (installed === true) {
    return
  }

  window.devtoolsFormatters = window.devtoolsFormatters || []

  const { ArrayFormatter, ObjectFormatter } = mobxFormatters(mobx)

  window.devtoolsFormatters.push(ArrayFormatter, ObjectFormatter)

  installed = true
}
