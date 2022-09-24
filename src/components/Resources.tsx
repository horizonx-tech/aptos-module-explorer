import { Types } from 'aptos'
import SearchIcon from 'public/svgs/icon_search.svg'
import { FC, useMemo, useState } from 'react'
import { useToggle } from 'src/hooks/useToggle'
import { smokyBlack } from 'src/styles/colors'
import { shortenInnerAddress } from 'src/utils/address'
import styled from 'styled-components'
import { Code, Control, InputDiv, Section } from './common'
import { Toggle } from './parts/Button'
import { CollapsableDiv } from './parts/CollapsableSection'

export const Resources: FC<{
  resources: Types.MoveResource[]
  refresh: () => Promise<any>
}> = (props) => {
  const items = useMemo(() => categorize(props.resources), [props.resources])
  const [word, setWord] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const moduleIds = Object.keys(items)
  return (
    <ResourcesSection>
      <h2>Resources</h2>
      <Control>
        <InputDiv>
          <SearchIcon />
          <input
            placeholder="module id..."
            value={word}
            onChange={({ target: { value } }) => setWord(value)}
            list="module-ids_resources"
          />
          <datalist id="module-ids_resources">
            {moduleIds.map((id) => (
              <option key={id} value={id}>
                {shortenInnerAddress(id)}
              </option>
            ))}
          </datalist>
        </InputDiv>
        <button
          onClick={async () => {
            setIsLoading(true)
            await props.refresh()
            setIsLoading(false)
          }}
        >
          Refresh
        </button>
        {isLoading && <div>Loading...</div>}
      </Control>
      {Object.entries(items)
        .filter(([moduleId]) => moduleId.includes(word))
        .map(([moduleId, structs]) => {
          return (
            <CollapsableDiv key={moduleId} summary={moduleId}>
              {Object.entries(structs).map(([name, resources]) => (
                <StructResources
                  key={name}
                  moduleId={moduleId}
                  name={name}
                  resources={resources}
                />
              ))}
            </CollapsableDiv>
          )
        })}
    </ResourcesSection>
  )
}

const StructResources: FC<{
  moduleId: string
  name: string
  resources: Types.MoveResource[]
}> = ({ moduleId, name, resources }) => {
  const [word, setWord] = useState('')
  const [ellipsizeAddress, toggleEllipsizeAddress] = useToggle(true)
  const listId = `types_${moduleId}::${name}`
  const types = resources.map(({ type }) => type)
  return (
    <details key={name}>
      <summary>{name}</summary>
      <Control>
        <InputDiv>
          <SearchIcon />
          <input
            placeholder="type..."
            value={word}
            onChange={({ target: { value } }) => setWord(value)}
            list={listId}
          />
          <datalist id={listId}>
            {types.map((type) => (
              <option key={type} value={type}>
                {shortenInnerAddress(type)}
              </option>
            ))}
          </datalist>
        </InputDiv>
        <label>
          <Toggle
            isActive={ellipsizeAddress}
            onClick={toggleEllipsizeAddress}
          />
          Ellipsize Address
        </label>
      </Control>
      <Code>
        {JSON.stringify(
          resources
            .filter(({ type }) =>
              type.toLowerCase().includes(word.toLowerCase()),
            )
            .map(({ type, ...values }) => ({
              type: ellipsizeAddress ? shortenInnerAddress(type) : type,
              ...values,
            })),
          null,
          2,
        )}
      </Code>
    </details>
  )
}

type CategorizedResources = Record<string, Record<string, Types.MoveResource[]>>

const categorize = (resources: Types.MoveResource[]) =>
  resources.reduce<CategorizedResources>((res, resource) => {
    const structId = resource.type.replace(/(^.*?)(?:<.*|$)/, '$1')
    const [address, moduleName, structName] = structId.split('::')
    const moduleId = `${address}::${moduleName}`
    const item = res[moduleId]
    if (!item)
      return {
        ...res,
        [moduleId]: { [structName]: [resource] },
      }
    const resources = item[structName]
    if (resources) resources.push(resource)
    else item[structName] = [resource]
    return res
  }, {})

const ResourcesSection = styled(Section)`
  ${Control} {
    > button {
      background: ${smokyBlack};
      padding: 10px 16px;
      border-radius: 8px;
      background: ${smokyBlack};
      text-align: center;
      line-height: 1;
    }
  }
  details {
    ${Control} {
      margin-top: 24px;
    }
    ${Code} {
      margin-top: 16px;
    }
  }
`
