import { AptosClient, Types } from 'aptos'
import { FC, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Code, FormButton } from '../common'
import { FormContainer, InputRow, InputWrapper, SubmitDiv } from './common'

export type FormData = {
  account: string
  typeParameter?: string
  start?: number
  limit?: number
}

type EventsFormProps = {
  event: {
    eventHandle: string
    fieldName: string
  }
  getEventsByEventHandle: AptosClient['getEventsByEventHandle'] | undefined
}
export const EventsForm: FC<EventsFormProps> = ({
  event: { eventHandle, fieldName },
  getEventsByEventHandle,
}) => {
  const [events, setEvents] = useState<Types.Event[]>()
  const [error, setError] = useState<any>()
  const methods = useForm<FormData>()
  return (
    <FormContainer>
      <h3>{fieldName}</h3>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(async (data) => {
            setEvents(undefined)
            setError(undefined)
            try {
              const events = await getEventsByEventHandle!(
                data.account,
                `${eventHandle}${
                  data.typeParameter ? `<${data.typeParameter}>` : ''
                }`,
                fieldName,
                data.limit || data.start
                  ? {
                      limit: data.limit || undefined,
                      start: data.start || undefined,
                    }
                  : undefined,
              )
              setEvents(
                events.sort((a, b) => +b.sequence_number - +a.sequence_number),
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
          </InputWrapper>
          <InputWrapper label="type parameter (optional)">
            <InputRow>
              <input {...methods.register('typeParameter')} />
            </InputRow>
          </InputWrapper>
          <InputWrapper label="limit (optional)">
            <InputRow>
              <input {...methods.register('limit', { valueAsNumber: true })} />
            </InputRow>
          </InputWrapper>
          <InputWrapper label="start (optional)">
            <InputRow>
              <input {...methods.register('start', { valueAsNumber: true })} />
            </InputRow>
          </InputWrapper>
          <SubmitDiv>
            <FormButton disabled={!getEventsByEventHandle}>Call</FormButton>
          </SubmitDiv>
        </form>
      </FormProvider>
      <Code>
        {error || events
          ? JSON.stringify(error || events, null, 2)
          : 'No events loaded'}
      </Code>
    </FormContainer>
  )
}
