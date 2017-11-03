import React, { Component } from 'react'
import './App.css'
import Map from './components/map'
import { move, health, obstacle, findPath, pipe } from './utils'

const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40
const DIRECTIONS = [LEFT, UP, RIGHT, DOWN]
const ALIVE = 'ALIVE'
const DEAD = 'DEAD'
const INVALID = 'INVALID'
const STATUS = [ALIVE, DEAD, INVALID]

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
    // purple: {
    //   y: 1,
    //   x: 11,
    //   color: 'purple',
    //   status: ALIVE,
    //   direction: LEFT,
    // },
  },
  level: [
    '############################',
    '#            ##            #',
    '# #### ##### ## ##### #### #',
    '# #### ##### ## ##### #### #',
    '#                          #',
    '# #### ## ######## ## #### #',
    '# #### ##    ##    ## #### #',
    '#      ##### ## #####      #',
    '###### ##### ## ##### ######',
    '###### ##          ## ######',
    '###### ## ###  ### ## ######',
    '###### ## #      # # ######',
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
    '# #######    ##  ########  #',
    '#                          #',
    '############################',
  ],
}

let interval

const tickCharacter = state => pipe(move, health(state.phantoms), obstacle(state.level))(state.character)
const tickPhantom = state => pipe(move, obstacle(state.level))

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  start() {
    interval = setInterval(() => this.tick(), 200)
  }

  stop() {
    clearInterval(interval)
  }

  tick() {
    const character = tickCharacter(this.state)
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

    this.setState({
      character: character.status === INVALID ? this.state.character : character,
      phantoms,
    })
  }

  componentDidMount() {
    window.addEventListener(
      'keydown',
      e => {
        const character = {
          ...this.state.character,
          direction: e.keyCode,
        }
        console.log('keydown character:', character)
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
