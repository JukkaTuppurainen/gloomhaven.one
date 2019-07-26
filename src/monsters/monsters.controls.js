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


const monsterValues = {
  initiative: Math.random() * 90 + 1 | 0,
  valueMove: 2,
  valueRange: 0,
  valueTarget: 1
}

export const abilityCardClick = event => {
  switch (event.target.id) {
    case 'accdm':
      --monsterValues.valueMove
      if (monsterValues.valueMove < 0) {
        monsterValues.valueMove = 0
      }
      break
    case 'accim':
      ++monsterValues.valueMove
      break
  }
  renderAbilityCard()
}

export const itemSelectChange = event => {
  const item = createItem(event.pageX, event.pageY, event.target.value)
  const boardItems = document.getElementById('items')

  boardItems.appendChild(item.element)
  board.items.push(item)
  monsters.hoverItem = board.items.length - 1

  startDraggingItem(hexWidth / 2, hexHeight / 2)

  event.target.value = ''
}

export const renderAbilityCard = () => {
  document.getElementById('ai').innerText = monsterValues.initiative.toString().padStart(2, '0')
  document.getElementById('acv-m').innerText = monsterValues.valueMove
}
