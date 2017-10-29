import React, { Component } from 'react'
import './App.css'
import Map from './components/map'

const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40

const initialState = {
  character: {
    y: 1,
    x: 1,
    direction: undefined,
  },
  phantoms: {
    yellow: {
      y: 10,
      x: 11,
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

const next = character => {
  const { x, y, direction } = character
  switch (direction) {
    case LEFT:
      return {
        x: x - 1,
        y,
        direction,
      }
    case RIGHT:
      return {
        x: x + 1,
        y,
        direction,
      }
    case UP:
      return {
        x,
        y: y - 1,
        direction,
      }
    case DOWN:
      return {
        x,
        y: y + 1,
        direction,
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
  const direction = [LEFT, UP, RIGHT, DOWN][Math.round(Math.random() * 4) - 1]
  return isValid(pos, map) ? pos : untilValid({ ...character, direction }, map)
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
    }, 150)

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
          <h1 className="App-title">Pact</h1>
        </header>
        <main>
          <Map level={this.state.level} character={this.state.character} phantom={this.state.phantoms.yellow} />
        </main>
      </div>
    )
  }
}

export default App
