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
      y: 10,
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
        x: x - 1,
      }
    case RIGHT:
      return {
        ...character,
        x: x + 1,
      }
    case UP:
      return {
        ...character,
        y: y - 1,
      }
    case DOWN:
      return {
        ...character,
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
      const nextCharacter = next(this.state.character)
      this.setState({
        character: isValid(nextCharacter, this.state.level) ? nextCharacter : this.state.character,
        phantoms: {
          yellow: untilValid(this.state.phantoms.yellow, this.state.level),
        },
      })
    }, 1000)

    window.addEventListener(
      'keydown',
      e => {
        const { x, y } = this.state.character
        this.setState({
          character: {
            x,
            y,
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
            phantom={this.state.phantoms.yellow} />
        </main>
      </div>
    )
  }
}

export default App
