import {findFocus}      from './focus/monsters.focus'
import {monsters}       from './monsters'
import {itemsList}      from './monsters.items'
import {findMovement}   from './movement/monster.movement'
import bitmap_itemsheet from '../assets/itemSheet.webp'
import {
  board,
  hexHeight,
  hexWidth
}                       from '../board/board'
import {
  createDragShadow
}                       from '../editor/editor.functions'
import {render}         from '../index'
import {pointToHex}     from '../lib/hexUtils'


export const activateMonster = monster => {
  monster.active = true
  monster.element.classList.add('item-active')
  const focus = findFocus(monster, 2)
  const movement = focus.player ? findMovement(monster, focus) : false
  render()

  const infoHTML = [
    '<h1>Focus</h1>',
    ...focus.messages.map(message => `<p>${message}</p>`)
  ]

  if (movement) {
    infoHTML.push(
      '<h1>Actions</h1>',
      ...movement.messages.map(message => `<p>${message}</p>`)
    )
  }

  const f = document.getElementById('f') || document.createElement('div')
  f.innerHTML = infoHTML.join('')

  if (!f.id) {
    f.id = 'f'
    document.getElementById('fw').appendChild(f)
  }

  const focusInfos = [
    [document.getElementById('fih'), 'focusHexes'],
    [document.getElementById('fip'), 'paths'],
    [document.getElementById('fim'), 'moveHexes']
  ]

  focusInfos.forEach(focusInfo => {
    if (focusInfo[0]) {
      focusInfo[0].addEventListener('focus', () => toggleFocusInfo(focusInfo[1], true))
      focusInfo[0].addEventListener('mouseover', () => toggleFocusInfo(focusInfo[1], true))
      focusInfo[0].addEventListener('blur', () => toggleFocusInfo(focusInfo[1], false))
      focusInfo[0].addEventListener('mouseout', () => toggleFocusInfo(focusInfo[1], false))
    }
  })
}

export const updateActivation = () => {
  const monster = board.items.find(item =>
    item.active === true &&
    item.type === 'monster'
  )
  if (monster) {
    activateMonster(monster)
  } else {
    deactivateMonster()
  }
}

const toggleFocusInfo = (info, state) => {
  board.focusInfo[`${info}Visible`] = state
  render()
}

export const clearPlayerControl = () => {
  const itemControls = document.getElementById('ic')
  if (itemControls) {
    itemControls.innerHTML = ''
  }
}

export const createItem = (x, y, type) => {
  const itemElement = document.createElement('div')
  itemElement.className = `img-loading item-tile item-${type}`

  const imgWrap = document.createElement('div')
  imgWrap.classList.add('img-wrap')
  const img = document.createElement('img')
  img.onload = () => itemElement.classList.remove('img-loading')
  img.onerror = () => {
    itemElement.classList.remove('img-loading')
    itemElement.classList.add('img-error')
  }
  img.src = bitmap_itemsheet

  const ch = pointToHex(x, y)

  itemElement.style.height = `${hexHeight}px`
  itemElement.style.left = `${x}px`
  itemElement.style.top = `${y}px`
  itemElement.style.width = `${hexWidth}px`

  imgWrap.appendChild(img)
  itemElement.appendChild(imgWrap)

  const item = {
    ch,
    element: itemElement,
    h: 1,
    pieceHexes: [{x: 0, y: 0}],
    pxH: hexHeight + 1,
    pxW: hexWidth + 1,
    stacks: itemsList[type].stacks,
    type,
    w: 1,
    x,
    y
  }

  if (type === 'player') {
    const players = board.items.filter(i => i.type === 'player')
    const initiatives = players.map(i => i.initiative)

    if (initiatives.length > 90) {
      return
    }

    do {
      item.initiative = Math.random() * 95 + 1 | 0
    } while (
      initiatives.includes(item.initiative)
    )

    const inUse = players.map(i => i.color)
    const colors = [0, 1, 2, 3, 4, 5].filter(c => !inUse.includes(c))

    item.color = colors.length
      ? colors[Math.random() * colors.length | 0]
      : Math.random() * 6 | 0

    itemElement.classList.add(`item-player-${item.color}`)
    const initiativeNumber = document.createElement('div')
    initiativeNumber.className = 'in'
    initiativeNumber.innerText = item.initiative
    itemElement.appendChild(initiativeNumber)
  }

  return item
}

