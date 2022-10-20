import { AptosAccount, AptosClient, Types } from 'aptos'

export type Signer = {
  signAndSubmitTransaction: (
    payload: Types.EntryFunctionPayload,
    options?: Partial<Types.SubmitTransactionRequest>,
  ) => Promise<Types.HashValue>
}
export const createSigner = (
  client: AptosClient,
  account: AptosAccount,
): Signer => ({
  signAndSubmitTransaction: async (payload, options) => {
    const tx = await client.generateTransaction(
      account.address(),
      payload,
      options,
    )
    const signedTx = await client.signTransaction(account, tx)
    const pendingTx = await client.submitTransaction(signedTx)
    const res = await client.waitForTransactionWithResult(pendingTx.hash)
    return res.hash
  },
})
