const listStyle = {
  style: 'list-style-type: none; padding: 0; margin: 0 0 0 12px; font-style: normal',
}
const mobxNameStyle = { style: 'color: rgb(232,98,0)' }
const nullStyle = { style: 'color: #777' }

export default function createFormatter(mobx) {
  const reference = (object, config) => {
    if (typeof object === 'undefined') {
      return ['span', nullStyle, 'undefined']
    } else if (object === 'null') {
      return ['span', nullStyle, 'null']
    }

    return ['object', { object, config }]
  }

  const renderIterableHeader = (iterable, name = 'Iterable') => [
    'span',
    ['span', mobxNameStyle, name],
    ['span', `[${iterable.length}]`],
  ]

  const hasBody = (collection, config) =>
    collection.length > 0 && !(config && config.noPreview)

  const renderIterableBody = (collection, mapper, options = {}) => {
    const children = Object.entries(mobx.toJS(collection)).map(mapper)
    return ['ol', listStyle, ...children]
  }

  const ObjectFormatter = {
    header(o) {
      if (!mobx.isObservableObject(o)) {
        return null
      }
      return renderIterableHeader(Object.keys(o), 'Object')
    },
    hasBody: o => hasBody(Object.keys(o)),
    body(o) {
      return renderIterableBody(o, ([key, value]) => [
        'li',
        {},
        reference(key),
        ': ',
        reference(value),
      ])
    },
  }

  const ArrayFormatter = {
    header(o) {
      if (!mobx.isObservableArray(o)) {
        return null
      }
      return renderIterableHeader(o, 'Array')
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, ([index, value]) => ['li', reference(value)])
    },
  }

  return {
    ObjectFormatter,
    ArrayFormatter,
  }
}
