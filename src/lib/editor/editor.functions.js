import {editor}   from './editor'
import {board}    from '../board/board'
import {makeWall} from '../makeWall'
import {render}   from '../../index'


export const editBoard = eventHex => {
  const editorHover = board.editor.hover

  switch (board.editor.mode) {
    case 'remove':
      removeHex(eventHex)
      break
    case 'tile':
      if (
        eventHex.x > 0 &&
        eventHex.y > 0 &&
        eventHex.x < board.scenario.grid.width - 1 &&
        eventHex.y < board.scenario.grid.height - 1
      ) {
        board.scenario.hexes.push(eventHex)
      }
      break
    case 'thin':
      if (editorHover) {
        removeThinwall(editorHover.sideWallCorners)
        const side = editorHover.side
        makeWall(
          editorHover.hex,
          side,
          side < 5 ? side + 1 : 0,
          true
        )
      }
      break
    case 'removethin':
      if (editorHover) {
        removeThinwall(editorHover.sideWallCorners)
      }
      break
  }

  updateBlueprint()
  render()
}

const formatBlueprintThinWalls = () => {
  const blueprintThinWalls = []
  board.scenario.thinWalls.forEach(thinWall => {
    if (thinWall.meta) {
      blueprintThinWalls.push(
        thinWall.meta.x,
        thinWall.meta.y,
        thinWall.meta.s
      )
    }
  })

  return blueprintThinWalls
}

export const removeHex = hexToRemove => {
  const hexFilter = filterHex => !(filterHex.x === hexToRemove.x && filterHex.y === hexToRemove.y)
  board.scenario.hexes = board.scenario.hexes.filter(hexFilter)

  const point = hexToRemove.toPoint()
  const corners = hexToRemove.corners().map(corner => corner.add(point))

  for (let i = 0; i < 6; ++i) {
    removeThinwall({
      x1: corners[i].x,
      y1: corners[i].y,
      x2: corners[i < 5 ? i + 1 : 0].x,
      y2: corners[i < 5 ? i + 1 : 0].y,
    })
  }
}

export const removeThinwall = thinwallToRemove =>
  board.scenario.thinWalls = board.scenario.thinWalls.filter(tw => !(
    (
      thinwallToRemove.x1 === tw.x1 &&
      thinwallToRemove.y1 === tw.y1 &&
      thinwallToRemove.x2 === tw.x2 &&
      thinwallToRemove.y2 === tw.y2
    ) || (
      thinwallToRemove.x1 === tw.x2 &&
      thinwallToRemove.y1 === tw.y2 &&
      thinwallToRemove.x2 === tw.x1 &&
      thinwallToRemove.y2 === tw.y1
    )
  ))

const toChar = n => String.fromCharCode(n + (n < 27 ? 96 : 38))

const formatBlueprintHexes = () => {
  const hexExport = {}
  let stringResult = ''

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
      stringResult += x
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
        stringResult += toChar(start) + toChar(yArray[i])
        start = 0
      }
      ++i
    }
  })

  return stringResult
}

export const updateBlueprint = () => {
  const hexesString = formatBlueprintHexes()

  board.scenario.blueprint = editor.blueprint = {
    hexes: hexesString,
    thinWalls: formatBlueprintThinWalls()
  }

  window.location.hash = ':' + hexesString
}
