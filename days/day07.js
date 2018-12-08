'use strict'

// Part 1
// ======

const parseLine = line => {
  const {
    groups: { step, prerequisite }
  } = line.match(
    /^Step (?<prerequisite>\w) must be finished before step (?<step>\w) can begin\./
  )
  return { step, prerequisite }
}
const parseInput = lines => lines.split('\n').map(parseLine)

const getNextStep = dependencyHash =>
  Object.entries(dependencyHash).reduce(
    (possibleNextStep, [step, dependencies]) => {
      if (dependencies.length) return possibleNextStep
      if (step > possibleNextStep) return possibleNextStep
      return step
    },
    null
  )

const takeDependency = (toRemove, { [toRemove]: _, ...rest }) => rest
const removeDependency = (toRemove, dependencyHash) =>
  Object.entries(dependencyHash).reduce((hash, [key, dependencies]) => {
    if (key === toRemove) return hash
    hash[key] = dependencies.filter(dependency => dependency !== toRemove)
    return hash
  }, {})

const createDependencyHash = input => {
  return parseInput(input).reduce((hash, { step, prerequisite }) => {
    hash[prerequisite] = hash[prerequisite] || []
    hash[step] = (hash[step] || []).concat(prerequisite)
    return hash
  }, {})
}

const part1 = input => {
  let dependencyHash = createDependencyHash(input)
  let str = ''
  let nextStep = getNextStep(dependencyHash)
  while (nextStep) {
    str += nextStep
    dependencyHash = removeDependency(nextStep, dependencyHash)
    nextStep = getNextStep(dependencyHash)
  }
  return str
}

// Part 2
// ======

const part2 = input => {
  const numWorkers = 5
  const durationModifier = 60
  const stepDuration = letter =>
    letter
      ? letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1 + durationModifier
      : Infinity

  let dependencyHash = createDependencyHash(input)
  const workers = new Array(numWorkers).fill(null).map((_, i) => ({
    id: i,
    currentStep: null,
    durationLeft: Infinity
  }))
  let busyWorkers
  let seconds = 0
  do {
    busyWorkers = workers
      .sort((a, b) => a.durationLeft - b.durationLeft)
      .filter(worker => {
        worker.durationLeft--
        if (!worker.durationLeft || !worker.currentStep) {
          dependencyHash = removeDependency(worker.currentStep, dependencyHash)
          worker.currentStep = getNextStep(dependencyHash)
          dependencyHash = takeDependency(worker.currentStep, dependencyHash)
          worker.durationLeft = stepDuration(worker.currentStep)
        }
        return worker.currentStep
      })
    seconds++
  } while (busyWorkers.length)
  return seconds - 1
}

exports.part1 = part1
exports.part2 = part2
