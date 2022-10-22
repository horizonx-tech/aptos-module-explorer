import { Types } from 'aptos'
import { FC, useEffect, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useLoading } from 'src/hooks/useLoading'
import { Code, FormButton } from '../common'
import { Toggle } from '../parts/Button'
import { InvalidChainWarning } from '../parts/Message'
import { FormContainer, InputRow, InputWrapper, SubmitDiv } from './common'

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
  validChainId?: number
  onSubmit?: (data: FormData) => Promise<FunctionResult>
}
export const FunctionForm: FC<FunctionFormProps> = ({
  fn: { name, generic_type_params, params },
  validChainId,
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
            {validChainId && <InvalidChainWarning chainId={validChainId} />}
            {result && (
              <FormButton type="button" onClick={() => setResult(undefined)}>
                Clear
              </FormButton>
            )}
            <FormButton disabled={!onSubmit || validChainId != null}>
              Call
            </FormButton>
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
            {param === 'bool' ? (
              <FormToggle name={`arguments.${idx}.${inputIdx}`} />
            ) : (
              <input {...register(`arguments.${idx}.${inputIdx}`)} />
            )}
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
          {param === 'bool' ? (
            <FormToggle name={`arguments.${idx}`} />
          ) : (
            <input {...register(`arguments.${idx}`)} />
          )}
          <div />
        </InputRow>
      )}
    </InputWrapper>
  )
}

const FormToggle: FC<{ name: string }> = ({ name }) => {
  const { register, watch, setValue } = useFormContext()
  const checked = watch(name)
  useEffect(() => {
    register(name)
    setValue(name, false)
  }, [register])
  return <Toggle isActive={checked} onClick={() => setValue(name, !checked)} />
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
