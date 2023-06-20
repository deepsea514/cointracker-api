import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { ERC20_ABI } from '../../constants/web3_constants'
import { executeBatchRequest } from './batchOperations'
import { getContract } from './contracts'

export const getPairTokens = async (pairContract: Contract, web3: Web3, ABI: AbiItem[]) => {
  const [token0Address, token1Address] = await executeBatchRequest(
    web3,
    pairContract.methods.token0().call.request(),
    pairContract.methods.token1().call.request(),
  )

  return {
    token0: getContract(ABI as AbiItem[], token0Address, web3),
    token1: getContract(ABI as AbiItem[], token1Address, web3),
  }
}

export const getTotalSupply = async (address: string, web3: Web3) => {
  const contract = getContract(ERC20_ABI, address, web3)
  return contract.methods.totalSupply().call()
}
export default {
  getPairTokens,
  getTotalSupply,
}
