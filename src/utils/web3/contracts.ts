import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

export const getContract = (abi: AbiItem | AbiItem[], address: string, web3: Web3) => {
  return new web3.eth.Contract(abi, address)
}

export default {
  getContract,
}
