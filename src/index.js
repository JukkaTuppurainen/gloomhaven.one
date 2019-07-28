import {board}        from './board/board'
import                     './components/toggle'
import {renderer}     from './lib/renderer'
import                     './lib/testWebp'
import {scenarioList} from './scenarios'
import                     './style.css'
import                     './monsters/monsters'


const canvas = document.getElementById('c')

export const render = () => requestAnimationFrame(renderer)
export const stopPropagation = event => event.stopPropagation()

document.getElementsByTagName('header')[0].addEventListener('mousedown', stopPropagation)

const scenarioSelectElement = document.getElementById('s')
for (let [id, scenario] of Object.entries(scenarioList)) {
  const option = document.createElement('option')
  option.value = id
  option.innerText = (id !== 'editor' ? `${id}. ` : '') + scenario[0]
  scenarioSelectElement.appendChild(option)
}

board.skipHashChangeHandler = false

scenarioSelectElement.addEventListener('change', event => {
  const value = event.target.value
  board.loadScenario(value)

  board.skipHashChangeHandler = true
  window.location.hash = value === 'editor' ? ':' : value
})

window.addEventListener('hashchange', () => {
  if (!board.skipHashChangeHandler) {
    if (window.location.hash.match(/^#\d+/)) {
      const id = window.location.hash.substr(1)
      if (id in scenarioList) {
        scenarioSelectElement.value = id
        board.loadScenario(id)
      }
    }
    if (window.location.hash.substr(0, 2) === '#:') {
      scenarioSelectElement.value = 'editor'
      board.loadScenario('editor')
    }
  }
  board.skipHashChangeHandler = false
})

let loadScenario = '1'

if (window.location.hash) {
  if (window.location.hash.match(/^#\d+/)) {
    loadScenario = window.location.hash.substr(1)
  } else if (window.location.hash.substr(0, 2) === '#:') {
    loadScenario = 'editor'
  }
}

scenarioSelectElement.value = loadScenario
board.loadScenario(loadScenario)

canvas.addEventListener('click', event => board.events('click', event))
canvas.addEventListener('mousedown', event => board.events('mousedown', event))
canvas.addEventListener('mouseleave', event => board.events('mouseleave', event))
canvas.addEventListener('mousemove', event => board.events('mousemove', event))
canvas.addEventListener('mouseout', event => {
  board.events('mouseup', event)
  board.events('click', event)
})
canvas.addEventListener('mouseup', event => board.events('mouseup', event))

let keyboardInteraction = false

document.addEventListener('keydown', event => {
  if (modalOpen && event.key === 'Escape') {
    closeModal()
  }

  if (!keyboardInteraction) {
    document.body.classList.add('keyboard')
  }
  keyboardInteraction = true
}, {capture: true})

document.addEventListener('mousedown', () => {
  if (keyboardInteraction) {
    document.body.classList.remove('keyboard')
  }
  keyboardInteraction = false
}, {capture: true})

document.getElementById('i').addEventListener('click', event => {
  event.preventDefault()
  openModal()
})

document.getElementById('n').addEventListener('click', event => {
  event.preventDefault()
  if (
    event.target.id === 'n' ||
    event.target.id === 'mc'
  ) {
    closeModal()
  }
})

let modalOpen = false
let disableOnModalOpen = '#s, #i, #tr>input, #tile-select, .control-button'

const openModal = () => {
  document.body.classList.add('modal-open')
  document.querySelectorAll(disableOnModalOpen).forEach(n => n.setAttribute('tabIndex', -1))
  modalOpen = true
}

const closeModal = () => {
  document.body.classList.remove('modal-open')
  document.querySelectorAll(disableOnModalOpen).forEach(n => n.removeAttribute('tabIndex'))
  modalOpen = false
}

document.getElementById('co').innerText = `Contact: jukka${String.fromCharCode(64)}tuppurainen.net`

// document.getElementById('los-mode').addEventListener('change', event => {
//   board.losMode = event.target.value === '1'
//   render()
// })

// const fullLOSTest = () => {
//   let inSight = 0
//   let outSight = 0
//
//   let start = window.performance.now()
//
//   const hexesToTest = board.scenario.hexes
//
//   hexesToTest.forEach(hex => {
//     hexesToTest.forEach(hex2 => {
//       if (hex.x !== hex2.x || hex.y !== hex2.y) {
//         if (isInSight(hex, hex2)) {
//           ++inSight
//         } else {
//           ++outSight
//         }
//       }
//     })
//   })
//   let end = window.performance.now()
//
//   console.log(`Full LOS test: In sight ${inSight} / Out of sight ${outSight}. Test took ${(end - start | 0)}ms.`)
// }
//
// setTimeout(fullLOSTest, 200)
