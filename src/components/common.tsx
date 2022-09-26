import { smokyBlack } from 'src/styles/colors'
import { fontWeightMedium } from 'src/styles/fonts'
import styled from 'styled-components'

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
  label {
    display: flex;
    align-items: center;
    column-gap: 12px;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    font-weight: ${fontWeightMedium};
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
