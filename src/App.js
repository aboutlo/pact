import React, { Component } from 'react'
import './App.css'
import Map from './components/map'

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
      y: 10,
      x: 11,
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
    '#############',
    '#           #',
    '# ######### #',
    '#           #',
    '# #### #### #',
    '# #  # #  # #',
    '# #### #### #',
    '#           #',
    '# #### #### #',
    '# #  # #  # #',
    '# #### #### #',
    '#           #',
    '#############',
  ],
}

const pickDirection = () => {
  const index = Math.round(Math.random() * 3)
  return DIRECTIONS[index]
}
const next = character => {
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
const status = (character, state) => {
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

const untilValid = (character, state) => {
  console.log('character:', character)
  const pos = status(next(character), state)
  return pos.status === INVALID
    ? untilValid(
        {
          ...character,
          direction: pickDirection(),
        },
        state
      )
    : pos
}

let interval

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
    const character = status(next(this.state.character), this.state)
    if (character.status === DEAD) {
      this.stop()
      this.setState({
        character,
      })
      return
    }
    const phantoms = Object.entries(this.state.phantoms)
      .map(([key, phantom]) => ({ [key]: untilValid(phantom, this.state) }))
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
        this.setState({
          character: {
            ...this.state.character,
            direction: e.keyCode,
          },
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
