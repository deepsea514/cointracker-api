import { IChainConfiguration } from '../chain/chainConfiguration'
import { AbiInput, AbiItem } from 'web3-utils'
import web3Helper from './helpers'
import { executeBatchRequest } from './batchOperations'
import { getPairTokens } from './tokens'
import { UNISWAP_PAIR_ABI } from '../../constants/web3_constants'
import { getContract } from './contracts'
import { getTokenDetails } from '../../controllers/helpers/prices'
import Web3 from 'web3'

const getPairDetails = async (address: string, chain: IChainConfiguration) => {
  const pairContract = getContract(UNISWAP_PAIR_ABI as AbiItem[], address, chain.web3)
  getPairTokens(pairContract, chain.web3, UNISWAP_PAIR_ABI as AbiItem[])
  const [factory, reserves, token0, token1] = await executeBatchRequest(
    chain.web3,
    pairContract.methods.factory().call.request(),
    pairContract.methods.getReserves().call.request(),
    pairContract.methods.token0().call.request(),
    pairContract.methods.token1().call.request(),
  )
  return { factory, reserve0: reserves._reserve0, reserve1: reserves._reserve1, token0, token1 }
}

const getLogs = async (
  event: string,
  eventAbi: AbiInput[],
  to: number,
  from: number,
  chain: IChainConfiguration,
  numberRequested = 30,
) => {
  const currentBlock = await web3Helper.getCurrentBlock(chain.web3)
  let toBlock = to ? to : currentBlock
  let fromBlock = from ? from : currentBlock - 10

  const addresses = new Map()

  const logs = await Promise.all(
    (
      await chain.web3.eth.getPastLogs({
        toBlock,
        fromBlock,
        topics: [
          chain.web3.utils.sha3(event),
          null, //(address), // From Address
        ],
      })
    ).map(async (log) => {
      // Add to list of addresses to look up details afterwards
      let pairDetails = addresses.get(log.address) ?? (await getPairDetails(log.address, chain))
      let token0 = addresses.get(pairDetails.token0) ?? (await getTokenDetails(pairDetails.token0, chain.web3))
      let token1 = addresses.get(pairDetails.token1) ?? (await getTokenDetails(pairDetails.token1, chain.web3))
      addresses.set(log.address, pairDetails)
      addresses.set(pairDetails.token0, token0)
      addresses.set(pairDetails.token1, token1)

      return {
        ...pairDetails,
        token0Address: token0.address,
        token0Symbol: token0.symbol,
        token0Decimals: token0.decimals,
        token1Address: token1.address,
        token1Symbol: token1.symbol,
        token1Decimals: token1.decimals,

        network: chain.network,

        // Timestamp will need to be a new query (see address comment below)
        timestamp: (await chain.web3.eth.getBlock(log.blockNumber)).timestamp,

        block: log.blockNumber,

        // For Burn/Mint this is the LP address (pairAddress), so we will need to make another
        // query to get the token details from this. I think the best we can do
        // is to keep adding these addresses to a queue to process afterwards
        // then we can deduplicate them, and do a batch request to get all the
        // token details for each pair. Then loop through this data again updating
        // each log
        address: log.address,
        tx: log.transactionHash,
        ...Object.fromEntries(
          Object.entries(
            chain.web3.eth.abi.decodeLog(
              eventAbi,
              log.data,
              log.topics.slice(1, log.topics.length), // remove the first since its the event sha3
            ),
          ).filter((a) => eventAbi.some((abi) => abi.name === a[0])),
        ),
      }
    }),
  )

  return logs
}

// Use this for secondary topics
// This is for supplying a pair address to filter the results by (e.g. only show mint for FTM-SPIRIT)
// We are going to need this, but I don't know where it lives yet
const convertAddressTo32ByteString = (address: string, web3: Web3) =>
  `${web3.utils.padLeft('0x', 24)}${address.split('0x')[1]}`

export default {
  getLogs,
}
