import React, { Component } from 'react'
import './App.css'
import Map from './components/map'
import { move, health, obstacle, findPath, pipe } from './utils'
import { DEAD, ALIVE, INVALID } from './constants/status'
import { LEFT } from './constants/directions'

const initialState = {
  lives: 3,
  character: {
    y: 1,
    x: 1,
    color: 'blue',
    status: ALIVE,
    direction: undefined,
  },
  phantoms: {
    yellow: {
      y: 8,
      x: 12,
      color: 'yellow',
      status: ALIVE,
      direction: LEFT,
    },
    purple: {
      y: 1,
      x: 11,
      color: 'purple',
      status: ALIVE,
      direction: LEFT,
    },
  },
  level: [
    '############################',
    '#●···········##            #',
    '# #### ##### ## ##### #### #',
    '# #### ##### ## ##### #### #',
    '#                          #',
    '# #### ## ######## ## #### #',
    '# #### ##    ##    ## #### #',
    '#      ##### ## #####      #',
    '###### ##### ## ##### ######',
    '###### ##          ## ######',
    '###### ## ###  ### ## ######',
    '###### ## #      # ## ######',
    '          #      #          ',
    '###### ## #      # ## ######',
    '###### ## ######## ## ######',
    '###### ##          ## ######',
    '###### ## ######## ## ######',
    '#            ##            #',
    '# #### ##### ## ##### #### #',
    '#   ##                ##   #',
    '### ## # ########## # ## ###',
    '#      #     ##     #      #',
    '# ########## ## ########## #',
    '#                          #',
    '############################',
  ],
}

let reqAnimation
const fps = 5

const tickCharacter = state => pipe(move, health(state.phantoms), obstacle(state.level))
const tickPhantom = state => pipe(move, obstacle(state.level))
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
      .map(([key, phantom]) => ({ [key]: findPath(tickPhantom(this.state), phantom) }))
      .reduce((memo, phantom) => ({ ...phantom, ...memo }), {})

    const level = this.state.level.map((row, y) => {
      return (
        row
          .split('')
          // remove dots has to be more idiomatic
          .map((tile, x) => (y === character.y && x === character.x && character.status !== INVALID ? ' ' : tile))
          .join('')
      )
    })

    this.setState({
      character: character.status === INVALID ? this.state.character : character,
      phantoms,
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
        <header className="App-header">
          <h1 className="App-title">React Man</h1>
        </header>
        <main>
          <Map level={this.state.level} character={this.state.character} phantoms={this.state.phantoms} />
        </main>
      </div>
    )
  }
}

export default App
