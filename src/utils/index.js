import { LEFT, RIGHT, UP, DOWN } from '../constants/directions'

export const pipe = (f1, ...fns) => (...args) => {
  return fns.reduce((res, fn) => fn(res), f1(...args))
}

export const next = character => {
  const { x, y, direction } = character
  switch (direction) {
    case LEFT:
      return {
        ...character,
        direction,
        x: x - 1,
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
        y: y - 1,
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
export const status = (character, state) => {
  const { x, y } = character
  const phantoms = Object.entries(state.phantoms).map(([k, v]) => v)
  let status = ALIVE
  if (phantoms.filter(p => p.x === x && p.y === y).pop()) {
    status = DEAD
  } else if (state.level[Math.abs(y)][x] === '#') {
    status = INVALID
  }
  return {
    ...character,
    status,
  }
}
