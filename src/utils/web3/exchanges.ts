import Big from 'big.js'
import { gql } from 'graphql-request'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { CHAINS, SUBGRAPHS } from '../../constants/constants'
import {
  BASE_TOKENS,
  ERC20_ABI,
  FACTORIES,
  RPC_URL,
  UNISWAP_FACTORY_ABI,
  UNISWAP_FACTORY_ABI_V3,
  WEB3_CLIENTS,
} from '../../constants/web3_constants'
import web3Helper from '../../utils/web3/helpers'
import { BadRequestError } from '../CustomErrors'
import subgraphHelper from '../subgraph/subgraph'
import { compareAddress } from './address'
import { executeBatchRequest } from './batchOperations'
import { getContract } from './contracts'
import { getBalanceOf } from './tokens'

export async function findMostLiquidExchange(address: string, chainId: CHAINS) {
  if (!FACTORIES[chainId]) throw new BadRequestError('Invalid configuration error.')

  const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL[chainId]))
  const exchanges = await Promise.all(
    FACTORIES[chainId].map(async (exchange) => {
      const isV3 = exchange.name.includes('V3')
      const contract = web3Helper.getContract(
        isV3 ? (UNISWAP_FACTORY_ABI_V3 as AbiItem[]) : (UNISWAP_FACTORY_ABI as AbiItem[]),
        exchange.address,
        web3,
      )

      const otherTokenAddress = compareAddress(address, BASE_TOKENS[chainId].NATIVE, WEB3_CLIENTS[chainId])
        ? BASE_TOKENS[chainId].STABLE
        : BASE_TOKENS[chainId].NATIVE

      return {
        ...exchange,
        contract,
        pair: await web3Helper.getPairAddress(address, otherTokenAddress, contract, isV3, chainId),
      }
    }),
  )

  const pairs = await Promise.all(
    exchanges.map(async (exchange) => {
      const subgraph = SUBGRAPHS[`${chainId}`][`${exchange.name}`]
      if (!subgraph) {
        throw new BadRequestError(`Missing subgraph for ${chainId} - ${exchange.name}`)
      }
      const isV3 = exchange.name.includes('V3')

      const { pair: pairData } = isV3
        ? await subgraphHelper.getDataByQuery({
            client: subgraph.CLIENT,
            query: gql`
              query getPairData($pair: ID!) {
                pair: pool(id: $pair) {
                  liquidity
                  token0 {
                    id
                  }
                  token1 {
                    id
                  }
                }
              }
            `,
            variables: { pair: exchange.pair.toLowerCase() },
          })
        : await subgraphHelper.getDataByQuery({
            client: subgraph.CLIENT,
            query: gql`
              query getPairData($pair: ID!) {
                pair(id: $pair) {
                  reserve0
                  reserve1
                  token0 {
                    id
                  }
                  token1 {
                    id
                  }
                }
              }
            `,
            variables: { pair: exchange.pair.toLowerCase() },
          })
      if (!pairData) {
        return {
          name: exchange.name,
          address: exchange.address,
          pair: exchange.pair,
          liquidity: 0,
        }
      }
      const token0IsDesired = compareAddress(pairData.token0.id, address, web3)

      if (isV3) {
        const [_reserve0, _reserve1] = await Promise.all([
          getBalanceOf(pairData.token0.id, exchange.pair.toLowerCase(), web3),
          getBalanceOf(pairData.token1.id, exchange.pair.toLowerCase(), web3),
        ])

        const token0 = getContract(ERC20_ABI as AbiItem[], pairData.token0.id, web3)
        const token1 = getContract(ERC20_ABI as AbiItem[], pairData.token1.id, web3)

        const decimals = await executeBatchRequest(
          web3,
          token0.methods.decimals().call.request(),
          token1.methods.decimals().call.request(),
        ).then(([d0, d1]) => ({ token0: Number(d0), token1: Number(d1) }))

        return {
          name: exchange.name,
          address: exchange.address,
          pair: exchange.pair,
          liquidity: token0IsDesired
            ? new Big(_reserve0).div(new Big(10).pow(decimals.token0)).toNumber()
            : new Big(_reserve1).div(new Big(10).pow(decimals.token1)).toNumber(),
        }
      } else {
        return {
          name: exchange.name,
          address: exchange.address,
          pair: exchange.pair,
          liquidity: token0IsDesired ? +pairData.reserve0 : +pairData.reserve1,
        }
      }
    }),
  )

  // exchanges: paint, sushi, spirit
  return pairs.find((b) => b.liquidity === Math.max(...pairs.map((p: any) => p.liquidity)))
}
