import React from './core/React.js'

// const App = React.createElement('div', { id: 'app', class: 'main-container' }, 'Hello!', 'mini react', '~')
const a = Array.from({ length: 1000 }, () => '1')
function Counter({ num }) {
  return <div>counter:{num}</div>
}
let num = 1
function clickHandler() {
  console.log('click')
  num++
  React.update()
}

function onMouseDown() {
  console.log('onMouseDown')
}
function onMouseUp() {
  console.log('onMouseUp')
}
const App = () => (
  <div id="app" class="main-container">
    <span style="brown;">Hello </span>
    <span style="color: skyblue;">mini-react ~</span>
    {/* <Counter num={10}></Counter>
    <Counter num={20}></Counter> */}
    <Counter num={num}></Counter>
    <button onClick={clickHandler}>点击事件</button>
    <br />
    <input type="text" onMouseDown={onMouseDown} onMouseUp={onMouseUp}></input>
    {/* {a.map((item, index) => (
      <div key={index}>{item}</div>
    ))} */}
  </div>
)

// React.createElement('div', { id: 'app', class: 'main-container' }, 'Hello!', 'mini react', '~')
console.log(App())
export default App
