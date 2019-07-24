import {itemSelectChange} from './monsters.controls'
import                         './monsters.css'
import {itemsList}        from './monsters.items'
import {
  monstersDocumentClick,
  monstersDocumentMousedown,
  monstersDocumentMousemove,
  monstersDocumentMouseup
}                         from './monsters.events'
import {board}            from '../board/board'
import {render}           from '../index'


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

    document.getElementById('h').innerHTML = '<div id="hh"><section id="ha">Add item: <select id="hs"><option value=""></option></select></section></div>'

    const itemSelect = document.getElementById('hs')
    let option

    Object.entries(itemsList).forEach(item => {
      option = document.createElement('option')
      option.value = item[0]
      option.innerText = item[1].name
      itemSelect.appendChild(option)
    })

    document.getElementById('hs').addEventListener('change', itemSelectChange)
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
    console.log('monsters.load()')
    monsters.activate()
  } else if (monsters.on) {
    console.log('monsters.unload()')
    monsters.deactivate()
  }
})
