import {editor}       from './editor'
import {
  generateEditorBoard,
  startDragging
}                     from './editor.functions'
import {board}        from '../board/board'
import {createPiece}  from '../board/board.functions'
import {pieceList}    from '../board/board.pieces'
import {render}       from '../index'
import {resolveLOS}   from '../lib/resolveLOS'


const pieceSort = (a, b) => {
  if (!a.isUnique && b.isUnique) {
    return 1
  }
  if (a.isUnique && !b.isUnique) {
    return -1
  }
  return a.id > b.id ? 1 : -1
}

const elementSort = (a, b) => {
  if (a.dataset['isUnique'] !== 'true' && b.dataset['isUnique'] === 'true') {
    return 1
  }
  if (a.dataset['isUnique'] === 'true' && b.dataset['isUnique'] !== 'true') {
    return -1
  }
  return a.dataset['id'] > b.dataset['id'] ? 1 : -1
}

const deletePiece = index => {
  board.pieces.splice(index, 1)

  document.getElementById('board').removeChild(
    document.querySelectorAll('.map-tile')[index]
  )

  document.getElementById('piece-controls').removeChild(
    document.querySelectorAll('.control-wrap')[index]
  )

  generateEditorBoard()
  updateTileSelectOptions()
  createPieceControls()
}

const rotatePiece = (index, angle) => {
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
  updateTileSelectOptions()
  createPieceControls()
}

export const updateTileSelectOptions = () => {
  const tileSelect = document.getElementById('tile-select')
  tileSelect.innerHTML = '<option value=""></option>'
  tileSelect.value = ''
  Object.keys(pieceList)
    .filter(key => (
      key === 'corridor' ||
      key === 'door' || (
        board.pieces &&
        !board.pieces.find(a => a.name.substr(0, 2) === key.substr(0, 2))
      )
    ))
    .forEach(key => {
      const option = document.createElement('option')
      option.innerText = key
      option.value = key
      tileSelect.appendChild(option)
    })
}

export const tileSelectChange = event => {
  const piece = createPiece(event.pageX, event.pageY, event.target.value)
  const boardElement = document.getElementById('board')

  boardElement.appendChild(piece.element)
  ;[...boardElement.children]
    .sort(elementSort)
    .forEach(node => boardElement.appendChild(node))

  board.pieces.push(piece)
  board.pieces.sort(pieceSort)

  editor.hoverPiece = board.pieces.findIndex(p => p.id === piece.id)

  startDragging(0, 0)

  updateTileSelectOptions()
  createPieceControls()
  event.target.value = ''
}

export const updatePieceControlPositions = () => {
  board.pieces.forEach((piece, i) => {
    const image = piece.element.children[0]
    const pieceControlWrap = document.querySelectorAll('.control-wrap')[i]

    if (image.style.transform) {
      const m = image.style.transform.match(/rotate\((\d+)/)
      if (m[1]) {
        if (image.width === 0) {
          let prevOnLoad
          if (image.onload) {
            prevOnLoad = image.onload
          }

          pieceControlWrap.style.display = 'none'

          image.onload = () => {
            pieceControlWrap.style.display = 'block'
            pieceControlWrap.style.transformOrigin = `${image.width / 2}px ${image.height / 2}px`
            prevOnLoad()
          }
        }

        pieceControlWrap.style.transform = `rotate(${parseInt(m[1])}deg)`
        pieceControlWrap.style.transformOrigin = `${image.width / 2}px ${image.height / 2}px`
      }
    } else {
      pieceControlWrap.style.transform = ''
    }

    pieceControlWrap.style.left =
      parseFloat(piece.element.style.left, 10) +
      (parseFloat(image.style.left, 10) || -38) +
      'px'

    pieceControlWrap.style.top =
      parseFloat(piece.element.style.top, 10) +
      (parseFloat(image.style.top, 10) || -16) +
      'px'
  })
}

const createPieceControls = () => {
  const pieceControls = document.getElementById('piece-controls')
  pieceControls.innerHTML = ''

  board.pieces.forEach((piece, i) => {
    const pieceControlWrap = document.createElement('div')
    pieceControlWrap.classList.add('control-wrap')

    if (!piece.isSingleTile) {
      const btn1 = document.createElement('button')
      btn1.classList.add('control-button', 'control-button-1')
      btn1.addEventListener('click', () => rotatePiece(i, 60))
      pieceControlWrap.appendChild(btn1)

      const btn2 = document.createElement('button')
      btn2.classList.add('control-button', 'control-button-2')
      btn2.addEventListener('click', () => rotatePiece(i, 180))
      pieceControlWrap.appendChild(btn2)
    }

    const btn3 = document.createElement('button')
    btn3.classList.add('control-button', 'control-button-3')
    btn3.addEventListener('click', () => deletePiece(i))
    pieceControlWrap.appendChild(btn3)

    pieceControls.appendChild(pieceControlWrap)
  })

  updatePieceControlPositions()
}

const setEditorOn = () => {
  document.body.classList.add('editor-on')
  createPieceControls()
  editor.on = true
  delete board.playerHex
  resolveLOS()
  board.style.hexHover = '#0000'
  board.style.noHexHover = '#0000'
  render()
}

export const setEditorOff = () => {
  document.body.classList.remove('editor-on')
  document.getElementById('piece-controls').innerHTML = ''
  editor.on = false
  board.style.hexHover = '#32005080'
  board.style.noHexHover = '#50003280'
}

export const editorToggleChange = event => {
  if (event.target.checked) {
    setEditorOn()
  } else {
    setEditorOff()
  }
}