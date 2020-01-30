import {monsters} from './monsters'
import {
  createItem,
  startDraggingItem,
  updateActivation
}                 from './monsters.functions'
import {board}    from '../board/board'
import {
  hexHeight,
  hexWidth
}                 from '../board/board.constants'


export const monsterValues = {
  move: 2,
  range: 0,
  targets: 1,
  mt: 0
}

export const abilityCardClick = event => {
  event.preventDefault()

  let update = true

  switch (event.target.id) {
    case 'Adm':
      --monsterValues.move
      if (monsterValues.move < 0) {
        monsterValues.move = 0
      }
      break
    case 'Aim':
      if (monsterValues.move < 50) {
        ++monsterValues.move
      }
      break
    case 'Aar':
      monsterValues.range = 2
      break
    case 'Adr':
      --monsterValues.range
      break
    case 'Air':
      if (monsterValues.range < 50) {
        ++monsterValues.range
      }
      break
    case 'Aat':
      monsterValues.targets = 2
      break
    case 'Adt':
      --monsterValues.targets
      break
    case 'Ait':
      if (monsterValues.targets < 50) {
        ++monsterValues.targets
      }
      break
    case 'Amt':
      ++monsterValues.mt
      if (monsterValues.mt > 2) {
        monsterValues.mt = 0
      }
      break
    default:
      update = false
  }

  if (update) {
    renderAbilityCard()
    updateActivation()
  }
}

export const itemSelectChange = event => {
  const item = createItem(event.pageX, event.pageY, event.target.value)
  if (item) {
    const boardItems = document.getElementById('items')

    boardItems.appendChild(item.element)
    board.items.push(item)
    monsters.hoverItem = board.items.length - 1

    startDraggingItem(
      (hexWidth / 2) + board.pxOffset,
      hexHeight / 2
    )
  }

  event.target.value = ''
}

export const renderAbilityCard = () => {
  document.getElementById('Awr').style.display = monsterValues.range < 1 ? 'block' : 'none'
  document.getElementById('Asr').style.display = monsterValues.range < 1 ? 'none' : 'block'
  document.getElementById('Awt').style.display = monsterValues.targets < 2 ? 'block' : 'none'
  document.getElementById('Ast').style.display = monsterValues.targets < 2 ? 'none' : 'block'
  document.getElementById('Avm').innerText = monsterValues.move
  document.getElementById('Avr').innerText = monsterValues.range
  document.getElementById('Avt').innerText = monsterValues.targets
  document.getElementById('Amt').className = `s${monsterValues.mt}`
}
