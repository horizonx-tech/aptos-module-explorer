import { FC, ReactNode } from 'react'
import styled from 'styled-components'

export const InputWrapper: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <label>
    <span>{label}</span>
    <InputsContainer>{children}</InputsContainer>
  </label>
)

const InputsContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`

export const InputRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 8px;
  input {
    flex: 1;
    padding: 4px 8px;
  }
  > * {
    :last-child {
      width: 120px;
    }
  }
  button {
    text-align: center;
  }
`

export const FormContainer = styled.div`
  padding: 12px 16px 6px;
  border-top: 1px solid;
  form {
    margin-top: 8px;
    margin-left: 16px;

    display: flex;
    flex-direction: column;
    row-gap: 8px;
    label {
      display: flex;
      justify-content: space-between;
      span {
        line-height: 1.875;
      }
    }
    button {
      width: 120px;
      margin-left: auto;
      text-align: center;
    }
    > button {
      margin-top: 12px;
    }
  }
`
