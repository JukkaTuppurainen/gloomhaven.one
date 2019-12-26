import {editor}     from './editor'
import {
  generateEditorBoard,
  getPieceIndexFromBoard,
  itemsToUpdate,
  renderDOM,
  startDragging,
  stopDragging,
  updateDragShadow
}                   from './editor.functions'
import {board}      from '../board/board'
import {boardClick} from '../board/board.events'
import {findSnap}   from '../board/board.functions'
import {render}     from '../index'
import {
  pointToHex,
  toPoint
}                   from '../lib/hexUtils'


let monsterFunctions
(async () => {
  monsterFunctions = await import(/* webpackMode: 'weak' */ '../monsters/monsters.functions')
})()

let mouseDownCoords = false
const minMouseMoveDeltaToConsiderClickAsDragging = 10

export const editorClick = event => {
  mouseDownCoords = false
  if (!editor.on) {
    boardClick(event)
  }
}

export const editorDocumentMousedown = event => {
  if (
    editor.on &&
    editor.dragging === false
  ) {
    editor.hoverPiece = -1
    const hexFromPoint = pointToHex(event.pageX, event.pageY)

    const boardHoverPiece = getPieceIndexFromBoard(hexFromPoint)
    if (boardHoverPiece >= 0) {
      editor.hoverPiece = boardHoverPiece
    }

    if (editor.hoverPiece >= 0) {
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
    const deltaX = event.pageX - mouseDownCoords.x
    const deltaY = event.pageY - mouseDownCoords.y

    if (
      !editor.dragging &&
      editor.hoverPiece >= 0 && (
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
    const piece = board.pieces[editor.hoverPiece]
    piece.x = event.pageX - editor.dragging.x
    piece.y = event.pageY - editor.dragging.y

    if (piece.name === 'corridor' || piece.name === 'door') {
      const boardIndex = getPieceIndexFromBoard(
        pointToHex(event.pageX, event.pageY),
        editor.hoverPiece
      )

      if (board.pieces[boardIndex]) {
        let newColor = board.pieces[boardIndex].color
        if (newColor < 4 && piece.name === 'corridor') { newColor += 4 }
        if (newColor > 3 && piece.name === 'door') { newColor -= 4 }

        piece.color = piece.element.dataset['color'] = newColor
      }
    }

    itemsToUpdate.forEach(item => {
      item.x = event.pageX - item.dx
      item.y = event.pageY - item.dy
    })

    renderDOM()
    updateDragShadow(
      event.pageX - editor.dragging.x,
      event.pageY - editor.dragging.y,
      piece
    )
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

      if (monsterFunctions) {
        piece.pieceHexes.forEach(pieceHex => {
          if (pieceHex.items) {
            pieceHex.items.forEach(item => {
              item.ch.x = piece.ch.x + pieceHex.x
              item.ch.y = piece.ch.y + pieceHex.y + (pieceHex.x & 1 ? piece.ch.x & 1 : 0)
              const point = toPoint(item.ch)
              item.x = point.x
              item.y = point.y

              monsterFunctions.placeItem(item)

              board.items.push(item)
            })
            delete pieceHex.items
          }
        })
      }

      renderDOM()
    }
    generateEditorBoard()

    mouseDownCoords = false
    stopDragging()
  }
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
  editorClick(event)
}

export const editorTouchmove = event => {
  if (
    editor.on &&
    editor.hoverPiece >= 0
  ) {
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
