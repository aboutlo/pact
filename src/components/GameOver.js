import React from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Heading from '../components/Heading'

const Container = styled.div`
  position: fixed;
  width: 200px;
  /* height: 100px; */
  top: 50%;
  left: 50%;
  background: black;
  padding: 20px;
  transform: translate(-50%, -50%);
  border: 1px solid yellow;
`
const Section = styled.section`
  padding: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
`

const Input = styled.input`
  -webkit-appearance: none;
  border: 0;
  background: black;
  border-bottom: 1px solid white;
  color: red;
  text-align: center;
  padding: 5px;
  text-transform: uppercase;

  &:focus {
    outline: none;
    border-bottom: 1px solid blue;
  }
`

const Button = styled.button`
  padding: 10px;
  background: transparent;
  border: 1px solid blue;
  font-weight: bold;
  color: white;
`
const insertCoin = () => window.location.reload()

const save = (input, score, scores) => {
  localStorage.setItem(
    'scores',
    JSON.stringify(scores.concat({ nickname: input.value, score }))
  )
  insertCoin()
}

const GameOver = ({ score, scores = [], children }) => {
  // WORKAROUND to get a value on the fly from the input
  // https://github.com/facebook/react/issues/4936#issuecomment-238638006
  let input

  const onSave = () => save(findDOMNode(input), score, scores)
  return (
    <Container>
      <Heading level={2} color="blue">
        Game Over
      </Heading>
      <Section>
        <p>
          Your Score:<strong>{score}</strong>
          {/* save a input ref to get the value on the fly */}
          <Input type="text" ref={c => (input = c)} />
        </p>
        <Button onClick={onSave}>save</Button>
        <p>Or</p>
        <Button onClick={insertCoin}>Insert Coin</Button>
      </Section>
      <Section>
        <Heading level={3} color="yellow">
          Top Three
        </Heading>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {scores.map((item, index) => (
            <li key={index}>
              {item.nickname.toUpperCase()}: {item.score}
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  )
}

GameOver.propTypes = {
  score: PropTypes.number.isRequired,
}

export default GameOver
