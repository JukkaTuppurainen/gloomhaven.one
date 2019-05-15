import tileBitmap     from './editor.jpg'
import {
  editorClear,
  editorModeButtonClick,
  gridSizeInputChange
}                     from './editor.controls'
import controlHTML    from './editor.controls.html'
import {
  editorClick,
  editorKeyboardShortcutKeydown,
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
import {render}       from '../../index'


const editorGridDefaultHeight = 20
const editorGridDefaultWidth = 20

export const editor = {
  blueprint: '',
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
      const patterns = ['#000']
      const oCanvas = document.createElement('canvas')
      oCanvas.width = 180
      oCanvas.height = 104
      const oCtx = oCanvas.getContext('2d')

      for (let i = 0; i < 19; ++i) {
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

      editor.style.hexes.fill = patterns[1]
      editor.style.wallHexes.fill = hex => patterns[hex.direction]
      render()
    }
    img.src = tileBitmap

    if (
      window.location.hash &&
      window.location.hash.substr(0, 2) === '#:'
    ) {
      editor.blueprint = window.location.hash.substr(2)
    }

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
    height: editorGridDefaultHeight,
    width: editorGridDefaultWidth
  },
  style: {
    hexes: {
      fill: '#000'
    },
    noHexes: {
      line: hex => (
        hex.x === 0 ||
        hex.y === 0 ||
        hex.x === board.gridSize.width - 1 ||
        hex.y === board.gridSize.height - 1
      ) ? '#0000' : '#222'

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
