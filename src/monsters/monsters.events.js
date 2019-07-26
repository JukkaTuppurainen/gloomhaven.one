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
let mouseHover = {}

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

const activateMonster = monster => {
  monster.active = true
  monster.element.classList.add('item-active')
}

const deactivateMonster = monster => {
  monster.active = false
  monster.element.classList.remove('item-active')
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
      hex.x !== mouseHover.x ||
      hex.y !== mouseHover.y
    ) {
      mouseHover.x = hex.x
      mouseHover.y = hex.y

      const item = board.items.find(i => hex.x === i.ch.x && hex.y === i.ch.y)
      if (!item) {
        if (mouseHover.item) {
          mouseHover.item = false
          clearPlayerControl()
        }
      } else if (item !== mouseHover.item) {
        mouseHover.item = item
        clearPlayerControl()
        if (item.type === 'player') {
          createPlayerControl(item)
        }
      }
    }
  }
}

const clearPlayerControl = () => {
  document.getElementById('ic').innerHTML = ''
}

const updateInitiative = value => {
  if (!mouseHover.item === false) {
    let newInitiative = mouseHover.item.initiative + value
    if (newInitiative < 1) {
      newInitiative = 1
    }
    if (newInitiative > 99) {
      newInitiative = 99
    }
    mouseHover.item.initiative = newInitiative
    mouseHover.item.element.children[1].innerText = mouseHover.item.initiative
  }
}

const createPlayerControl = item => {
  const playerControl = document.createElement('div')
  playerControl.className = 'icw'
  playerControl.innerHTML = '<button id="icd" class="pm"></button><button id="ici"  class="pm"></button>'
  playerControl.style.left = item.x - 5 + 'px'
  playerControl.style.top = item.y + 41 + 'px'
  document.getElementById('ic').appendChild(playerControl)

  document.getElementById('icd').addEventListener('click', () => {
    updateInitiative(-(Math.random() * 10 + 5 | 0))
  })
  document.getElementById('ici').addEventListener('click', () => {
    updateInitiative(Math.random() * 10 + 5 | 0)
  })
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
