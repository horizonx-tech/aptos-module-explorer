import { Types } from 'aptos'
import { FC, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useLoading } from 'src/hooks/useLoading'
import { convert } from 'src/utils/converter'
import { Code, FormButton } from '../common'
import { FormContainer, InputRow, InputWrapper, SubmitDiv } from './common'

const NUMBER_TYPE_REGEX = /u(8|16|32|64|128)/

export type FunctionResult =
  | { tx: Types.Transaction }
  | {
      payload: Types.TransactionPayload_EntryFunctionPayload
      error: any
    }
export type FormData = {
  type_arguments: string[]
  arguments: (string | string[])[]
}

type FunctionFormProps = {
  fn: Types.MoveFunction
  onSubmit?: (data: FormData) => Promise<FunctionResult>
}
export const FunctionForm: FC<FunctionFormProps> = ({
  fn: { name, generic_type_params, params },
  onSubmit,
}) => {
  const [result, setResult] = useState<any>()
  const methods = useForm<FormData>({
    defaultValues: {
      arguments: [],
      type_arguments: [],
    },
  })
  const { setIsLoading } = useLoading()
  return (
    <FormContainer>
      <h3>{`${name}(${params.join(', ')})`}</h3>
      <FormProvider {...methods}>
        <form
          onSubmit={
            onSubmit &&
            methods.handleSubmit(async (data) => {
              setResult(undefined)
              setIsLoading(true)
              const res = await onSubmit(data)
              setResult(res)
              setIsLoading(false)
            })
          }
        >
          {generic_type_params.length > 0 && (
            <TypeParamInput length={generic_type_params.length} />
          )}
          {params
            .filter((param) => param !== '&signer')
            .map((param, idx) => (
              <ParamInput key={idx} param={param} idx={idx} />
            ))}
          <SubmitDiv>
            {result && (
              <FormButton type="button" onClick={() => setResult(undefined)}>
                Clear
              </FormButton>
            )}
            <FormButton disabled={!onSubmit}>Call</FormButton>
          </SubmitDiv>
        </form>
      </FormProvider>
      {result && <Code>{JSON.stringify(result, null, 2)}</Code>}
    </FormContainer>
  )
}

type ParamInputProps = {
  param: string
  idx: number
}
const ParamInput: FC<ParamInputProps> = ({ param, idx }) => {
  const { register, getValues, setValue } = useFormContext<FormData>()
  const [inputLength, setInputLength] = useState(1)
  const isVector = param.startsWith('vector')
  return (
    <InputWrapper label={param}>
      {isVector ? (
        Array.from(new Array(inputLength)).map((_, inputIdx) => (
          <InputRow key={inputIdx}>
            <input
              {...register(`arguments.${idx}.${inputIdx}`, {
                valueAsNumber: NUMBER_TYPE_REGEX.test(param),
              })}
            />
            {inputIdx === 0 ? (
              <FormButton
                onClick={() => {
                  setInputLength(inputLength + 1)
                }}
              >
                Add
              </FormButton>
            ) : (
              <FormButton
                onClick={() => {
                  setInputLength(inputLength - 1)
                  const values = getValues(`arguments.${idx}`) as string[]
                  values.splice(inputIdx, 1)
                  setValue(`arguments.${idx}`, values)
                }}
              >
                Remove
              </FormButton>
            )}
          </InputRow>
        ))
      ) : (
        <InputRow>
          <input
            {...register(`arguments.${idx}`, {
              setValueAs: (value) => convert(value, param),
            })}
          />
          <div />
        </InputRow>
      )}
    </InputWrapper>
  )
}
const TypeParamInput: FC<{ length: number }> = ({ length }) => {
  const { register } = useFormContext<FormData>()
  return (
    <InputWrapper label="type_arguments">
      {Array.from(new Array(length)).map((_, inputIdx) => (
        <InputRow key={inputIdx}>
          <input {...register(`type_arguments.${inputIdx}`)} />
          <div />
        </InputRow>
      ))}
    </InputWrapper>
  )
}
