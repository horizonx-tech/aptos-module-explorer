import { darkGrey, jetBlack, smokyBlack, tiffany } from 'src/styles/colors'
import styled from 'styled-components'

export const FormButton = styled.button`
  width: 80px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${smokyBlack};
  transition: background, color, 0.2s ease-in-out;
  :enabled:hover,
  :enabled:focus {
    background: ${tiffany};
    color: ${jetBlack};
  }
  :disabled {
    color: ${darkGrey};
    cursor: not-allowed;
  }
`

export const InputDiv = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
  padding: 10px 16px;
  border-radius: 20px;
  background: ${smokyBlack};
`

export const Control = styled.div`
  display: flex;
  align-items: center;
  column-gap: 24px;
  ${FormButton} {
    width: unset;
  }
`

export const Code = styled.code`
  display: block;
  padding: 16px;
  background: ${smokyBlack};
  white-space: pre;
  overflow: auto;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  summary {
    cursor: pointer;
  }
  code {
    margin-top: 8px;
    display: block;
    padding: 20px 16px;
    background-color: #504c4c;
    white-space: pre-wrap;
  }
  ${Control} {
    margin-top: 4px;
  }
`

export const Details = styled.details`
  ${Control} {
    margin-top: 24px;
  }
  ${Code} {
    margin-top: 16px;
  }
`
