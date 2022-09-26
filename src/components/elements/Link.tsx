import NextLink from 'next/link'
import { FC } from 'react'
import { darkGrey } from 'src/styles/colors'
import styled, { css } from 'styled-components'

type LinkProps = Parameters<typeof NextLink>[0]

export const Link = styled<FC<LinkProps>>(
  ({ children, className, ...props }) => (
    <NextLink {...props} passHref>
      <StyledA className={className} $disabled={!props.href}>
        {children}
      </StyledA>
    </NextLink>
  ),
)``

export const ExternalLink = styled(({ children, className, ...props }) => (
  <StyledA
    className={className}
    $disabled={!props.href}
    tabIndex={props.href ? undefined : -1}
    target="_blank"
    rel="noopener"
    {...props}
  >
    {children}
  </StyledA>
))``

const disabledStyle = css`
  color: ${darkGrey};
  pointer-events: none;
`

const StyledA = styled.a<{ $disabled?: boolean }>`
  ${({ $disabled }) => $disabled && disabledStyle};
`
