import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Character from './Sprite'
import pacmanAsset from '../assets/pacman.png'
import pacgirlAsset from '../assets/pacgirl.png'
import phantomAsset from '../assets/blinky.png'

// const SIDE = 16
const Tile = styled.div`
  // move to css attributes
  width: ${({ side }) => side}px;
  height: ${({ side }) => side}px;
  background: ${({ children }) => (children === '#' ? 'blue' : 'black')};
  color: yellow;
  text-align: center;
  text-indent: ${({ children }) => (children === '#' ? '-9000px' : 0)};
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

const Row = ({ data, side }) => {
  const tiles = data.split('')
  return (
    <Container>
      {tiles.map((tile, key) => (
        <Tile key={key} side={side}>
          {tile}
        </Tile>
      ))}
    </Container>
  )
}

const Map = ({ level, character, phantoms }) => {
  const side = Math.min(window.innerWidth / level[0].length, (window.innerHeight - 200) / level.length)
  return (
    <Level width={level[0].length * side} height={level.length * side}>
      <div>{level.map((str, key) => <Row key={key} data={str} side={side} />)}</div>
      {Object.entries(phantoms).map(([k, phantom]) => (
        <Character side={side} key={k} {...phantom} sprite={phantomAsset} />
      ))}
      <Character side={side} {...character} sprite={pacgirlAsset} />
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
