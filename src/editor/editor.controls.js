import {editor}       from './editor'
import {
  deletePiece,
  generateEditorBoard,
  startDragging,
  stopDragging
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

  const newPiece = createPiece(piece.x, piece.y, name, angle, piece.color)
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
      pieceList[key][5] !== false && (
        key === 'corridor' ||
        key === 'door' || (
          board.pieces &&
          !board.pieces.find(a => a.name.substr(0, 2) === key.substr(0, 2))
        )
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
    const imageWrap = piece.element.children[0]
    const pieceControlWrap = document.querySelectorAll('.control-wrap')[i]

    if (imageWrap.style.transform) {
      const m = imageWrap.style.transform.match(/rotate\((\d+)/)
      if (m[1]) {
        const image = imageWrap.children[0]

        if (image.width === 0) {
          let prevOnLoad
          if (image.onload) {
            prevOnLoad = image.onload
          }

          pieceControlWrap.classList.add('hidden')

          image.onload = () => {
            pieceControlWrap.classList.remove('hidden')
            const style = window.getComputedStyle(imageWrap)
            const height = parseFloat(style.height)
            const width = parseFloat(style.width)
            pieceControlWrap.style.transformOrigin = `${width / 2}px ${height / 2}px`
            prevOnLoad()
          }
        }

        const style = window.getComputedStyle(imageWrap)
        const height = parseFloat(style.height)
        const width = parseFloat(style.width)

        pieceControlWrap.style.transform = `rotate(${parseInt(m[1])}deg)`
        pieceControlWrap.style.transformOrigin = `${width / 2}px ${height / 2}px`
      }
    } else {
      pieceControlWrap.style.transform = ''
    }

    const iWStyleLeft = parseFloat(imageWrap.style.left, 10)
    const iWStyleTop = parseFloat(imageWrap.style.top, 10)

    pieceControlWrap.style.left =
      parseFloat(piece.element.style.left, 10) +
      (isNaN(iWStyleLeft) ? -38 : iWStyleLeft) +
      'px'

    pieceControlWrap.style.top =
      parseFloat(piece.element.style.top, 10) +
      (isNaN(iWStyleTop) ? -16 : iWStyleTop) +
      'px'
  })
}

const pieceControlBlur = () => {
  document.querySelectorAll('.map-tile-focus').forEach(n => n.classList.remove('map-tile-focus'))
}

const pieceControlFocus = i => {
  document.getElementById('board').children[i].classList.add('map-tile-focus')
}

export const createPieceControls = () => {
  const pieceControls = document.getElementById('piece-controls')
  pieceControls.innerHTML = ''

  board.pieces.forEach((piece, i) => {
    const pieceControlWrap = document.createElement('div')
    pieceControlWrap.classList.add('control-wrap')

    if (!piece.isSingleTile) {
      const btn1 = document.createElement('button')
      btn1.classList.add('control-button', 'control-button-1')
      btn1.addEventListener('blur', pieceControlBlur)
      btn1.addEventListener('click', () => rotatePiece(i, 60))
      btn1.addEventListener('focus', () => pieceControlFocus(i))
      btn1.addEventListener('mouseenter', () => pieceControlFocus(i))
      btn1.addEventListener('mouseleave', pieceControlBlur)
      pieceControlWrap.appendChild(btn1)

      const btn2 = document.createElement('button')
      btn2.addEventListener('blur', pieceControlBlur)
      btn2.addEventListener('click', () => rotatePiece(i, 180))
      btn2.addEventListener('focus', () => pieceControlFocus(i))
      btn2.addEventListener('mouseenter', () => pieceControlFocus(i))
      btn2.addEventListener('mouseleave', pieceControlBlur)
      btn2.classList.add('control-button', 'control-button-2')
      pieceControlWrap.appendChild(btn2)
    }

    const btn3 = document.createElement('button')
    btn3.classList.add('control-button', 'control-button-3')
    btn3.addEventListener('blur', pieceControlBlur)
    btn3.addEventListener('click', () => deletePiece(i))
    btn3.addEventListener('focus', () => pieceControlFocus(i))
    btn3.addEventListener('mouseenter', () => pieceControlFocus(i))
    btn3.addEventListener('mouseleave', pieceControlBlur)
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
  if (editor.dragging) {
    if (editor.hoverPiece >= 0) {
      deletePiece(editor.hoverPiece)
      editor.hoverPiece = -1
    }
    stopDragging()
  }

  document.body.classList.remove('editor-on')
  document.getElementById('piece-controls').innerHTML = ''
  document.querySelectorAll('.map-tile-focus').forEach(n => n.classList.remove('map-tile-focus'))
  editor.on = false
  board.style.hexHover = '#32005080'
  board.style.noHexHover = '#50003280'
}

export const editorToggleChange = event => {
  if (event.target.value === 'Editor') {
    setEditorOn()
  } else if (editor.on) {
    setEditorOff()
  }
}
