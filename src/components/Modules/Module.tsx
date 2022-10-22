import { AptosClient, Types } from 'aptos'
import { FC } from 'react'
import { isEventHandle, isResource } from 'src/utils/filter'
import styled from 'styled-components'
import { CollapsableDiv } from '../parts/CollapsableSection'
import { EventsForm } from './EventsForm'
import { FormData, FunctionForm } from './FunctionForm'
import { ResourceForm } from './ResourceForm'

type ModuleProps = {
  module: Types.MoveModule
  validChainId: number | undefined
  callFunction:
    | ((moduleId: string, fuctionName: string, data: FormData) => Promise<any>)
    | undefined
  client: AptosClient | undefined
}
export const Module: FC<ModuleProps> = ({
  module,
  validChainId,
  callFunction,
  client,
}) => {
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
                callFunction
                  ? (data) => callFunction(moduleId, fn.name, data)
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
