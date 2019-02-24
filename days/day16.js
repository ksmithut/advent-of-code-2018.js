'use strict'

// Part 1
// ======

const operations = {
  addr: (r, a, b, c) => (r[c] = r[a] + r[b]),
  addi: (r, a, b, c) => (r[c] = r[a] + b),
  mulr: (r, a, b, c) => (r[c] = r[a] * r[b]),
  muli: (r, a, b, c) => (r[c] = r[a] * b),
  banr: (r, a, b, c) => (r[c] = r[a] & r[b]),
  bani: (r, a, b, c) => (r[c] = r[a] & b),
  borr: (r, a, b, c) => (r[c] = r[a] | r[b]),
  bori: (r, a, b, c) => (r[c] = r[a] | b),
  setr: (r, a, b, c) => (r[c] = r[a]),
  seti: (r, a, b, c) => (r[c] = a),
  gtir: (r, a, b, c) => (r[c] = a > r[b] ? 1 : 0),
  gtri: (r, a, b, c) => (r[c] = r[a] > b ? 1 : 0),
  gtrr: (r, a, b, c) => (r[c] = r[a] > r[b] ? 1 : 0),
  eqir: (r, a, b, c) => (r[c] = a === r[b] ? 1 : 0),
  eqri: (r, a, b, c) => (r[c] = r[a] === b ? 1 : 0),
  eqrr: (r, a, b, c) => (r[c] = r[a] === r[b] ? 1 : 0)
}

const arraysEqual = (arr1, arr2) => {
  const max = Math.max(arr1.length, arr2.length)
  for (let i = 0; i < max; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

const part1 = input => {
  return input
    .split('\n\n\n\n', 1)[0]
    .split('\n\n')
    .filter(sampleString => {
      const [beforeString, instructionString, afterString] = sampleString.split(
        '\n'
      )
      console.log({ beforeString, instructionString, afterString })
      const before = JSON.parse(beforeString.replace(/^Before: /, ''))
      const instruction = instructionString.split(' ').map(num => Number(num))
      const after = JSON.parse(afterString.replace(/^After: /, ''))

      const possibilities = Object.entries(operations).filter(
        ([_, operation]) => {
          const r = before.slice()
          const [, a, b, c] = instruction
          operation(r, a, b, c)
          return arraysEqual(r, after)
        }
      )

      return possibilities.length >= 3
    }).length
}

// Part 2
// ======

const part2 = input => {
  const [samples, instructions] = input.split('\n\n\n\n')
  const parsedSamples = samples
    .split('\n\n')
    .map(sampleString => {
      const [beforeString, instructionString, afterString] = sampleString.split(
        '\n'
      )
      const before = JSON.parse(beforeString.replace(/^Before: /, ''))
      const [code, a, b, c] = instructionString
        .split(' ')
        .map(num => Number(num))
      const after = JSON.parse(afterString.replace(/^After: /, ''))

      const possibilities = Object.entries(operations).filter(
        ([_, operation]) => {
          const r = before.slice()
          operation(r, a, b, c)
          return arraysEqual(r, after)
        }
      )
      return {
        possibilities,
        code
      }
    })
    .sort((a, b) => a.possibilities.length - b.possibilities.length)
  let memo = { byName: {}, byCode: {}, samples: parsedSamples }
  while (memo.samples.length) {
    memo = memo.samples.reduce(
      (operations, { possibilities, code }) => {
        if (operations.byCode[code]) return operations
        possibilities = possibilities.filter(([name, operation]) => {
          return !operations.byName[name]
        })
        if (possibilities.length === 1) {
          const [name, operation] = possibilities[0]
          const value = { name, operation, code }
          operations.byCode[code] = value
          operations.byName[name] = value
        }
        operations.samples.push({ possibilities, code })
        return operations
      },
      { byName: memo.byName, byCode: memo.byCode, samples: [] }
    )
  }
  return instructions.split('\n').reduce(
    (r, instructionString) => {
      const [code, a, b, c] = instructionString
        .split(' ')
        .map(num => Number(num))
      memo.byCode[code].operation(r, a, b, c)
      return r
    },
    [0, 0, 0, 0]
  )[0]
}

exports.part1 = part1
exports.part2 = part2
