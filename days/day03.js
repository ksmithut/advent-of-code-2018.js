'use strict'

// Part 1
// ======

const parseLine = line => {
  const {
    groups: { id, x, y, width, height }
  } = line.match(
    /^#(?<id>\d+) @ (?<x>\d+),(?<y>\d+): (?<width>\d+)x(?<height>\d+)$/
  )
  return {
    id,
    x: Number(x),
    y: Number(y),
    width: Number(width),
    height: Number(height)
  }
}

function reduceArea (reducer, area, value) {
  for (let x = area.x; x < area.x + area.width; x++) {
    for (let y = area.y; y < area.y + area.height; y++) {
      value = reducer(value, { x, y })
    }
  }
  return value
}

const part1 = input => {
  const grid = input.split('\n').reduce((grid, line) => {
    return reduceArea(
      (grid, { x, y }) => {
        const key = `${x}:${y}`
        grid[key] = (grid[key] || 0) + 1
        return grid
      },
      parseLine(line),
      grid
    )
  }, {})
  return Object.values(grid).reduce((count, cellCount) => {
    return cellCount === 1 ? count : count + 1
  }, 0)
}

// Part 2
// ======

const part2 = input => {
  const { claims } = input.split('\n').reduce(
    ({ claims, grid }, line) => {
      const area = parseLine(line)
      claims[area.id] = {}
      return reduceArea(
        ({ claims, grid }, { x, y }) => {
          const key = `${x}:${y}`
          grid[key] = (grid[key] || 0) + 1
          claims[area.id][key] = () => grid[key]
          return { claims, grid }
        },
        area,
        { claims, grid }
      )
    },
    { claims: {}, grid: {} }
  )
  const [nonOverlappingId] = Object.entries(claims).find(([id, areaGrid]) => {
    return Object.values(areaGrid).every(getUsageCount => getUsageCount() === 1)
  })
  return nonOverlappingId
}
// 1067

exports.part1 = part1
exports.part2 = part2
