import React, { Component } from 'react'
import './App.css'
import Map from './components/map'
import { move, health, walls, findPath, points, finder, isIntersection, pipe } from './utils'
import { DEAD, ALIVE, INVALID } from './constants/status'
import { LEFT, DOWN, UP } from './constants/directions'
import Console from './components/Console'

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

let reqAnimation
const fps = 3

const tickCharacter = ({ phantoms, level }) => character => {
  const sprite = pipe(health(phantoms), current => (current.status === DEAD ? current : move(current)), walls(level))(
    character
  )
  return sprite.status === INVALID ? character : sprite
}
const tickPhantom = state => pipe(finder(state.level, state.character))
let start = null

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  start() {
    reqAnimation = window.requestAnimationFrame(timestamp => this.tick(timestamp))
  }

  stop() {
    cancelAnimationFrame(reqAnimation)
  }

  tick(timestamp) {
    if (!start) start = timestamp

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
        .map((tile, x) => (y === character.y && x === character.x && character.status !== INVALID ? ' ' : tile))
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
  x

  componentDidMount() {
    window.addEventListener(
      'keydown',
      e => {
        const character = {
          ...this.state.character,
          direction: e.keyCode,
        }
        // console.log('keydown character:', character)
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

  render() {
    return (
      <div className="App">
        <main>
          <header className="App-header">
            <h1 className="App-title">Ract Man</h1>
            <Console level={1} score={this.state.score} lives={this.state.lives} />
          </header>
          <Map level={this.state.level} character={this.state.character} phantoms={this.state.phantoms} />
        </main>
      </div>
    )
  }
}

export default App
