import styled from 'styled-components'

export const Control = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
  > input {
    padding: 4px 8px;
  }
  label {
    display: flex;
    align-items: center;
    column-gap: 4px;
  }
`

export const Code = styled.code`
  margin-top: 8px;
  display: block;
  padding: 20px 16px;
  background-color: #504c4c;
  white-space: pre;
  overflow: auto;
  font-size: 0.8em;
  span {
    font-size: 0.8em;
  }
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  > details {
    padding: 8px 12px;
    border: 1px solid;
    summary {
      font-size: 1.2em;
      cursor: pointer;
      span {
        font-size: 0.8em;
        font-style: italic;
        margin-left: 8px;
      }
    }
    details {
      border-top: solid 1px;
      padding: 8px 12px;
    }
    details:first-of-type {
      margin-top: 8px;
    }
    details:last-of-type {
      padding-bottom: 0;
    }
  }
  code {
    margin-top: 8px;
    display: block;
    padding: 20px 16px;
    background-color: #504c4c;
    white-space: pre-wrap;
    font-size: 0.8em;
    span {
      font-size: 0.8em;
    }
  }
  ${Control} {
    margin-top: 4px;
  }
`
