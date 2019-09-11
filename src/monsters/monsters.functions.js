import {findFocus}      from './focus/monsters.focus'
import {monsters}       from './monsters'
import {itemsList}      from './monsters.items'
import bitmap_itemsheet from '../assets/itemSheet.webp'
import {
  board,
  hexHeight,
  hexWidth
}                       from '../board/board'
import {
  pointToHex,
  rectangle
}                       from '../lib/hexUtils'
import {
  createDragShadow
}                       from '../editor/editor.functions'
import {render}         from '../index'


export const activateMonster = monster => {
  monster.active = true
  monster.element.classList.add('item-active')
  const focus = findFocus(monster)
  render()

  const f = document.getElementById('f') || document.createElement('div')

  f.innerHTML = focus.messages
    .map(message => `<p>${message}</p>`)
    .join('')

  if (!f.id) {
    f.id = 'f'
    document.getElementById('fw').appendChild(f)
  }

  const focusInformationHexes = document.getElementById('fih')
  const focusInformationPath = document.getElementById('fip')

  const focusVisualisations = [
    [focusInformationHexes, showFocusHexes, hideFocusHexes],
    [focusInformationPath, showFocusPath, hideFocusPath]
  ]

  focusVisualisations.forEach(focusVisualisation => {
    if (focusVisualisation[0]) {
      focusVisualisation[0].addEventListener('focus', focusVisualisation[1])
      focusVisualisation[0].addEventListener('mouseover', focusVisualisation[1])
      focusVisualisation[0].addEventListener('blur', focusVisualisation[2])
      focusVisualisation[0].addEventListener('mouseout', focusVisualisation[2])
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

const showFocusHexes = () => {
  board.focusInfo.focusHexesVisible = true
  render()
}

const hideFocusHexes = () => {
  board.focusInfo.focusHexesVisible = false
  render()
}

const showFocusPath = () => {
  board.focusInfo.pathsVisible = true
  render()
}

const hideFocusPath = () => {
  board.focusInfo.pathsVisible = false
  render()
}

export const clearPlayerControl = () => {
  document.getElementById('ic').innerHTML = ''
}

export const createItem = (x, y, type) => {
  const itemElement = document.createElement('div')
  itemElement.className = `img-loading item-tile item-${type}`

  const itemGrid = rectangle({height: 1, width: 1})

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
    grid: itemGrid,
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
    item.initiative = Math.random() * 90 + 1 | 0

    const inUse = board.items
      .filter(i => i.type === 'player')
      .map(i => i.color)

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
    updateInitiative(-(Math.random() * 10 + 5 | 0))
  })
  document.getElementById('ici').addEventListener('click', () => {
    updateInitiative(Math.random() * 10 + 5 | 0)
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
  deactivateMonster()
  board.items = []
  const itemControls = document.getElementById('ic')
  if (itemControls) {
    itemControls.innerHTML = ''
  }
  document.getElementById('items').innerHTML = ''
}

export const deleteItem = itemIndex => {
  const itemsElement = document.getElementById('items')
  board.items.splice(itemIndex, 1)
  itemsElement.removeChild(
    itemsElement.children[itemIndex]
  )
  document.getElementById('ic').innerHTML = ''
  updateActivation()
}

export const placeItem = item => {
  const prevItems = board.items.filter(boardItem =>
    boardItem !== item &&
    boardItem.ch.x === item.ch.x &&
    boardItem.ch.y === item.ch.y
  )

  let prevItemIndex
  prevItems.forEach(prevItem => {
    prevItemIndex = board.items.findIndex(i => i === prevItem)

    if (prevItem.stacks) {
      if (item.stacks) {
        deleteItem(prevItemIndex)
      } else {
        prevItem.element.classList.add('item-stacked')
      }
    } else {
      if (item.stacks) {
        item.element.classList.add('item-stacked')
      } else {
        deleteItem(prevItemIndex)
      }
    }
  })
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

const updateInitiative = value => {
  if (!monsters.mouseHover.item === false) {
    const direction = value > 0 ? 1 : -1
    const initiatives = board.items
      .filter(i => i.type === 'player')
      .map(i => i.initiative)
      .sort((a, b) => a > b ? direction : -direction)

    const currentInitiative = monsters.mouseHover.item.initiative
    let nextInitiative = false

    initiatives.forEach(initiative => {
      if (
        !nextInitiative &&
        (
          (direction === 1 && initiative > currentInitiative) ||
          (direction === -1 && initiative < currentInitiative)
        )
      ) {
        nextInitiative = initiative
      }
    })

    let newInitiative = monsters.mouseHover.item.initiative + value
    if (newInitiative < 1) {
      newInitiative = 1
    }
    if (newInitiative > 99) {
      newInitiative = 99
    }
    if (direction === 1 && nextInitiative && newInitiative + 2 > nextInitiative) {
      newInitiative = nextInitiative
    }
    if (direction === -1 && nextInitiative && newInitiative - 2 < nextInitiative) {
      newInitiative = nextInitiative
    }

    monsters.mouseHover.item.initiative = newInitiative
    monsters.mouseHover.item.element.children[1].innerText = monsters.mouseHover.item.initiative
  }
  updateActivation()
}
