'use strict'

// Part 1
// ======

const parseLine = line => {
  const {
    groups: { positionX, positionY, velocityX, velocityY }
  } = line.match(
    /^position=<(?<positionX>[- ]\d+), (?<positionY>[- ]\d+)> velocity=<(?<velocityX>[- ]\d+), (?<velocityY>[- ]\d+)>$/
  )
  return {
    position: {
      x: Number(positionX),
      y: Number(positionY)
    },
    velocity: {
      x: Number(velocityX),
      y: Number(velocityY)
    }
  }
}

const parseInput = input => input.split('\n').map(parseLine)

const findBoundingDimensions = vectors => {
  const { minX, minY, maxX, maxY } = vectors.reduce(
    ({ minX, minY, maxX, maxY }, { position: { x, y } }) => ({
      minX: Math.min(minX, x),
      minY: Math.min(minY, y),
      maxX: Math.max(maxX, x),
      maxY: Math.max(maxY, y)
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  )
  const width = maxX - minX
  const height = maxY - minY
  return { minX, minY, maxX, maxY, width, height }
}

const findBoundingArea = vectors => {
  const { width, height } = findBoundingDimensions(vectors)
  return width * height
}

const moveVectors = vectors => {
  return vectors.map(({ position, velocity }) => ({
    position: {
      x: position.x + velocity.x,
      y: position.y + velocity.y
    },
    velocity
  }))
}

const renderVectors = vectors => {
  const { minX, minY, maxX, maxY } = findBoundingDimensions(vectors)
  const grid = vectors.reduce((grid, { position: { x, y } }) => {
    grid[`${x}:${y}`] = true
    return grid
  }, {})
  let lines = []
  for (let y = minY; y <= maxY; y++) {
    let line = ''
    for (let x = minX; x <= maxX; x++) {
      line += grid[`${x}:${y}`] ? '#' : ' '
    }
    lines.push(line)
  }
  return lines.join('\n')
}

const findMessage = input => {
  const vectors = parseInput(input)
  let currentArea = {
    seconds: 0,
    area: findBoundingArea(vectors),
    vectors
  }
  while (true) {
    const nextVectors = moveVectors(currentArea.vectors)
    const nextArea = findBoundingArea(nextVectors)
    if (nextArea > currentArea.area) return currentArea
    currentArea = {
      area: nextArea,
      vectors: nextVectors,
      seconds: currentArea.seconds + 1
    }
  }
}

const part1 = async input => {
  return renderVectors(findMessage(input).vectors)
}

// Part 2
// ======

const part2 = input => {
  return findMessage(input).seconds
}

exports.part1 = part1
exports.part2 = part2
