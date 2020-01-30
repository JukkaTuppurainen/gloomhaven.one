import {monsters}         from './monsters'
import {
  activateMonster,
  clearPlayerControl,
  createItem,
  createPlayerControl,
  deactivateMonster,
  deleteItem,
  generateItemsLayoutString,
  placeItem,
  startDraggingItem,
  stopDragging,
  updateActivation
}                         from './monsters.functions'
import {itemsList}        from './monsters.items'
import {board}            from '../board/board'
import {findSnap}         from '../board/board.functions'
import {updateDragShadow} from '../editor/editor.functions'
import {
  pointToHex,
  toPoint
}                         from '../lib/hexUtils'
import {render}           from '../renderer/render'


const minMouseMoveDeltaToConsiderClickAsDragging = 20
let mouseDownCoords = false

export const monstersClick = event => {
  mouseDownCoords = false
  if (monsters.dragging) {
    stopDragging()
  } else {
    const clickHex = pointToHex(event.pageX - board.pxOffset, event.pageY)
    const clickMonster = board.items.find(item => (
      item.ch.x === clickHex.x &&
      item.ch.y === clickHex.y &&
      item.type === 'monster'
    ))

    if (clickMonster) {
      if (clickMonster.active) {
        deactivateMonster(clickMonster)
      } else {
        const prevActiveItem = board.items.find(item => item.active)
        if (prevActiveItem) {
          deactivateMonster(prevActiveItem)
        }
        activateMonster(clickMonster)
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
          ? itemsInHex[0].stacks > itemsInHex[1].stacks ? 0 : 1
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

      const player = board.items.find(i =>
        hex.x === i.ch.x &&
        hex.y === i.ch.y &&
        i.type === 'player'
      )

      if (monsters.mouseHover.item && (!player || player !== monsters.mouseHover.item)) {
        monsters.mouseHover.item = false
        clearPlayerControl()
      }

      if (player) {
        monsters.mouseHover.item = player
        createPlayerControl(player)
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

      generateItemsLayoutString()
    }
  }
}

const itemShortcuts = new Map([
  ['q', 'obstacle'],
  ['w', 'player'],
  ['e', 'difficult'],
  ['r', 'monster'],
  ['t', 'trap'],
])

export const monstersDocumentKeydown = event => {
  if (
    !event.altKey &&
    !event.ctrlKey &&
    !mouseDownCoords &&
    !monsters.dragging &&
    monsters.mouseHover.x &&
    monsters.mouseHover.y &&
    board.scenario.hexes.some(hex => (
      hex.x === monsters.mouseHover.x && hex.y === monsters.mouseHover.y
    ))
  ) {
    let itemName = itemShortcuts.get(event.key.toLowerCase())

    if (itemName) {
      const itemStacks = itemsList[itemName].stacks
      const prevItemIndex = board.items.findIndex(boardItem => (
        boardItem.ch.x === monsters.mouseHover.x &&
        boardItem.ch.y === monsters.mouseHover.y &&
        boardItem.stacks & itemStacks
      ))

      if (
        prevItemIndex > -1 &&
        board.items[prevItemIndex].type === itemName
      ) {
        deleteItem(prevItemIndex)
        updateActivation()

        const otherItemIndex = board.items.findIndex(boardItem => (
          boardItem.ch.x === monsters.mouseHover.x &&
          boardItem.ch.y === monsters.mouseHover.y
        ))

        if (otherItemIndex > -1) {
          board.items[otherItemIndex].element.classList.remove('item-stacked')
        }
      } else {
        const point = toPoint(monsters.mouseHover)
        const item = createItem(point.x, point.y, itemName)
        if (item) {
          const closest = findSnap(item, item.x, item.y)

          item.ch = closest.closestHex

          document.getElementById('items').appendChild(item.element)
          board.items.push(item)

          placeItem(item)
          updateActivation()
        }
      }

      generateItemsLayoutString()
    }
  }
}

const renderDOM = () => {
  const item = board.items[monsters.hoverItem]
  const draggedItemStyle = item.element.style
  draggedItemStyle.left = `${item.x}px`
  draggedItemStyle.top = `${item.y}px`
}
