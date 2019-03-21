import {editBoard} from './editor.functions'
import {
  board,
  Grid
}                  from '../board/board'
import {
  boardClick,
  boardMousemove
}                  from '../board/board.events'
import {render}    from '../../index'


/*
  This file is for editor's canvas keyboard and mouse events
 */

export const editorClick = event => {
  if (typeof board.editor.mode === 'undefined') {
    boardClick(event)
  } else {
    const clickHex = board.grid.get(Grid.pointToHex(event.layerX, event.layerY))
    if (clickHex) {
      editBoard(clickHex)
    }
  }
}

export const editorKeyboardShortcutKeydown = event => {
  switch (event.key) {
    case 't':
      document.querySelector('[data-editor-mode="tile"]').click()
      break
    case 'r':
      document.querySelector('[data-editor-mode="remove"]').click()
      break
    case 'h':
      document.querySelector('[data-editor-mode="thin"]').click()
      break
    case 'e':
      document.querySelector('[data-editor-mode="removethin"]').click()
      break
  }
}

export const editorMousedown = () => {
  if (typeof board.editor.mode !== 'undefined') {
    board.editor.mousedown = true
  }
}

export const editorMousemove = event => {
  if (
    board.editor.mousedown &&
    typeof board.editor.mode !== 'undefined'
  ) {
    const moveHex = board.grid.get(Grid.pointToHex(event.layerX, event.layerY))

    if (
      moveHex && (
        moveHex.x !== board.editor.previousEditHex.x ||
        moveHex.y !== board.editor.previousEditHex.y
      )
    ) {
      editBoard(moveHex)
      board.editor.previousEditHex = moveHex
    }
  }

  if (
    board.editor.mode === 'thin' ||
    board.editor.mode === 'removethin'
  ) {
    const previousEditorHover = board.editor.hover
    const hoverHex = board.grid.get(Grid.pointToHex(event.layerX, event.layerY))

    if (hoverHex) {
      const point = hoverHex.toPoint()
      const adjust = board.settings.hexSize
      const corners = hoverHex.corners().map(corner => corner.add(point))

      point.x += adjust
      point.y += adjust / 2 * Math.sqrt(3)

      const side = (
        Math.atan2(
          point.y - event.layerY,
          point.x - event.layerX
        ) + Math.PI
      ) / Math.PI * 3 | 0

      const nextSide = side < 5 ? side + 1 : 0

      board.editor.hover = {
        hex: hoverHex,
        side,
        sideWallCorners: {
          x1: corners[side].x,
          y1: corners[side].y,
          x2: corners[nextSide].x,
          y2: corners[nextSide].y
        }
      }

      if (
        !previousEditorHover ||
        previousEditorHover.side !== side
      ) {
        render()
      }
    }
  }

  boardMousemove(event)
}

export const editorMouseup = () => {
  if (typeof board.editor.mode !== 'undefined') {
    board.editor.mousedown = false
  }
}
