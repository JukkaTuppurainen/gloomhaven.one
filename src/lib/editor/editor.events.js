import {
  boardChange,
  scenario
}                from './editor'
import {
  board,
  Grid
}                from '../board/board'
import {
  boardClick,
  boardMousemove
}                from '../board/board.events'
import {render}  from '../../index'


// @tmp
window.board = board

const removeHex = hexToRemove => {
  const hexFilter = filterHex => !(filterHex.x === hexToRemove.x && filterHex.y === hexToRemove.y)
  board.scenario.hexes = board.scenario.hexes.filter(hexFilter)
  board.scenario.wallHexes = board.scenario.wallHexes.filter(hexFilter)
}

const editBoard = eventHex => {

  switch (board.editor.mode) {
    case 'remove':
      removeHex(eventHex)
      break
    case 'tile':
      removeHex(eventHex)
      board.scenario.hexes.push(eventHex)
      break
    case 'wall':
      removeHex(eventHex)
      board.scenario.wallHexes.push(eventHex)
      break
  }

  boardChange()

  scenario.blueprint = {
    hexes: board.scenario.hexes,
    wallHexes: board.scenario.wallHexes
  }

  render()
}

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

  boardMousemove(event)
}

export const editorMouseup = () => {
  if (typeof board.editor.mode !== 'undefined') {
    board.editor.mousedown = false
  }
}
