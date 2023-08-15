import { Contract } from 'web3-eth-contract'

export const getPastEvents = (pairContract: Contract, type: string, fromBlock: number, toBlock: number) => {
  return pairContract.getPastEvents(type, {
    fromBlock,
    toBlock,
  })
}

export default {
  getPastEvents,
}
