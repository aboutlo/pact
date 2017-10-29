import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const Tile = styled.div`
  background: ${props => {
    return props.color
  }};
  width: 20px;
  height: 20px;
  position: absolute;
  left: ${props => props.x * 20}px;
  top: ${props => props.y * 20}px;
`

const Character = props => {
  return <Tile {...props} />
}

export default Character
