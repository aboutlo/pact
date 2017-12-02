import DIRECTIONS, { LEFT, RIGHT, UP, DOWN } from '../constants/directions'
import { ALIVE, DEAD, INVALID } from '../constants/status'
import PF from 'pathfinding'

const DEFAULT_INTERSECTIONS = [{ x: 6, y: 4 }, { x: 21, y: 4 }, { x: 6, y: 17 }, { x: 21, y: 17 }]

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
  if (status === INVALID) return 0
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

/*
  01234
  1
  2 o
  3 x
  4
  */

export const getDirection = (tile, target) => {
  if (target.y > tile.y) return DOWN
  if (target.y < tile.y) return UP
  if (target.x < tile.x) return LEFT
  if (target.x > tile.x) return RIGHT
  return undefined
}

export const isIntersection = (level, target) => {
  return (
    level[target.y - 1][target.x] !== '#' &&
    level[target.y + 1][target.x] !== '#' &&
    level[target.y][target.x - 1] !== '#' &&
    level[target.y][target.x + 1] !== '#'
  )
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

export const finder = curry((level, target, character) => {
  let path = character.path
  const hasPath = (character.path || []).length > 0
  if (isIntersection(level, character) || !hasPath) {
    // TODO LS convert only at the bootstrap
    const map = level.map(row => row.split('').map(tile => (tile === '#' ? 1 : 0)))
    const grid = new PF.Grid(map)
    const finder = new PF.AStarFinder()
    const t = hasPath ? target : DEFAULT_INTERSECTIONS[Math.round(Math.random() * (DEFAULT_INTERSECTIONS.length - 1))]
    path = finder.findPath(character.x, character.y, t.x, t.y, grid)
  }
  // console.log(path)
  const [x, y] = path[1] || [character.x, character.y]
  const direction = getDirection({ x, y }, target)
  return {
    ...character,
    path: path.slice(1, path.length - 1),
    x,
    y,
    direction,
  }
})
