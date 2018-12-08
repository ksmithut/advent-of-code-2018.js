'use strict'

// Part 1
// ======

const prop = name => obj => obj[name]
const path = props => obj => props.reduce((obj, name) => prop(name)(obj), obj)
const maxBy = by => (a, b) => (by(a) > by(b) ? a : b)
const maxByProp = name => maxBy(prop(name))
const maxByPath = props => maxBy(path(props))

const parseLine = line => {
  const typeMapping = {
    'wakes up': 'awake',
    'falls asleep': 'asleep',
    Guard: 'duty'
  }
  const {
    groups: { date, type, guardId }
  } = line.match(
    /^\[(?<date>.*)\] (?<type>wakes up|falls asleep|Guard)( #(?<guardId>\d+) begins shift)?/
  )
  return {
    date: new Date(date),
    type: typeMapping[type],
    guardId
  }
}

const parseLogs = input => {
  const guards = input
    .split('\n')
    .sort()
    .map(parseLine)
    .reduce((shifts, { date, type, guardId }) => {
      if (type === 'duty') {
        shifts.push({ guardId, sleepPeriods: [] })
      } else if (type === 'asleep') {
        shifts.slice(-1)[0].sleepPeriods.push({ start: date })
      } else if (type === 'awake') {
        const sleepPeriod = shifts.slice(-1)[0].sleepPeriods.slice(-1)[0]
        sleepPeriod.duration = (date - sleepPeriod.start) / 1000 / 60
      }
      return shifts
    }, [])
    .reduce((guards, shift) => {
      const guard = guards[shift.guardId] || {
        guardId: shift.guardId,
        timeAsleep: 0,
        shifts: []
      }
      guards[shift.guardId] = guard
      guard.shifts.push(shift)
      guard.timeAsleep = shift.sleepPeriods.reduce(
        (sum, period) => sum + period.duration,
        guard.timeAsleep
      )
      return guards
    }, {})
  return Object.values(guards)
}

const parseMinutes = shifts => {
  const padTime = val => String(val).padStart(2, '0')
  const minutesIndex = shifts.reduce((minuteCount, shift) => {
    return shift.sleepPeriods.reduce((minuteCount, { start, duration }) => {
      for (
        let count = 0, date = new Date(start);
        count < duration;
        count++, date.setMinutes(date.getMinutes() + 1)
      ) {
        const hour = date.getHours()
        const minute = date.getMinutes()
        const key = [hour, minute].map(padTime).join(':')
        const entry = minuteCount[key] || {
          hour,
          minute,
          count: 0
        }
        entry.count++
        minuteCount[key] = entry
      }
      return minuteCount
    }, minuteCount)
  }, {})
  return Object.values(minutesIndex)
}

const getSleepiestMinute = shifts => {
  return parseMinutes(shifts).reduce(maxByProp('count'), { count: 0 })
}

const part1 = input => {
  const { guardId, shifts } = parseLogs(input).reduce(maxByProp('timeAsleep'))
  const { minute } = getSleepiestMinute(shifts)
  return Number(guardId) * minute
}

// Part 2
// ======

const part2 = input => {
  const {
    guardId,
    sleepiestMinute: { minute }
  } = parseLogs(input)
    .map(guard => ({
      ...guard,
      sleepiestMinute: getSleepiestMinute(guard.shifts)
    }))
    .reduce(maxByPath(['sleepiestMinute', 'count']))
  return Number(guardId) * minute
}

exports.part1 = part1
exports.part2 = part2
