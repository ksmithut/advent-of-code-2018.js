'use strict'

// Part 1
// ======

class ElfDiedError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.code = 'ELF_DIED_ERROR'
  }
}

const posKey = ({ x, y }) => `${x},${y}`

const minBySort = (a, b, sort) => {
  const val = sort(a, b)
  if (val < 0) return a
  if (val > 0) return b
  return a
}

const findMove = source => {
  const { character } = source
  const queue = [[source]]
  const visited = new Set([source])
  let nextPath
  while (queue.length) {
    const path = queue.shift()
    const { up, left, right, down } = path[path.length - 1]
    const neighbors = [up, left, right, down]
      .filter(Boolean)
      .filter(neighbor => !visited.has(neighbor))
      .filter(neighbor => !neighbor.wall)
      .filter(
        neighbor =>
          !neighbor.character || neighbor.character.team !== character.team
      )
    const enemies = neighbors.filter(neighbor => neighbor.character)
    if (enemies.length) {
      if (!nextPath) nextPath = path
      nextPath = minBySort(nextPath, path, (a, b) => {
        const pointA = a[a.length - 1]
        const pointB = b[b.length - 1]
        return a.length - b.length || pointA.y - pointB.y || pointA.x - pointB.x
      })
      continue
    }
    visited
      .add(up)
      .add(left)
      .add(right)
      .add(down)
    queue.push(...neighbors.map(neighbor => path.concat([neighbor])))
  }
  return nextPath && nextPath[1]
}

const parseInput = (input, teams, stopAtElfDeath = false) => {
  // const minX = 0
  // const minY = 0
  // const maxX = input.split('\n')[0].length - 1
  // const maxY = input.split('\n').length - 1

  const grid = input.split('\n').reduce((grid, row, y) => {
    return row.split('').reduce((grid, char, x) => {
      const node = {
        x,
        y,
        wall: char === '#',
        character: teams[char]
          ? {
            team: char,
            hitPoints: teams[char].hitPoints,
            power: teams[char].power
          }
          : null
      }
      const up = grid[posKey({ x, y: y - 1 })]
      const left = grid[posKey({ x: x - 1, y })]
      if (up) {
        node.up = up
        up.down = node
      }
      if (left) {
        node.left = left
        left.right = node
      }
      grid[posKey({ x, y })] = node
      return grid
    }, grid)
  }, {})

  const move = source => {
    const targets = Object.values(grid).filter(
      point => point.character && point.character.team !== source.character.team
    )
    if (!targets.length) return true
    let currentPoint = source
    const nextPoint = findMove(source)
    if (nextPoint) {
      nextPoint.character = currentPoint.character
      delete currentPoint.character
      currentPoint = nextPoint
    }
    const target = [
      currentPoint.up,
      currentPoint.left,
      currentPoint.right,
      currentPoint.down
    ]
      .filter(
        point =>
          point.character &&
          point.character.team !== currentPoint.character.team
      )
      .sort(
        (a, b) =>
          a.character.hitPoints - b.character.hitPoints ||
          a.y - b.y ||
          a.x - b.x
      )[0]
    if (target) {
      target.character.hitPoints -= currentPoint.character.power
      if (target.character.hitPoints <= 0) {
        if (stopAtElfDeath && target.character.team === 'E') {
          throw new ElfDiedError()
        }
        delete target.character
      }
    }
    currentPoint.character.moved = true
  }

  const round = grid => {
    return Object.values(grid)
      .filter(point => point.character)
      .map(point => {
        point.character.moved = false
        return point
      })
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .some(point => {
        if (!point.character) return
        if (point.character.moved) return
        return move(point)
      })
  }

  // const toString = grid => {
  //   let output = ''
  //   for (let y = minY; y <= maxY; y++) {
  //     for (let x = minX; x <= maxX; x++) {
  //       const point = grid[posKey({ x, y })]
  //       if (point.wall) output += '#'
  //       else if (!point.character) output += '.'
  //       else output += point.character.team
  //     }
  //     output += '\n'
  //   }
  //   return output
  // }

  const play = grid => {
    let rounds = 0
    while (true) {
      if (round(grid)) break
      rounds += 1
    }
    const sum = Object.values(grid)
      .filter(point => point.character)
      .reduce((total, { character }) => total + character.hitPoints, 0)
    return rounds * sum
  }

  return play(grid)
}

const part1 = input => {
  return parseInput(input, {
    E: { hitPoints: 200, power: 3 },
    G: { hitPoints: 200, power: 3 }
  })
}

// Part 2
// ======

const part2 = input => {
  let elfPower = 3
  while (true) {
    try {
      return parseInput(
        input,
        {
          E: { hitPoints: 200, power: elfPower },
          G: { hitPoints: 200, power: 3 }
        },
        true
      )
    } catch (err) {
      if (err instanceof ElfDiedError) elfPower++
      else throw err
    }
  }
}

exports.part1 = part1
exports.part2 = part2
