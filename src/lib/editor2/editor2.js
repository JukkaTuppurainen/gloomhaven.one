import editor2HTML               from './editor2.html'
import editor2ControlsHTML       from './editor2.controls.html'
import {
  createPieceBtnClick,
  tileListBtnClick
}                                from './editor2.controls'
import {pieceList}               from './editor2.pieces'
import {
  board,
  cornersCoordinates,
  Grid,
  hexHeight,
  hexWidth
}                                from '../board/board'
import {boardClick}              from '../board/board.events'
import {scenarioLoad}            from '../board/board.scenarioLoad'
import {generateBlueprintString} from '../editor/editor.functions'
import {toPoint}                 from '../hexUtils'
import {makeWall}                from '../makeWall'
import {render}                  from '../../index'


const editorGridDefaultHeight = 40
const editorGridDefaultWidth = 40

let mouseDownCoords = false

export const startDragging = (x, y) => {
  editor2.dragging = {x, y}
  delete board.playerHex
  editor2.style.hexHover = '#0000'
  editor2.style.noHexHover = '#0000'
  render()
}

const stopDragging = () => {
  editor2.style.hexHover = '#32005080'
  editor2.style.noHexHover = '#50003280'
  editor2.dragging = false
  render()
}

const editor2documentClick = event => {
  mouseDownCoords = false
  if (editor2.dragging !== false) {
    stopDragging()
  } else {
    boardClick(event)
  }
}

const editor2documentMousedown = event => {
  if (editor2.hoverPiece !== null) {
    mouseDownCoords = {
      x: event.pageX,
      y: event.pageY
    }

    render()
  }
}

const minMouseMoveDeltaToConsiderClickAsDragging = 20

const editor2documentMousemove = event => {
  if (mouseDownCoords) {
    let deltaX = event.pageX - mouseDownCoords.x
    let deltaY = event.pageY - mouseDownCoords.y
    if (
      !editor2.dragging &&
      editor2.hoverPiece !== false && (
        deltaX > minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaX < -minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaY > minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaY < -minMouseMoveDeltaToConsiderClickAsDragging
      )
    ) {
      startDragging(
        event.pageX - editor2pieces[editor2.hoverPiece].x,
        event.pageY - editor2pieces[editor2.hoverPiece].y
      )
    }
  }
  if (editor2.dragging) {
    editor2pieces[editor2.hoverPiece].x = event.pageX - editor2.dragging.x
    editor2pieces[editor2.hoverPiece].y = event.pageY - editor2.dragging.y
    renderDOM()
  } else {
    editor2.hoverPiece = null
    editor2pieces.forEach((piece, i) => {
      if (
        event.pageX >= piece.x &&
        event.pageX <= piece.x + piece.pxW &&
        event.pageY >= piece.y &&
        event.pageY <= piece.y + piece.pxH
      ) {
        editor2.hoverPiece = i
      }
    })
  }
}

export const generateEditor2board = () => {
  const hexesCenterCoordinates = []

  if (editor2pieces.length) {
    const center = {
      x: hexWidth / 2,
      y: hexHeight / 2
    }

    editor2pieces.forEach(piece => {
      piece.pieceHexes.forEach(pieceHex => {
        const centerCoordinates = toPoint(pieceHex)
        centerCoordinates.x += piece.x + center.x
        centerCoordinates.y += piece.y + center.y
        if (pieceHex.metaThinwalls) {
          centerCoordinates.metaThinwalls = pieceHex.metaThinwalls
        }

        hexesCenterCoordinates.push(centerCoordinates)
      })
    })
  }

  delete board.playerHex
  board.scenario.hexes.length = 0
  board.scenario.thinWalls.length = 0

  hexesCenterCoordinates.forEach(hexCenterCoordinates => {
    const hexFromPoint = Grid.pointToHex(hexCenterCoordinates.x, hexCenterCoordinates.y)
    board.scenario.hexes.push(hexFromPoint)

    if (hexCenterCoordinates.metaThinwalls) {
      hexCenterCoordinates.metaThinwalls.forEach(metaThinWall => {
        makeWall(
          hexFromPoint,
          metaThinWall,
          metaThinWall === 5 ? 0 : metaThinWall + 1,
          true
        )
      })
    }
  })

  editor2.blueprint = generateBlueprintString()
  scenarioLoad(editor2)
}

