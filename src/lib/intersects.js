// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
export const intersects = (a, b, c, d, p, q, r, s) => {
  let det, gamma, lambda
  det = (c - a) * (s - q) - (r - p) * (d - b)
  if (det === 0) {
    return false
  }
  lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
  gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
  return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)
}
