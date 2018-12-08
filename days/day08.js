'use strict'

// Part 1
// ======

const parseInput = input => input.split(' ').map(num => Number(num))

const createTree = ([childrenCount, metadataCount, ...rest], count = 0) => {
  const node = {
    children: [],
    metadata: []
  }
  let offset = 0
  for (let i = 0; i < childrenCount; i++) {
    const subTree = createTree(rest, count + 1)
    node.children.push(subTree.node)
    offset = offset + subTree.offset
    rest = rest.slice(subTree.offset)
  }
  node.metadata = rest.slice(0, metadataCount)
  return { node, offset: 2 + offset + metadataCount }
}

const reduceTree = (reducer, value, node) => {
  value = node.children.reduce((value, child) => {
    return reduceTree(reducer, value, child)
  }, value)
  return reducer(value, node)
}

const part1 = input => {
  const numbers = parseInput(input)
  const { node } = createTree(numbers)
  const sum = arr => arr.reduce((a, b) => a + b, 0)
  const sumMetadata = node => {
    return node.children.reduce(
      (total, child) => total + sumMetadata(child),
      sum(node.metadata)
    )
  }
  return sumMetadata(node)
}

// Part 2
// ======

const part2 = input => {
  const numbers = parseInput(input)
  const { node } = createTree(numbers)

  const nodeValue = ({ children, metadata }) => {
    if (!children.length) return metadata.reduce((a, b) => a + b, 0)
    return metadata.reduce((value, metadatum) => {
      const childIndex = metadatum - 1
      const child = children[childIndex]
      return value + (child ? nodeValue(child) : 0)
    }, 0)
  }
  return nodeValue(node)
}

exports.part1 = part1
exports.part2 = part2
