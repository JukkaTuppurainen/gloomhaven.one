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
  monstersDocumentClick,
  monstersDocumentMousedown,
  monstersDocumentMousemove,
  monstersDocumentMouseup
}                       from './monsters.events'
import {board}          from '../board/board'
import {render}         from '../index'


board.items = []

export const monsters = {
  on: false,
  dragging: false,
  activate: () => {
    delete board.mouseHex

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

    document.getElementById('hs').addEventListener('change', itemSelectChange)

    const abilityCard = document.createElement('div')
    abilityCard.id = 'ac'
    abilityCard.innerHTML = abilityCardHTML
    abilityCard.addEventListener('click', abilityCardClick)
    document.getElementById('aw').appendChild(abilityCard)
    renderAbilityCard()

    render()
  },
  deactivate: () => {
    board.scenario.events = board.scenario._events
    delete board.scenario._events

    monsters.on = false
    monsters.dragging = false

    document.getElementById('h').innerHTML = ''
  }
}

document.getElementById('tr').addEventListener('change', event => {
  if (event.target.value === 'Monsters') {
    monsters.activate()
  } else if (monsters.on) {
    monsters.deactivate()
  }
})
