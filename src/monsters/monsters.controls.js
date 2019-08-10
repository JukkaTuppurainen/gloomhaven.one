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


const monsterValues = {
  initiative: Math.random() * 90 + 1 | 0,
  valueMove: 2,
  valueRange: 0,
  valueTarget: 1
}

export const abilityCardClick = event => {
  switch (event.target.id) {
    case 'Adm':
      --monsterValues.valueMove
      if (monsterValues.valueMove < 0) {
        monsterValues.valueMove = 0
      }
      break
    case 'Aim':
      ++monsterValues.valueMove
      break
    // case 'Aar':
    //   document.getElementById('Awr').style.display = 'none'
    //   document.getElementById('Asr').style.display = 'block'
    //   monsterValues.valueRange = 2
    //   break
    // case 'Adr':
    //   --monsterValues.valueRange
    //   if (monsterValues.valueRange < 1) {
    //     document.getElementById('Awr').style.display = 'block'
    //     document.getElementById('Asr').style.display = 'none'
    //   }
    //   break
    // case 'Air':
    //   ++monsterValues.valueRange
    //   break
    // case 'Aat':
    //   document.getElementById('Awt').style.display = 'none'
    //   document.getElementById('Ast').style.display = 'block'
    //   monsterValues.valueTarget = 2
    //   break
    // case 'Adt':
    //   --monsterValues.valueTarget
    //   if (monsterValues.valueTarget < 2) {
    //     document.getElementById('Awt').style.display = 'block'
    //     document.getElementById('Ast').style.display = 'none'
    //   }
    //   break
    // case 'Ait':
    //   ++monsterValues.valueTarget
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
  document.getElementById('Avm').innerText = monsterValues.valueMove
  // document.getElementById('Avr').innerText = monsterValues.valueRange
  // document.getElementById('Avt').innerText = monsterValues.valueTarget
}
