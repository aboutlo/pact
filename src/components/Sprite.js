import React from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { LEFT, RIGHT, DOWN, UP } from '../constants/directions'

const SIDE = 16
const walk = keyframes`
  100% {background-position-x: -32px;}
`

const getBackgroundPositionY = direction => {
  switch (direction) {
    case RIGHT:
      return `0px`
    case LEFT:
      return `-${SIDE}px`
    case UP:
      return `-${SIDE * 2}px`
    case DOWN:
      return `-${SIDE * 3}px`
  }
}
const Tile = styled.div.attrs({
  style: ({ direction, x, y }) => ({
    backgroundPositionY: getBackgroundPositionY(direction),
    left: `${x * SIDE}px`,
    top: `${y * SIDE}px`,
  }),
})`
  position: absolute;
  background-repeat: no-repeat;
  background-image: url(${props => props.sprite});
  width: ${SIDE}px;
  height: ${SIDE}px;
  ${({ status, direction }) =>
    status === 'DEAD' || direction === undefined ? '' : `animation: ${walk} 0.4s steps(2) infinite;`};
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
}

export default Character
