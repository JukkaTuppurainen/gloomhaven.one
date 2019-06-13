import {editor}     from './editor'
import {
  updatePieceControlPositions
}                   from './editor.controls'
import {
  board,
  cornersCoordinates
}                   from '../board/board'
import {findSnap}   from '../board/board.functions'
import {
  clearScenario,
  scenarioLoad
}                   from '../board/board.scenarioLoad'
import {render}     from '../index'
import {
  addPoint,
  toPoint
}                   from '../lib/hexUtils'
import {resolveLOS} from '../lib/resolveLOS'


const toChar = n => String.fromCharCode(n + (n < 27 ? 96 : 38))

export const generateEditorBoard = () => {
  clearScenario()
  scenarioLoad(editor)
  generateBoardLayoutString()
}

const generateBoardLayoutString = () => {
  let layoutString = ''

  board.pieces.forEach(piece => {
    layoutString += piece.ch.x + toChar(piece.ch.y) + (piece.name === 'door' ? '0' : piece.name)
    if (piece.rotation > 0) {
      layoutString += toChar((piece.rotation + 1) / 60)
    }
  })

  board.skipHashChangeHandler = true
  window.location.hash = ':' + layoutString
}

export const startDragging = (x, y) => {
  delete board.playerHex
  resolveLOS()
  document.body.classList.add('editor-dragging')
  document.getElementById('editor-controls').style.display = 'none'
  editor.dragging = {x, y}
  render()
  const hoverPiece = board.pieces[editor.hoverPiece]
  const dragShadowElement = document.createElement('canvas')
  dragShadowElement.id = 'drag-shadow'
  dragShadowElement.height = hoverPiece.pxH
  dragShadowElement.width = hoverPiece.pxW

  const dragShadowCtx = dragShadowElement.getContext('2d')
  dragShadowCtx.fillStyle = '#f006'

  let outerEdges = []
  let x1
  let y1
  let x2
  let y2
  let prevLength

  dragShadowCtx.lineWidth = 2
  dragShadowCtx.setLineDash([5, 5]);
  dragShadowCtx.strokeStyle = '#fff'

  hoverPiece.pieceHexes.forEach(hex => {
    const corners = addPoint(cornersCoordinates, toPoint(hex))

    for (let i = 0; i < 6; ++i) {
      x1 = corners[i].x
      y1 = corners[i].y
      x2 = corners[i < 5 ? i + 1 : 0].x
      y2 = corners[i < 5 ? i + 1 : 0].y
      prevLength = outerEdges.length
      outerEdges = outerEdges.filter(edge => !(
        (edge.x1 === x1 && edge.x2 === x2 && edge.y1 === y1 && edge.y2 === y2) ||
        (edge.x1 === x2 && edge.x2 === x1 && edge.y1 === y2 && edge.y2 === y1)
      ))
      if (outerEdges.length === prevLength) {
        outerEdges.push({
          x1,
          y1,
          x2,
          y2
        })
      }
    }
  })

  dragShadowCtx.beginPath()
  outerEdges.forEach(edge => {
    dragShadowCtx.moveTo(edge.x1, edge.y1)
    dragShadowCtx.lineTo(edge.x2, edge.y2)
  })
  dragShadowCtx.stroke()

  document.body.appendChild(dragShadowElement)
}

export const stopDragging = () => {
  document.body.classList.remove('editor-dragging')
  document.getElementById('editor-controls').style.display = 'flex'

  editor.dragging = false
  render()
  const dragShadowElement = document.getElementById('drag-shadow')
  if (dragShadowElement) {
    document.body.removeChild(dragShadowElement)
  }
  updatePieceControlPositions()
}

export const updateDragShadow = (x, y) => {
  const piece = board.pieces[editor.hoverPiece]
  const {closestPoint} = findSnap(
    piece,
    x - editor.dragging.x,
    y - editor.dragging.y
  )
  const dragShadow = document.getElementById('drag-shadow')

  if (closestPoint) {
    dragShadow.style.left = `${closestPoint.x}px`
    dragShadow.style.top = `${closestPoint.y}px`
  }
}
