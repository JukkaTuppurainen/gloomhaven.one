import {monsters}     from './monsters'
import bitmap_boulder from '../assets/boulder.webp'
import trap_boulder   from '../assets/trap.webp'
import {
  board,
  hexHeight,
  hexWidth
}                     from '../board/board'
import {
  pointToHex,
  rectangle
}                     from '../lib/hexUtils'
import {
  createDragShadow
}                     from '../editor/editor.functions'


export const createItem = (x, y, t) => {
  const itemElement = document.createElement('div')
  itemElement.classList.add('img-loading', 'item-tile', 'map-tile')

  const itemGrid = rectangle({height: 1, width: 1})

  const imgWrap = document.createElement('div')
  imgWrap.classList.add('img-wrap')
  const img = document.createElement('img')
  img.onload = () => itemElement.classList.remove('img-loading')
  img.onerror = () => {
    itemElement.classList.remove('img-loading')
    itemElement.classList.add('img-error')
  }

  let type

  switch (t) {
    case '1':
      img.src = bitmap_boulder
      type = 'obstacle'
      break
    case '2':
      img.src = trap_boulder
      type = 'trap'
      break
  }

  const ch = pointToHex(x, y)

  itemElement.style.height = `${hexHeight}px`
  itemElement.style.left = `${x}px`
  itemElement.style.top = `${y}px`
  itemElement.style.width = `${hexWidth}px`

  imgWrap.appendChild(img)
  itemElement.appendChild(imgWrap)

  return {
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
