import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { LEFT, RIGHT, DOWN, UP } from '../constants/directions'

const walk = ({ side }) => keyframes`
  100% {
    background-position-x: ${-32 * side / 16}px;
`

const getBackgroundPositionY = (direction, side) => {
  switch (direction) {
    case RIGHT:
      return `0px`
    case LEFT:
      return `-${side}px`
    case UP:
      return `-${side * 2}px`
    case DOWN:
      return `-${side * 3}px`
    case undefined:
      return ''
    default:
      console.log(arguments)
      throw new Error(`getBackgroundPositionY ${direction} direction not supported`)
  }
}
const Tile = styled.div.attrs({
  style: ({ direction, x, y, side }) => ({
    backgroundPositionY: getBackgroundPositionY(direction, side),
    left: `${x * side}px`,
    top: `${y * side}px`,
  }),
})`
  position: absolute;
  background-repeat: no-repeat;
  background-image: url(${props => props.sprite});
  background-size: ${({ side }) => `${32 * side / 16}px ${64 * side / 16}px`};
  width: ${({ side }) => side}px;
  height: ${({ side }) => side}px;
  ${({ status, direction, side }) => {
    // TODO STOP ANIMATION IF HITTING THE WALL
    return status === 'DEAD' || direction === undefined ? '' : `animation: ${walk({ side })} 0.4s steps(2) infinite;`
  }};
`

const Character = props => {
  return <Tile {...props} />
}
Character.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  sprite: PropTypes.string,
  direction: PropTypes.number,
  status: PropTypes.string,
  color: PropTypes.string,
  side: PropTypes.number,
}

export default Character
