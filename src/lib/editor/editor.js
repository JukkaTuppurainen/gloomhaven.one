import controlHTML    from './editor.controls.html'
import {
  editorClick,
  editorMousedown,
  editorMousemove,
  editorMouseup
}                     from './editor.events'
import {board}        from '../board/board'
import {scenarioLoad} from '../board/board.scenarioLoad'
import tileBitmap     from '../../scenarios/editor.jpg'


const img = new Image()
img.onload = () => {
  /*
    Patterns:
    0 - Floor
    1 - Wall corner
    2 - N-S wall
    3 - SW-NE wall
    4 - NW-SE wall
    5 - N-S wall (east)
    6 - N-S wall (west)
    7 - SW-NE wall (north)
    8 - SW-NE wall (south)
    9 - NW-SE wall (north)
    10 - NW-SE wall (south)
   */

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

  scenario.style.hexes.fill = patterns[0]
  scenario.style.wallHexes.fill = hex => hex.direction ? patterns[hex.direction] : patterns[1]
}
img.src = tileBitmap

const setWallPattern = (wallHex, left, right, patternLeft, patternRight, patternBoth) => {
  const onLeftSide = board.grid.neighborsOf(wallHex, left).filter(
    hex => board.scenario.hexes.find(tileHex => hex.x === tileHex.x && hex.y === tileHex.y)
  )
  const onRightSide = board.grid.neighborsOf(wallHex, right).filter(
    hex => board.scenario.hexes.find(tileHex => hex.x === tileHex.x && hex.y === tileHex.y)
  )

  if (onLeftSide.length && !onRightSide.length) {
    wallHex.direction = patternLeft
  } else if (!onLeftSide.length && onRightSide.length) {
    wallHex.direction = patternRight
  } else {
    wallHex.direction = patternBoth
  }
}

export const boardChange = () => {
  scenario.blueprint.wallHexes.forEach(wallHex => {
    let adjacentInDirection
    let adjacentWalls = []
    for (let i = 0; i < 6; ++i) {
      adjacentInDirection = board.grid.neighborsOf(wallHex, i)
      if (adjacentInDirection.length) {
        let wallHex = board.scenario.wallHexes.find(
          hex => hex.x === adjacentInDirection[0].x && hex.y === adjacentInDirection[0].y
        )
        if (wallHex) {
          adjacentWalls.push(i)
        }
      }
    }

    if ((
      adjacentWalls.length === 1 &&
      (adjacentWalls[0] === 1 || adjacentWalls[0] === 4)
    ) || (
      adjacentWalls.length === 2 &&
      adjacentWalls.includes(1) &&
      adjacentWalls.includes(4)
    )) {
      setWallPattern(wallHex, [2, 3], [0, 5], 5, 6, 2)
    }

    else if ((
      adjacentWalls.length === 1 &&
      (adjacentWalls[0] === 2 || adjacentWalls[0] === 5)
    ) || (
      adjacentWalls.length === 2 &&
      adjacentWalls.includes(2) &&
      adjacentWalls.includes(5)
    )) {
      setWallPattern(wallHex, [0, 1], [3, 4], 7, 8, 3)
    }

    else if ((
      adjacentWalls.length === 1 &&
      (adjacentWalls[0] === 0 || adjacentWalls[0] === 3)
    ) || (
      adjacentWalls.length === 2 &&
      adjacentWalls.includes(0) &&
      adjacentWalls.includes(3)
    )) {
      setWallPattern(wallHex, [1, 2], [4, 5], 9, 10, 4)
    }

    else {
      wallHex.direction = 1
    }
  })
}

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
      fill: '#000'
    },
    noHexes: {
      line: '#222'
    },
    wallHexes: {
      fill: '#000'
    },
    hexHover: '#32005080',
    noHexHover: '#50003280'
  }
}
