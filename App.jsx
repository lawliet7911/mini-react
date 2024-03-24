import React from './core/React.js'

// const App = React.createElement('div', { id: 'app', class: 'main-container' }, 'Hello!', 'mini react', '~')
const a = Array.from({ length: 1000 }, () => '1')
const App = (
  <div id="app" class="main-container">
    <span style="brown;">Hello </span>
    <span style="color: skyblue;">mini-react ~</span>
    {a.map((item, index) => (
      <div key={index}>{item}</div>
    ))}
  </div>
)

console.log(App)

// React.createElement('div', { id: 'app', class: 'main-container' }, 'Hello!', 'mini react', '~')

export default App
