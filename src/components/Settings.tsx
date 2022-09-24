import { WalletType } from '@horizonx/aptos-wallet-connector'
import Image from 'next/image'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PUBLIC_NODE_URLS, WALLET_INFO } from 'src/constants'
import { useSettings } from 'src/hooks/useSettings'
import { useWallet } from 'src/hooks/useWallet'
import { darkGrey, smokyBlack, trueBlack } from 'src/styles/colors'
import { fontFamilyHeading } from 'src/styles/fonts'
import styled from 'styled-components'
import { WalletButton } from './parts/Button'

export const Settings: FC = () => {
  const { account, signer, connect } = useWallet()
  const {
    values: { nodeUrl, account: targetAccount },
    updateValues,
  } = useSettings()

  const methods = useForm()
  return (
    <Section>
      <FormProvider {...methods}>
        <div>
          <span>Signer</span>
          {signer && <code>{account}</code>}
          <WalletsDiv>
            {Object.keys(WALLET_INFO).map((key) => {
              const { imageSrc, label } = WALLET_INFO[key as WalletType]
              return (
                <WalletButton
                  key={key}
                  onClick={async () => {
                    const connectedWallet = await connect(key as WalletType)
                    if (!connectedWallet?.account) return
                    close()
                  }}
                  disabled={signer?.type === key}
                >
                  <Image src={imageSrc} alt={label} width={24} height={24} />
                  {label}
                </WalletButton>
              )
            })}
          </WalletsDiv>
        </div>
        <label>
          <span>Node URL</span>
          {nodeUrl && <code>{nodeUrl}</code>}
          <InputDiv>
            <input {...methods.register('nodeUrl')} list="node-urls" />
            <datalist id="node-urls">
              {PUBLIC_NODE_URLS.map((url) => (
                <option key={url} value={url} />
              ))}
            </datalist>
            <button
              onClick={() => {
                const newNodeUrl = methods.getValues('nodeUrl')
                updateValues({ nodeUrl: newNodeUrl })
                methods.setValue('nodeUrl', '')
              }}
            >
              Apply
            </button>
          </InputDiv>
        </label>
        <label>
          <span>Account</span>
          {targetAccount && <code>{targetAccount}</code>}
          <InputDiv>
            <input {...methods.register('account')} />
            <button
              disabled={!nodeUrl}
              onClick={() => {
                updateValues({ account: methods.getValues('account') })
                methods.setValue('account', '')
              }}
            >
              Load
            </button>
          </InputDiv>
        </label>
      </FormProvider>
    </Section>
  )
}

const WalletsDiv = styled.div``

const InputDiv = styled.div`
  padding: 12px;
  border-radius: 6px;
  background: ${smokyBlack};
  input {
    flex: 1;
  }
  button {
    padding: 8px 12px;
    border-radius: 4px;
    background: ${darkGrey};
    :disabled {
      opacity: 0.5;
    }
  }
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 52px;
  label,
  > div {
    display: flex;
    flex-direction: column;
    span {
      font-size: 20px;
      font-family: ${fontFamilyHeading};
    }
    div {
      display: flex;
      align-items: center;
      column-gap: 8px;
    }
  }
  ${WalletsDiv} {
    margin-top: 24px;
  }
  label {
    row-gap: 16px;
  }
  code {
    padding: 12px 16px;
    background: ${trueBlack};
    font-size: 14px;
  }
`
