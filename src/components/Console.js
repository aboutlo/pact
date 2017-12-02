import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DOWN, LEFT, RIGHT, UP } from '../constants/directions'

const Container = styled.ul`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  list-style: none;
  border: 1px solid red;
`

const Item = styled.li`
  flex: 0;
  min-width: 100px;
`

const toEmoji = direction => {
  switch (direction) {
    case LEFT:
      return '⬅️'
    case RIGHT:
      return '➡️'
    case DOWN:
      return '⬇️️'
    case UP:
      return '⬆️️'
    case undefined:
      return ''
    default:
      throw new Error(`toEmoji ${direction} direction not supported`)
  }
}
class Console extends React.Component {
  render() {
    const { level, score, lives, direction } = this.props
    return (
      <Container>
        <Item>{Array.from({ length: lives }).map(life => '❤️')}</Item>
        <Item>{score} points</Item>
        <Item>{level} level</Item>
        <Item>{toEmoji(direction)}</Item>
      </Container>
    )
  }
}
Console.propTypes = {
  lives: PropTypes.number,
  score: PropTypes.number,
  level: PropTypes.number,
}

export default Console
