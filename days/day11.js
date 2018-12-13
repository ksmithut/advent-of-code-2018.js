'use strict'

// Part 1
// ======

const range = (a, b) => new Array(b - a + 1).fill(null).map((_, i) => i + a)
const nthDigit = (digit, num) =>
  Number(
    String(num)
      .split('')
      .reverse()[digit] || '0'
  )

const createGrid = (serialNumber, width, height) => {
  return range(1, height).reduce((grid, y) => {
    return range(1, width).reduce((grid, x) => {
      const rackId = x + 10
      let powerLevel = rackId * y
      powerLevel += serialNumber
      powerLevel *= rackId
      powerLevel = nthDigit(2, powerLevel)
      powerLevel -= 5
      grid[`${x},${y}`] = powerLevel
      return grid
    }, grid)
  }, {})
}

const createSumGrid = (serialNumber, width, height) => {
  const grid = createGrid(serialNumber, width, height)
  const key = (x, y) => `${x},${y}`
  const get = (grid, x, y) => grid[key(x, y)] || 0
  return Object.entries(grid).reduce((sum, [gridKey, value]) => {
    const [x, y] = gridKey.split(',')
    sum[key(x, y)] =
      get(grid, x, y) +
      get(sum, x - 1, y) +
      get(sum, x, y - 1) -
      get(sum, x - 1, y - 1)
    return sum
  }, {})
}

const findArea = (size, x, y, sums) => {
  const s = size
  return (
    sums[`${x + s},${y + s}`] +
    sums[`${x},${y}`] -
    sums[`${x + s},${y}`] -
    sums[`${x},${y + s}`]
  )
}

const findBestArea = (size, width, height, sums) => {
  return range(1, height - size).reduce(
    (best, y) => {
      return range(1, width - size).reduce((best2, x) => {
        const total = findArea(size, x, y, sums)
        return best2.total >= total
          ? best2
          : { x: x + 1, y: y + 1, total, size }
      }, best)
    },
    { x: -1, y: -1, size, total: -Infinity }
  )
}

const part1 = input => {
  const width = 300
  const height = 300
  const size = 3
  const sums = createSumGrid(Number(input), width, height)
  const { x, y } = findBestArea(size, width, height, sums)
  return `${x},${y}`
}

// Part 2
// ======

const part2 = input => {
  const width = 300
  const height = 300
  const sums = createSumGrid(Number(input), width, height)
  const { x, y, size } = range(1, width).reduce(
    (best, size) => {
      const possibleBest = findBestArea(size, width, height, sums)
      return best.total > possibleBest.total ? best : possibleBest
    },
    { x: -1, y: -1, size: 0, total: -Infinity }
  )
  return `${x},${y},${size}`
}

exports.part1 = part1
exports.part2 = part2
