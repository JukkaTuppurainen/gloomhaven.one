import {
  drawHoverLines,
  shadeHexesNotInSight,
  shadeWallhexes
}                   from './renderer.los'
import {
  paintMouseHex,
  paintPlayer
}                   from './renderer.painthex'
// import {drawPath}   from './renderer.path'
// import {
//   paintPathingDebug,
//   writeHexNumbers
// }                   from './renderer.debug'
import {board}      from '../board/board'


const canvas = document.getElementById('c')
const ctx = canvas.getContext('2d')
const renderFunctions = []

renderFunctions.push(
  // drawNoHexes,
  shadeWallhexes,
  shadeHexesNotInSight,
  paintMouseHex,
  paintPlayer,
  // paintPathingDebug,
  // writeHexNumbers,
  // drawWalls,
  drawHoverLines
  // drawPath
)

export const renderer = () => {
  if (!board.scenario) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  renderFunctions.forEach(renderFunction => renderFunction(ctx))
}
