import {board}    from '../board/board'
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

  startDraggingItem(0, 0)

  event.target.value = ''
}
