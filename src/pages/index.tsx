import { MoveModule, MoveResource } from 'aptos/dist/generated'
import type { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { Modules } from 'src/components/Modules'
import { Resources } from 'src/components/Resources'
import { Settings } from 'src/components/Settings'
import { useAptosClient } from 'src/hooks/useAptosClient'
import { useSettings } from 'src/hooks/useSettings'
import { notFalsy } from 'src/utils/filter'
import styled from 'styled-components'

const Home: NextPage = () => {
  const {
    values: { account },
  } = useSettings()
  const { client } = useAptosClient()

  const [modules, setModules] = useState<MoveModule[]>([])
  const [isModulesLoading, setIsModulesLoading] = useState(false)
  const [resources, setResources] = useState<MoveResource[]>([])

  const refreshModules = useCallback(async () => {
    if (!client || !account) return
    setIsModulesLoading(true)
    return client!.getAccountModules(account).then((modules) => {
      setModules(modules.map(({ abi }) => abi).filter(notFalsy))
      setIsModulesLoading(false)
    })
  }, [client, account])

  const refreshResources = useCallback(async () => {
    if (!client || !account) return
    return client!.getAccountResources(account).then(setResources)
  }, [client, account])

  useEffect(() => {
    refreshModules()
    refreshResources()
  }, [refreshModules, refreshResources])

  return (
    <Main>
      <h1>Aptos Module/Resource Explorer</h1>
      <Settings />
      {isModulesLoading && <Loading>Loading...</Loading>}
      {modules && modules.length > 0 && <Modules modules={modules} />}
      {resources && resources.length > 0 && (
        <Resources resources={resources} refresh={refreshResources} />
      )}
    </Main>
  )
}

const Loading = styled.div`
  margin: 24px 0;
`

const Main = styled.main`
  width: 100%;
  max-width: 1200px;
  padding: 0 16px 240px;
  margin: 64px auto;

  h1 {
    font-size: 3em;
    margin-bottom: 64px;
  }
  h2 {
    font-size: 2em;
    margin-top: 48px;
  }
  h3 {
    font-size: 1.2em;
  }
  h4 {
    font-size: 1.2em;
  }

  input {
    border: 1px solid darkgray;
  }

  button {
    background-color: gray;
    padding: 6px 24px;
  }
`

export default Home
