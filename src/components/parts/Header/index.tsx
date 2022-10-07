import DevCentralIcon from 'public/svgs/icon_devcentral.svg'
import { FC } from 'react'
import { ExternalLink } from 'src/components/elements/Link'
import { jetBlack, tiffany } from 'src/styles/colors'
import { fontWeightBold, fontWeightMedium } from 'src/styles/fonts'
import { DEV_CENTRAL, LEIZD, REPOSITORY } from 'src/utils/routes'
import styled from 'styled-components'

export const Header = styled<FC<{ className?: string }>>(({ className }) => {
  return (
    <StyledHeader className={className}>
      <ExternalLink href={DEV_CENTRAL}>
        <DevCentralIcon />
        DevCentral
      </ExternalLink>
      <div>
        <ExternalLink href={REPOSITORY}>GitHub</ExternalLink>
        <ExternalLink href={LEIZD}>Open Leizd</ExternalLink>
      </div>
    </StyledHeader>
  )
})``

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 16px 0;
  margin: 36px auto 0;
  svg {
    height: 32px;
    width: fit-content;
  }
  > ${ExternalLink}:first-child {
    display: flex;
    align-items: center;
    column-gap: 16px;
    font-size: 18px;
    font-weight: ${fontWeightBold};
  }
  > div:last-child {
    display: flex;
    align-items: center;
    column-gap: 16px;
    ${ExternalLink}:last-child {
      padding: 13px 20px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: ${fontWeightMedium};
      transition: background, color, 0.2s ease-in-out;
      :hover,
      :focus {
        background: ${tiffany};
        color: ${jetBlack};
      }
    }
  }
`
