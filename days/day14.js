'use strict'

// Part 1
// ======

const reduceWhile = (cond, reduce, value) => {
  while (cond(value)) value = reduce(value)
  return value
}

const newRecipes = (elves, recipes) => {
  const newRecipes = elves
    .reduce((sum, elfIndex) => sum + recipes[elfIndex], 0)
    .toString()
    .split('')
    .map(num => Number(num))
  recipes.push(...newRecipes) // Don't concat this, takes too long
  elves = elves.map(
    elfIndex => (elfIndex + recipes[elfIndex] + 1) % recipes.length
  )
  return { elves, recipes }
}

const part1 = input => {
  const maxRecipes = Number(input)
  return reduceWhile(
    ({ recipes }) => recipes.length < maxRecipes + 10,
    ({ recipes, elves }) => newRecipes(elves, recipes),
    { recipes: [3, 7], elves: [0, 1] }
  )
    .recipes.slice(maxRecipes, maxRecipes + 10)
    .join('')
}

// Part 2
// ======

const part2 = input => {
  const endSequence = input.split('').map(num => Number(num))
  return reduceWhile(
    ({ recipes, prevCheckedIndex }) =>
      !endSequence.every((val, i) => val === recipes[prevCheckedIndex + i]),
    ({ recipes, elves, prevCheckedIndex }) => ({
      ...newRecipes(elves, recipes),
      prevCheckedIndex: prevCheckedIndex + 1
    }),
    { recipes: [3, 7], elves: [0, 1], prevCheckedIndex: 0 }
  ).prevCheckedIndex
}

exports.part1 = part1
exports.part2 = part2
