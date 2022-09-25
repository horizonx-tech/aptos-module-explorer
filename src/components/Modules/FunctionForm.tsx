import { Types } from 'aptos'
import { FC, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { convert } from 'src/utils/converter'
import { Code } from '../common'
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
  fn: { name, params },
  onSubmit,
}) => {
  const [result, setResult] = useState<any>()
  const methods = useForm<FormData>({
    defaultValues: {
      arguments: [],
      type_arguments: [],
    },
  })
  return (
    <FormContainer>
      <h3>{`${name}(${params.join(', ')})`}</h3>
      <FormProvider {...methods}>
        <form
          onSubmit={
            onSubmit &&
            methods.handleSubmit(async (data) => {
              setResult(undefined)
              const res = await onSubmit(data)
              setResult(res)
            })
          }
        >
          <TypeParamInput />
          {params
            .filter((param) => param !== '&signer')
            .map((param, idx) => (
              <ParamInput key={idx} param={param} idx={idx} />
            ))}
          <SubmitDiv>
            {result && (
              <button type="button" onClick={() => setResult(undefined)}>
                Clear
              </button>
            )}
            <button disabled={!onSubmit}>Call</button>
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
              <button
                onClick={() => {
                  setInputLength(inputLength + 1)
                }}
              >
                Add
              </button>
            ) : (
              <button
                onClick={() => {
                  setInputLength(inputLength - 1)
                  const values = getValues(`arguments.${idx}`) as string[]
                  values.splice(inputIdx, 1)
                  setValue(`arguments.${idx}`, values)
                }}
              >
                Remove
              </button>
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
const TypeParamInput: FC = () => {
  const { register, getValues, setValue } = useFormContext<FormData>()
  const [inputLength, setInputLength] = useState(1)
  return (
    <InputWrapper label="type_arguments">
      {Array.from(new Array(inputLength)).map((_, inputIdx) => (
        <InputRow key={inputIdx}>
          <input {...register(`type_arguments.${inputIdx}`)} />
          {inputIdx === 0 ? (
            <button
              onClick={() => {
                setInputLength(inputLength + 1)
              }}
            >
              Add
            </button>
          ) : (
            <button
              onClick={() => {
                setInputLength(inputLength - 1)
                const values = getValues(`type_arguments`)
                values.splice(inputIdx, 1)
                setValue(`type_arguments`, values)
              }}
            >
              Remove
            </button>
          )}
        </InputRow>
      ))}
    </InputWrapper>
  )
}
