import {board}      from './board'
import {
  clearScenario,
  scenarioLoad
}                   from './board.scenarioLoad.js'
import {
  getPieceIndexFromBoard
}                   from '../editor/editor.functions.js'
import {
  pointToHex,
  toPoint
}                   from '../lib/hexUtils'
import {resolveLOS} from '../lib/resolveLOS'
import {render}     from '../renderer/render'


export const boardMousemove = event => {
  const newMouseHex = pointToHex(event.layerX, event.layerY)

  if (
    newMouseHex.x >= 0 &&
    newMouseHex.y >= 0 &&
    newMouseHex.x < board.gridSize.width &&
    newMouseHex.y < board.gridSize.height
  ) {
    if (
      newMouseHex.x !== board.mouseHex.x ||
      newMouseHex.y !== board.mouseHex.y
    ) {
      if (board.mouseHex.active) {
        const a = document.getElementById('a')
        a.querySelectorAll('button').forEach(b => a.removeChild(b))
      }

      board.mouseHex = newMouseHex

      const hoverPieceIndex = getPieceIndexFromBoard(newMouseHex)
      const hoverPiece = board.pieces[hoverPieceIndex]

      if (hoverPiece && hoverPiece.name === 'z') {
        board.mouseHex.active = true

        const point = toPoint(board.mouseHex)
        const btn = document.createElement('button')

        btn.className = 'z-button'
        btn.style.top = point.y + 'px'
        btn.style.left = point.x + 'px'

        if (hoverPiece.active) {
          btn.classList.add('active')
        }

        btn.addEventListener('click', () => {
          if (
            hoverPiece.element.classList.contains('active')
          ) {
            hoverPiece.active = false
            hoverPiece.element.classList.remove('active')
            btn.classList.remove('active')
            if (
              board.playerHex &&
              board.playerHex.x === newMouseHex.x &&
              board.playerHex.y === newMouseHex.y
            ) {
              board.playerHex = null
            }
          } else {
            hoverPiece.element.classList.add('active')
            btn.classList.add('active')
            hoverPiece.active = true
          }

          clearScenario()
          scenarioLoad()
          resolveLOS()
        })

        document.getElementById('a').appendChild(btn)
      }

      render()
    }
  } else if (board.mouseHex.x !== null) {
    board.mouseHex = {
      x: null,
      y: null
    }
    render()
  }
}

export const boardMouseLeave = () => {
  board.mouseHex = {
    x: null,
    y: null
  }
  render()
}

export const boardClick = event => {
  const clickHex = pointToHex(event.layerX, event.layerY)

  if (
    !clickHex ||
    !board.scenario.hexes.has(clickHex)
  ) {
    return
  }

  board.playerHex = (
    board.playerHex &&
    clickHex.x === board.playerHex.x &&
    clickHex.y === board.playerHex.y
  )
    ? null
    : clickHex

  resolveLOS()
  render()
}
