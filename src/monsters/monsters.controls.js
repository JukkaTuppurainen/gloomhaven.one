import {monsters} from './monsters'
import {
  createItem,
  startDraggingItem,
  updateActivation
}                 from './monsters.functions'
import {
  board,
  hexHeight,
  hexWidth
}                 from '../board/board'


export const monsterValues = {
  move: 2,
  range: 0,
  targets: 1
}

export const abilityCardClick = event => {
  switch (event.target.id) {
    case 'Adm':
      --monsterValues.move
      if (monsterValues.move < 0) {
        monsterValues.move = 0
      }
      break
    case 'Aim':
      ++monsterValues.move
      break
    case 'Aar':
      monsterValues.range = 2
      break
    case 'Adr':
      --monsterValues.range
      break
    case 'Air':
      ++monsterValues.range
      break
    // case 'Aat':
    //   monsterValues.targets = 2
    //   break
    // case 'Adt':
    //   --monsterValues.targets
    //   break
    // case 'Ait':
    //   ++monsterValues.targets
    //   break
  }

  renderAbilityCard()
  updateActivation()
}

export const itemSelectChange = event => {
  const item = createItem(event.pageX, event.pageY, event.target.value)
  const boardItems = document.getElementById('items')

  boardItems.appendChild(item.element)
  board.items.push(item)
  monsters.hoverItem = board.items.length - 1

  startDraggingItem(
    (hexWidth / 2) + board.pxOffset,
    hexHeight / 2
  )

  event.target.value = ''
}

export const renderAbilityCard = () => {
  document.getElementById('Awr').style.display = monsterValues.range < 1 ? 'block' : 'none'
  document.getElementById('Asr').style.display = monsterValues.range < 1 ? 'none' : 'block'
  // document.getElementById('Awt').style.display = monsterValues.targets < 2 ? 'block' : 'none'
  // document.getElementById('Ast').style.display = monsterValues.targets < 2 ? 'none' : 'block'
  document.getElementById('Avm').innerText = monsterValues.move
  document.getElementById('Avr').innerText = monsterValues.range
  // document.getElementById('Avt').innerText = monsterValues.targets
}
