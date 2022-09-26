import { Types } from 'aptos'
import type { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { Modules } from 'src/components/Modules'
import { Footer } from 'src/components/parts/Footer'
import { Header } from 'src/components/parts/Header'
import { Resources } from 'src/components/Resources'
import { Settings } from 'src/components/Settings'
import { useAptosClient } from 'src/hooks/useAptosClient'
import { useLoading } from 'src/hooks/useLoading'
import { useSettings } from 'src/hooks/useSettings'
import { tiffany } from 'src/styles/colors'
import { fontWeightBold } from 'src/styles/fonts'
import { notFalsy } from 'src/utils/filter'
import styled from 'styled-components'

const Home: NextPage = () => {
  const {
    values: { account },
  } = useSettings()
  const { client } = useAptosClient()

  const [modules, setModules] = useState<Types.MoveModule[]>([])
  const { setIsLoading } = useLoading()
  const [resources, setResources] = useState<Types.MoveResource[]>([])

  const refreshModules = useCallback(async () => {
    if (!client || !account) return
    setIsLoading(true)
    return client!
      .getAccountModules(account)
      .then((modules) => {
        setModules(modules.map(({ abi }) => abi).filter(notFalsy))
      })
      .finally(() => setIsLoading(false))
  }, [client, account])

  const refreshResources = useCallback(async () => {
    if (!client || !account) return
    setIsLoading(true)
    return client!
      .getAccountResources(account)
      .then(setResources)
      .finally(() => setIsLoading(false))
  }, [client, account])

  useEffect(() => {
    refreshModules()
    refreshResources()
  }, [refreshModules, refreshResources])

  return (
    <>
      <Header />
      <Main>
        <h1>Aptos Module/Resource Explorer</h1>
        <Settings />
        {modules && modules.length > 0 && <Modules modules={modules} />}
        {resources && resources.length > 0 && (
          <Resources resources={resources} refresh={refreshResources} />
        )}
      </Main>
      <Footer />
    </>
  )
}

const Main = styled.main`
  width: 100%;
  max-width: 1200px;
  padding: 0 16px 240px;
  margin: 120px auto;

  h1 {
    font-size: 48px;
    font-weight: ${fontWeightBold};
    margin-bottom: 64px;
  }
  h2 {
    font-size: 20px;
    font-weight: ${fontWeightBold};
    margin-top: 48px;
  }
  h3 {
    font-size: 16px;
  }
  summary {
    :hover,
    :focus {
      transition: color 0.2s ease-in-out;
      color: ${tiffany};
      outline: none;
    }
  }
`

export default Home
