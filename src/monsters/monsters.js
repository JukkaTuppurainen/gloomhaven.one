import {itemSelectChange} from './monsters.controls'
import                         './monsters.css'
import {
  monstersDocumentClick,
  monstersDocumentMousedown,
  monstersDocumentMousemove,
  monstersDocumentMouseup
}                         from './monsters.events'
import {board}            from '../board/board'
import {render}           from '../index'


const itemsElement = document.getElementById('items')

// const monsterKeydown = event => {
//   let type
//
//   switch (event.key) {
//     case 'q':
//       type = 'obstacle'
//       break
//     case 'w':
//       type = 'trap'
//       break
//     case 'e':
//       type = ''
//       break
//     case 'r':
//       type = ''
//       break
//   }
//
//   if (type) {
//     const hex = board.scenario.hexes.find(hex => (
//       hex.x === board.mouseHex.x && hex.y === board.mouseHex.y
//     ))
//
//     if (hex) {
//       const prevItemIndex = board.items.findIndex(i => i.x === hex.x && i.y === hex.y)
//
//       console.log(prevItemIndex)
//
//       let prevType
//       if (prevItemIndex > -1) {
//         prevType = board.items[prevItemIndex].type
//         board.items.splice(prevItemIndex, 1)
//         itemsElement.removeChild(
//           itemsElement.children[prevItemIndex]
//         )
//       }
//
//       if (type !== prevType) {
//         const item = createItem(hex.x, hex.y, type)
//         board.items.push(item)
//         itemsElement.appendChild(item.element)
//       }
//     }
//   }
// }


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

    board.items = []
    monsters.on = true
    // document.addEventListener('keydown', monsterKeydown)

    document.getElementById('h').innerHTML = '<div id="hh"><section id="ha">Add item: <select id="hs"><option value=""></option><option value="1">Obstacle</option><option value="2">Trap</option></select></section></div>'
    document.getElementById('hs').addEventListener('change', itemSelectChange)
    render()
  },
  deactivate: () => {
    board.scenario.events = board.scenario._events
    delete board.scenario._events

    delete board.items
    itemsElement.innerHTML = ''
    monsters.on = false
    monsters.dragging = false
    // document.removeEventListener('keydown', monsterKeydown)

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
