import {
  editor,
  editorPieces
}                     from './editor'
import {
  board,
  Grid,
  hexHeight,
  hexWidth
}                     from '../board/board'
import {scenarioLoad} from '../board/board.scenarioLoad'
import {toPoint}      from '../hexUtils'
import {makeWall}     from '../makeWall'


const toChar = n => String.fromCharCode(n + (n < 27 ? 96 : 38))

export const generateBlueprintString = () => {
  const hexExport = {}
  let blueprintString = ''

  board.scenario.hexes.forEach(hex => {
    if (!hexExport[hex.x]) {
      hexExport[hex.x] = new Set()
    }

    hexExport[hex.x].add(hex.y)
  })

  let previousX = 0
  let previousLastY = 99

  Object.keys(hexExport).forEach(x => {
    x = parseInt(x, 10)
    const yArray = [...hexExport[x]].sort((a, b) => a > b ? 1 : -1)

    if (
      yArray[0] > previousLastY ||
      x > previousX + 1
    ) {
      blueprintString += x
    }

    previousX = x
    previousLastY = yArray[yArray.length - 1]

    let i = 0
    let start = 0

    while (i < yArray.length) {
      if (!start) {
        start = yArray[i]
      }
      if (
        (yArray[i + 1] > yArray[i] + 1) ||
        i === yArray.length - 1
      ) {
        blueprintString += toChar(start) + toChar(yArray[i])
        start = 0
      }
      ++i
    }
  })

  if (board.scenario.thinWalls.length) {
    blueprintString += '.'
    board.scenario.thinWalls.forEach(thinWall => {
      blueprintString += thinWall.meta.x + toChar(thinWall.meta.y)
      if (thinWall.meta.s !== 1) {
        blueprintString += toChar(thinWall.meta.s + 1)
      }
    })
  }

  return blueprintString
}

export const generateEditorBoard = () => {
  const hexesCenterCoordinates = []

  if (editorPieces.length) {
    const center = {
      x: hexWidth / 2,
      y: hexHeight / 2
    }

    editorPieces.forEach(piece => {
      piece.pieceHexes.forEach(pieceHex => {
        const centerCoordinates = toPoint(pieceHex)
        centerCoordinates.x += piece.x + center.x
        centerCoordinates.y += piece.y + center.y
        if (pieceHex.metaThinwalls) {
          centerCoordinates.metaThinwalls = pieceHex.metaThinwalls
        }

        hexesCenterCoordinates.push(centerCoordinates)
      })
    })
  }

  delete board.playerHex
  board.scenario.hexes.length = 0
  board.scenario.thinWalls.length = 0

  hexesCenterCoordinates.forEach(hexCenterCoordinates => {
    const hexFromPoint = Grid.pointToHex(hexCenterCoordinates.x, hexCenterCoordinates.y)
    board.scenario.hexes.push(hexFromPoint)

    if (hexCenterCoordinates.metaThinwalls) {
      hexCenterCoordinates.metaThinwalls.forEach(metaThinWall => {
        makeWall(
          hexFromPoint,
          metaThinWall,
          metaThinWall === 5 ? 0 : metaThinWall + 1,
          true
        )
      })
    }
  })

  editor.blueprint = generateBlueprintString()
  scenarioLoad(editor)
}
