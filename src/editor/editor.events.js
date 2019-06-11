import {editor}     from './editor'
import {
  generateEditorBoard,
  startDragging,
  stopDragging,
  updateDragShadow
}                   from './editor.functions'
import {board}      from '../board/board'
import {boardClick} from '../board/board.events'
import {findSnap}   from '../board/board.functions'
import {render}     from '../index'


let mouseDownCoords = false
const minMouseMoveDeltaToConsiderClickAsDragging = 20

export const editorDocumentClick = event => {
  mouseDownCoords = false
  if (editor.dragging !== false) {
    stopDragging()
  } else if (!editor.on) {
    boardClick(event)
  }
}

export const editorDocumentMousedown = event => {
  if (
    editor.on &&
    editor.dragging === false
  ) {
    editor.hoverPiece = false
    board.pieces.forEach((piece, i) => {
      if (
        event.pageX >= piece.x &&
        event.pageX <= piece.x + piece.pxW &&
        event.pageY >= piece.y &&
        event.pageY <= piece.y + piece.pxH
      ) {
        editor.hoverPiece = i
      }
    })

    if (editor.hoverPiece !== false) {
      mouseDownCoords = {
        x: event.pageX,
        y: event.pageY
      }

      render()
    }
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
        event.pageX - board.pieces[editor.hoverPiece].x,
        event.pageY - board.pieces[editor.hoverPiece].y
      )
    }
  }
  if (editor.dragging) {
    board.pieces[editor.hoverPiece].x = event.pageX - editor.dragging.x
    board.pieces[editor.hoverPiece].y = event.pageY - editor.dragging.y
    renderDOM()
    updateDragShadow(event.pageX, event.pageY)
  }
}

export const editorDocumentMouseup = event => {
  if (editor.dragging) {
    const piece = board.pieces[editor.hoverPiece]
    const closest = findSnap(
      piece,
      event.pageX - editor.dragging.x,
      event.pageY - editor.dragging.y
    )

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
  const piece = board.pieces[editor.hoverPiece]
  const draggedPieceStyle = piece.element.style
  draggedPieceStyle.left = `${piece.x}px`
  draggedPieceStyle.top = `${piece.y}px`
}

const synthesiseEventPageCoordinates = event => {
  if (event.touches && event.touches[0]) {
    event.pageX = event.touches[0].pageX
    event.pageY = event.touches[0].pageY
  }
}

let lastTouch = false

export const editorTouchend = event => {
  event.pageX = lastTouch.pageX
  event.pageY = lastTouch.pageY
  editorDocumentMouseup(event)
  editorDocumentClick(event)
}

export const editorTouchmove = event => {
  if (editor.hoverPiece !== false) {
    event.preventDefault()
  }
  synthesiseEventPageCoordinates(event)
  editorDocumentMousemove(event)
  lastTouch = event
}

export const editorTouchstart = event => {
  synthesiseEventPageCoordinates(event)
  editorDocumentMousedown(event)
}
