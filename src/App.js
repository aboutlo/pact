import React, { Component } from 'react'
import './App.css'
import Map from './components/map'

const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40
const DIRECTIONS = [LEFT, UP, RIGHT, DOWN]

const initialState = {
  character: {
    y: 1,
    x: 1,
    color: 'blue',
    direction: undefined,
  },
  phantoms: {
    yellow: {
      y: 10,
      x: 11,
      color: 'yellow',
      direction: LEFT,
    },
    purple: {
      y: 1,
      x: 11,
      color: 'purple',
      direction: LEFT,
    },
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

const pickDirection= () => {
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
const isValid = (pos, map) => {
  const { x, y } = pos
  return map[Math.abs(y)][x] !== '#'
}
const untilValid = (character, map) => {
  const pos = next(character)
  return isValid(pos, map)
    ? pos
    : untilValid({
      ...character,
      direction: pickDirection()
      }, map)
}

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  componentDidMount() {
    setInterval(() => {
      const character = next(this.state.character)
      const phantoms = Object
        .entries(this.state.phantoms)
        .map(([key, phantom]) => ({[key]: untilValid(phantom, this.state.level) }))
        .reduce((memo, phantom) => ({ ...phantom, ...memo }), {})
      this.setState({
        character: isValid(character, this.state.level) ? character : this.state.character,
        phantoms,
      })
    }, 200)

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
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Man</h1>
        </header>
        <main>
          <Map
            level={this.state.level}
            character={this.state.character}
            phantoms={this.state.phantoms} />
        </main>
      </div>
    )
  }
}

export default App
