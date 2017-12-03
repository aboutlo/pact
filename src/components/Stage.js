import React, { Component } from 'react'
import Hammer from 'react-hammerjs'

import { DEAD, ALIVE, INVALID } from '../constants/status'
import DIRECTIONS, { UP } from '../constants/directions'
import Map from '../components/map'
import Console from '../components/Console'
import {
  finder,
  health,
  move,
  pipe,
  points,
  walls,
  gestureToDirection,
} from '../utils'

const initialState = {
  lives: 3,
  time: Date.now(),
  score: 0,
  character: {
    y: 1,
    x: 1,
    color: 'blue',
    status: ALIVE,
    direction: undefined,
  },
  phantoms: {
    // yellow: {
    //   y: 8,
    //   x: 12,
    //   color: 'yellow',
    //   status: ALIVE,
    //   direction: LEFT,
    // },
    purple: {
      y: 17,
      x: 9,
      color: 'purple',
      status: ALIVE,
      direction: UP,
    },
  },
  level: [
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
  ],
}

const hammerOptions = {
  touchAction: 'compute',
  recognizers: {
    tap: {
      time: 600,
      threshold: 100,
    },
  },
}

let reqAnimation
const fps = 5

const tickCharacter = ({ phantoms, level }) => character => {
  //prettier-ignore
  const sprite = pipe(
    health(phantoms),
    current => (current.status === DEAD ? current : move(current)),
    walls(level)
  )(character)
  return sprite.status === INVALID ? character : sprite
}
const tickPhantom = state => pipe(finder(state.level, state.character))
let start = null

class Stage extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  start() {
    reqAnimation = window.requestAnimationFrame(timestamp =>
      this.tick(timestamp)
    )
  }

  stop() {
    cancelAnimationFrame(reqAnimation)
  }

  tick(timestamp) {
    if (!start) start = timestamp

    //TODO move this into Stage component
    const character = tickCharacter(this.state)(this.state.character)
    if (character.status === DEAD) {
      this.stop()
      this.setState({
        character,
      })
      return
    }
    const phantoms = Object.entries(this.state.phantoms)
      .map(([key, phantom]) => ({ [key]: tickPhantom(this.state)(phantom) }))
      .reduce((memo, phantom) => ({ ...phantom, ...memo }), {})

    const score = this.state.score + points(this.state.level, character)

    const level = this.state.level.map((row, y) => {
      return row
        .split('')
        .map(
          (tile, x) =>
            y === character.y &&
            x === character.x &&
            character.status !== INVALID
              ? ' '
              : tile
        )
        .join('')
    })

    this.setState({
      character,
      phantoms,
      score,
      level,
    })

    setTimeout(() => {
      reqAnimation = requestAnimationFrame(timestamp => this.tick(timestamp))
    }, 1000 / fps)
  }

  componentDidMount() {
    window.addEventListener(
      'keydown',
      e => {
        if (!DIRECTIONS.includes(e.keyCode)) return
        const character = {
          ...this.state.character,
          direction: e.keyCode,
        }
        this.setState({
          character,
        })
      },
      true
    )
    this.start()
  }

  componentWillUnmount() {
    this.stop()
  }

  pan(e) {
    const character = {
      ...this.state.character,
      direction:
        gestureToDirection(e.additionalEvent) || this.state.character.direction,
    }
    this.setState({
      character,
    })
  }

  render() {
    return (
      <Hammer onPan={this.pan.bind(this)} options={hammerOptions}>
        <div>
          <Map
            level={this.state.level}
            character={this.state.character}
            phantoms={this.state.phantoms}
          />
          <Console
            lives={this.state.lives}
            score={this.state.score}
            level={1}
            direction={this.state.character.direction}
          />
        </div>
      </Hammer>
    )
  }
}

export default Stage
