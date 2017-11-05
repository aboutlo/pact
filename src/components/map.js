import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import Character from './Sprite'
const SIDE = 16
const Tile = styled.div`
  width: ${SIDE}px;
  height: ${SIDE}px;
  background: ${props => (props.tile === '#' ? 'black' : 'white')};
`

const Container = styled.div`
  display: flex;
`

const Level = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  margin: auto;
`

const Row = ({ data }) => {
  const tiles = data.split('')
  return <Container>{tiles.map((tile, key) => <Tile key={key} tile={tile} />)}</Container>
}

const Map = ({ level, character, phantoms }) => {
  return (
    <Level width={level[0].length * SIDE} height={level.length * SIDE}>
      <div>{level.map((str, key) => <Row key={key} data={str} />)}</div>
      {Object.entries(phantoms).map(([k, phantom]) => <Character key={k} {...phantom} />)}
      <Character {...character} />
    </Level>
  )
}
Map.propTypes = {
  character: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    color: PropTypes.string,
  }),
}
export default Map
