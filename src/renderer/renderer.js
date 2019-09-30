import {
  drawHoverLines,
  shadeHexesNotInSight,
  shadeWallhexes
}                   from './renderer.los'
import {
  paintFocusHexes,
  paintMouseHex,
  paintMoveHexes,
  paintPlayer
}                   from './renderer.painthex'
import {
  drawFocusPath,
  drawMovePath
}                   from './renderer.path'
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
  paintFocusHexes,
  paintMouseHex,
  paintMoveHexes,
  paintPlayer,
  // paintPathingDebug,
  // writeHexNumbers,
  // drawWalls,
  drawHoverLines,
  drawFocusPath,
  drawMovePath
)

export const renderer = () => {
  if (!board.scenario) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  renderFunctions.forEach(renderFunction => renderFunction(ctx))
}
