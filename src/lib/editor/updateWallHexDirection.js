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

export const updateWallHexDirections = () => {
  board.scenario.wallHexes.forEach(wallHex => {
    let adjacentInDirection
    let adjacentWalls = []
    for (let i = 0; i < 6; ++i) {
      adjacentInDirection = board.grid.neighborsOf(wallHex, i)
      if (adjacentInDirection.length) {
        let wallHex = board.scenario.wallHexes.find(
          hex => hex.x === adjacentInDirection[0].x && hex.y === adjacentInDirection[0].y
        )
        if (wallHex) {
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
      setWallPattern(wallHex, [2, 3], [0, 5], 5, 6, 2)
    }

    else if ((
      adjacentWalls.length === 1 &&
      (adjacentWalls[0] === 2 || adjacentWalls[0] === 5)
    ) || (
      adjacentWalls.length === 2 &&
      adjacentWalls.includes(2) &&
      adjacentWalls.includes(5)
    )) {
      setWallPattern(wallHex, [0, 1], [3, 4], 7, 8, 3)
    }

    else if ((
      adjacentWalls.length === 1 &&
      (adjacentWalls[0] === 0 || adjacentWalls[0] === 3)
    ) || (
      adjacentWalls.length === 2 &&
      adjacentWalls.includes(0) &&
      adjacentWalls.includes(3)
    )) {
      setWallPattern(wallHex, [1, 2], [4, 5], 9, 10, 4)
    }

    else {
      wallHex.direction = 1
    }
  })
}
