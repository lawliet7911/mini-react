# day 01:

## 1. 小步走，先实现dom创建渲染
``` javascript
  const root = document.getElementById('root');
  const App = document.createElement('div');
  App.id = 'app';
  const text = document.createTextNode('');
  text.textContent = 'Hello, world!';
  root.append(App);
  App.appendChild(text);
```

## 2. 抽离写死的部分，用对象表示VDom
``` javascript
  const textNode = {
    type: 'TEXT_NODE',
    props: {
      nodeValue: 'Hello, world!',
      children: []
    },
  }
  const vdom = {
    type: 'div',
    props: {
      id: 'app',
      children: [
        textNode,
      ],
    }
  }
```


## 3. 抽象实现VDom
``` javascript 
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  }
}

function createTextNode(text) {
  return {
    type: 'TEXT_NODE',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
```

## 4.实现对vdom的递归渲染
``` javascript 
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
      // 子节点递归调用render函数进行渲染
      render(child, dom)
    })
    container.append(dom)
  }
```

## 5.重构方法，抽离函数，模仿React的API写法
重构各个方法，分为React（实现通用渲染初始化方法），ReactDom（处理浏览器各节点的方法）；



## 6. 使用jsx
使用vite来对jsx进行支持。


## 问题：dom节点多了之后，render会有什么影响？
A：render函数是个同步任务，递归执行，必须全部递归处理完之后才能恢复js线程其他任务，dom节点过于庞大之后，导致js线程去进行递归早操，页面会卡顿。