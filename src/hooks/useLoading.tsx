import { createContext, FC, ReactNode, useContext, useState } from 'react'
import { LoadingCircle } from 'src/components/Loading'
import styled from 'styled-components'

export const useLoading = () => useContext(LoadingContext)

type LoadingContextInterface = {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const LoadingContext = createContext<LoadingContextInterface>({
  isLoading: false,
  setIsLoading: () => {},
})

export const LoadingContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setLoading] = useState(false)
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading: setLoading }}>
      {children}
      {isLoading && <GlobalLoadingCircle />}
    </LoadingContext.Provider>
  )
}

const GlobalLoadingCircle = styled(LoadingCircle)`
  position: fixed;
  bottom: 80px;
  right: 120px;
`
