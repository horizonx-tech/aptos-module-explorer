import { Types } from 'aptos'
import SearchIcon from 'public/svgs/icon_search.svg'
import { FC, useMemo, useState } from 'react'
import { useToggle } from 'src/hooks/useToggle'
import { shortenInnerAddress } from 'src/utils/address'
import { Code, Control, Details, FormButton, InputDiv, Section } from './common'
import { Toggle } from './parts/Button'
import { CollapsableDiv } from './parts/CollapsableSection'
import { InputWithDatalist } from './parts/Input'

export const Resources: FC<{
  resources: Types.MoveResource[]
  refresh: () => Promise<any>
}> = (props) => {
  const items = useMemo(() => categorize(props.resources), [props.resources])
  const [word, setWord] = useState('')
  const moduleIds = Object.keys(items)
  return (
    <Section>
      <h2>Resources</h2>
      <Control>
        <InputDiv>
          <SearchIcon />
          <InputWithDatalist
            placeholder="module id..."
            value={word}
            onChange={({ target: { value } }) => setWord(value)}
            listId="module-ids_resources"
            options={moduleIds.map((id) => ({
              value: id,
              label: shortenInnerAddress(id),
            }))}
          />
        </InputDiv>
        <FormButton onClick={props.refresh}>Refresh</FormButton>
      </Control>
      {Object.entries(items)
        .filter(([moduleId]) => moduleId.includes(word))
        .map(([moduleId, structs]) => {
          return (
            <CollapsableDiv
              key={moduleId}
              summary={shortenInnerAddress(moduleId)}
            >
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
    </Section>
  )
}

const StructResources: FC<{
  moduleId: string
  name: string
  resources: Types.MoveResource[]
}> = ({ moduleId, name, resources }) => {
  const [word, setWord] = useState('')
  const [ellipsizeAddress, toggleEllipsizeAddress] = useToggle(true)
  return (
    <Details key={name}>
      <summary>{name}</summary>
      <Control>
        <InputDiv>
          <SearchIcon />
          <InputWithDatalist
            placeholder="type..."
            value={word}
            onChange={({ target: { value } }) => setWord(value)}
            listId={`types_${moduleId}::${name}`}
            options={resources.map(({ type }) => ({
              value: type,
              label: shortenInnerAddress(type),
            }))}
          />
        </InputDiv>
        <Toggle isActive={ellipsizeAddress} onClick={toggleEllipsizeAddress}>
          Ellipsize Address
        </Toggle>
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
    </Details>
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
