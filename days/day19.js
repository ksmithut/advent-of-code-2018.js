'use strict'

// Part 1
// ======

const OPERATIONS = {
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

const parseProgram = input => {
  const [registerString, ...rawInstructions] = input.split('\n')
  const {
    groups: { pointer }
  } = registerString.match(/^#ip (?<pointer>\d+)$/)
  const instructions = rawInstructions.map(rawInstruction => {
    const {
      groups: { name, aRaw, bRaw, cRaw }
    } = rawInstruction.match(
      /^(?<name>\w+) (?<aRaw>\d+) (?<bRaw>\d+) (?<cRaw>\d+)$/
    )
    const [a, b, c] = [aRaw, bRaw, cRaw].map(num => Number(num))
    return { name, a, b, c }
  })
  return { ip: pointer, program: instructions }
}

const run = (
  input,
  initialRegisters = [0, 0, 0, 0, 0, 0],
  breakAfterBigNumber = false
) => {
  const debug = false
  const { ip, program } = parseProgram(input)
  let ipValue = 0
  const registers = initialRegisters.slice()
  while (ipValue < program.length) {
    if (breakAfterBigNumber && ipValue === 34) break
    registers[ip] = ipValue
    debug && process.stdout.write(`#ip=${ipValue} [${registers.join(', ')}] `)
    const { name, a, b, c } = program[ipValue]
    OPERATIONS[name](registers, a, b, c) // exec instruction
    ipValue = registers[ip] + 1
    debug &&
      process.stdout.write(`${name} ${a} ${b} ${c} [${registers.join(', ')}]\n`)
  }
  return registers
}

const part1 = input => {
  const registers = run(input)
  return registers[0]
}

// Part 2
// ======

const part2 = input => {
  // This may not work for every input. Had to figure out what the program did
  // It essentially calculates a big number, then finds the sum of all of the
  // divisors for that number. For my input, the big number is in register 5 and
  // is found fairly quickly in the program. Ideally, I should find a command to
  // insert into the input to make it run my logic.
  const registers = run(input, [1, 0, 0, 0, 0, 0], true)
  const bigNumber = registers[5]
  const max = Math.sqrt(bigNumber)
  const divisors = []
  for (let i = 1; i <= max; i++) {
    if (bigNumber % i === 0) divisors.push(bigNumber / i, i)
  }
  return divisors.reduce((a, b) => a + b)
}

exports.part1 = part1
exports.part2 = part2