const editor2documentMouseup = event => {
  if (editor2.dragging) {
    const piece = editor2pieces[editor2.hoverPiece]
    const pieceFirstHexCorners = cornersCoordinates.map(corner => corner.add(piece.grid[0].toPoint()))

    const x = event.pageX + pieceFirstHexCorners[0].x - editor2.dragging.x
    const y = event.pageY + pieceFirstHexCorners[0].y - editor2.dragging.y

    let distance
    let shortestDistance
    let closestPoint

    board.grid.forEach(hex => {
      if (
        hex.x > 0 &&
        hex.y > 0 &&
        hex.x < editorGridDefaultWidth - piece.w &&
        hex.y < editorGridDefaultHeight - piece.h
      ) {
        const point = toPoint(hex)
        const corner0 = {
          x: cornersCoordinates[0].x + point.x,
          y: cornersCoordinates[0].y + point.y
        }
        distance = Math.sqrt(((x - corner0.x) ** 2) + ((y - corner0.y) ** 2))

        if (!shortestDistance || distance < shortestDistance) {
          shortestDistance = distance
          closestPoint = point
        }
      }
    })

    if (closestPoint) {
      piece.x = closestPoint.x + 38
      piece.y = closestPoint.y + 24
      renderDOM()
    }
    generateEditor2board()
  }
}

const renderDOM = () => {
  const piece = editor2pieces[editor2.hoverPiece]
  const draggedPieceStyle = piece.element.style
  draggedPieceStyle.left = `${piece.x}px`
  draggedPieceStyle.top = `${piece.y}px`
}

export const editor2pieces = []

export const editor2 = {
  blueprint: '',
  dragging: false,
  events: {
    click: editor2documentClick
  },
  load: () => {
    // Add editor2 html which contains the draggable pieces
    const editor2 = document.createElement('div')
    editor2.id = 'editor2'
    editor2.innerHTML = editor2HTML
    document.body.appendChild(editor2)

    // Add controls for editor2
    const editor2controls = document.createElement('div')
    editor2controls.id = 'editor2controls'
    editor2controls.innerHTML = editor2ControlsHTML
    document.body.appendChild(editor2controls)

    // Add event listener and list of available pieces
    const tileButtons = document.getElementById('tile-btns')
    tileButtons.addEventListener('click', createPieceBtnClick)
    Object.keys(pieceList).forEach(key => {
      const addPieceBtn = document.createElement('button')
      addPieceBtn.innerText = key
      addPieceBtn.dataset['piece'] = key
      tileButtons.appendChild(addPieceBtn)
    })

    // Add event listener for list of used pieces
    document.getElementById('tile-list').addEventListener('click', tileListBtnClick)

    document.addEventListener('mousedown', editor2documentMousedown)
    document.addEventListener('mousemove', editor2documentMousemove)
    document.addEventListener('mouseup', editor2documentMouseup)
    document.body.classList.add('editor-open')
  },
  unload: () => {
    editor2pieces.length = 0
    document.body.removeChild(document.getElementById('editor2'))
    document.body.removeChild(document.getElementById('editor2controls'))
    document.removeEventListener('mousedown', editor2documentMousedown)
    document.removeEventListener('mousemove', editor2documentMousemove)
    document.removeEventListener('mouseup', editor2documentMouseup)
    document.body.classList.remove('editor-open')
  },
  grid: {
    height: editorGridDefaultHeight,
    width: editorGridDefaultWidth
  },
  style: {
    // hexes: {
    //   fill: '#000'
    // },
    // noHexes: {
    //   line: hex => (
    //     hex.x === 0 ||
    //     hex.y === 0 ||
    //     hex.x === board.gridSize.width - 1 ||
    //     hex.y === board.gridSize.height - 1
    //   ) ? '#0000' : '#222'
    // },
    // wallHexes: {
    //   fill: '#00f4'
    // },
    hexHover: '#32005080',
    noHexHover: '#50003280',
    // thinWalls: {
    //   line: '#f00',
    //   width: 8
    // }
  }
}
