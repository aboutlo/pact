import { LEFT, RIGHT, DOWN, UP } from '../constants/directions'
import { ALIVE, DEAD, INVALID } from '../constants/status'
import { move, health, obstacle, findPath, pipe } from './index'
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

  describe('move', () => {
    it('UP', () => {
      const subject = {
        ...character,
        direction: UP,
      }
      expect(move(subject)).toMatchObject({
        ...subject,
        y: 1,
      })
    })

    it('DOWN', () => {
      const subject = {
        ...character,
        direction: DOWN,
      }
      expect(move(subject)).toMatchObject({
        ...subject,
        y: 3,
      })
    })

    it('LEFT', () => {
      const subject = {
        ...character,
        direction: LEFT,
      }
      expect(move(subject)).toMatchObject({
        ...subject,
        x: 1,
      })
    })

    it('RIGHT', () => {
      const direction = RIGHT
      expect(
        move({
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

  describe('health', () => {
    let character

    beforeEach(() => {
      character = {
        x: 2,
        y: 2,
        direction: undefined,
        status: ALIVE,
      }
    })

    it('alive', () => {
      const phantoms = [{ x: 1, y: 1 }]
      expect(health(phantoms, character)).toHaveProperty('status', ALIVE)
    })

    it('dead', () => {
      const phantoms = [{ x: 2, y: 2 }]
      expect(health(phantoms, character)).toHaveProperty('status', DEAD)
    })
  })

  describe('obstacle', () => {
    // prettier-ignore
    const map = [
      '###',
      '# #',
      '###'
    ]

    it('valid', () => {
      const character = {
        x: 1,
        y: 1,
        status: ALIVE,
      }
      expect(obstacle(map, character)).toHaveProperty('status', ALIVE)
    })

    it('invalid', () => {
      const character = {
        x: 0,
        y: 0,
        status: ALIVE,
      }
      expect(obstacle(map, character)).toHaveProperty('status', INVALID)
    })
  })

  describe('pipe', () => {
    it('untouched', () => {
      const character = {
        x: 1,
        y: 1,
        status: ALIVE,
      }
      const phantoms = []
      // prettier-ignore
      const map = [
        '###',
        '# #',
        '###'
      ]
      expect(pipe(move, health(phantoms), obstacle(map))(character)).toMatchObject({
        ...character,
      })
    })

    it('dead', () => {
      const character = {
        x: 1,
        y: 1,
        status: ALIVE,
      }
      const phantoms = [
        {
          x: 1,
          y: 1,
        },
      ]
      // prettier-ignore
      const map = [
        '###',
        '# #',
        '###'
      ]
      expect(pipe(move, obstacle(map), health(phantoms))(character)).toMatchObject({
        ...character,
        status: DEAD,
      })
    })

    it('invalid or dead', () => {
      const character = {
        x: 0,
        y: 0,
        status: ALIVE,
      }
      const phantoms = [
        {
          x: 0,
          y: 0,
        },
      ]
      const map = ['#']
      expect(pipe(move, obstacle(map), health(phantoms))(character)).toMatchObject({
        ...character,
        status: DEAD,
      })
    })
  })

  describe('findPath', () => {
    it('until valid', () => {
      const character = {
        x: 1,
        y: 0,
        status: ALIVE,
      }
      const phantoms = []
      // prettier-ignore
      const map = [
       //0123
        '####',//0
        '#  #',//1
        '####' //2
      ]
      const f = pipe(move, health(phantoms), obstacle(map))
      expect(findPath(f, character)).toMatchObject({
        x: 1,
        y: 1,
        status: ALIVE,
      })
    })
  })
})
