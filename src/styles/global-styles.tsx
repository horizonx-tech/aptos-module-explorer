import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  html {
    height: 100%;
    overflow-y: overlay;
  }
  body {
    height: 100%;
    font-size: 16px;
    line-height: 1.25;
    background-color: darkslategrey;
    color: whitesmoke;
    a, button {
      :enabled:hover,
      :enabled:focus {
        color: coral;
      }
    }
    > div#__next {
      height: 100%;
      display: flex;
      flex-flow: column;
      main {
        flex: 1;
      }
    }
  }
`
