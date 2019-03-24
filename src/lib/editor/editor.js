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
import {scenarioLoad} from '../board/board.scenarioLoad'
import tileBitmap     from '../../scenarios/editor.jpg'


let defaultHeight = 8
let defaultWidth = 10

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
      const patterns = ['#000']
      const oCanvas = new OffscreenCanvas(180, 104)
      const oCtx = oCanvas.getContext('2d')

      for (let i = 0; i < 13; ++i) {
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
      editor.style.wallHexes.fill = hex => patterns[hex.direction] || 2
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
