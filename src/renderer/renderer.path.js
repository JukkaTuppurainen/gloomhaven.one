// import {
//   board,
//   hexHeight,
//   hexWidth
// }                 from '../board/board'
// import {toPoint}  from '../lib/hexUtils'
//
//
// export const drawPath = ctx => {
//   if (board.paths) {
//     board.paths.forEach(path => {
//       ctx.beginPath()
//       let first = true
//       let prevPoint
//       let trianglePoints = []
//
//       ctx.beginPath()
//
//       path.forEach((pathHex, i) => {
//         let point = toPoint(pathHex)
//         point.x += hexWidth / 2
//         point.y += hexHeight / 2
//
//         if (first) {
//           let playerPoint = toPoint(board.pathStart)
//           playerPoint.x += hexWidth / 2
//           playerPoint.y += hexHeight / 2
//
//           ctx.moveTo(
//             (playerPoint.x + point.x) / 2,
//             (playerPoint.y + point.y) / 2
//           )
//           first = false
//         }
//
//         if (i < path.length - 1) {
//           ctx.lineTo(point.x, point.y)
//         } else if (prevPoint) {
//           ctx.lineTo(
//             (prevPoint.x + point.x) / 2,
//             (prevPoint.y + point.y) / 2
//           )
//
//           let angle = Math.atan2(prevPoint.y - point.y, prevPoint.x - point.x)
//           let arrowWidth = Math.PI * 0.1
//
//           trianglePoints.push({
//             x: point.x + 20 * Math.cos(angle),
//             y: point.y + 20 * Math.sin(angle)
//           })
//
//           trianglePoints.push(
//             {
//               x: trianglePoints[0].x + 35 * Math.cos(angle + arrowWidth),
//               y: trianglePoints[0].y + 35 * Math.sin(angle + arrowWidth)
//             },
//             {
//               x: trianglePoints[0].x + 35 * Math.cos(angle - arrowWidth),
//               y: trianglePoints[0].y + 35 * Math.sin(angle - arrowWidth)
//             }
//           )
//         }
//
//         prevPoint = point
//       })
//
//       if (prevPoint && trianglePoints.length) {
//         ctx.lineWidth = 10
//         ctx.strokeStyle = ctx.fillStyle = '#090'
//         ctx.stroke()
//
//         ctx.lineWidth = 1
//         ctx.beginPath()
//         ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y)
//         ctx.lineTo(trianglePoints[1].x, trianglePoints[1].y)
//         ctx.lineTo(trianglePoints[2].x, trianglePoints[2].y)
//         ctx.lineTo(trianglePoints[0].x, trianglePoints[0].y)
//         ctx.fill()
//
//         ctx.arc(prevPoint.x, prevPoint.y, 14, 0, Math.PI * 2)
//         ctx.fill()
//
//         ctx.textAlign = 'center'
//         ctx.font = '24px "Pirata One"'
//         ctx.fillStyle = '#fff'
//         ctx.fillText(path.pathLength, prevPoint.x, prevPoint.y + 9)
//       }
//     })
//   }
// }