export const createPlayerControl = item => {
  const playerControl = document.createElement('div')
  playerControl.className = 'icw'
  playerControl.innerHTML = '<button id="icd" class="pm"></button><button id="ici" class="pm"></button>'
  playerControl.style.left = item.x - 5 + board.pxOffset + 'px'
  playerControl.style.top = item.y + 41 + 'px'
  document.getElementById('ic').appendChild(playerControl)

  document.getElementById('icd').addEventListener('click', () => {
    updateInitiative(false)
  })
  document.getElementById('ici').addEventListener('click', () => {
    updateInitiative(true)
  })
}

export const deactivateMonster = (monster = null) => {
  if (monster === null) {
    monster = board.items.find(item => (
      item.active === true &&
      item.type === 'monster'
    ))
  }

  if (monster) {
    monster.active = false
    monster.element.classList.remove('item-active')
  }

  const focusDetailsWrap = document.getElementById('fw')
  if (focusDetailsWrap) {
    focusDetailsWrap.innerHTML = ''
  }

  delete board.focusInfo
  render()
}

export const deleteAllItems = () => {
  clearPlayerControl()
  deactivateMonster()
  board.items = []
  document.getElementById('items').innerHTML = ''
}

export const deleteItem = itemIndex => {
  document.getElementById('items').removeChild(
    board.items.splice(itemIndex, 1)[0].element
  )
  clearPlayerControl()
  updateActivation()
}

export const deleteSomeItems = () => {
  const allItems = [...board.items]

  allItems.forEach(item => {
    if (!board.scenario.hexes.some(hex =>
      hex.x === item.ch.x &&
      hex.y === item.ch.y
    )) {
      deleteItem(board.items.findIndex(q => q === item))
    }
  })
}

export const placeItem = item => {
  let prevItems = board.items.filter(boardItem =>
    boardItem !== item &&
    boardItem.ch.x === item.ch.x &&
    boardItem.ch.y === item.ch.y
  )

  prevItems.forEach(prevItem => {
    let stackLayer = 1
    while (stackLayer < 8) {
      if (
        item.stacks & stackLayer &&
        prevItem.stacks & stackLayer
      ) {
        deleteItem(board.items.findIndex(i => i === prevItem))
        break
      }

      stackLayer *= 2
    }
  })

  prevItems = board.items.filter(boardItem =>
    boardItem !== item &&
    boardItem.ch.x === item.ch.x &&
    boardItem.ch.y === item.ch.y
  )

  if (prevItems.length) {
    (
      prevItems[0].stacks > item.stacks
        ? prevItems[0]
        : item
    ).element.classList.add('item-stacked')
  }
}

export const startDraggingItem = (x, y) => {
  monsters.dragging = {x, y}
  const dragItem = board.items[monsters.hoverItem]
  const dragItemClassList = dragItem.element.classList
  dragItemClassList.add('item-dragging')
  dragItemClassList.remove('item-stacked')
  createDragShadow(dragItem)
}

export const stopDragging = () => {
  monsters.dragging = false
  const dragShadowElement = document.getElementById('drag-shadow')
  if (dragShadowElement) {
    document.body.removeChild(dragShadowElement)
  }
  const draggedItem = document.querySelector('.item-dragging')
  if (draggedItem) {
    draggedItem.classList.remove('item-dragging')
  }
  updateActivation()
}

const updateInitiative = increase => {
  if (!monsters.mouseHover.item === false) {
    const r = 15

    const initiatives = board.items
      .filter(i => i.type === 'player')
      .map(i => i.initiative)

    const currentInitiative = monsters.mouseHover.item.initiative
    let freeValues = []
    const d = increase ? 1 : -1

    for (
      let i = currentInitiative + d;
      i < 100 &&
      i > 0 &&
      i < currentInitiative + r &&
      i > currentInitiative - r;
      i += d
    ) {
      freeValues.push(i)
    }

    freeValues = freeValues.filter(f => !initiatives.includes(f))

    if (freeValues.length) {
      let f = freeValues[Math.random() * freeValues.length | 0]
      monsters.mouseHover.item.initiative = f
      monsters.mouseHover.item.element.children[1].innerText = f
    }
  }
  updateActivation()
}
