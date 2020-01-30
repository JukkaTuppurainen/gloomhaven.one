// import {drawHex}  from './renderer.functions'
// import {board}    from '../board/board'
// import {hexWidth} from '../board/board.constants'
// import {toPoint}  from '../lib/hexUtils'
//
//
// export const drawNoHexes = ctx => {
//   board.grid
//     .filter(gridHex => !board.scenario.hexes.find(hex => hex.x === gridHex.x && hex.y === gridHex.y))
//     .forEach(gridHex => {
//       drawHex(gridHex)
//
//       ctx.strokeStyle = '#444'
//       ctx.stroke()
//     })
// }
//
// export const drawWalls = ctx => {
//   ctx.strokeStyle = '#fff'
//   ctx.lineWidth = 1
//   board.scenario.walls.forEach(wall => {
//     ctx.beginPath()
//     ctx.moveTo(wall.x1, wall.y1)
//     ctx.lineTo(wall.x2, wall.y2)
//     ctx.stroke()
//   })
// }
//
// export const paintPathingDebug = ctx => {
//   if (board.paths) {
//     if ('closedList' in board.paths[0].debug) {
//       board.paths[0].debug.closedList.forEach(h => {
//         drawHex(h)
//         ctx.fillStyle = '#f006'
//         ctx.fill()
//       })
//     }
//
//     if ('openList' in board.paths[0].debug) {
//       board.paths[0].debug.openList.forEach(h => {
//         drawHex(h)
//         ctx.fillStyle = '#0f06'
//         ctx.fill()
//       })
//     }
//
//     if (board.paths[0].debug.path) {
//       board.paths[0].debug.path.forEach(h => {
//         drawHex(h)
//         ctx.fillStyle = '#00f5'
//         ctx.fill()
//       })
//     }
//
//     if (board.paths[0].debug.end) {
//       drawHex(board.paths[0].debug.end)
//       ctx.fillStyle = '#00f6'
//       ctx.fill()
//     }
//   }
// }
//
// export const writeHexNumbers = ctx => {
//   ctx.font = '14px Arial'
//   ctx.textAlign = 'center'
//   const hW = hexWidth / 2
//
//   board.scenario.hexes.forEach(gridHex => {
//     const point = toPoint(gridHex)
//     const str = `${gridHex.x}, ${gridHex.y}`
//
//     ctx.fillStyle = '#000'
//     ctx.fillText(str, point.x + hW, point.y + 20)
//     ctx.fillStyle = '#fff'
//     ctx.fillText(str, point.x + hW - 1, point.y + 19)
//   })
// }
//
// const rangeColors = {
//   0: '#f00',
//   1: '#f80',
//   2: '#cf0',
//   3: '#0e0',
//   4: '#0ff',
//   5: '#08f',
//   6: '#00f',
//   7: '#70f',
//   8: '#f0f'
// }
//
// export const paintRange = ctx => {
//   if (board.temprange) {
//     board.temprange.forEach(hex => {
//       drawHex(hex)
//       ctx.fillStyle = rangeColors[hex.r] + '8'
//       ctx.fill()
//     })
//   }
// }
