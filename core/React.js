import { plainType } from '../utils/index.js'

const NodeType = {
  TEXT_NODE: 'TEXT_NODE',
  FRAGMENT: 'FRAGMENT',
  TEXT_NODE: 'TEXT_NODE',
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((cihld) => (typeof cihld === 'string' ? createTextNode(cihld) : cihld)),
    },
  }
}

function createTextNode(text) {
  console.log('wocao.')
  return {
    type: NodeType.TEXT_NODE,
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createDom(type) {
  switch (type) {
    case NodeType.TEXT_NODE:
      return document.createTextNode('')
    case NodeType.FRAGMENT:
      return document.createDocumentFragment()
    default:
      return document.createElement(type)
  }
}

function patchProps(dom, props) {
  Object.keys(props).forEach((keys) => {
    if (keys === 'children') return
    dom[keys] = props[keys]
  })
}

// 当前处理节点
let nextUnitOfWork = null
function render(vdom, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [vdom],
    },
  }
}

// 处理当前节点
function performUnitOfWork(fiber) {
  // 创建元素
  if (!fiber.dom) {
    // 更新属性
    const dom = (fiber.dom = createDom(fiber.type))
    fiber.parent.dom.append(dom)
    patchProps(fiber.dom, fiber.props)
  }

  // 构建关系
  const children = fiber.props.children
  let preChild = null
  children.forEach((child, index) => {
    const isArray = plainType(child) === 'array'
    const newFiber = {
      type: isArray ? NodeType.FRAGMENT : child.type,
      props: isArray ? { children: child } : child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    }
    // 第一个节点设置为当前vdom fiber的 child
    if (index === 0) {
      fiber.child = newFiber
    } else {
      // 例如index = 1，代表上一个节点的兄弟节点为当前节点
      preChild.sibling = newFiber
    }
    //  结束一次循环 设置pre为当前节点 方便构建兄弟间的关系
    preChild = newFiber

    // fragment 循环完
    if (index === children.length - 1 && newFiber.parent.type === NodeType.FRAGMENT) {
      newFiber.parent.parent.dom.append(newFiber.parent.dom)
    }
  })
  if (fiber.type === NodeType.FRAGMENT) {
    fiber.parent.dom.append(fiber.dom)
  }

  // 返回下一个fiber
  if (fiber.child) return fiber.child
  if (fiber.sibling) return fiber.sibling
  return fiber.parent?.sibling
}

function workLoop(deadline) {
  // 是否让出主线程
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // do work
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

export default {
  createElement,
  createTextNode,
  render,
}
