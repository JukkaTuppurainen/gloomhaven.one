import abilityCardHTML  from './monsters.abilitycard.html'
import {
  abilityCardClick,
  itemSelectChange,
  renderAbilityCard
}                       from './monsters.controls'
import controlsHTML     from './monsters.controls.html'
import                       './monsters.css'
import {itemsList}      from './monsters.items'
import {
  monstersClick,
  monstersDocumentKeydown,
  monstersMouseout,
  monstersMousedown,
  monstersMousemove,
  monstersMouseup
}                       from './monsters.events'
import {
  deactivateMonster,
  deleteAllItems,
  deleteItem,
  stopDragging
}                       from './monsters.functions'
import {board}          from '../board/board'
import {resizeCanvas}   from '../board/board.scenarioLoad'
import {render}         from '../index'
import {resolveLOS}     from '../lib/resolveLOS'


board.items = []

export const monsters = {
  hoverItem: -1,
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
      click: monstersClick,
      mousedown: monstersMousedown,
      mousemove: monstersMousemove,
      mouseout: monstersMouseout,
      mouseup: monstersMouseup
    }

    monsters.on = true
    board.pxOffset = 280
    resizeCanvas()

    document.body.classList.add('monsters-on')
    document.getElementById('h').innerHTML = controlsHTML

    const itemSelect = document.getElementById('hs')
    let option

    Object.entries(itemsList).forEach(item => {
      option = document.createElement('option')
      option.value = item[0]
      option.innerText = item[1].name
      itemSelect.appendChild(option)
    })

    document.getElementById('di').addEventListener('click', deleteAllItems)
    document.getElementById('hs').addEventListener('change', itemSelectChange)

    const abilityCard = document.createElement('div')
    abilityCard.id = 'ac'
    abilityCard.innerHTML = abilityCardHTML
    abilityCard.addEventListener('click', abilityCardClick)
    document.getElementById('aw').appendChild(abilityCard)
    document.getElementById('ai').innerText = (
      Math.random() * 90 + 1 | 0
    ).toString().padStart(2, '0')

    document.addEventListener('keydown', monstersDocumentKeydown)
    renderAbilityCard()
    resolveLOS()
    render()
  },
  deactivate: () => {
    board.scenario.events = board.scenario._events
    delete board.scenario._events

    monsters.on = false
    board.pxOffset = 0
    resizeCanvas()

    document.body.classList.remove('monsters-on')

    if (monsters.dragging) {
      if (board.items[monsters.hoverItem]) {
        deleteItem(monsters.hoverItem)
      }
      stopDragging()
    }

    if (monsters.hoverItem > -1) {
      monsters.hoverItem = -1
    }

    board.items.forEach(i => {
      if (i.active) {
        deactivateMonster(i)
      }
    })

    document.getElementById('h').innerHTML = ''
    document.removeEventListener('keydown', monstersDocumentKeydown)
    render()
  }
}

document.getElementById('tr').addEventListener('change', event => {
  if (event.target.value === 'Monsters') {
    monsters.activate()
  } else if (monsters.on) {
    monsters.deactivate()
  }
})

document.getElementById('s').addEventListener('change', () => {
  deleteAllItems()
  monsters.deactivate()
})
