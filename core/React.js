function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((cihld) => {
        return typeof cihld === 'string' ? createTextNode(cihld) : cihld
      }),
    },
  }
}

function createTextNode(text) {
  console.log('wocao.')
  return {
    type: 'TEXT_NODE',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function render(vdom, container) {
  const dom = vdom.type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(vdom.type)
  // props
  Object.keys(vdom.props).forEach((keys) => {
    if (keys === 'children') return
    dom[keys] = vdom.props[keys]
  })

  // children
  const children = vdom.props.children
  children.forEach((child) => {
    render(child, dom)
  })
  container.append(dom)
}

export default {
  createElement,
  createTextNode,
  render,
}
