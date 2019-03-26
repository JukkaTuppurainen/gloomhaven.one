import {board}    from '../board/board'


const setWallPattern = (wallHex, left, right, patternLeft, patternRight, patternBoth) => {
  const onLeftSide = board.grid.neighborsOf(wallHex, left).filter(
    hex => board.scenario.hexes.find(tileHex => hex.x === tileHex.x && hex.y === tileHex.y)
  )
  const onRightSide = board.grid.neighborsOf(wallHex, right).filter(
    hex => board.scenario.hexes.find(tileHex => hex.x === tileHex.x && hex.y === tileHex.y)
  )

  if (onLeftSide.length && !onRightSide.length) {
    wallHex.direction = patternLeft
  } else if (!onLeftSide.length && onRightSide.length) {
    wallHex.direction = patternRight
  } else {
    wallHex.direction = patternBoth
  }
}

const checkHex = (a, b) => (
  b instanceof Array
    ? b.includes(a) || b.includes(a - 1000)
    : a === b || a - 1000 === b
)

export const updateWallHexDirections = () => {
  board.scenario.wallHexes.forEach(wallHex => {
    let adjacentInDirection
    let adjacentWalls = []
    for (let i = 0; i < 6; ++i) {
      adjacentInDirection = board.grid.neighborsOf(wallHex, i)
      if (adjacentInDirection.length) {
        let adjacentWallHex = board.scenario.wallHexes.find(
          hex => hex.x === adjacentInDirection[0].x && hex.y === adjacentInDirection[0].y
        )
        if (adjacentWallHex) {
          adjacentWalls.push(i)
        }
      }
    }

    if ((
      adjacentWalls.length === 1 &&
      (adjacentWalls[0] === 1 || adjacentWalls[0] === 4)
    ) || (
      adjacentWalls.length === 2 &&
      adjacentWalls.includes(1) &&
      adjacentWalls.includes(4)
    )) {
      setWallPattern(wallHex, [2, 3], [0, 5], 6, 7, 3)
    }

    else if ((
      adjacentWalls.length === 1 &&
      (adjacentWalls[0] === 2 || adjacentWalls[0] === 5)
    ) || (
      adjacentWalls.length === 2 &&
      adjacentWalls.includes(2) &&
      adjacentWalls.includes(5)
    )) {
      setWallPattern(wallHex, [0, 1], [3, 4], 8, 9, 4)
    }

    else if ((
      adjacentWalls.length === 1 &&
      (adjacentWalls[0] === 0 || adjacentWalls[0] === 3)
    ) || (
      adjacentWalls.length === 2 &&
      adjacentWalls.includes(0) &&
      adjacentWalls.includes(3)
    )) {
      setWallPattern(wallHex, [1, 2], [4, 5], 10, 11, 5)
    }

    else if (
      adjacentWalls.length === 2 &&
      adjacentWalls.includes(3) &&
      adjacentWalls.includes(5)
    ) {
      setWallPattern(wallHex, 4, 2, 1000, 13)
    }

    else if (
      adjacentWalls.length === 2 &&
      adjacentWalls.includes(2) &&
      adjacentWalls.includes(0)
    ) {
      setWallPattern(wallHex, 1, 5, 1000, 12)
    }

    else {
      wallHex.direction = 1002
    }
  })

  board.scenario.wallHexes.forEach(wallHex => {
    if (wallHex.direction > 999) {
      let wallsInAdjacentDirections = {}
      let adjacentInDirection
      let adjacentWallHex
      let adjacentFloorHex
      for (let i = 0; i < 6; ++i) {
        adjacentInDirection = board.grid.neighborsOf(wallHex, i)

        if (adjacentInDirection.length) {
          adjacentWallHex = board.scenario.wallHexes.find(
            hex => hex.x === adjacentInDirection[0].x && hex.y === adjacentInDirection[0].y
          )
          if (adjacentWallHex) {
            wallsInAdjacentDirections[i] = adjacentWallHex.direction
          } else {
            adjacentFloorHex = board.scenario.hexes.find(
              hex => hex.x === adjacentInDirection[0].x && hex.y === adjacentInDirection[0].y
            )
            if (adjacentFloorHex) {
              wallsInAdjacentDirections[i] = 1
            }
          }
        }
      }

      [
        {rules: [[1, [2, 7]], [5, 0]], result: 16},
        {rules: [[4, [2, 7]], [0, 0]], result: 17},
        {rules: [[1, [2, 6]], [3, 0]], result: 14},
        {rules: [[4, [2, 6]], [2, 0]], result: 15},
        {rules: [[3, [2, 11]], [5, [2, 9]], [4, 1]], result: 18},
        {rules: [[2, [2, 8]], [0, [2, 10]], [1, 1]], result: 19}
      ].forEach(row => {
        let isOk = true
        row.rules.forEach(rule => {
          if (!checkHex(wallsInAdjacentDirections[rule[0]], rule[1])) {
            isOk = false
          }
        })
        if (isOk) {
          wallHex.direction = row.result
        }
      })

      if (wallHex.direction > 999) {
        wallHex.direction -= 1000
      }
    }
  })
}
