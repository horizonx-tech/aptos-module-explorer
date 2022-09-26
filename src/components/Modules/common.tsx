import { FC, ReactNode } from 'react'
import { darkGrey } from 'src/styles/colors'
import { fontWeightBold } from 'src/styles/fonts'
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
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid ${darkGrey};
  }
  > * {
    :last-child {
      width: 80px;
    }
  }
`

export const SubmitDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  column-gap: 12px;
`

export const FormContainer = styled.div`
  padding: 32px 40px;
  font-size: 14px;
  h3 {
    font-weight: ${fontWeightBold};
  }
  form {
    margin-top: 24px;
    margin-left: 12px;

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
    ${SubmitDiv} {
      margin-top: 12px;
    }
  }
`
