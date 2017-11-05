import React from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { LEFT, RIGHT, DOWN, UP } from '../constants/directions'
import background from '../assets/blinky.png'
const SIDE = 16
const walk = keyframes`
  100% {background-position-x: -32px;}
`
const Tile = styled.div`
  width: ${SIDE}px;
  height: ${SIDE}px;
  position: absolute;
  /*background: ${props => {
    return props.status === 'ALIVE' ? props.color : 'red'
  }};*/
  background-image: url(${background});
  background-repeat: no-repeat;
  animation: ${walk} 0.5s steps(2) infinite;
  background-position-y: ${({ direction }) => {
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
  }}; 
  left: ${props => props.x * SIDE}px;
  top: ${props => props.y * SIDE}px;
`

const Character = props => {
  return <Tile {...props} />
}
Character.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  direction: PropTypes.number,
  status: PropTypes.string,
  color: PropTypes.string,
}

export default Character
