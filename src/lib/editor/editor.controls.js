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
  } else {
    delete board.editor.mode
    delete board.editor.mousedown
    board.editor.previousEditHex = {x: null, y: null}
    scenarioLoad(editor)
  }

  render()
}

const getInputValue = (inputId, prevValue) => {
  let inputElement = document.getElementById(inputId)
  let value = inputElement.value

  value = parseInt(value, 10)

  if (value > 100) {
    value = 100
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

  const blueprintHexes = editor.blueprint.hexes
  const newBlueprintHexes = []
  let removesHappened = false

  for (let i = 0; i < blueprintHexes.length; i += 2) {
    if (
      blueprintHexes[i] < newWidth - 1 &&
      blueprintHexes[i + 1] < newHeight - 1
    ) {
      newBlueprintHexes.push(
        blueprintHexes[i],
        blueprintHexes[i + 1]
      )
    } else {
      removeHex(board.grid.get({x: blueprintHexes[i], y: blueprintHexes[i + 1]}))
      removesHappened = true
    }
  }

  if (removesHappened) {
    updateBlueprint()
  }

  if (newBlueprintHexes.length < blueprintHexes.length) {
    editor.blueprint.hexes = newBlueprintHexes
  }

  scenarioLoad(editor)
}
