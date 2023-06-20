import Web3 from 'web3'

export const getCurrentBlock = (web3: Web3) => {
  return web3.eth.getBlockNumber()
}

export default {
  getCurrentBlock,
}
