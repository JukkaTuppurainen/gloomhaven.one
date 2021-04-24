import {board}            from './board/board'
import {resizeCanvas}     from './board/board.scenarioLoad'
import                         './components/toggle'
import {stopPropagation}  from './lib/dom'
import                         './lib/testWebp'
import {render}           from './renderer/render'
import {scenarioList}     from './scenarios'
import                         './style.css'


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

document.getElementsByTagName('header')[0].addEventListener('mousedown', stopPropagation)

const scenarioSelectElement = document.getElementById('s')
const soloScenariosGroup = document.createElement('optgroup')
soloScenariosGroup.label = 'Solo Scenarios'
for (let [id] of Object.entries(scenarioList)) {
  const option = document.createElement('option')
  option.value = id
  if (id.startsWith('solo')) {
    option.innerText = 'Page ' + id.substr(5)
    soloScenariosGroup.appendChild(option)
  } else {
    option.innerText = id
    scenarioSelectElement.appendChild(option)
  }
}
scenarioSelectElement.appendChild(soloScenariosGroup)

board.skipHashChangeHandler = false

scenarioSelectElement.addEventListener('change', event => {
  const value = event.target.value
  board.loadScenario(value)

  board.skipHashChangeHandler = true
  window.location.hash = value === 'editor' ? ':' : value
})

window.addEventListener('hashchange', () => {
  if (!board.skipHashChangeHandler) {
    let m = window.location.hash.match(/^#(solo-)?\d+/)
    if (m) {
      const id = m[0].substr(1)
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
  const m = h.match(/^#(solo-)?\d+/)

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
  if (['m', 'mc', 'n'].includes(event.target.id)) {
    closeModal()
  }
})

let modalOpen = false
const disableOnModalOpen = 'a, button, input, select'

const openModal = () => {
  document.body.classList.add('modal-open')
  ;[...document.querySelectorAll(disableOnModalOpen)]
    .filter(n => {
      let parent = n.parentElement
      while (parent) {
        if (parent.id === 'm') {
          return false
        }
        parent = parent.parentElement
      }
      return true
    })
    .forEach(n => n.setAttribute('tabIndex', -1))
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
