import {monsters}         from './monsters'
import {
  startDraggingItem,
  stopDragging
}                         from './monsters.functions'
import {board}            from '../board/board'
import {findSnap}         from '../board/board.functions'
import {render}           from '../index'
import {pointToHex}       from '../lib/hexUtils'
import {updateDragShadow} from '../editor/editor.functions'


const itemsElement = document.getElementById('items')
const minMouseMoveDeltaToConsiderClickAsDragging = 20
let mouseDownCoords = false

export const monstersDocumentClick = () => {
  mouseDownCoords = false
  if (monsters.dragging) {
    stopDragging()
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
    }
  }
}

const renderDOM = () => {
  const item = board.items[monsters.hoverItem]
  const draggedItemStyle = item.element.style
  draggedItemStyle.left = `${item.x}px`
  draggedItemStyle.top = `${item.y}px`
}
