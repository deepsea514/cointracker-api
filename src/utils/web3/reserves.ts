import { Contract } from 'web3-eth-contract'

export const getReserves = (pairContract: Contract) => {
  return pairContract.methods.getReserves().call()
}

export default {
  getReserves,
}
