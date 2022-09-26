import BottomTriangle from 'public/svgs/triangle_bottom.svg'
import { FC, ReactNode } from 'react'
import { useToggle } from 'src/hooks/useToggle'
import { jetBlack, smokyBlack, tiffany, trueBlack } from 'src/styles/colors'
import styled, { css } from 'styled-components'

export const CollapsableDiv = styled<
  FC<{ summary: string; children: ReactNode } & { className?: string }>
>(({ summary, children, className }) => {
  const [collapsed, toggleCollapsed] = useToggle(true)
  return (
    <StyledDiv className={className} $collapsed={collapsed}>
      <button onClick={toggleCollapsed}>
        <BottomTriangle />
        {summary}
      </button>
      {!collapsed && <div>{children}</div>}
    </StyledDiv>
  )
})``

const StyledDiv = styled.div<{ $collapsed: boolean }>`
  border-radius: 6px;
  > button {
    display: flex;
    align-items: center;
    column-gap: 12px;
    width: 100%;
    padding: 16px 22px;
    border-radius: 6px;
    background: ${smokyBlack};
    font-size: 20px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    svg {
      transform: rotate(-90deg);
    }
    :hover,
    :focus {
      background: ${tiffany};
      color: ${jetBlack};
    }
  }
  > div {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    padding: 20px 40px;
    background: ${trueBlack};
    border-radius: 0px 0px 6px 6px;
  }
  ${({ $collapsed }) =>
    $collapsed &&
    css`
      background: ${trueBlack};
      > button:first-child {
        svg {
          transform: rotate(0deg);
        }
      }
    `}
`
