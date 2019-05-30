import {editor} from './editor'
import {board}  from '../board/board'
import {
  clearScenario,
  scenarioLoad
}               from '../board/board.scenarioLoad'


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
