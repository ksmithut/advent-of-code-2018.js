'use strict'

// Part 1
// ======

const part1 = input => {
  const countByValue = (counts, value) => {
    counts[value] = (counts[value] || 0) + 1
    return counts
  }
  const counts = input.split('\n').reduce((counts, line) => {
    const charCount = line.split('').reduce(countByValue, {})
    const uniqueCounts = new Set(Object.values(charCount))
    return Array.from(uniqueCounts).reduce(countByValue, counts)
  }, {})
  return counts[2] * counts[3]
}

// Part 2
// ======

const part2 = input => {
  const strIntersection = (str1, str2) =>
    str1
      .split('')
      .reduce((str, char, i) => (char === str2[i] ? str + char : str), '')
  const lines = input.split('\n')
  for (let a = 0; a < lines.length; a++) {
    for (let b = a + 1; b < lines.length; b++) {
      const intersection = strIntersection(lines[a], lines[b])
      if (intersection.length === lines[a].length - 1) return intersection
    }
  }
}

exports.part1 = part1
exports.part2 = part2
