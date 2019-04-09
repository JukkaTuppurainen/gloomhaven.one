import {editor}       from './editor'
import {
  removeHex,
  updateBlueprint
}                     from './editor.functions'
import {board}        from '../board/board'
import {scenarioLoad} from '../board/board.scenarioLoad'
import {render}       from '../../index'


/*
  This file is for editor control panel related stuff
 */

// Current limit from blueprint string format
const maxBoardSize = 54

export const editorClear = () => {
  editor.blueprint.hexes = []
  editor.blueprint.thinWalls = []

  scenarioLoad(editor)
}

export const editorModeButtonClick = event => {
  const active = event.target.classList.contains('active')
  document.querySelectorAll('[data-editor-mode]').forEach(n => n.classList.remove('active'))
  delete board.editor.hover

  if (!active) {
    event.target.classList.add('active')
    board.editor.mode = event.target.dataset['editorMode']
    delete board.playerHex
    board.scenario.wallHexes = []
    document.querySelectorAll('input').forEach(n => n.setAttribute('disabled', true))
  } else {
    delete board.editor.mode
    delete board.editor.mousedown
    board.editor.previousEditHex = {x: null, y: null}
    document.querySelectorAll('input').forEach(n => n.removeAttribute('disabled'))
    scenarioLoad(editor)
  }

  render()
}

const getInputValue = (inputId, prevValue) => {
  let inputElement = document.getElementById(inputId)
  let value = inputElement.value

  value = parseInt(value, 10)

  if (value > maxBoardSize) {
    value = maxBoardSize
    inputElement.value = maxBoardSize
  } else if (!value) {
    value = prevValue
    inputElement.value = prevValue
  }

  return value
}

export const gridSizeInputChange = () => {
  let newHeight = getInputValue('grid-height', editor.grid.height)
  let newWidth = getInputValue('grid-width', editor.grid.width)

  editor.grid = {
    height: newHeight,
    width: newWidth
  }

  board.scenario.hexes.forEach(hex => {
    if (hex.x > newWidth - 2 || hex.y > newHeight - 2) {
      removeHex(hex)
    }
  })

  updateBlueprint()

  delete board.playerHex

  scenarioLoad(editor)
}
