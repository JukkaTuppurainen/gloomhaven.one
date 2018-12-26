// https://stackoverflow.com/questions/6865832/detecting-if-a-point-is-of-a-line-segment

const isBetween = (q, w, e) => {
  return q < w && w < e || q > w && w > e
}

export const isPointOnSegment = (startPoint, checkPoint, endPoint) => {

  // console.log(startPoint, checkPoint, endPoint)
  //
  // console.log(
  //   ((endPoint.y - startPoint.y) * (checkPoint.x - startPoint.x)),
  //   ((checkPoint.y - startPoint.y) * (endPoint.x - startPoint.x))
  // )
  //
  // console.log(
  //   ((endPoint.y - startPoint.y) * (checkPoint.x - startPoint.x)).toFixed(0),
  //   ((checkPoint.y - startPoint.y) * (endPoint.x - startPoint.x)).toFixed(0)
  // )

  // if (
  //   (
  //     startPoint.x === checkPoint.x && checkPoint.x === endPoint.x &&
  //     isBetween(startPoint.x, checkPoint.x, endPoint.x)
  //   ) &&
  //   (
  //     startPoint.y === checkPoint.y && checkPoint.y === endPoint.y &&
  //     isBetween(startPoint.y, checkPoint.y, endPoint.y)
  //   )
  // ) {
  //   return true
  // }

  return (
    ((endPoint.y - startPoint.y) * (checkPoint.x - startPoint.x)).toFixed(0) ===
    ((checkPoint.y - startPoint.y) * (endPoint.x - startPoint.x)).toFixed(0)
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
