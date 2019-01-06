// https://stackoverflow.com/questions/6865832/detecting-if-a-point-is-of-a-line-segment

const isBetween = (q, w, e) => {
  return q < w && w < e || q > w && w > e
}

export const isPointOnSegment = (startPoint, checkPoint, endPoint) => {
  if ((
    startPoint.x === checkPoint.x && checkPoint.x === endPoint.x &&
    isBetween(startPoint.y, checkPoint.y, endPoint.y)
  ) || (
    startPoint.y === checkPoint.y && checkPoint.y === endPoint.y &&
    isBetween(startPoint.x, checkPoint.x, endPoint.x)
  )) {
    return true
  }

  return (
    (Math.abs((endPoint.y - startPoint.y) * (checkPoint.x - startPoint.x)) + .5 | 0) ===
    (Math.abs((checkPoint.y - startPoint.y) * (endPoint.x - startPoint.x)) + .5 | 0)
    &&
    (
      (startPoint.x > checkPoint.x && checkPoint.x > endPoint.x) ||
      (startPoint.x < checkPoint.x && checkPoint.x < endPoint.x)
    )
    &&
    (
      (startPoint.y >= checkPoint.y && checkPoint.y >= endPoint.y) ||
      (startPoint.y <= checkPoint.y && checkPoint.y <= endPoint.y)
    )
  )
}

// window.w = window.w || {}
// window.w.isPointOnSegment = isPointOnSegment
