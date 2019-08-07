import {monsters}         from './monsters'
import {
  activateMonster,
  clearPlayerControl,
  createItem,
  createPlayerControl,
  deactivateMonster,
  startDraggingItem,
  stopDragging
}                         from './monsters.functions'
import {board}            from '../board/board'
import {findSnap}         from '../board/board.functions'
import {updateDragShadow} from '../editor/editor.functions'
import {render}           from '../index'
import {
  pointToHex,
  toPoint
}                         from '../lib/hexUtils'


const itemsElement = document.getElementById('items')
const minMouseMoveDeltaToConsiderClickAsDragging = 20
let mouseDownCoords = false

export const monstersDocumentClick = event => {
  mouseDownCoords = false
  if (monsters.dragging) {
    stopDragging()
  } else {
    const clickHex = pointToHex(event.pageX, event.pageY)
    const clickItem = board.items.find(item => (
      item.ch.x === clickHex.x && item.ch.y === clickHex.y
    ))

    if (clickItem && clickItem.type === 'monster') {
      if (clickItem.active) {
        deactivateMonster(clickItem)
      } else {
        const prevActiveItem = board.items.find(item => item.active)
        if (prevActiveItem) {
          deactivateMonster(prevActiveItem)
        }
        activateMonster(clickItem)
      }
    }
  }
}

export const monstersDocumentMousedown = event => {
  if (monsters.dragging === false) {
    monsters.hoverItem = false
    const hexFromPoint = pointToHex(event.pageX, event.pageY)

    monsters.hoverItem = board.items.findIndex(i =>
      i.ch.x === hexFromPoint.x && i.ch.y === hexFromPoint.y
    )

    if (monsters.hoverItem === -1) {
      monsters.hoverItem = false
    }

    if (monsters.hoverItem !== false) {
      mouseDownCoords = {
        x: event.pageX,
        y: event.pageY
      }

      render()
    }
  }
}

export const monstersDocumentMousemove = event => {
  if (mouseDownCoords) {
    const deltaX = event.pageX - mouseDownCoords.x
    const deltaY = event.pageY - mouseDownCoords.y

    if (
      !monsters.dragging &&
      monsters.hoverItem !== false && (
        deltaX > minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaX < -minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaY > minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaY < -minMouseMoveDeltaToConsiderClickAsDragging
      )
    ) {
      clearPlayerControl()
      startDraggingItem(
        event.pageX - board.items[monsters.hoverItem].x,
        event.pageY - board.items[monsters.hoverItem].y
      )
    }
  }

  if (monsters.dragging) {
    const item = board.items[monsters.hoverItem]
    item.x = event.pageX - monsters.dragging.x
    item.y = event.pageY - monsters.dragging.y

    renderDOM()
    updateDragShadow(
      event.pageX - monsters.dragging.x,
      event.pageY - monsters.dragging.y,
      item
    )
  }

  if (!mouseDownCoords && !monsters.dragging) {
    const hex = pointToHex(event.pageX, event.pageY)
    if (
      hex.x !== monsters.mouseHover.x ||
      hex.y !== monsters.mouseHover.y
    ) {
      monsters.mouseHover.x = hex.x
      monsters.mouseHover.y = hex.y

      const item = board.items.find(i => hex.x === i.ch.x && hex.y === i.ch.y)
      if (!item) {
        if (monsters.mouseHover.item) {
          monsters.mouseHover.item = false
          clearPlayerControl()
        }
      } else if (item !== monsters.mouseHover.item) {
        monsters.mouseHover.item = item
        clearPlayerControl()
        if (item.type === 'player') {
          createPlayerControl(item)
        }
      }
    }
  }
}

export const monstersDocumentMouseup = event => {
  if (monsters.dragging) {
    const item = board.items[monsters.hoverItem]
    const closest = findSnap(
      item,
      event.pageX - monsters.dragging.x,
      event.pageY - monsters.dragging.y
    )

    if (closest.closestPoint) {
      const scenarioHex = board.scenario.hexes.find(h => (
        h.x === closest.closestHex.x && h.y === closest.closestHex.y
      ))

      if (!scenarioHex) {
        board.items.splice(monsters.hoverItem, 1)
        itemsElement.removeChild(
          itemsElement.children[monsters.hoverItem]
        )
      } else {
        item.x = closest.closestPoint.x
        item.y = closest.closestPoint.y
        item.ch = closest.closestHex
        renderDOM()

        placeItem(item)
      }
    }
  }
}

const placeItem = item => {
  const prevItemIndex = board.items.findIndex(i => (
    i !== item && i.ch.x === item.ch.x && i.ch.y === item.ch.y
  ))

  if (prevItemIndex > -1) {
    board.items.splice(prevItemIndex, 1)
    itemsElement.removeChild(
      itemsElement.children[prevItemIndex]
    )
  }
}

export const monstersDocumentKeydown = event => {
  if (
    !mouseDownCoords &&
    !monsters.dragging &&
    monsters.mouseHover.x &&
    monsters.mouseHover.y &&
    board.scenario.hexes.find(hex => (
      hex.x === monsters.mouseHover.x && hex.y === monsters.mouseHover.y
    ))
  ) {
    let itemName

    switch (event.key) {
      case 'q':
        itemName = 'obstacle'
        break
      case 'w':
        itemName = 'player'
        break
      // case 'e':
      //   itemName = 'difficult'
      //   break
      case 'r':
        itemName = 'monster'
        break
      // case 't':
      //   itemName = 'trap'
      //   break
    }

    if (itemName) {
      const prevItemIndex = board.items.findIndex(boardItem => (
        boardItem.ch.x === monsters.mouseHover.x && boardItem.ch.y === monsters.mouseHover.y
      ))

      if (
        prevItemIndex > -1 &&
        board.items[prevItemIndex].type === itemName
      ) {
        board.items.splice(prevItemIndex, 1)
        itemsElement.removeChild(
          itemsElement.children[prevItemIndex]
        )
      } else {
        const point = toPoint(monsters.mouseHover)
        const item = createItem(point.x, point.y, itemName)
        const closest = findSnap(item, item.x, item.y)

        item.ch = closest.closestHex

        const boardItems = document.getElementById('items')
        boardItems.appendChild(item.element)
        board.items.push(item)

        placeItem(item)
        deactivateMonster()
      }
    }
  }
}

const renderDOM = () => {
  const item = board.items[monsters.hoverItem]
  const draggedItemStyle = item.element.style
  draggedItemStyle.left = `${item.x}px`
  draggedItemStyle.top = `${item.y}px`
}
