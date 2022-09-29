import { Types } from 'aptos'
import SearchIcon from 'public/svgs/icon_search.svg'
import { FC, useState } from 'react'
import { useAptosClient } from 'src/hooks/useAptosClient'
import { useSettings } from 'src/hooks/useSettings'
import { useToggle } from 'src/hooks/useToggle'
import { useWallet } from 'src/hooks/useWallet'
import { isEventHandle, isResource, notFalsy } from 'src/utils/filter'
import styled from 'styled-components'
import { Control, InputDiv, Section } from '../common'
import { Toggle } from '../parts/Button'
import { CollapsableDiv } from '../parts/CollapsableSection'
import { InputWithDatalist } from '../parts/Input'
import { EventsForm } from './EventsForm'
import { FunctionForm } from './FunctionForm'
import { ResourceForm } from './ResourceForm'

type ModulesProps = {
  modules: Types.MoveModule[]
}
export const Modules: FC<ModulesProps> = ({ modules }) => {
  const { signer, chainId } = useWallet()
  const {
    values: { moduleName, chainId: moduleChainId },
    updateValues,
  } = useSettings()
  const validChainId =
    moduleChainId && chainId && moduleChainId !== chainId
      ? moduleChainId
      : undefined
  const { client } = useAptosClient()
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
        .map((module) => {
          const entryFunctions = module.exposed_functions.filter(
            ({ is_entry }) => is_entry,
          )
          const resources = module.structs.filter(isResource)
          const moduleId = `${module.address}::${module.name}`
          const events = resources.flatMap(({ name, fields }) =>
            fields.filter(isEventHandle).map(({ name: fieldName }) => ({
              eventHandle: `${moduleId}::${name}`,
              fieldName,
            })),
          )
          return (
            <CollapsableDiv
              key={module.name}
              summary={`${module.name} (${entryFunctions.length} entry functions, ${resources.length} resources, ${events.length} events)`}
            >
              {entryFunctions.length > 0 && (
                <Functions>
                  <summary>Functions</summary>
                  {entryFunctions.map((fn) => (
                    <FunctionForm
                      key={fn.name}
                      fn={fn}
                      validChainId={validChainId}
                      onSubmit={
                        signer && client
                          ? async (data) => {
                              const payload = {
                                type: 'entry_function_payload',
                                function: `${moduleId}::${fn.name}`,
                                type_arguments:
                                  data.type_arguments.filter(notFalsy),
                                arguments: data.arguments,
                              }
                              try {
                                const { gas_estimate } =
                                  await client.estimateGasPrice()
                                const maxGasAmount =
                                  await client.estimateMaxGasAmount(
                                    module.address,
                                  )
                                const txHash =
                                  await signer.signAndSubmitTransaction(
                                    payload,
                                    {
                                      max_gas_amount: maxGasAmount.toString(),
                                      gas_unit_price: `${gas_estimate}`,
                                    },
                                  )
                                const tx = await client.getTransactionByHash(
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
                </Functions>
              )}
              {resources.length > 0 && (
                <Structs>
                  <summary>Resources</summary>
                  {resources.map((struct) => (
                    <ResourceForm
                      key={struct.name}
                      moduleId={moduleId}
                      resource={struct}
                      getAccountResources={
                        client
                          ? (...args) => client.getAccountResources(...args)
                          : undefined
                      }
                    />
                  ))}
                </Structs>
              )}
              {events.length > 0 && (
                <Structs>
                  <summary>Events</summary>
                  {events.map(({ fieldName, eventHandle }) => (
                    <EventsForm
                      key={fieldName}
                      event={{ eventHandle, fieldName }}
                      getEventsByEventHandle={
                        client
                          ? (...args) => client.getEventsByEventHandle(...args)
                          : undefined
                      }
                    />
                  ))}
                </Structs>
              )}
            </CollapsableDiv>
          )
        })}
    </Section>
  )
}

const Structs = styled.details`
  > div {
    margin-top: 16px;
    margin-left: 16px;
    padding: 12px 16px 6px;
    label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      input {
        padding: 4px 8px;
        width: 50%;
      }
    }
  }
`

const Functions = styled.details`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  > div {
    margin-top: 8px;
    :last-child {
      margin-bottom: 16px;
    }
  }
`
