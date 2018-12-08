'use strict'

// Part 1
// ======

const range = (a, b) => new Array(b - a + 1).fill(null).map((_, i) => i + a)
const aToZ = range('A'.charCodeAt(0), 'Z'.charCodeAt(0)).map(code =>
  String.fromCharCode(code)
)

const createReactorMapping = () => {
  return aToZ.reduce((mapping, char) => {
    mapping[char.toUpperCase()] = char.toLowerCase()
    mapping[char.toLowerCase()] = char.toUpperCase()
    return mapping
  }, {})
}

const react = input => {
  const reactorMapping = createReactorMapping()
  const letters = input.split('')
  for (let pointer = 0; pointer < letters.length - 1;) {
    const currentLetter = letters[pointer]
    const nextLetter = letters[pointer + 1]
    if (reactorMapping[currentLetter] === nextLetter) {
      letters.splice(pointer, 2)
      pointer--
    } else {
      pointer++
    }
  }
  return letters.join('')
}

const part1 = input => {
  return react(input).length
}

// Part 2
// ======

const part2 = input => {
  const removeCharater = (str, char) => str.replace(new RegExp(char, 'ig'), '')
  return aToZ
    .map(char => react(removeCharater(input, char)).length)
    .reduce((a, b) => Math.min(a, b))
}

exports.part1 = part1
exports.part2 = part2
