import { tiffany } from 'src/styles/colors'
import styled from 'styled-components'

export const LoadingCircle = styled(({ className }) => (
  <StyledDiv className={className}>
    <svg viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
  </StyledDiv>
))``

const StyledDiv = styled.div`
  svg {
    animation: rotate 2s linear infinite;
    width: 50px;
    height: 50px;

    circle {
      stroke: ${tiffany};
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`
