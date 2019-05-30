import {
  board,
  cornersCoordinates
} from './board/board'
import {
  addPoint,
  toPoint
} from './hexUtils'
import {
  isInSight
} from './isInSight'


const canvas = document.getElementById('c')
const ctx = canvas.getContext('2d')
const applyStyle = (style, hex) => typeof style === 'function' ? style(hex) : style

export const renderer = () => {
  if (!board.scenario) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let linesToHover = false
  let hoverHex = false
  const style = board.scenario.style

  if ('noHexes' in style) {
    board.grid
      .filter(gridHex => !board.scenario.hexes.find(hex => hex.x === gridHex.x && hex.y === gridHex.y))
      .filter(gridHex => !board.scenario.wallHexes.find(hex => hex.x === gridHex.x && hex.y === gridHex.y))
      .forEach(gridHex => {
        const [firstCorner, ...otherCorners] = addPoint(cornersCoordinates, toPoint(gridHex))

        ctx.beginPath()
        ctx.moveTo(firstCorner.x, firstCorner.y)
        otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
        ctx.lineTo(firstCorner.x, firstCorner.y)
        if (style.noHexes.line) {
          ctx.strokeStyle = applyStyle(style.noHexes.line, gridHex)
          ctx.stroke()
        }
      })
  }

  board.scenario.wallHexes.forEach(wallHex => {
    const [firstCorner, ...otherCorners] = addPoint(cornersCoordinates, toPoint(wallHex))

    if (style.wallHexes) {
      ctx.beginPath()
      ctx.moveTo(firstCorner.x, firstCorner.y)
      otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
      ctx.lineTo(firstCorner.x, firstCorner.y)
      if (style.wallHexes.line) {
        ctx.strokeStyle = style.wallHexes.line
        ctx.stroke()
      }
      if (style.wallHexes.fill) {
        ctx.fillStyle = applyStyle(style.wallHexes.fill, wallHex)
        ctx.fill()
      }
    }

    // Shade wall hexes always when player is on the board
    if (board.playerHex) {
      ctx.beginPath()
      ctx.moveTo(firstCorner.x, firstCorner.y)
      otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
      ctx.lineTo(firstCorner.x, firstCorner.y)
      ctx.fillStyle = '#000a'
      ctx.fill()
    }
  })

  board.scenario.hexes.forEach(hex => {
    const [firstCorner, ...otherCorners] = addPoint(cornersCoordinates, toPoint(hex))

    ctx.beginPath()
    ctx.moveTo(firstCorner.x, firstCorner.y)
    otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
    ctx.lineTo(firstCorner.x, firstCorner.y)

    if (style.hexes) {
      if (style.hexes.line) {
        ctx.strokeStyle = style.hexes.line
        ctx.stroke()
      }

      if (style.hexes.fill) {
        ctx.fillStyle = style.hexes.fill
        ctx.fill()
      }
    }

    ctx.closePath()

    let isMouseHex = hex.x === board.mouseHex.x && hex.y === board.mouseHex.y
    let responseToisInSight = board.playerHex && isInSight(board.playerHex, hex, isMouseHex)

    if (isMouseHex && responseToisInSight instanceof Array) {
      linesToHover = responseToisInSight
    }

    // Line of sight
    if (responseToisInSight === false) {
      ctx.fillStyle = '#000a'
      ctx.fill()
    }

    // Hex hover
    if (hex.x === board.mouseHex.x && hex.y === board.mouseHex.y) {
      if (style.hexHover) {
        ctx.fillStyle = applyStyle(style.hexHover)
        ctx.fill()
      }
      hoverHex = true
    }

    // Player
    if (board.playerHex && hex.x === board.playerHex.x && hex.y === board.playerHex.y) {
      ctx.fillStyle = '#00f8'
      ctx.fill()
    }
  })

  // Numbers on hexes
  // ctx.font = '14px Arial'
  // board.grid.forEach(gridHex => {
  //   const firstCorner = addPoint(cornersCoordinates, toPoint(gridHex))[0]
  //
  //   ctx.fillStyle = '#000'
  //   ctx.fillText(`${gridHex.x}, ${gridHex.y}`, firstCorner.x - 61, firstCorner.y - 23)
  //   ctx.fillStyle = '#fff'
  //   ctx.fillText(`${gridHex.x}, ${gridHex.y}`, firstCorner.x - 60, firstCorner.y - 22)
  // })

  // noHex hover
  if (
    !hoverHex &&
    board.mouseHex &&
    style.noHexHover
  ) {
    if (board.mouseHex.x !== null && board.mouseHex.y !== null) {
      const [firstCorner, ...otherCorners] = addPoint(cornersCoordinates, toPoint(board.mouseHex))

      ctx.beginPath()
      ctx.moveTo(firstCorner.x, firstCorner.y)
      otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
      ctx.lineTo(firstCorner.x, firstCorner.y)

      ctx.fillStyle = applyStyle(style.noHexHover)
      ctx.fill()
    }
  }

  if (style.thinWalls) {
    ctx.lineWidth = style.thinWalls.width
    ctx.strokeStyle = style.thinWalls.line
    board.scenario.thinWalls.forEach(thinWall => {
      ctx.beginPath()
      ctx.moveTo(thinWall.x1, thinWall.y1)
      ctx.lineTo(thinWall.x2, thinWall.y2)
      ctx.stroke()
    })
    ctx.lineWidth = 1
  }

  // Draw walls
  // if (renderDebug) {
  //   ctx.strokeStyle = '#fff'
  //   ctx.lineWidth = 1
  //   board.scenario.walls.forEach(wall => {
  //     ctx.beginPath()
  //     ctx.moveTo(wall.x1, wall.y1)
  //     ctx.lineTo(wall.x2, wall.y2)
  //     ctx.stroke()
  //   })
  // }

  if (linesToHover) {
    let shortestLine = linesToHover.reduce((acc, line) => {
      line.len = Math.sqrt(((line.x - line.a) ** 2) + ((line.y - line.b) ** 2))
      if (!acc || line.len < acc.len) {
        acc = line
      }
      return acc
    }, false)

    // linesToHover.forEach(line => {
    ctx.beginPath()
    ctx.moveTo(shortestLine.a, shortestLine.b)
    ctx.lineTo(shortestLine.x, shortestLine.y)
    ctx.lineWidth = 3
    ctx.strokeStyle = '#f0fe'
    ctx.stroke()
    ctx.lineWidth = 1
    // })
  }
}
