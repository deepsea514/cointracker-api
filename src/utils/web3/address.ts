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
): Promise<string> => {
  return await factoryContract.methods.getPair(firstAddress, secondAddress).call()
}

export default {
  checksumAddress,
  getPairAddress,
  compareAddress,
}
