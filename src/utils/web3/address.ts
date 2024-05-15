import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { BigNumber } from 'ethers'
import { CHAINS } from '../../constants/constants'
import { getContract } from './contracts'
import { BadRequestError } from '../CustomErrors'
import {
  RPC_URL,
  UNISWAP_PAIR_ABI_V3,
} from '../../constants/web3_constants'

export const checksumAddress = (address: string, web3: Web3): string => {
  try {
    return web3.utils.toChecksumAddress(address)
  } catch {
    throw new BadRequestError(`Invalid address provided: ${address}`)
  }
}

export const compareAddress = (addressOne: string, addressTwo: string, web3: Web3): boolean => {
  return checksumAddress(addressOne, web3) === checksumAddress(addressTwo, web3)
}

export const getPairAddress = async (
  firstAddress: string,
  secondAddress: string,
  factoryContract: Contract,
  isV3: boolean,
  chainId: CHAINS,
): Promise<string> => {
  if (isV3) {
    const feeTiers = [100, 500, 3000, 10000]
    const pools = await Promise.all(
      feeTiers.map(async (feeTier) => {
        return await factoryContract.methods.getPool(firstAddress, secondAddress, feeTier).call()
      }),
    )

    let maxLiquidity = BigNumber.from(0);
    let maxLiquidityPool;

    for (const pool of pools) {
      if (pool !== '0x0000000000000000000000000000000000000000') {
        try {
          const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL[chainId]))
          const pairContract = getContract(UNISWAP_PAIR_ABI_V3 as AbiItem[], pool, web3)
          const liquidity = await pairContract.methods.liquidity().call()

          if (liquidity.gt(maxLiquidity)) {
            maxLiquidity = liquidity;
            maxLiquidityPool = pool;
          }
        }
        catch (error) {

        }
      }
    }
    return maxLiquidityPool
  } else {
    return await factoryContract.methods.getPair(firstAddress, secondAddress).call()
  }
}

export default {
  checksumAddress,
  getPairAddress,
  compareAddress,
}
