'use strict'

// Part 1
// ======

const range = (a, b) => new Array(b - a + 1).fill(null).map((_, i) => i + a)

const parseInput = input => {
  return input.split('\n').reduce((grid, line, y) => {
    return line.split('').reduce((grid, cell, x) => {
      grid[`${x},${y}`] = { x, y, cell }
      return grid
    }, grid)
  }, {})
}

const adjacent = (x, y, grid) => {
  return [
    grid[`${x - 1},${y - 1}`],
    grid[`${x},${y - 1}`],
    grid[`${x + 1},${y - 1}`],
    grid[`${x - 1},${y}`],
    grid[`${x + 1},${y}`],
    grid[`${x - 1},${y + 1}`],
    grid[`${x},${y + 1}`],
    grid[`${x + 1},${y + 1}`]
  ].filter(Boolean)
}

const runLandscape = grid => {
  return Object.values(grid).reduce((newGrid, { x, y, cell }) => {
    const neighbors = adjacent(x, y, grid)
    let newValue
    switch (cell) {
      case '.':
        newValue =
          neighbors.filter(({ cell }) => cell === '|').length >= 3
            ? { x, y, cell: '|' }
            : { x, y, cell }
        break
      case '|':
        newValue =
          neighbors.filter(({ cell }) => cell === '#').length >= 3
            ? { x, y, cell: '#' }
            : { x, y, cell }
        break
      case '#':
        const { '|': trees = 0, '#': lumberyards = 0 } = neighbors.reduce(
          (counts, { cell }) => {
            counts[cell]++
            return counts
          },
          { '|': 0, '#': 0, '.': 0 }
        )
        newValue = trees && lumberyards ? { x, y, cell } : { x, y, cell: '.' }
        break
      default:
        throw new Error('hello')
    }
    newGrid[`${x},${y}`] = newValue
    return newGrid
  }, {})
}

const countCells = grid => {
  return Object.values(grid).reduce(
    (counts, { cell }) => {
      counts[cell]++
      return counts
    },
    { '|': 0, '#': 0, '.': 0 }
  )
}

const part1 = input => {
  const grid = range(1, 10).reduce(
    grid => runLandscape(grid),
    parseInput(input)
  )
  const { '|': trees, '#': lumberyards } = countCells(grid)
  return trees * lumberyards
}

// Part 2
// ======

const part2 = input => {
  const minutes = 1000000000
  let grid = parseInput(input)
  let history = []
  let pattern = []
  for (let i = 0; i < minutes; i++) {
    const { '|': trees, '#': lumberyards } = countCells(grid)
    const value = trees * lumberyards
    if (history.indexOf(value) !== -1) {
      if (pattern.indexOf(value) !== -1) {
        const shortPattern = pattern.filter(() => true)
        const index = (minutes - pattern.length) % shortPattern.length
        return shortPattern[index]
      }
      pattern[i] = value
    } else {
      pattern = []
    }
    history.push(value)
    grid = runLandscape(grid)
  }
  // The below shouldn't if a pattern is found. Spoiler alert <69 74 20 64 6f 65 73>
  const { '|': trees, '#': lumberyards } = countCells(grid)
  return trees * lumberyards
}

exports.part1 = part1
exports.part2 = part2
