import React from 'react'

import Page from './components/Page'
import Heading from './components/Heading'
import Stage from './components/Stage'

const App = () => (
  <Page>
    <header className="App-header">
      <Heading level={1}>
        Pac-Man <small>with Styled Components </small>
        <span role="img" aria-label="Styled components logo">
          💅
        </span>
      </Heading>
    </header>
    <Stage />
  </Page>
)

export default App
