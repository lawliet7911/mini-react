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
      children: children.map((child) => {
        const isTextNode = typeof child === 'string' || typeof child === 'number'
        return isTextNode ? createTextNode(child) : child
      }),
    },
  }
}

function createTextNode(text) {
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

function attachEvent(dom, key, handler) {
  const eventName = key.slice(2).toLowerCase()
  dom.addEventListener(eventName, handler)
}

function unbindEvent(dom, key, handler) {
  const eventName = key.slice(2).toLowerCase()
  dom.removeEventListener(eventName, handler)
}

// 处理props
function patchProps(dom, oldProps, newProps) {
  // 新props没有的属性 删除掉
  Object.keys(oldProps).forEach((key) => {
    if (key !== 'children') {
      if (!(key in newProps)) {
        dom.removeAttribute(key)
      }
    }
  })

  Object.keys(newProps).forEach((key) => {
    if (key !== 'children') {
      if (newProps[key] !== oldProps[key]) {
        if (key.startsWith('on')) {
          // 绑定事件
          unbindEvent(dom, key, oldProps[key])
          attachEvent(dom, key, newProps[key])
        } else dom[key] = newProps[key]
      }
    }
  })
}

// 当前处理节点
let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null
function render(vdom, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [vdom],
    },
  }
  wipRoot = nextUnitOfWork
}

function update() {
  nextUnitOfWork = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  }
  wipRoot = nextUnitOfWork
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]

  constructConnection(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 更新属性
    fiber.dom = createDom(fiber.type)
    patchProps(fiber.dom, {}, fiber.props)
  }
  const children = fiber.props.children

  constructConnection(fiber, children)
}

// 处理当前节点
function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function'
  // 分离逻辑
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // todo 错误的添加
  if (fiber.type === NodeType.FRAGMENT) {
    fiber.parent.dom.append(fiber.dom)
  }

  // 返回下一个fiber
  if (fiber.child) return fiber.child
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    else nextFiber = nextFiber.parent
  }
}

// 构建fiber之间的关系
function constructConnection(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let preChild = null
  children.forEach((child, index) => {
    const isArray = plainType(child) === 'array'
    const isSameType = oldFiber && oldFiber.type === child.type
    let newFiber
    if (isSameType) {
      // 更新逻辑
      newFiber = {
        type: isArray ? NodeType.FRAGMENT : child.type,
        props: isArray ? { children: child } : child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: 'UPDATE',
        alternate: oldFiber,
      }
    } else {
      newFiber = {
        type: isArray ? NodeType.FRAGMENT : child.type,
        props: isArray ? { children: child } : child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectTag: 'PLACEMENT',
        alternate: null,
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
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
  })
}

function workLoop(deadline) {
  // 是否让出主线程
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // do work
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

function commitRoot() {
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.effectTag === 'UPDATE' && fiber.dom) {
    patchProps(fiber.dom, fiber.alternate?.props, fiber.props)
  } else if (fiber.effectTag === 'PLACEMENT') {
    if (fiber.dom) {
      fiberParent.dom.appendChild(fiber.dom)
    }
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

requestIdleCallback(workLoop)

export default {
  createElement,
  createTextNode,
  render,
  update,
}
