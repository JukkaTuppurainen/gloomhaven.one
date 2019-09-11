import {monsters}         from './monsters'
import {
  activateMonster,
  clearPlayerControl,
  createItem,
  createPlayerControl,
  deactivateMonster,
  deleteItem,
  placeItem,
  startDraggingItem,
  stopDragging,
  updateActivation
}                         from './monsters.functions'
import {itemsList}        from './monsters.items'
import {board}            from '../board/board'
import {findSnap}         from '../board/board.functions'
import {updateDragShadow} from '../editor/editor.functions'
import {render}           from '../index'
import {
  pointToHex,
  toPoint
}                         from '../lib/hexUtils'


const minMouseMoveDeltaToConsiderClickAsDragging = 20
let mouseDownCoords = false

export const monstersClick = event => {
  mouseDownCoords = false
  if (monsters.dragging) {
    stopDragging()
  } else {
    const clickHex = pointToHex(event.pageX - board.pxOffset, event.pageY)
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

export const monstersMousedown = event => {
  if (monsters.dragging === false) {
    const hexFromPoint = pointToHex(event.pageX - board.pxOffset, event.pageY)
    const itemsInHex = board.items.filter(i =>
      i.ch.x === hexFromPoint.x && i.ch.y === hexFromPoint.y
    )

    if (itemsInHex.length) {
      const hoverItem = itemsInHex[
        itemsInHex.length > 1
          ? itemsInHex[0].stacks ? 0 : 1
          : 0
      ]

      monsters.hoverItem = board.items.findIndex(i => i === hoverItem)

      mouseDownCoords = {
        x: event.pageX,
        y: event.pageY
      }

      clearPlayerControl()
      render()
    }
  }
}

export const monstersMousemove = event => {
  let adjustedEventPageX = event.pageX - board.pxOffset

  if (mouseDownCoords) {
    const deltaX = event.pageX - mouseDownCoords.x
    const deltaY = event.pageY - mouseDownCoords.y

    if (
      !monsters.dragging &&
      monsters.hoverItem > -1 && (
        deltaX > minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaX < -minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaY > minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaY < -minMouseMoveDeltaToConsiderClickAsDragging
      )
    ) {
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
    const hex = pointToHex(adjustedEventPageX, event.pageY)
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

export const monstersMouseout = event => {
  monstersMouseup(event)
  monstersClick(event)
}

export const monstersMouseup = event => {
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
        deleteItem(monsters.hoverItem)
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

    switch (event.key.toLowerCase()) {
      case 'q':
        itemName = 'obstacle'
        break
      case 'w':
        itemName = 'player'
        break
      case 'e':
        itemName = 'difficult'
        break
      case 'r':
        itemName = 'monster'
        break
      case 't':
        itemName = 'trap'
    }

    if (itemName) {
      const itemStacks = itemsList[itemName].stacks
      const prevItemIndex = board.items.findIndex(boardItem => (
        boardItem.ch.x === monsters.mouseHover.x &&
        boardItem.ch.y === monsters.mouseHover.y &&
        boardItem.stacks === itemStacks
      ))

      if (
        prevItemIndex > -1 &&
        board.items[prevItemIndex].type === itemName
      ) {
        deleteItem(prevItemIndex)
        updateActivation()

        if (!itemStacks) {
          const prevStackedItemIndex = board.items.findIndex(boardItem => (
            boardItem.ch.x === monsters.mouseHover.x &&
            boardItem.ch.y === monsters.mouseHover.y &&
            boardItem.stacks
          ))

          if (prevStackedItemIndex > -1) {
            board.items[prevStackedItemIndex].element.classList.remove('item-stacked')
          }
        }
      } else {
        const point = toPoint(monsters.mouseHover)
        const item = createItem(point.x, point.y, itemName)
        const closest = findSnap(item, item.x, item.y)

        item.ch = closest.closestHex

        const boardItems = document.getElementById('items')
        boardItems.appendChild(item.element)
        board.items.push(item)

        placeItem(item)
        updateActivation()
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
