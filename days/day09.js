'use strict'

// Part 1
// ======

const range = (a, b) => new Array(b - a + 1).fill(null).map((_, i) => i + a)
const parseInput = input => {
  const {
    groups: { maxPlayers, maxMarble }
  } = input.match(
    /^(?<maxPlayers>\d+) players; last marble is worth (?<maxMarble>\d+) points$/
  )
  return {
    maxPlayers: Number(maxPlayers),
    maxMarble: Number(maxMarble)
  }
}

const createCircle = () => {
  return {
    add (value, after) {
      const node = { value }
      if (!after) {
        node.prev = node
        node.next = node
      } else {
        node.prev = after
        node.next = after.next
        after.next.prev = node
        after.next = node
      }
      return node
    },
    move (node, amount) {
      const direction = amount > 0 ? 'next' : 'prev'
      let cursor = node
      for (let i = 0; i < Math.abs(amount); i++) cursor = cursor[direction]
      return cursor
    },
    remove (node) {
      node.prev.next = node.next
      node.next.prev = node.prev
      return node
    }
  }
}

const playGame = (maxPlayers, lastMarble) => {
  const scores = range(1, maxPlayers).map(() => 0)
  const circle = createCircle()
  let cursor = circle.add(0)
  for (let marble = 1; marble <= lastMarble; marble++) {
    if (marble % 23 === 0) {
      const player = marble % maxPlayers
      cursor = circle.move(cursor, -7)
      const removedMarble = circle.remove(cursor)
      scores[player] += marble + removedMarble.value
      cursor = removedMarble.next
    } else {
      cursor = circle.add(marble, circle.move(cursor, 1))
    }
  }
  return scores.reduce((a, b) => Math.max(a, b))
}

const part1 = input => {
  const { maxPlayers, maxMarble } = parseInput(input)
  return playGame(maxPlayers, maxMarble)
}

// Part 2
// ======

const part2 = input => {
  const { maxPlayers, maxMarble } = parseInput(input)
  return playGame(maxPlayers, maxMarble * 100)
}

exports.part1 = part1
exports.part2 = part2
