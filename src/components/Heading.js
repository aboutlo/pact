import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Heading = styled(({ level, children, ...props }) =>
  React.createElement(`h${level}`, props, children)
)`
  text-align: center;
`

Heading.propTypes = {
  level: PropTypes.number.isRequired,
}

export default Heading
