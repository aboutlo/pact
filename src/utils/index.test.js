import { LEFT, RIGHT, DOWN, UP } from '../constants/directions'
import { ALIVE, DEAD, INVALID } from '../constants/status'
import { move, health, walls, getDirection, findPath, finder, isIntersection, pipe } from './index'
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

  describe.only('health', () => {
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

  describe('walls', () => {
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
      expect(walls(map, character)).toHaveProperty('status', ALIVE)
    })

    it('invalid', () => {
      const character = {
        x: 0,
        y: 0,
        status: ALIVE,
      }
      expect(walls(map, character)).toHaveProperty('status', INVALID)
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
      expect(pipe(move, health(phantoms), walls(map))(character)).toMatchObject({
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
      expect(pipe(move, walls(map), health(phantoms))(character)).toMatchObject({
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
      expect(pipe(move, walls(map), health(phantoms))(character)).toMatchObject({
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
      const f = pipe(move, health(phantoms), walls(map))
      expect(findPath(f, character)).toMatchObject({
        x: 1,
        y: 1,
        status: ALIVE,
      })
    })

    it('pipe', () => {
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
      // prettier-ignore
      const f = pipe(
        move,
        health(phantoms),
        walls(map),
        findPath(pipe(move,walls(map)))
      )
      expect(f(character)).toMatchObject({
        x: 1,
        y: 1,
        status: ALIVE,
      })
    })
  })

  describe('finder', () => {
    describe('getDirection', () => {
      it('DOWN', () => {
        const tile = { x: 1, y: 1 }
        const target = { x: 1, y: 2 }
        expect(getDirection(tile, target)).toEqual(DOWN)
      })

      it('UP', () => {
        const tile = { x: 1, y: 1 }
        const target = { x: 1, y: 0 }
        expect(getDirection(tile, target)).toEqual(UP)
      })

      it('RIGHT', () => {
        const tile = { x: 1, y: 1 }
        const target = { x: 2, y: 1 }
        expect(getDirection(tile, target)).toEqual(RIGHT)
      })

      it('LEFT', () => {
        const tile = { x: 1, y: 1 }
        const target = { x: 0, y: 1 }
        expect(getDirection(tile, target)).toEqual(LEFT)
      })
    })

    describe('isIntersection', () => {
      describe('cross', () => {
        // prettier-ignore
        const map = [
          '#####',
          '##·##',
          '#·x·#',
          '##·##',
          '#####',
        ]

        it('true', () => {
          const tile = { x: 2, y: 2 }
          expect(isIntersection(map, tile)).toBe(true)
        })

        it('false', () => {
          const tile = { x: 2, y: 1 }
          expect(isIntersection(map, tile)).toBe(false)
        })
      })

      describe('cross', () => {
        // prettier-ignore
        const map = [
          '#####',
          '##x·#',
          '##·##',
          '##·##',
          '#####',
        ]

        it('true', () => {
          const tile = { x: 2, y: 1 }
          expect(isIntersection(map, tile)).toBe(true)
        })

        it('false', () => {
          const tile = { x: 2, y: 1 }
          expect(isIntersection(map, tile)).toBe(false)
        })
      })
    })

    describe('finder', () => {
      // prettier-ignore
      const map = [
        '############################',
        '#●···········##···········●#',
        '#·####·#####·##·#####·####·#',
        '#·####·#####·##·#####·####·#',
        '#·····●··············●·····#',
        '#·####·##·########·##·####·#',
        '#·####·##····##····##·####·#',
        '#······#####·##·#####······#',
        '######·#####·##·#####·######',
        '######·##··········##·######',
        '######·##·###··###·##·######',
        '######·##·#······#·##·######',
        '······●···#······#···●······',
        '######·##·#······#·##·######',
        '######·##·########·##·######',
        '######·##··········##·######',
        '######·##·########·##·######',
        '#·····●······##······●·····#',
        '#·####·#####·##·#####·####·#',
        '#···##················##···#',
        '###·##·#·##########·#·##·###',
        '#······#·····##·····#······#',
        '#·##########·##·##########·#',
        '#●························●#',
        '############################',
        ]
      it.only('run', () => {
        const pacman = {
          x: 1,
          y: 1,
        }
        const ghost = {
          x: 7,
          y: 2,
        }
        expect(finder(map, pacman, ghost)).toMatchObject({
          x: 7,
          y: 1,
          direction: LEFT,
        })
      })

      it.only('pipe', () => {})
    })
  })
})
