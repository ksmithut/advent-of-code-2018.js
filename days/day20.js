'use strict'

// Part 1
// ======

const parseInput = input => {
  input = input.replace(/^\^/, '').replace(/\$$/, '')
  const path = []
  for (const char of input.split('')) {
    switch (char) {
      case 'W':
      case 'S':
      case 'E':
      case 'N':
        break
      case '(':
    }
  }
}

const part1 = input => {
  return parseInput
}

// Part 2
// ======

const part2 = input => {
  return input
}

exports.part1 = part1
exports.part2 = part2
