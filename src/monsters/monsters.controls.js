import {
  board,
  hexHeight,
  hexWidth
}                 from '../board/board'
import {monsters} from './monsters'
import {
  createItem,
  startDraggingItem
}                 from './monsters.functions'


export const itemSelectChange = event => {
  const item = createItem(event.pageX, event.pageY, event.target.value)
  const boardItems = document.getElementById('items')

  boardItems.appendChild(item.element)
  board.items.push(item)
  monsters.hoverItem = board.items.length - 1

  startDraggingItem(hexWidth / 2, hexHeight / 2)

  event.target.value = ''
}
