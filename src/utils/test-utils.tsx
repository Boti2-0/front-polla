import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from '~assets/styles/global'
import { BrowserRouter as Router } from 'react-router-dom'
import { PropsWithChildren } from 'react'

function render(ui: React.ReactElement, renderOptions?: RenderOptions) {
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return (
      <Router>
        <ThemeProvider theme={{}}>
          <>
            <GlobalStyle />
            {children}
          </>
        </ThemeProvider>
      </Router>
    )
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { render }
