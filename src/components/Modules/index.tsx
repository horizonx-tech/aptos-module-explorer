import { Types } from 'aptos'
import SearchIcon from 'public/svgs/icon_search.svg'
import { FC, useState } from 'react'
import { useAptosClient } from 'src/hooks/useAptosClient'
import { useSettings } from 'src/hooks/useSettings'
import { useToggle } from 'src/hooks/useToggle'
import { useWallet } from 'src/hooks/useWallet'
import { isResource, notFalsy } from 'src/utils/filter'
import { estimateGas } from 'src/utils/transaction'
import { Control, InputDiv, Section } from '../common'
import { Toggle } from '../parts/Button'
import { InputWithDatalist } from '../parts/Input'
import { Module } from './Module'

type ModulesProps = {
  modules: Types.MoveModule[]
}
export const Modules: FC<ModulesProps> = ({ modules }) => {
  const { signer, chainId, account } = useWallet()
  const {
    values: { moduleName, chainId: moduleChainId },
    updateValues,
  } = useSettings()
  const validChainId =
    moduleChainId && chainId && moduleChainId !== chainId
      ? moduleChainId
      : undefined

  const { client } = useAptosClient()
  const { aptosAccount } = useSettings()
  const [word, setWord] = useState(moduleName)
  const [hideNoFunctions, toggleHideNoFunctions] = useToggle(true)
  const [hideNoResources, toggleHideNoResources] = useToggle()

  const filteredModules = modules.filter((module) => {
    const entryFunctions = module.exposed_functions.filter(
      ({ is_entry }) => is_entry,
    )
    if (entryFunctions.length === 0 && hideNoFunctions) return false
    const resources = module.structs.filter(isResource)
    if (resources.length === 0 && hideNoResources) return false
    return true
  })

  const sender = account || aptosAccount
  const txSigner = client && aptosAccount ? aptosAccount.signer(client) : signer

  return (
    <Section>
      <h2>Modules</h2>
      <Control>
        <InputDiv>
          <SearchIcon />
          <InputWithDatalist
            placeholder="module name..."
            value={word}
            onChange={({ target: { value } }) => setWord(value)}
            onBlur={({ target: { value } }) =>
              updateValues({ moduleName: value })
            }
            listId="module-ids_functions"
            options={filteredModules.map(({ name }) => name)}
          />
        </InputDiv>
        <Toggle isActive={hideNoFunctions} onClick={toggleHideNoFunctions}>
          Hide No Function Modules
        </Toggle>
        <Toggle isActive={hideNoResources} onClick={toggleHideNoResources}>
          Hide No Resource Modules
        </Toggle>
      </Control>
      {filteredModules
        .filter(({ name }) => !word || name.includes(word))
        .map((module) => (
          <Module
            key={module.name}
            module={module}
            validChainId={validChainId}
            client={client}
            callFunction={
              txSigner && sender && client
                ? async (moduleId, functionName, data) => {
                    const payload = {
                      type: 'entry_function_payload',
                      function: `${moduleId}::${functionName}`,
                      type_arguments: data.type_arguments.filter(notFalsy),
                      arguments: data.arguments,
                    }
                    try {
                      const gas = await estimateGas(
                        client,
                        sender,
                        payload,
                        module,
                      )
                      const txHash = await txSigner.signAndSubmitTransaction(
                        payload,
                        gas,
                      )
                      const tx = await client.waitForTransactionWithResult(
                        txHash,
                      )
                      return { tx }
                    } catch (error) {
                      return { error, payload }
                    }
                  }
                : undefined
            }
          />
        ))}
    </Section>
  )
}
