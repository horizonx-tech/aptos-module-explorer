import { AptosClient, Types } from 'aptos'
import { FC, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { shortenInnerAddress } from 'src/utils/address'
import { Code, FormButton } from '../common'
import { FormContainer, InputRow, InputWrapper, SubmitDiv } from './common'

type ResourceFormData = {
  account: string
}
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
  const methods = useForm<ResourceFormData>()
  return (
    <FormContainer>
      <h3>{name}</h3>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(async (data) => {
            setResources(undefined)
            setError(undefined)
            try {
              const resources = await getAccountResources!(data.account || '')
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
          })}
        >
          <InputWrapper label="account">
            <InputRow>
              <input {...methods.register('account')} />
            </InputRow>
            <SubmitDiv>
              <FormButton>Call</FormButton>
            </SubmitDiv>
          </InputWrapper>
        </form>
      </FormProvider>
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
