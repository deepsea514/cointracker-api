import { NextFunction, Request, Response } from 'express'
import { AbiItem } from 'web3-utils'
import asyncHandler from '../middleware/asyncHandler'
import JsonResponse from '../utils/JsonResponse'
import pricingHelpers from './helpers/prices'
import { UNISWAP_FACTORY_ABI, UNISWAP_PAIR_ABI, ERC20_ABI, EVENT_TYPES } from '../constants/web3_constants'
import { ChainId, getChainConfiguration } from '../utils/chain/chainConfiguration'
import { CHAINS } from '../constants/constants'

const getPricing = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const chainId = req.query.chainId as unknown as CHAINS
  const addresses = req.body.tokens?.map((a: string) => a.toLowerCase())

  const prices = await pricingHelpers.getPricing(
    UNISWAP_FACTORY_ABI as AbiItem[],
    UNISWAP_PAIR_ABI as AbiItem[],
    ERC20_ABI as AbiItem[],
    addresses as string[],
    chainId,
  )

  res.status(200).json(JsonResponse({ prices }))
})

// TODO: This function is getting history of Swap events, rather than the token prices
// TODO: The function should be named accordingly and be used in a route like /tokens/:id/swaps
const getHistoricalPricing = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Normalize incoming address (& validate checksum?)
  const { from, to, address, chainId = 1 } = req.query

  const chain = getChainConfiguration(chainId as ChainId)

  const { token, prices } = await pricingHelpers.getHistoricalPricing(
    UNISWAP_FACTORY_ABI as AbiItem[], // TODO: replace hardcoded ABIs
    UNISWAP_PAIR_ABI as AbiItem[], // TODO: replace hardcoded ABIs
    ERC20_ABI as AbiItem[],
    EVENT_TYPES.SWAP as string, // hardcoded event
    address as string,
    Number(from),
    Number(to),
    chain,
  )

  res.status(200).json(JsonResponse({ token, prices }))
})

export default {
  getPricing,
  getHistoricalPricing,
}
