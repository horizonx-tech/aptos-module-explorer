import { AptosClient, Types } from 'aptos'
import { FC, useRef, useState } from 'react'
import { shortenInnerAddress } from 'src/utils/address'
import { Code } from '../common'
import { FormContainer, InputRow, InputWrapper } from './common'

type ResourceFormProps = {
  moduleId: string
  resource: Types.MoveStruct
  getAccountResources: AptosClient['getAccountResources'] | undefined
}
export const ResourceForm: FC<ResourceFormProps> = ({
  moduleId,
  resource: { name, fields },
  getAccountResources,
}) => {
  const [resources, setResources] = useState<Types.MoveResource[]>()
  const [error, setError] = useState<any>()
  const ref = useRef<HTMLInputElement>(null)
  return (
    <FormContainer>
      <h3>{name}</h3>
      <form>
        <InputWrapper label="account">
          <InputRow>
            <input ref={ref} />
            <button
              onClick={async () => {
                setResources(undefined)
                setError(undefined)
                try {
                  const resources = await getAccountResources!(
                    ref.current?.value || '',
                  )
                  const regex = new RegExp(`^${moduleId}::${name}(<|$)`)
                  setResources(
                    resources
                      .filter(({ type }) => regex.test(type))
                      .map(({ type, ...values }) => ({
                        type: shortenInnerAddress(type),
                        ...values,
                      })),
                  )
                } catch (e) {
                  setError(e)
                }
              }}
              disabled={!getAccountResources}
            >
              Call
            </button>
          </InputRow>
        </InputWrapper>
      </form>
      <Code>
        {error || resources
          ? JSON.stringify(error || resources, null, 2)
          : fields.map(({ name, type }) => (
              <div key={name}>
                {name}: <span>{type}</span>
              </div>
            ))}
      </Code>
    </FormContainer>
  )
}
