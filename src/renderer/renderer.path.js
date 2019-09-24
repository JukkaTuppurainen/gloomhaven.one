import {drawTriangle} from './renderer.functions'
import {
  board,
  hexHeight,
  hexWidth
}                     from '../board/board'
import {toPoint}      from '../lib/hexUtils'


const drawEndPathTriangle = (ctx, path) => {
  const lastPoint = toPoint(path[path.length - 1])
  lastPoint.x += hexWidth / 2
  lastPoint.y += hexHeight / 2

  const pointBeforeLastPoint = toPoint(path[path.length - 2])
  pointBeforeLastPoint.x += hexWidth / 2
  pointBeforeLastPoint.y += hexHeight / 2

  drawTriangle(
    lastPoint.x,
    lastPoint.y,
    20,
    Math.atan2(
      pointBeforeLastPoint.y - lastPoint.y,
      pointBeforeLastPoint.x - lastPoint.x
    ),
    35,
    0.3
  )
}

const drawPath = (ctx, path) => {
  const coordinates = path.map(hex => {
    const point = toPoint(hex)
    point.x += hexWidth / 2
    point.y += hexHeight / 2
    return point
  })

  ctx.beginPath()
  ctx.moveTo(
    (coordinates[0].x + coordinates[1].x) / 2,
    (coordinates[0].y + coordinates[1].y) / 2,
  )
  let i
  for (i = 1; i < coordinates.length - 1; ++i) {
    ctx.lineTo(
      coordinates[i].x,
      coordinates[i].y
    )
  }
  ctx.lineTo(
    (coordinates[i - 1].x + coordinates[i].x) / 2,
    (coordinates[i - 1].y + coordinates[i].y) / 2,
  )
  ctx.stroke()
}

const drawNumberCircle = (ctx, path) => {
  const point = toPoint(path[path.length - 1])
  point.x += hexWidth / 2
  point.y += hexHeight / 2
  ctx.arc(point.x, point.y, 14, 0, Math.PI * 2)
  ctx.fill()
  ctx.textAlign = 'center'
  ctx.font = '23px "Pirata One"'
  ctx.fillStyle = '#fff'
  ctx.fillText(path.pathLength, point.x, point.y + 9)
}

export const drawFocusPath = ctx => {
  const focusInfo = board.focusInfo
  if (
    focusInfo &&
    focusInfo.pathsVisible &&
    focusInfo.paths
  ) {
    focusInfo.paths.forEach(path => {
      if (path.length) {
        const fullPath = [focusInfo.pathStart, ...path]
        ctx.lineWidth = 10
        ctx.setLineDash([5, 5])
        ctx.strokeStyle = '#090'
        ctx.fillStyle = '#090'
        drawPath(ctx, fullPath)
        ctx.lineWidth = 1
        ctx.setLineDash([])
        drawEndPathTriangle(ctx, fullPath)
        drawNumberCircle(ctx, path)
      }
    })
  }
}

export const drawMovePath = ctx => {
  const focusInfo = board.focusInfo
  if (
    focusInfo &&
    focusInfo.moveHexesVisible &&
    focusInfo.moveHexes
  ) {
    focusInfo.moveHexes.forEach(moveHex => {
      if (moveHex.path.length) {
        const fullPath = [focusInfo.pathStart, ...moveHex.path]
        ctx.lineWidth = 10
        ctx.strokeStyle = '#090'
        ctx.fillStyle = '#090'
        drawPath(ctx, fullPath)
        drawEndPathTriangle(ctx, fullPath)
        drawNumberCircle(ctx, moveHex.path)
      }
    })
  }
}
