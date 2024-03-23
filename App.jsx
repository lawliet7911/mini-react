import React from './core/React.js'

// const App = React.createElement('div', { id: 'app', class: 'main-container' }, 'Hello!', 'mini react', '~')
const App = (
  <div id="app" class="main-container">
    <span style="brown;">Hello </span>
    <span style="color: skyblue;">mini-react ~</span>
  </div>
)

console.log(App)

// React.createElement('div', { id: 'app', class: 'main-container' }, 'Hello!', 'mini react', '~')

export default App
