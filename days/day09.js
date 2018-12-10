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

const playGame = (maxPlayers, lastMarble) => {
  const scores = range(1, maxPlayers).map(() => 0)
  let cursor = { value: 0 }
  Object.assign(cursor, { next: cursor, prev: cursor })
  for (let marble = 1; marble <= lastMarble; marble++) {
    if (marble % 23 === 0) {
      cursor = cursor.prev.prev.prev.prev.prev.prev
      scores[marble % maxPlayers] += marble + cursor.prev.value
      cursor.prev.prev.next = cursor
      cursor.prev = cursor.prev.prev
    } else {
      const next = cursor.next
      const toAdd = {
        value: marble,
        prev: next,
        next: next.next
      }
      next.next.prev = toAdd
      next.next = toAdd
      cursor = toAdd
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
