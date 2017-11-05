import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Character from './Sprite'
import pacmanAsset from '../assets/pacman.png'
import phantomAsset from '../assets/blinky.png'

const SIDE = 16
const Tile = styled.div`
  background: ${({ children }) => (children === '#' ? 'blue' : 'black')};
  width: ${SIDE}px;
  height: ${SIDE}px;
  color: yellow;
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
  return <Container>{tiles.map((tile, key) => <Tile key={key}>{tile}</Tile>)}</Container>
}

const Map = ({ level, character, phantoms }) => {
  return (
    <Level width={level[0].length * SIDE} height={level.length * SIDE}>
      <div>{level.map((str, key) => <Row key={key} data={str} />)}</div>
      {Object.entries(phantoms).map(([k, phantom]) => <Character key={k} {...phantom} sprite={phantomAsset} />)}
      <Character {...character} sprite={pacmanAsset} />
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
