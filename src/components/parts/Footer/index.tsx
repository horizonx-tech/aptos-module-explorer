import DiscordIcon from 'public/svgs/icon_discord.svg'
import GitBookIcon from 'public/svgs/icon_gitbook.svg'
import GitHubIcon from 'public/svgs/icon_github.svg'
import TwitterIcon from 'public/svgs/icon_twitter.svg'
import LeizdLogo from 'public/svgs/logo_leizd.svg'
import { ExternalLink } from 'src/components/elements/Link'
import { trueWhite } from 'src/styles/colors'
import { fontWeightMedium } from 'src/styles/fonts'
import { DISCORD, DOCUMENTS, GITHUB, TWITTER } from 'src/utils/routes'
import styled from 'styled-components'

export const Footer = styled(({ className }) => {
  return (
    <StyledFooter className={className}>
      <Content>
        <div>
          <LogoDiv>
            <LeizdLogo />
          </LogoDiv>
          <p>
            Leizd Procotol is a decentralized and comprehensive DeFi platform
            focused on optimizing the scalability and liquidity of the money
            market.
          </p>
          <LinksDiv>
            <ExternalLink href={TWITTER}>
              <TwitterIcon />
            </ExternalLink>
            <ExternalLink href={DISCORD}>
              <DiscordIcon />
            </ExternalLink>
            <ExternalLink href={DOCUMENTS}>
              <GitBookIcon />
            </ExternalLink>
            <ExternalLink href={GITHUB}>
              <GitHubIcon />
            </ExternalLink>
          </LinksDiv>
        </div>
      </Content>
    </StyledFooter>
  )
})``

const LinksDiv = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
  color: ${trueWhite}a3;
`

const LogoDiv = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  font-size: 18px;
  font-weight: ${fontWeightMedium};
  color: ${trueWhite};
  svg {
    width: 74px;
    height: 24px;
  }
`
const Content = styled.div`
  display: flex;
  justify-content: space-between;
  > div:first-child {
    p {
      margin-top: 28px;
      max-width: 240px;
      font-size: 12px;
      color: ${trueWhite}cc;
    }
    ${LinksDiv} {
      margin-top: 72px;
    }
  }
`

const StyledFooter = styled.footer`
  background-color: rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(24px) brightness(0.84);
  ${Content} {
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px;
  }
`
