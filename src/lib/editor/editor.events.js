import {scenario} from './editor'
import {
  board,
  Grid
}                 from '../board/board'
import {
  boardClick,
  boardMousemove
}                 from '../board/board.events'
import {makeWall} from '../makeWall'
import {render}   from '../../index'


const removeHex = hexToRemove => {
  const hexFilter = filterHex => !(filterHex.x === hexToRemove.x && filterHex.y === hexToRemove.y)
  board.scenario.hexes = board.scenario.hexes.filter(hexFilter)
  board.scenario.wallHexes = board.scenario.wallHexes.filter(hexFilter)

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

const blueprintThinWalls = () => {
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

const blueprintHexes = () => {
  const blueprintTiles = []
  board.scenario.hexes.forEach(hex => {
    blueprintTiles.push(hex.x, hex.y)
  })

  return blueprintTiles
}

const removeThinwall = thinwallToRemove =>
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


const editBoard = eventHex => {
  const editorHover = board.editor.hover

  switch (board.editor.mode) {
    case 'remove':
      removeHex(eventHex)
      break
    case 'tile':
      removeHex(eventHex)
      board.scenario.hexes.push(eventHex)
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

  scenario.blueprint = {
    hexes: blueprintHexes(),
    thinWalls: blueprintThinWalls()
  }

  render()
}

export const editorClick = event => {
  if (typeof board.editor.mode === 'undefined') {
    boardClick(event)
  } else {
    const clickHex = board.grid.get(Grid.pointToHex(event.layerX, event.layerY))
    if (clickHex) {
      editBoard(clickHex)
    }
  }
}

export const editorMousedown = () => {
  if (typeof board.editor.mode !== 'undefined') {
    board.editor.mousedown = true
  }
}

export const editorMousemove = event => {
  if (
    board.editor.mousedown &&
    typeof board.editor.mode !== 'undefined'
  ) {
    const moveHex = board.grid.get(Grid.pointToHex(event.layerX, event.layerY))

    if (
      moveHex && (
        moveHex.x !== board.editor.previousEditHex.x ||
        moveHex.y !== board.editor.previousEditHex.y
      )
    ) {
      editBoard(moveHex)
      board.editor.previousEditHex = moveHex
    }
  }

  if (
    board.editor.mode === 'thin' ||
    board.editor.mode === 'removethin'
  ) {
    const previousEditorHover = board.editor.hover
    const hoverHex = board.grid.get(Grid.pointToHex(event.layerX, event.layerY))

    if (hoverHex) {
      const point = hoverHex.toPoint()
      const adjust = board.settings.hexSize
      const corners = hoverHex.corners().map(corner => corner.add(point))

      point.x += adjust
      point.y += adjust / 2 * Math.sqrt(3)

      const side = (
        Math.atan2(
          point.y - event.layerY,
          point.x - event.layerX
        ) + Math.PI
      ) / Math.PI * 3 | 0

      const nextSide = side < 5 ? side + 1 : 0

      board.editor.hover = {
        hex: hoverHex,
        side,
        sideWallCorners: {
          x1: corners[side].x,
          y1: corners[side].y,
          x2: corners[nextSide].x,
          y2: corners[nextSide].y
        }
      }

      if (
        !previousEditorHover ||
        previousEditorHover.side !== side
      ) {
        render()
      }
    }
  }

  boardMousemove(event)
}

export const editorMouseup = () => {
  if (typeof board.editor.mode !== 'undefined') {
    board.editor.mousedown = false
  }
}
