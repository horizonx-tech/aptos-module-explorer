import { MoveResource } from 'aptos/dist/generated'
import { FC, useMemo, useState } from 'react'
import { shortenInnerAddress } from 'src/utils/address'
import { Code, Control, Section } from './common'

export const Resources: FC<{
  resources: MoveResource[]
  refresh: () => Promise<any>
}> = (props) => {
  const items = useMemo(() => categorize(props.resources), [props.resources])
  const [word, setWord] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Section>
      <h2>Resources</h2>
      <Control>
        <input
          placeholder="module id..."
          value={word}
          onChange={({ target: { value } }) => setWord(value)}
        />
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
            <details key={moduleId}>
              <summary>{moduleId}</summary>
              {Object.entries(structs).map(([name, resources]) => (
                <StructResources key={name} name={name} resources={resources} />
              ))}
            </details>
          )
        })}
    </Section>
  )
}

const StructResources: FC<{ name: string; resources: MoveResource[] }> = ({
  name,
  resources,
}) => {
  const [word, setWord] = useState('')
  return (
    <details key={name}>
      <summary>{name}</summary>
      <Control>
        <input
          placeholder="type..."
          value={word}
          onChange={({ target: { value } }) => setWord(value)}
        />
      </Control>
      <Code>
        {JSON.stringify(
          resources
            .filter(({ type }) =>
              type.toLowerCase().includes(word.toLowerCase()),
            )
            .map(({ type, ...values }) => ({
              type: shortenInnerAddress(type),
              ...values,
            })),
          null,
          2,
        )}
      </Code>
    </details>
  )
}

type CategorizedResources = Record<string, Record<string, MoveResource[]>>

const categorize = (resources: MoveResource[]) =>
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
