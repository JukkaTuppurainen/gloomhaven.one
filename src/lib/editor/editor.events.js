import {
  editor,
  editorGridDefaultHeight,
  editorGridDefaultWidth,
  editorPieces
}                            from './editor'
import {generateEditorBoard} from './editor.functions'
import {
  board,
  cornersCoordinates
}                            from '../board/board'
import {boardClick}          from '../board/board.events'
import {render}              from '../../index'
import {toPoint}             from '../hexUtils'


let mouseDownCoords = false
const minMouseMoveDeltaToConsiderClickAsDragging = 20

export const startDragging = (x, y) => {
  delete board.playerHex
  document.getElementById('editor-controls').style.display = 'none'
  editor.dragging = {x, y}
  editor.style.hexHover = '#0000'
  editor.style.noHexHover = '#0000'
  render()
}

const stopDragging = () => {
  document.getElementById('editor-controls').style.display = 'block'
  editor.style.hexHover = '#32005080'
  editor.style.noHexHover = '#50003280'
  editor.dragging = false
  render()
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
    const pieceFirstHexCorners = cornersCoordinates.map(corner => corner.add(piece.grid[0].toPoint()))

    const x = event.pageX + pieceFirstHexCorners[0].x - editor.dragging.x
    const y = event.pageY + pieceFirstHexCorners[0].y - editor.dragging.y

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
    generateEditorBoard()
  }
}

const renderDOM = () => {
  const piece = editorPieces[editor.hoverPiece]
  const draggedPieceStyle = piece.element.style
  draggedPieceStyle.left = `${piece.x}px`
  draggedPieceStyle.top = `${piece.y}px`
}
