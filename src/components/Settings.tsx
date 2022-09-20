import { SUPPORTED_WALLETS } from '@horizonx/aptos-wallet-connector'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PUBLIC_NODE_URLS } from 'src/constants'
import { useSettings } from 'src/hooks/useSettings'
import { useWallet } from 'src/hooks/useWallet'
import styled from 'styled-components'

export const Settings: FC = () => {
  const { account, signer, connect, disconnect } = useWallet()
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
          {signer && <code>{`${signer.type}: ${account}`}</code>}
          <div>
            {SUPPORTED_WALLETS.map((type) =>
              signer?.type === type ? (
                <button key={type} onClick={disconnect}>
                  disconnect {type === 'aptos' ? 'petra' : type}
                </button>
              ) : (
                <button key={type} onClick={() => connect(type)}>
                  connect {type === 'aptos' ? 'petra' : type}
                </button>
              ),
            )}
          </div>
        </div>
        <label>
          <span>Node URL</span>
          {nodeUrl && <code>{nodeUrl}</code>}
          <div>
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
          </div>
        </label>
        <label>
          <span>Account</span>
          {targetAccount && <code>{targetAccount}</code>}
          <div>
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
          </div>
        </label>
      </FormProvider>
    </Section>
  )
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  label,
  > div {
    max-width: 640px;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    span {
      font-size: 1.2em;
    }
    div {
      display: flex;
      align-items: center;
      column-gap: 8px;
      input {
        flex: 1;
        padding: 4px 8px;
      }
    }
  }
`
