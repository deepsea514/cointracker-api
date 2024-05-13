import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { BadRequestError } from '../CustomErrors'

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
): Promise<string> => {
  if (isV3) {
    const feeTiers = [100, 500, 2500, 10000]
    const pools = await Promise.all(
      feeTiers.map(async (feeTier) => {
        return await factoryContract.methods.getPool(firstAddress, secondAddress, feeTier).call()
      }),
    )

    let result = ''
    for (const pool of pools) {
      if (pool !== '0x0000000000000000000000000000000000000000') {
        result = pool
      }
    }
    return result
  } else {
    return await factoryContract.methods.getPair(firstAddress, secondAddress).call()
  }
}

export default {
  checksumAddress,
  getPairAddress,
  compareAddress,
}
