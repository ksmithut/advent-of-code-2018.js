'use strict'

// Part 1
// ======

const range = (a, b) => new Array(b - a + 1).fill(null).map((_, i) => i + a)

const parseLine = line => {
  const {
    groups: { key, value }
  } = line.match(/^(?<key>[.#]{5}) => (?<value>[.#])$/)
  return { key, value }
}

const parseInput = input => {
  const [initialStateInput, instructionsInput] = input.split('\n\n')
  const {
    groups: { state }
  } = initialStateInput.match(/^initial state: (?<state>[.#]*)$/)
  const legend = instructionsInput
    .split('\n')
    .map(parseLine)
    .reduce((legend, { key, value }) => {
      legend[key] = value
      return legend
    }, {})
  return {
    initialState: state.split('').reduce((state, value, index) => {
      state[index] = value
      return state
    }, {}),
    legend
  }
}

const runGeneration = (state, legend) => {
  const { min, max } = Object.keys(state).reduce(
    ({ min, max }, index) => ({
      min: Math.min(min, Number(index)),
      max: Math.max(max, Number(index))
    }),
    { min: Infinity, max: -Infinity }
  )
  const newState = {}
  const get = i => state[i] || '.'

  for (let i = min - 10; i <= max + 10; i++) {
    const key = [get(i), get(i + 1), get(i + 2), get(i + 3), get(i + 4)].join(
      ''
    )
    const value = legend[key] || '.'
    if (value !== '.') newState[i + 2] = value
  }
  return newState
}

const countValues = state =>
  Object.entries(state).reduce((total, [index, value]) => {
    return total + (value === '#' ? Number(index) : 0)
  }, 0)

const part1 = input => {
  const { initialState, legend } = parseInput(input)
  const state = range(1, 20).reduce(
    state => runGeneration(state, legend),
    initialState
  )
  return countValues(state)
}

// Part 2
// ======

const part2 = input => {
  const iterations = 50e9
  const sample = 1e3
  const { initialState, legend } = parseInput(input)
  const { values } = range(1, sample).reduce(
    ({ state, values }) => {
      const newState = runGeneration(state, legend)
      values.push(countValues(newState))
      return { state: newState, values }
    },
    { state: initialState, values: [] }
  )
  const diff = values[values.length - 1] - values[values.length - 2]
  return (iterations - sample) * diff + values[values.length - 1]
}

exports.part1 = part1
exports.part2 = part2
