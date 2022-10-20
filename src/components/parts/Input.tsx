import { forwardRef, InputHTMLAttributes } from 'react'

export type InputWithDatalistProps = {
  listId: string
  options: (string | { value: string; label?: string })[]
}

export const InputWithDatalist = forwardRef<
  HTMLInputElement,
  InputWithDatalistProps & InputHTMLAttributes<HTMLInputElement>
>(({ listId, options, ...props }, ref) => (
  <>
    <input {...props} ref={ref} list={listId} />
    <datalist id={listId}>
      {options.map((option) =>
        typeof option === 'string' ? (
          <option key={option} value={option} />
        ) : !option.label ? (
          <option key={option.value} value={option.value} />
        ) : (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ),
      )}
    </datalist>
  </>
))
