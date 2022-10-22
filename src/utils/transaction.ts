import {
  AptosClient,
  HexString,
  MaybeHexString,
  TransactionBuilderRemoteABI,
  TxnBuilderTypes,
  Types,
} from 'aptos'

class TransactionBuilderABIJSON extends TransactionBuilderRemoteABI {
  constructor(
    private abi: Types.MoveModule,
    client: AptosClient,
    sender: MaybeHexString,
  ) {
    super(client, { sender })
  }
  fetchABI = async () => {
    const abis = this.abi.exposed_functions
      .filter((ef) => ef.is_entry)
      .map((ef) => ({
        fullName: `${this.abi.address}::${this.abi.name}::${ef.name}`,
        ...ef,
      }))
    const abiMap = new Map()
    abis.forEach((abi) => {
      abiMap.set(abi.fullName, abi)
    })
    return abiMap
  }
}

export const estimateGas = async (
  client: AptosClient,
  sender: { address: MaybeHexString; publicKey: MaybeHexString },
  payload: Types.EntryFunctionPayload,
  abi?: Types.MoveModule,
) => {
  const [tx] = await simulateTx(client, sender, payload, abi)
  return {
    max_gas_amount: `${Math.ceil(+tx.gas_used * 1.2)}`,
    gas_unit_price: tx.gas_unit_price,
  }
}

export const simulateTx = async (
  client: AptosClient,
  sender: { address: MaybeHexString; publicKey: MaybeHexString },
  payload: Types.EntryFunctionPayload,
  abi?: Types.MoveModule,
) => {
  const rawTx = await (abi
    ? new TransactionBuilderABIJSON(abi, client, sender.address).build(
        payload.function,
        payload.type_arguments,
        payload.arguments,
      )
    : new TransactionBuilderRemoteABI(client, {
        sender: sender.address,
      }).build(payload.function, payload.type_arguments, payload.arguments))

  const publicKey = new TxnBuilderTypes.Ed25519PublicKey(
    HexString.ensure(sender.publicKey).toUint8Array(),
  )

  return client.simulateTransaction(publicKey, rawTx, {
    estimatePrioritizedGasUnitPrice: false,
    estimateGasUnitPrice: false,
    estimateMaxGasAmount: true,
  })
}
