import { FC, ReactNode } from 'react'
import { cream, darkBlack, tiffany } from 'src/styles/colors'
import { fontWeightMedium } from 'src/styles/fonts'
import styled, { css, keyframes } from 'styled-components'

const blinkKeyframes = keyframes`
  0%,
  100% {
    border-color: ${tiffany}40;
    color: ${cream}80;
  }
  50% {
    border-color: ${tiffany};
    color: ${tiffany};
  }
`

export const WalletButton = styled.button`
  display: flex;
  align-items: center;
  column-gap: 16px;
  width: 232px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid ${cream}1a;

  font-weight: ${fontWeightMedium};
  color: ${cream};
  backdrop-filter: blur(8px) brightness(1);
  :disabled {
    border-color: ${tiffany};
    color: ${tiffany};
  }
  :enabled:hover,
  :enabled:focus {
    animation: ${blinkKeyframes} 2s ease-out infinite;
  }
`

export const Toggle: FC<{
  isActive?: boolean
  activeColor?: string
  onClick: VoidFunction
  children?: ReactNode
}> = ({ isActive, activeColor, onClick, children }) => {
  return (
    <ToggleButton
      type="button"
      $isActive={isActive}
      $activeColor={activeColor}
      onClick={onClick}
    >
      <div />
      {children}
    </ToggleButton>
  )
}
const ToggleButton = styled.button<{
  $isActive?: boolean
  $activeColor?: string
}>`
  display: flex;
  align-items: center;
  column-gap: 12px;
  white-space: nowrap;
  :hover,
  :focus {
    color: ${tiffany};
  }
  > div:first-child {
    position: relative;
    display: flex;
    width: 32px;
    height: 20px;
    padding: 4px;
    margin: 0 auto;
    border-radius: 12px;
    background: ${darkBlack};
    ::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${cream};
      transition: transform 0.2s ease-in-out;
    }
  }
  ${({ $isActive, $activeColor = tiffany }) =>
    $isActive &&
    css`
      > div:first-child {
        background: ${$activeColor};
        ::after {
          border-radius: 50%;
          transform: translate(100%, -50%);
          background: ${darkBlack};
        }
      }
    `}
`
