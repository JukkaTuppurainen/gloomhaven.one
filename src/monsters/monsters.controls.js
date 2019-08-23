import {monsters} from './monsters'
import {
  createItem,
  startDraggingItem
}                 from './monsters.functions'
import {
  board,
  hexHeight,
  hexWidth
}                 from '../board/board'


export const monsterValues = {
  initiative: Math.random() * 90 + 1 | 0,
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
      document.getElementById('Awr').style.display = 'none'
      document.getElementById('Asr').style.display = 'block'
      monsterValues.range = 2
      break
    case 'Adr':
      --monsterValues.range
      if (monsterValues.range < 1) {
        document.getElementById('Awr').style.display = 'block'
        document.getElementById('Asr').style.display = 'none'
      }
      break
    case 'Air':
      ++monsterValues.range
      break
    // case 'Aat':
    //   document.getElementById('Awt').style.display = 'none'
    //   document.getElementById('Ast').style.display = 'block'
    //   monsterValues.targets = 2
    //   break
    // case 'Adt':
    //   --monsterValues.targets
    //   if (monsterValues.targets < 2) {
    //     document.getElementById('Awt').style.display = 'block'
    //     document.getElementById('Ast').style.display = 'none'
    //   }
    //   break
    // case 'Ait':
    //   ++monsterValues.targets
    //   break
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
  document.getElementById('Avm').innerText = monsterValues.move
  document.getElementById('Avr').innerText = monsterValues.range
  // document.getElementById('Avt').innerText = monsterValues.targets
}
