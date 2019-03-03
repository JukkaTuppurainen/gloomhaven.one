import controlHTML    from './editor.controls.html'
import {
  editorClick,
  editorMousedown,
  editorMousemove,
  editorMouseup
}                     from './editor.events'
import {board}        from '../board/board'
import {scenarioLoad} from '../board/board.scenarioLoad'


const gridSizeInputChange = () => {
  let newHeight = parseInt(document.getElementById('grid-height').value, 10)
  let newWidth = parseInt(document.getElementById('grid-width').value, 10)
  if (newHeight > 100) {
    newHeight = 100
  }
  if (newWidth > 100) {
    newWidth = 100
  }
  scenario.grid = {
    height: newHeight,
    width: newWidth
  }

  const sizeFilter = hex => !(hex.x >= newWidth || hex.y >= newHeight)
  scenario.blueprint.hexes = scenario.blueprint.hexes.filter(sizeFilter)
  scenario.blueprint.wallHexes = scenario.blueprint.wallHexes.filter(sizeFilter)

  scenarioLoad(scenario)
}

const editorModeButtonClick = event => {
  const active = event.target.classList.contains('active')
  document.querySelectorAll('[data-editor-mode]').forEach(n => n.classList.remove('active'))

  if (!active) {
    event.target.classList.add('active')
    board.editor.mode = event.target.dataset['editorMode']
    delete board.playerHex
  } else {
    delete board.editor.mode
    delete board.editor.mousedown
    board.editor.previousEditHex = {x: null, y: null}
    scenarioLoad(scenario)
  }
}

const editorKeyboardShortcutKeydown = event => {
  switch (event.key) {
    case 't':
      document.querySelector('[data-editor-mode="tile"]').click()
      break
    case 'r':
      document.querySelector('[data-editor-mode="remove"]').click()
      break
    case 'w':
      document.querySelector('[data-editor-mode="wall"]').click()
      break
  }
}

let defaultHeight = 8
let defaultWidth = 12

export const scenario = {
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
    gh.value = scenario.grid.height
    gh.addEventListener('change', gridSizeInputChange)

    const gw = document.getElementById('grid-width')
    gw.value = scenario.grid.width
    gw.addEventListener('change', gridSizeInputChange)

    document.querySelectorAll('[data-editor-mode]').forEach(n => {
      n.addEventListener('click', editorModeButtonClick)
    })

    document.addEventListener('keydown', editorKeyboardShortcutKeydown)
    document.body.classList.add('editor-open')
  },
  unload: () => {
    document.body.removeChild(document.getElementById('editor'))
    document.body.classList.remove('editor-open')
    document.removeEventListener('keydown', editorKeyboardShortcutKeydown)
    delete board.editor
  },
  grid: {
    height: defaultHeight,
    width: defaultWidth
  },
  style: {
    hexes: {
      fill: '#444',
      line: '#ccc'
    },
    noHexes: {
      line: '#222'
    },
    wallHexes: {
      fill: '#222',
      line: '#888'
    },
    hexHover: '#32005080',
    noHexHover: '#50003280'
  }
}
