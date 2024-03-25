import React from './core/React.js'

// const App = React.createElement('div', { id: 'app', class: 'main-container' }, 'Hello!', 'mini react', '~')
const a = Array.from({ length: 1000 }, () => '1')
function Counter({ num }) {
  return <div>counter:{num}</div>
}
const App = () => (
  <div id="app" class="main-container">
    <span style="brown;">Hello </span>
    <span style="color: skyblue;">mini-react ~</span>
    <Counter num={10}></Counter>
    <Counter num={20}></Counter>
    <Counter num={30}></Counter>
    {/* {a.map((item, index) => (
      <div key={index}>{item}</div>
    ))} */}
  </div>
)

// React.createElement('div', { id: 'app', class: 'main-container' }, 'Hello!', 'mini react', '~')
console.log(App())
export default App
