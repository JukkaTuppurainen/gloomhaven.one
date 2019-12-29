import {board}        from './board/board'
import {resizeCanvas} from './board/board.scenarioLoad'
import                     './components/toggle'
import                     './lib/testWebp'
import {renderer}     from './renderer/renderer'
import {scenarioList} from './scenarios'
import                     './style.css'


let loadScenario = '1'
let initItems

if (/* global ENV_isAlpha */ ENV_isAlpha) {
  import(/* webpackMode: 'eager' */ './monsters/monsters').then(module => {
    if (initItems) {
      module.monsters.loadItems(initItems)
    }
  })

  if (/* global ENV_isProduction */ ENV_isProduction) {
    const alphaNotice = document.createElement('div')
    alphaNotice.id = 'alpha'
    alphaNotice.innerHTML = 'This is an early alpha version. Monster focus and movement information may be incorrect.'
    document.body.classList.add('alpha')
    document.body.appendChild(alphaNotice)
  }
}

const canvas = document.getElementById('c')

export const render = () => requestAnimationFrame(renderer)
export const stopPropagation = event => event.stopPropagation()

document.getElementsByTagName('header')[0].addEventListener('mousedown', stopPropagation)

const scenarioSelectElement = document.getElementById('s')
for (let [id] of Object.entries(scenarioList)) {
  const option = document.createElement('option')
  option.value = id
  option.innerText = id
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

if (window.location.hash) {
  const h = window.location.hash
  const m = h.match(/^#\d+/)

  if (m) {
    loadScenario = m[0].substr(1)
    const itemsStart = h.indexOf(':') + 1
    if (itemsStart) {
      initItems = h.substr(itemsStart)
    }
  } else if (h.substr(0, 2) === '#:') {
    loadScenario = 'editor'
    const m2 = h.match(/:.*:(.*)/)
    if (m2) {
      initItems = m2[1]
    }
  }
}

scenarioSelectElement.value = loadScenario
board.loadScenario(loadScenario)

canvas.addEventListener('click', event => board.events('click', event))
canvas.addEventListener('mousedown', event => board.events('mousedown', event))
canvas.addEventListener('mouseleave', event => board.events('mouseleave', event))
canvas.addEventListener('mousemove', event => board.events('mousemove', event))
canvas.addEventListener('mouseout', event => board.events('mouseout', event))
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

document.getElementById('co').innerText = `Contact email address: contact${String.fromCharCode(64)}gloomhaven.one`

window.addEventListener('resize', () => {
  resizeCanvas()
  render()
})

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
