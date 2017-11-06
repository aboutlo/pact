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
// TODO LS add prev character state
export const health = curry((phantoms, character) => {
  const { x, y } = character
  const points = Object.entries(phantoms).map(([k, v]) => v)
  const hits = points.filter(p => p.x === x && p.y === y)
  return {
    ...character,
    status: hits.pop() ? DEAD : ALIVE,
  }
})
export const walls = curry((map, character) => {
  const { x, y } = character
  const tile = map[y][x]
  const status = tile === '#' || tile === undefined ? INVALID : character.status
  const direction = status === INVALID ? undefined : character.direction
  return {
    ...character,
    direction,
    status,
  }
})
export const points = curry((map, character) => {
  const { x, y, status } = character
  if (character.status === INVALID) return 0
  const tile = map[y][x]
  switch (tile) {
    case '●':
      return 50
    case '·':
      return 5
    default:
      return 0
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
