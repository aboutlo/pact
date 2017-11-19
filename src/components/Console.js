import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.ul`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  list-style: none;
`

const Item = styled.li`
  flex: 0;
  min-width: 100px;
`

const Console = ({ lives, score, level }) => {
  return (
    <Container>
      <Item>{Array.from({ length: lives }).map(life => '❤️')}️</Item>
      <Item>{score} points</Item>
      <Item>{level} level</Item>
    </Container>
  )
}
Console.propTypes = {
  lives: PropTypes.int,
  score: PropTypes.int,
  level: PropTypes.int,
}

export default Console
