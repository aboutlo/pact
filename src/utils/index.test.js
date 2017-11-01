import { LEFT, RIGHT, DOWN, UP } from '../constants/directions'
import { ALIVE } from '../constants/status'
import { next } from './index'
describe('utils', () => {
  let character

  beforeEach(() => {
    character = {
      x: 2,
      y: 2,
      direction: undefined,
      status: ALIVE,
    }
  })

  describe('next', () => {
    it('UP', () => {
      const direction = UP
      expect(
        next({
          ...character,
          direction,
        })
      ).toMatchObject({
        ...character,
        direction,
        y: 1,
      })
    })

    it('DOWN', () => {
      const direction = DOWN
      expect(
        next({
          ...character,
          direction,
        })
      ).toMatchObject({
        ...character,
        direction,
        y: 3,
      })
    })

    it('DOWN', () => {
      const direction = DOWN
      expect(
        next({
          ...character,
          direction,
        })
      ).toMatchObject({
        ...character,
        direction,
        y: 3,
      })
    })

    it('RIGHT', () => {
      const direction = RIGHT
      expect(
        next({
          ...character,
          direction,
        })
      ).toMatchObject({
        ...character,
        direction,
        x: 3,
      })
    })
  })
})
