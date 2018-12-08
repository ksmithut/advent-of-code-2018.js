'use strict'

// Part 1
// ======

const part1 = input => {
  return input.split('\n').reduce((sum, line) => sum + Number(line), 0)
}

// Part 2
// ======

const part2 = input => {
  const deltas = input.split('\n').map(delta => Number(delta))
  let frequency = 0
  const visitedFrequencies = new Set([frequency])
  while (true) {
    for (const delta of deltas) {
      frequency += delta
      if (visitedFrequencies.has(frequency)) return frequency
      visitedFrequencies.add(frequency)
    }
  }
}

exports.part1 = part1
exports.part2 = part2
