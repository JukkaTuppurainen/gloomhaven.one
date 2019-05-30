import {editor}               from './editor'
import {startDragging}        from './editor.events'
import {generateEditorBoard}  from './editor.functions'
import {board}                from '../board/board'
import {createPiece}          from '../board/board.functions'
import {render}               from '../index'


const pieceSort = (a, b) => {
  if (a.isSingleTile && !b.isSingleTile) {
    return 1
  }
  if (!a.isSingleTile && b.isSingleTile) {
    return -1
  }
  return a.id > b.id ? 1 : -1
}

const elementSort = (a, b) => {
  if (a.dataset['singleTile'] === 'true' && b.dataset['singleTile'] !== 'true') {
    return 1
  }
  if (a.dataset['singleTile'] !== 'true' && b.dataset['singleTile'] === 'true') {
    return -1
  }
  return a.dataset['id'] > b.dataset['id'] ? 1 : -1
}

export const createPieceBtnClick = event => {
  if (event.target.nodeName === 'BUTTON') {
    const pieceKey = event.target.dataset['piece']
    const piece = createPiece(event.pageX, event.pageY, pieceKey)
    const boardElement = document.getElementById('board')

    boardElement.appendChild(piece.element)
    ;[...boardElement.children]
      .sort(elementSort)
      .forEach(node => boardElement.appendChild(node))

    board.pieces.push(piece)
    board.pieces.sort(pieceSort)

    editor.hoverPiece = board.pieces.findIndex(p => p.id === piece.id)

    startDragging(0, 0)

    updateEditorControls()
  }
}

export const updateEditorControls = () => {
  const pieceListElement = document.getElementById('tile-list')
  pieceListElement.innerHTML = ''

  document.querySelectorAll('#tile-btns button').forEach(n => n.removeAttribute('disabled'))

  board.pieces.forEach((piece, i) => {
    const pieceListItem = document.createElement('li')
    pieceListItem.id = piece.id

    let html = `<span>${piece.name}</span><span>`
    if (!piece.isSingleTile) {
      html += `<button data-angle="60" data-rotate="${i}" type="button">60°</button><button data-angle="180" data-rotate="${i}" type="button">180°</button>`
    }
    html += `<button data-delete="${i}" type="button">X</button></span>`

    pieceListItem.innerHTML = html
    pieceListElement.appendChild(pieceListItem)

    pieceListItem.addEventListener('mouseenter', tileListMouseenter)
    pieceListItem.addEventListener('mouseleave', tileListMouseleave)

    if (!piece.isSingleTile) {
      document.querySelector(`button[data-piece="${piece.name}"]`).setAttribute('disabled', true)
    }
  })
}

export const tileListBtnClick = event => {
  if (event.target.nodeName === 'BUTTON') {
    if (event.target.dataset['delete']) {
      const index = parseInt(event.target.dataset['delete'], 10)
      board.pieces.splice(index, 1)
      updateEditorControls()

      document.getElementById('board').removeChild(
        document.querySelectorAll('.map-tile')[index]
      )

      generateEditorBoard()
    }
    if (event.target.dataset['rotate']) {
      const index = parseInt(event.target.dataset['rotate'], 10)
      let angle = parseInt(event.target.dataset['angle'], 10)
      const piece = board.pieces[index]
      const name = piece.name
      angle = piece.rotation + angle
      if (angle >= 360) {
        angle -= 360
      }
      const boardElement = document.getElementById('board')

      boardElement.removeChild(
        document.querySelectorAll('.map-tile')[index]
      )

      const newPiece = createPiece(piece.x, piece.y, name, angle)
      board.pieces.splice(index, 1)
      board.pieces.push(newPiece)
      board.pieces.sort(pieceSort)

      boardElement.appendChild(newPiece.element)

      ;[...boardElement.children]
        .sort(elementSort)
        .forEach(node => boardElement.appendChild(node))

      generateEditorBoard()
      updateEditorControls()
    }
  }
}

const tileListMouseenter = event => {
  delete board.playerHex
  board.pieces
    .find(p => p.id === event.target.id)
    .element.classList.add('with-control-hover')
  render()
}

const tileListMouseleave = () => {
  document.querySelectorAll('.with-control-hover').forEach(n => (
    n.classList.remove('with-control-hover')
  ))
}
