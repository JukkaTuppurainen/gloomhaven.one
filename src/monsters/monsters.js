import abilityCardHTML      from './monsters.abilitycard.html'
import {
  abilityCardClick,
  deleteAllItemsClick,
  itemSelectChange,
  renderAbilityCard
}                           from './monsters.controls'
import controlsHTML         from './monsters.controls.html'
import                           './monsters.css'
import {itemsList}          from './monsters.items'
import {
  monstersDocumentClick,
  monstersDocumentMousedown,
  monstersDocumentMousemove,
  monstersDocumentMouseup,
  monstersDocumentKeydown
}                           from './monsters.events'
import {board}              from '../board/board'
import {render}             from '../index'
import {resolveLOS}         from '../lib/resolveLOS'
import {deactivateMonster}  from './monsters.functions'


board.items = []

export const monsters = {
  on: false,
  dragging: false,
  mouseHover: {
    x: null,
    y: null
  },
  activate: () => {
    board.mouseHex = {
      x: null,
      y: null
    }
    delete board.playerHex
    delete board.linesToHover

    board.scenario._events = board.scenario.events
    board.scenario.events  = {
      click: monstersDocumentClick,
      mousedown: monstersDocumentMousedown,
      mousemove: monstersDocumentMousemove,
      mouseup: monstersDocumentMouseup
    }

    monsters.on = true

    document.getElementById('h').innerHTML = controlsHTML

    const itemSelect = document.getElementById('hs')
    let option

    Object.entries(itemsList).forEach(item => {
      option = document.createElement('option')
      option.value = item[0]
      option.innerText = item[1].name
      itemSelect.appendChild(option)
    })

    document.getElementById('di').addEventListener('click', deleteAllItemsClick)
    document.getElementById('hs').addEventListener('change', itemSelectChange)

    const abilityCard = document.createElement('div')
    abilityCard.id = 'ac'
    abilityCard.innerHTML = abilityCardHTML
    abilityCard.addEventListener('click', abilityCardClick)
    document.getElementById('aw').appendChild(abilityCard)

    document.addEventListener('keydown', monstersDocumentKeydown)
    renderAbilityCard()
    resolveLOS()
    render()
  },
  deactivate: () => {
    board.scenario.events = board.scenario._events
    delete board.scenario._events

    monsters.on = false
    monsters.dragging = false
    board.items.forEach(i => {
      if (i.active) {
        deactivateMonster(i)
      }
    })

    document.getElementById('h').innerHTML = ''
    document.removeEventListener('keydown', monstersDocumentKeydown)
  }
}

document.getElementById('tr').addEventListener('change', event => {
  if (event.target.value === 'Monsters') {
    monsters.activate()
  } else if (monsters.on) {
    monsters.deactivate()
  }
})
