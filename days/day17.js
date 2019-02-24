'use strict'

// Part 1
// ======

const CLAY = '#'
const SAND = '.'
const WATER = '~'
const FLOW = '|'

const posKey = ({ x, y }) => `${x},${y}`
const range = (a, b) => new Array(b - a + 1).fill(null).map((_, i) => i + a)

const findBounds = grid => {
  return Object.keys(grid).reduce(
    ({ minX, minY, maxX, maxY }, key) => {
      const [x, y] = key.split(',').map(num => Number(num))
      return {
        minX: Math.min(minX, x),
        minY: Math.min(minY, y),
        maxX: Math.max(maxX, x),
        maxY: Math.max(maxY, y)
      }
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  )
}

const parseInput = input => {
  const clay = input.split('\n').reduce((grid, line) => {
    const { x: xRange, y: yRange } = line
      .split(', ')
      .sort()
      .reduce((definition, part) => {
        const [key, value] = part.split('=')
        const {
          groups: { start, end }
        } = value.match(/^(?<start>\d+)(\.\.(?<end>\d+))?$/)
        definition[key] = end
          ? range(Number(start), Number(end))
          : range(Number(start), Number(start))
        return definition
      }, {})
    return yRange.reduce((grid, y) => {
      return xRange.reduce((grid, x) => {
        grid[posKey({ x, y })] = { x, y }
        return grid
      }, grid)
    }, grid)
  }, {})
  const bounds = findBounds(clay)
  const grid = range(bounds.minY, bounds.maxY).reduce((grid, y) => {
    return range(bounds.minX - 1, bounds.maxX + 1).reduce((grid, x) => {
      grid[posKey({ x, y })] = clay[posKey({ x, y })] ? CLAY : SAND
      return grid
    }, grid)
  }, {})
  return {
    grid,
    bounds
  }
}

const directions = {
  up: ({ x, y }) => ({ x, y: y - 1 }),
  down: ({ x, y }) => ({ x, y: y + 1 }),
  left: ({ x, y }) => ({ x: x - 1, y }),
  right: ({ x, y }) => ({ x: x + 1, y })
}

const isFilled = (grid, point) => {
  const value = grid[posKey(point)]
  return value === CLAY || value === WATER
}
const belowIsFilled = (grid, point) => isFilled(grid, directions.down(point))
const leftIsFilled = (grid, point) => isFilled(grid, directions.left(point))
const rightIsFilled = (grid, point) => isFilled(grid, directions.right(point))

const fillWater = (grid, source, maxY) => {
  let leftPointer = { ...source }
  let rightPointer = { ...source }
  while (!leftIsFilled(grid, leftPointer) && belowIsFilled(grid, leftPointer)) {
    leftPointer = directions.left(leftPointer)
    grid[posKey(leftPointer)] = FLOW
  }
  grid[posKey(rightPointer)] = FLOW
  while (
    !rightIsFilled(grid, rightPointer) &&
    belowIsFilled(grid, rightPointer)
  ) {
    rightPointer = directions.right(rightPointer)
    grid[posKey(rightPointer)] = FLOW
  }
  if (leftIsFilled(grid, leftPointer) && rightIsFilled(grid, rightPointer)) {
    for (let x = leftPointer.x; x <= rightPointer.x; x++) {
      grid[posKey({ x, y: source.y })] = WATER
    }
    return fillWater(grid, { x: source.x, y: source.y - 1 }, maxY)
  }
  if (!belowIsFilled(grid, leftPointer)) {
    pourWaterDown(grid, leftPointer, maxY)
  }
  if (!belowIsFilled(grid, rightPointer)) {
    pourWaterDown(grid, rightPointer, maxY)
  }
}

const pourWaterDown = (grid, source, maxY) => {
  let pointer = { ...source }
  while (pointer.y < maxY && !belowIsFilled(grid, pointer)) {
    pointer = directions.down(pointer)
    if (grid[posKey(pointer)] === FLOW) return
    grid[posKey(pointer)] = FLOW
  }
  if (pointer.y >= maxY) return
  return fillWater(grid, pointer, maxY)
}

// const printGrid = grid => {
//   const bounds = findBounds(grid)
//   let output = ''
//   for (let y = bounds.minY; y <= bounds.maxY; y++) {
//     for (let x = bounds.minX - 1; x <= bounds.maxX + 1; x++) {
//       output += grid[posKey({ x, y })] || '.'
//     }
//     output += '\n'
//   }
//   console.log(output)
// }

const part1 = input => {
  const { grid, bounds } = parseInput(input)
  const spout = { y: bounds.minY - 1, x: 500 }
  pourWaterDown(grid, spout, bounds.maxY)
  return Object.values(grid).reduce((total, item) => {
    return item === WATER || item === FLOW ? total + 1 : total
  }, 0)
}

// Part 2
// ======

const part2 = input => {
  const { grid, bounds } = parseInput(input)
  const spout = { y: bounds.minY - 1, x: 500 }
  pourWaterDown(grid, spout, bounds.maxY)
  return Object.values(grid).reduce((total, item) => {
    return item === WATER ? total + 1 : total
  }, 0)
}

exports.part1 = part1
exports.part2 = part2
