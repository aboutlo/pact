import DIRECTIONS, { LEFT, RIGHT, UP, DOWN } from '../constants/directions'
import { ALIVE, DEAD, INVALID } from '../constants/status'

export const pipe = (f1, ...fns) => (...args) => {
  return fns.reduce((res, fn) => fn(res), f1(...args))
}

export const curry = (f, arr = [], length = f.length) => (...args) =>
  (a => (a.length === length ? f(...a) : curry(f, a)))([...arr, ...args])

export const move = character => {
  const { x, y, direction } = character
  switch (direction) {
    case LEFT:
      return {
        ...character,
        direction,
        x: Math.max(x - 1, 0),
      }
    case RIGHT:
      return {
        ...character,
        direction,
        x: x + 1,
      }
    case UP:
      return {
        ...character,
        direction,
        y: Math.max(y - 1, 0),
      }
    case DOWN:
      return {
        ...character,
        direction,
        y: y + 1,
      }
    default:
      return character
  }
}
export const health = curry((phantoms, character) => {
  const { x, y } = character
  const points = Object.entries(phantoms).map(([k, v]) => v)
  return {
    ...character,
    status: points.filter(p => p.x === x && p.y === y).pop() ? DEAD : ALIVE,
  }
})
export const obstacle = curry((map, character) => {
  const { x, y, status } = character
  const tile = map[y][x]
  return {
    ...character,
    status: tile === '#' || tile === undefined ? INVALID : status,
  }
})

const pickDirection = () => {
  const index = Math.round(Math.random() * 3)
  return DIRECTIONS[index]
}

export const findPath = curry((func, character) => {
  const pos = func(character)
  return pos.status === INVALID
    ? findPath(func, {
        ...character,
        direction: pickDirection(),
      })
    : pos
})
