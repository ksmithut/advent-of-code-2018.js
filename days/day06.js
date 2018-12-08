'use strict'

// Part 1
// ======

const parseLine = line => {
  const [x, y] = line.split(', ').map(num => Number(num))
  return { x, y }
}
const parseInput = input => input.split('\n').map(parseLine)
const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
const getBounds = points =>
  points.reduce(
    ({ maxX, maxY, minX, minY }, { x, y }) => ({
      minX: Math.min(minX, x),
      minY: Math.min(minY, y),
      maxX: Math.max(maxX, x),
      maxY: Math.max(maxY, y)
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  )
const reduceGrid = (reducer, { minX, minY, maxX, maxY }, value) => {
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      value = reducer(value, { x, y })
    }
  }
  return value
}
const reduceGridBorder = (reducer, { minX, minY, maxX, maxY }, value) => {
  for (let x = minX; x < maxX; x++) value = reducer(value, { x, y: minY })
  for (let y = minY; y < maxY; y++) value = reducer(value, { x: maxX, y })
  for (let x = maxX; x > minX; x--) value = reducer(value, { x, y: maxY })
  for (let y = maxY; y > minY; y--) value = reducer(value, { x: minX, y })
  return value
}

const part1 = input => {
  const points = parseInput(input)
  const { minX, minY, maxX, maxY } = getBounds(points)
  const width = maxX - minX
  const height = maxY - minY
  const expandedGrid = {
    minX: minX - width,
    minY: minY - height,
    maxX: maxX + width,
    maxY: maxY + height
  }
  const findClosest = (pointA, points) =>
    points.reduce(
      ({ closest, same }, pointB) => {
        if (!closest) return { closest: pointB, same }
        const closestDist = distance(pointA, closest)
        const pointDist = distance(pointA, pointB)
        if (closestDist < pointDist) return { closest, same }
        if (closestDist > pointDist) return { closest: pointB, same: false }
        return { closest, same: true }
      },
      { closest: null, same: false }
    )
  const { areas, cells } = reduceGrid(
    ({ areas, cells }, { x, y }) => {
      const { closest, same } = findClosest({ x, y }, points)
      const closestKey = same ? null : `${closest.x}:${closest.y}`
      areas[closestKey] = (areas[closestKey] || 0) + 1
      cells[`${x}:${y}`] = closestKey
      return { areas, cells }
    },
    expandedGrid,
    { areas: {}, cells: {} }
  )
  const finiteAreas = reduceGridBorder(
    (areas, { x, y }) => {
      delete areas[cells[`${x}:${y}`]]
      return areas
    },
    expandedGrid,
    areas
  )
  return Object.values(finiteAreas).reduce((a, b) => Math.max(a, b))
}
// 5035

// Part 2
// ======

const part2 = input => {
  const maxDistance = 10000 - 1
  const points = parseInput(input)
  const bounds = getBounds(points)
  const sumDistances = (pointA, points) =>
    points.reduce((sum, pointB) => sum + distance(pointA, pointB), 0)
  const cells = reduceGrid(
    (cells, { x, y }) => {
      const totalDistances = sumDistances({ x, y }, points)
      cells[`${x}:${y}`] = totalDistances <= maxDistance
      return cells
    },
    bounds,
    {}
  )
  return Object.values(cells).filter(Boolean).length
}

exports.part1 = part1
exports.part2 = part2
