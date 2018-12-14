'use strict'

const directions = {
  up: ({ x, y }) => ({ x, y: y - 1 }),
  down: ({ x, y }) => ({ x, y: y + 1 }),
  left: ({ x, y }) => ({ x: x - 1, y }),
  right: ({ x, y }) => ({ x: x + 1, y })
}

const cartDirections = {
  '^': directions.up,
  v: directions.down,
  '>': directions.right,
  '<': directions.left
}

const turnDirections = {
  left: direction => {
    if (direction === directions.up) return directions.left
    if (direction === directions.left) return directions.down
    if (direction === directions.down) return directions.right
    return directions.up
  },
  straight: direction => {
    return direction
  },
  right: direction => {
    if (direction === directions.up) return directions.right
    if (direction === directions.right) return directions.down
    if (direction === directions.down) return directions.left
    return directions.up
  }
}

const turnCart = (cart, nextTrack) => {
  if (nextTrack === '+') return cart.turnState.next().value(cart.direction)
  switch (cart.direction) {
    case directions.right:
    case directions.left:
      if (nextTrack === '/') return turnDirections.left(cart.direction)
      if (nextTrack === '\\') return turnDirections.right(cart.direction)
      break
    case directions.up:
    case directions.down:
      if (nextTrack === '/') return turnDirections.right(cart.direction)
      if (nextTrack === '\\') return turnDirections.left(cart.direction)
      break
  }
  return cart.direction
}

function * turnState () {
  while (true) {
    yield turnDirections.left
    yield turnDirections.straight
    yield turnDirections.right
  }
}

const posKey = ({ x, y }) => `${x},${y}`

const parseInput = input => {
  const state = { grid: {}, carts: [] }
  return input.split('\n').reduce((state, line, y) => {
    return line.split('').reduce(({ grid, carts }, character, x) => {
      switch (character) {
        case '^':
        case 'v':
          carts.push({
            direction: cartDirections[character],
            turnState: turnState(),
            position: { x, y },
            crashed: false
          })
          grid[posKey({ x, y })] = '|'
          break
        case '<':
        case '>':
          carts.push({
            direction: cartDirections[character],
            turnState: turnState(),
            position: { x, y },
            crashed: false
          })
          grid[posKey({ x, y })] = '-'
          break
        case '/':
        case '\\':
        case '-':
        case '|':
        case '+':
          grid[posKey({ x, y })] = character
          break
      }
      return { grid, carts }
    }, state)
  }, state)
}

// Part 1
// ======

const sortCarts = (a, b) => {
  return a.position.y - b.position.y || a.position.x - b.position.y
}

const collidingCart = (cart, carts) =>
  carts.find(
    otherCart =>
      otherCart !== cart &&
      !otherCart.crashed &&
      otherCart.position.x === cart.position.x &&
      otherCart.position.y === cart.position.y
  )

const part1 = input => {
  const { grid, carts } = parseInput(input)
  while (true) {
    for (const cart of carts.sort(sortCarts)) {
      cart.position = cart.direction(cart.position)
      if (collidingCart(cart, carts)) return posKey(cart.position)
      cart.direction = turnCart(cart, grid[posKey(cart.position)])
    }
  }
}

// Part 2
// ======

const part2 = input => {
  let { grid, carts } = parseInput(input)
  while (true) {
    for (const cart of carts.sort(sortCarts)) {
      if (cart.crashed) continue
      if (cart.direction(cart.position).y < 0) {
        console.log(grid[posKey(cart.position)])
        throw new Error('foo')
      }
      cart.position = cart.direction(cart.position)
      const otherCart = collidingCart(cart, carts)
      if (otherCart) {
        cart.crashed = true
        otherCart.crashed = true
        continue
      }
      cart.direction = turnCart(cart, grid[posKey(cart.position)])
    }
    carts = carts.filter(cart => !cart.crashed)
    if (carts.length === 1) return posKey(carts[0].position)
  }
}

exports.part1 = part1
exports.part2 = part2
exports.options = {
  noTrim: true
}
