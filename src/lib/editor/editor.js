import controlHTML    from './editor.controls.html'
import {
  editorClick,
  editorMousedown,
  editorMousemove,
  editorMouseup
}                     from './editor.events'
import {
  updateWallHexDirections
}                     from './updateWallHexDirection'
import {
  addAction,
  removeAction
}                     from '../actions'
import {board}        from '../board/board'
import {scenarioLoad} from '../board/board.scenarioLoad'
import {render}       from '../../index'
import tileBitmap     from '../../scenarios/editor.jpg'


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

const gridSizeInputChange = () => {
  let newHeight = getInputValue('grid-height', editor.grid.height)
  let newWidth = getInputValue('grid-width', editor.grid.width)

  editor.grid = {
    height: newHeight,
    width: newWidth
  }

  const blueprintHexes = editor.blueprint.hexes
  const newBlueprintHexes = []
  for (let i = 0; i < blueprintHexes.length; i += 2) {
    if (
      blueprintHexes[i] < newWidth - 1 &&
      blueprintHexes[i + 1] < newHeight - 1
    ) {
      newBlueprintHexes.push(
        blueprintHexes[i],
        blueprintHexes[i + 1]
      )
    }
  }

  if (newBlueprintHexes.length < blueprintHexes.length) {
    editor.blueprint.hexes = newBlueprintHexes
  }

  scenarioLoad(editor)
}

const editorClear = () => {
  editor.blueprint.hexes = []
  editor.blueprint.thinWalls = []

  scenarioLoad(editor)
}

const editorModeButtonClick = event => {
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

const editorKeyboardShortcutKeydown = event => {
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

let defaultHeight = 8
let defaultWidth = 12

export const editor = {
  blueprint: {
    hexes: [],
    wallHexes: [],
    thinWalls: []
  },
  events: {
    click: editorClick,
    mousedown: editorMousedown,
    mousemove: editorMousemove,
    mouseup: editorMouseup
  },
  load: () => {
    board.editor = {
      mousedown: false,
      previousEditHex: {x: null, y: null}
    }

    const controls = document.createElement('div')
    controls.id = 'editor'
    controls.innerHTML = controlHTML

    document.body.appendChild(controls)

    const gh = document.getElementById('grid-height')
    gh.value = editor.grid.height
    gh.addEventListener('change', gridSizeInputChange)

    const gw = document.getElementById('grid-width')
    gw.value = editor.grid.width
    gw.addEventListener('change', gridSizeInputChange)

    document.querySelectorAll('[data-editor-mode]').forEach(n => {
      n.addEventListener('click', editorModeButtonClick)
    })

    document.getElementById('editor-clear').addEventListener('click', editorClear)

    document.addEventListener('keydown', editorKeyboardShortcutKeydown)
    document.body.classList.add('editor-open')

    const img = new Image()
    img.onload = () => {
      const patterns = []
      const oCanvas = new OffscreenCanvas(180, 104)
      const oCtx = oCanvas.getContext('2d')

      for (let i = 0; i <= 10; ++i) {
        oCtx.drawImage(
          img,
          (i % 4) * 182,
          (i / 4 | 0) * 106,
          180,
          104,
          0,
          0,
          180,
          104
        )
        patterns.push(oCtx.createPattern(oCanvas, 'repeat'))
      }

      editor.style.hexes.fill = patterns[0]
      editor.style.wallHexes.fill = hex => hex.direction ? patterns[hex.direction] : patterns[1]
    }
    img.src = tileBitmap

    addAction('scenarioLoad', updateWallHexDirections)
  },
  unload: () => {
    document.body.removeChild(document.getElementById('editor'))
    document.body.classList.remove('editor-open')
    document.removeEventListener('keydown', editorKeyboardShortcutKeydown)
    delete board.editor
    removeAction('scenarioLoad', updateWallHexDirections)
  },
  grid: {
    height: defaultHeight,
    width: defaultWidth
  },
  style: {
    hexes: {
      fill: '#000'
    },
    noHexes: {
      line: '#222'
    },
    wallHexes: {
      fill: '#000'
    },
    hexHover: '#32005080',
    noHexHover: '#50003280',
    thinWalls: {
      line: '#000',
      width: 8
    }
  }
}
