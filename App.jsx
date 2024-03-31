import React from './core/React.js'

// const App = React.createElement('div', { id: 'app', class: 'main-container' }, 'Hello!', 'mini react', '~')
const a = Array.from({ length: 1000 }, () => '1')
function Counter({ label = 'counter', num }) {
  return (
    <div>
      {label}:{num}
    </div>
  )
}
let num = 0
let flag = true
function clickHandler() {
  const update = React.update()
  console.log('click')
  num++
  flag = !flag
  update()
}

function onMouseDown() {
  console.log('onMouseDown')
}
function onMouseUp() {
  console.log('onMouseUp')
}

let flagCondition = false

const App = () => {
  const fooT = <div>fooT</div>
  const barT = (
    <div>
      barT
      <div>new Child1</div>
      <div>new Child2</div>
    </div>
  )
  const Bar = () => <div>foo</div>
  const Foo = () => (
    <div>
      text
      <div>bar</div>
    </div>
  )

  let fc1Num = 0
  const FC1 = () => {
    console.log('fc1 run')
    const update = React.update()
    function onFC1Click() {
      fc1Num++
      update()
    }
    return (
      <div>
        fc1Num:
        {fc1Num}
        <button onClick={onFC1Click}>点击</button>
      </div>
    )
  }

  let fc2Num = 0
  const FC2 = () => {
    console.log('fc2 run')
    const update = React.update()
    function onFC2Click() {
      fc2Num++
      update()
    }
    return (
      <div>
        fc2Num:
        {fc2Num}
        <button onClick={onFC2Click}>点击</button>
      </div>
    )
  }

  function changeFlagCondition() {
    const update = React.update()
    flagCondition = !flagCondition
    update()
  }

  const componentCondition = <div>componentCondition</div>

  return (
    <div id="app" class="main-container">
      <span style="brown;">Hello </span>
      <span style="color: skyblue;">mini-react ~</span>
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
      <Counter label={'点击次数'} num={num}></Counter>
      <button onClick={clickHandler}>点击事件</button>

      {flag ? fooT : barT}
      <br />
      <input type="text" onMouseDown={onMouseDown} onMouseUp={onMouseUp}></input>

      <div>条件渲染</div>
      <div>
        <button onClick={changeFlagCondition}>改变</button>
      </div>
      {!flagCondition && componentCondition}
      <div>条件渲染End</div>

      <div>组件更新</div>
      <FC1 />
      <FC2 />

      {/* todo case 1 */}
      {/* <div>Todo case: function Component insert pos start</div>
      {flag ? <Foo /> : <Bar />}
      <div>-------- function Component insert pos end ------</div> */}

      {/* todo case 2: map */}

      {/* {a.map((item, index) => (
      <div key={index}>{item}</div>
    ))} */}
    </div>
  )
}

// React.createElement('div', { id: 'app', class: 'main-container' }, 'Hello!', 'mini react', '~')
console.log(App())
export default App
