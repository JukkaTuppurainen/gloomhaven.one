import {monsters}       from './monsters'
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


export const createItem = (x, y, type) => {
  const itemElement = document.createElement('div')
  itemElement.className = `img-loading item-tile item-${type} map-tile`

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

export const startDraggingItem = (x, y) => {
  monsters.dragging = {x, y}
  createDragShadow(board.items[monsters.hoverItem])
}

export const stopDragging = () => {
  monsters.dragging = false
  const dragShadowElement = document.getElementById('drag-shadow')
  if (dragShadowElement) {
    document.body.removeChild(dragShadowElement)
  }
}
