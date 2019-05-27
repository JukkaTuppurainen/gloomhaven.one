import {
  editor,
  editorPieces
}                   from './editor'
import {
  findSnap,
  generateEditorBoard
}                   from './editor.functions'
import {
  board,
  cornersCoordinates
}                   from '../board/board'
import {boardClick} from '../board/board.events'
import {render}     from '../../index'
import {
  addPoint,
  toPoint
}                   from '../hexUtils'


let mouseDownCoords = false
const minMouseMoveDeltaToConsiderClickAsDragging = 20

export const startDragging = (x, y) => {
  delete board.playerHex
  document.getElementById('editor-controls').style.display = 'none'
  editor.dragging = {x, y}
  editor.style.hexHover = '#0000'
  editor.style.noHexHover = '#0000'
  render()
  const hoverPiece = editorPieces[editor.hoverPiece]
  const dragShadowElement = document.createElement('canvas')
  dragShadowElement.id = 'drag-shadow'
  dragShadowElement.height = hoverPiece.canvas.height
  dragShadowElement.width = hoverPiece.canvas.width

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

const stopDragging = () => {
  document.getElementById('editor-controls').style.display = 'block'
  editor.style.hexHover = '#32005080'
  editor.style.noHexHover = '#50003280'
  editor.dragging = false
  render()
  const dragShadowElement = document.getElementById('drag-shadow')
  if (dragShadowElement) {
    document.body.removeChild(dragShadowElement)
  }
}

export const editorDocumentClick = event => {
  mouseDownCoords = false
  if (editor.dragging !== false) {
    stopDragging()
  } else {
    boardClick(event)
  }
}

export const editorDocumentMousedown = event => {
  if (editor.hoverPiece !== null) {
    mouseDownCoords = {
      x: event.pageX,
      y: event.pageY
    }

    render()
  }
}

const updateDragShadow = (x, y) => {
  const piece = editorPieces[editor.hoverPiece]
  const {closestPoint} = findSnap(piece, x, y)
  const dragShadow = document.getElementById('drag-shadow')

  if (closestPoint) {
    dragShadow.style.left = `${closestPoint.x}px`
    dragShadow.style.top = `${closestPoint.y}px`
  }
}

export const editorDocumentMousemove = event => {
  if (mouseDownCoords) {
    let deltaX = event.pageX - mouseDownCoords.x
    let deltaY = event.pageY - mouseDownCoords.y
    if (
      !editor.dragging &&
      editor.hoverPiece !== false && (
        deltaX > minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaX < -minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaY > minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaY < -minMouseMoveDeltaToConsiderClickAsDragging
      )
    ) {
      startDragging(
        event.pageX - editorPieces[editor.hoverPiece].x,
        event.pageY - editorPieces[editor.hoverPiece].y
      )
    }
  }
  if (editor.dragging) {
    editorPieces[editor.hoverPiece].x = event.pageX - editor.dragging.x
    editorPieces[editor.hoverPiece].y = event.pageY - editor.dragging.y
    renderDOM()
    updateDragShadow(event.pageX, event.pageY)
  } else {
    editor.hoverPiece = null
    editorPieces.forEach((piece, i) => {
      if (
        event.pageX >= piece.x &&
        event.pageX <= piece.x + piece.pxW &&
        event.pageY >= piece.y &&
        event.pageY <= piece.y + piece.pxH
      ) {
        editor.hoverPiece = i
      }
    })
  }
}

export const editorDocumentMouseup = event => {
  if (editor.dragging) {
    const piece = editorPieces[editor.hoverPiece]
    const closest = findSnap(piece, event.pageX, event.pageY)

    if (closest.closestPoint) {
      piece.x = closest.closestPoint.x
      piece.y = closest.closestPoint.y
      piece.ch = closest.closestHex
      renderDOM()
    }
    generateEditorBoard()
  }
}

const renderDOM = () => {
  const piece = editorPieces[editor.hoverPiece]
  const draggedPieceStyle = piece.element.style
  draggedPieceStyle.left = `${piece.x}px`
  draggedPieceStyle.top = `${piece.y}px`
}
